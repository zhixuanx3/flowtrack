import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../lib/prisma.js";

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
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const generateTokens = async (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
};

export const register = async (data: unknown) => {
  const { email, password, name } = RegisterSchema.parse(data);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, name },
  });

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

  return {
    accessToken,
    refreshToken, // controller will set this as httpOnly cookie
    user: { id: user.id, email: user.email, name: user.name },
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
