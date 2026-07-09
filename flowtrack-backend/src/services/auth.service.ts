import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { MemberRole } from "../generated/prisma/client.js";
import { generateTokens } from "../utils/tokens.js";

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  accountType: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
  orgName: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const register = async (data: unknown) => {
  const { email, password, name, accountType, orgName } = RegisterSchema.parse(data);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);

  if (accountType === "ORGANIZATION") {
    if (!orgName) throw new Error("Organisation name is required");
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashed, name, role: MemberRole.OWNER },
      });
      const org = await tx.organization.create({
        data: { name: orgName, ownerId: user.id, members: { connect: { id: user.id } } },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { organizationId: org.id },
      });
    });
  } else {
    await prisma.user.create({
      data: { email, password: hashed, name },
    });
  }

  return { message: "Account created successfully" };
};

export const login = async (data: unknown) => {
  const { email, password } = LoginSchema.parse(data);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(
    user.id,
    user.email,
  );

  const org = user.organizationId
    ? await prisma.organization.findUnique({
        where: { id: user.organizationId },
        select: { id: true, name: true },
      })
    : null;

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
    org: org ? { ...org, role: user.role! } : null,
  };
};

export const refresh = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error("User not found");

  // rotate — delete old, issue new
  await prisma.refreshToken.delete({ where: { token } });
  const { accessToken, refreshToken } = await generateTokens(
    user.id,
    user.email,
  );

  return { accessToken, refreshToken };
};

export const logout = async (token: string) => {
  await prisma.refreshToken.deleteMany({ where: { token } });
  return { message: "Logged out successfully" };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organization: { select: { id: true, name: true } },
    },
  });
  if (!user) throw new Error("User not found");

  const { organization, role, ...rest } = user;
  return {
    user: rest,
    org: organization ? { ...organization, role: role! } : null,
  };
};
