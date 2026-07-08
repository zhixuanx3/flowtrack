import { z } from "zod";
import prisma from "../lib/prisma.js";
import { MemberRole } from "../generated/prisma/client.js";
import { hasPermission } from "../utils/permissions.js";

const OrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  email: z
    .union([z.email("Invalid email"), z.literal("")])
    .optional()
    .transform((val) => val || undefined),
  website: z
    .union([z.url("Invalid website URL"), z.literal("")])
    .optional()
    .transform((val) => val || undefined),
  logo: z
    .union([z.url("Invalid logo URL"), z.literal("")])
    .optional()
    .transform((val) => val || undefined),
});

export const createOrganization = async (userId: string, data: unknown) => {
  const { name } = OrganizationSchema.parse(data);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (user.organizationId) {
    throw new Error("You already belong to an organization");
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      ownerId: userId,
      members: { connect: { id: userId } },
    },
    select: { id: true, name: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { organizationId: organization.id, role: MemberRole.OWNER },
  });

  return organization;
};

export const getOrganization = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          email: true,
          website: true,
          logo: true,
          createdAt: true,
          _count: { select: { members: true } },
        },
      },
    },
  });

  if (!user?.organization) throw new Error("Not part of any organization");

  return {
    id: user.organization.id,
    name: user.organization.name,
    email: user.organization.email,
    website: user.organization.website,
    logo: user.organization.logo,
    createdAt: user.organization.createdAt,
    role: user.role,
    memberCount: user.organization._count.members,
  };
};

export const updateOrganization = async (userId: string, data: unknown) => {
  const { name, email, website, logo } = OrganizationSchema.parse(data);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.organizationId) throw new Error("Not part of any organization");

  if (!hasPermission(user.role, "org:edit"))
    throw new Error("You do not have permission to edit this organization");

  const organization = await prisma.organization.update({
    where: { id: user.organizationId },
    data: { name, email, website, logo },
    select: { id: true, name: true, email: true, website: true, logo: true },
  });

  return organization;
};

export const getOrganizationMembers = async (
  userId: string,
  page: number,
  pageSize: number,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user?.organizationId) throw new Error("Not part of any organization");

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [members, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.user.count({ where: { organizationId: user.organizationId } }),
  ]);

  return {
    members,
    page: safePage,
    pageSize: safePageSize,
    total: totalCount,
  };
};
