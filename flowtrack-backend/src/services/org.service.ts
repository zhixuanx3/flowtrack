import { z } from "zod";
import prisma from "../lib/prisma.js";
import { AccountType, MemberRole } from "../generated/prisma/client.js";

const OrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
});

export const createOrganization = async (userId: string, data: unknown) => {
  const { name } = OrganizationSchema.parse(data);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.accountType !== AccountType.ORGANIZATION) {
    throw new Error("Only organization accounts can create organizations");
  }

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
    include: { organization: { select: { id: true, name: true } } },
  });

  if (!user?.organization) throw new Error("Not part of any organization");

  return { ...user.organization, role: user.role };
};
