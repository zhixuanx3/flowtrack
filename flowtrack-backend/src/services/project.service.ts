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
  key: z
    .string()
    .max(10, "Key must be at most 10 characters")
    .regex(
      /^[A-Za-z][A-Za-z0-9-]*$/,
      "Key must start with a letter and contain only letters, numbers and hyphens",
    )
    .transform((val) => val.toUpperCase())
    .optional(),
  description: z.string().optional(),
  dueDate: z.coerce
    .date()
    .refine((date) => date > new Date(), "Due date must be in the future")
    .optional(),
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
  const { name, key, description, dueDate } = ProjectSchema.parse(data);

  await checkOrgMembership(userId, organizationId);

  if (key) {
    const existing = await prisma.project.findUnique({
      where: { organizationId_key: { organizationId, key } },
      select: { id: true },
    });
    if (existing) throw new Error("Project key already in use");
  }

  const project = await prisma.project.create({
    data: { name, key, description, dueDate, organizationId, createdById: userId },
    select: {
      id: true,
      name: true,
      key: true,
      description: true,
      status: true,
      dueDate: true,
    },
  });

  await prisma.projectMember.create({
    data: { projectId: project.id, userId },
  });

  return project;
};

export const getProjects = async (
  userId: string,
  organizationId: string,
  page: number,
  pageSize: number,
) => {
  await checkOrgMembership(userId, organizationId);

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const where = {
    organizationId,
    members: { some: { userId } },
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        key: true,
        description: true,
        status: true,
        dueDate: true,
        members: {
          select: { user: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.project.count({ where }),
  ]);

  return { projects, page: safePage, pageSize: safePageSize, total };
};
