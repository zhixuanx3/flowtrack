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
export const createProject = async (userId: string, organizationId: string, data: unknown) => {
  const { name, description } = ProjectSchema.parse(data);

  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  });

  if (!member) throw new Error("Not a member of this organization");

  const project = await prisma.project.create({
    data: { name, description, organizationId, createdById: userId },
    select: { id: true, name: true, description: true, status: true },
  });

  return project;
};

export const getProjects = async (userId: string, organizationId: string) => {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  });

  if (!member) throw new Error("Not a member of this organization");

  return prisma.project.findMany({
    where: { organizationId },
    select: { id: true, name: true, description: true, status: true },
  });
};
