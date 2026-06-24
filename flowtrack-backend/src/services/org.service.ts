import { z } from "zod";
import prisma from "../lib/prisma.js";
import { MemberRole } from "../generated/prisma/client.js";

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

  const organization = await prisma.organization.create({
    data: { name, ownerId: userId },
    select: { id: true, name: true },
  });

  await prisma.organizationMember.create({
    data: { userId, organizationId: organization.id, role: MemberRole.OWNER },
  });

  return organization;
};

export const getOrganizations = async (userId: string) => {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: { organization: { select: { id: true, name: true } } },
  });

  return memberships.map((m) => ({ ...m.organization, role: m.role }));
};
