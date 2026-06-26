import { z } from "zod";
import prisma from "../lib/prisma.js";

const ProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  description: z.string().optional(),
});

const checkOrgMembership = async (userId: string, organizationId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.organizationId !== organizationId) {
    throw new Error("Not a member of this organization");
  }
};

export const createProject = async (
  userId: string,
  organizationId: string,
  data: unknown,
) => {
  const { name, description } = ProjectSchema.parse(data);

  await checkOrgMembership(userId, organizationId);

  const project = await prisma.project.create({
    data: { name, description, organizationId, createdById: userId },
    select: { id: true, name: true, description: true, status: true },
  });

  await prisma.projectMember.create({
    data: { projectId: project.id, userId },
  });

  return project;
};

export const getProjects = async (userId: string, organizationId: string) => {
  await checkOrgMembership(userId, organizationId);

  return prisma.project.findMany({
    where: {
      organizationId,
      members: { some: { userId } },
    },
    select: { id: true, name: true, description: true, status: true },
  });
};
