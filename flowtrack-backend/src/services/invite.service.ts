import { email, z } from "zod";
import prisma from "../lib/prisma.js";
import { MemberRole, InviteStatus } from "../generated/prisma/enums.js";
import { hasPermission } from "../utils/permissions.js";
import { generateTokens } from "../utils/tokens.js";
import crypto from "node:crypto";
import { sendEmail } from "./email.service.js";
import bcrypt from "bcrypt";

const INVITE_EXPIRY_DAYS = 7;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const CreateInvitesSchema = z.object({
  emails: z.array(z.email("Invalid email")).min(1, "Enter at least one email"),
  role: z.enum([MemberRole.ADMIN, MemberRole.MEMBER]),
});
const AcceptInviteSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    )
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createInvites = async (userId: string, data: unknown) => {
  const { emails, role } = CreateInvitesSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true, role: true },
  });
  if (!user?.organizationId)
    throw new Error("You are not part of an organization");
  if (!hasPermission(user.role, "org:invite"))
    throw new Error("You do not have permission to invite members");

  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: user.organizationId },
    select: { id: true, name: true },
  });
  const organizationId = organization.id;

  const invites = await Promise.all(
    emails.map(async (email) => {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

      const invite = await prisma.invite.upsert({
        where: {
          organizationId_email: { organizationId, email },
        },
        create: { email, role, organizationId, token, expiresAt },
        update: { role, token, expiresAt, status: InviteStatus.PENDING },
      });

      await sendEmail(
        email,
        `You've been invited to join ${organization.name} on FlowTrack`,
        `<p>You've been invited to join <strong>${organization.name}</strong> on FlowTrack as ${role.toLowerCase()}.</p>
         <p><a href="${CLIENT_URL}/invite/accept?token=${token}">Accept invite</a></p>`,
      );
      return invite;
    }),
  );

  return invites.map((invite) => ({
    email: invite.email,
    role: invite.role,
    status: invite.status,
  }));
};

export const getInviteByToken = async (token: string) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
    select: {
      email: true,
      role: true,
      expiresAt: true,
      status: true,
      organizationId: true,
    },
  });

  if (!invite) throw new Error("Invalid invite link");
  if (invite?.status === InviteStatus.ACCEPTED)
    throw new Error("Invite has been used");
  if (invite.expiresAt < new Date()) throw new Error("Invite has expired");

  const organizationId = invite?.organizationId;
  if (!organizationId) throw new Error("Organization does not exist");

  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { name: true, logo: true },
  });

  const userExists = !!(await prisma.user.findUnique({
    where: { email: invite.email },
    select: { id: true },
  }));

  return {
    email: invite.email,
    role: invite.role,
    organizationName: organization.name,
    organizationLogo: organization.logo,
    userExists,
  };
};

export const acceptInvite = async (token: string, data: unknown) => {
  const { name, password } = AcceptInviteSchema.parse(data);

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: {
      id: true,
      email: true,
      role: true,
      expiresAt: true,
      status: true,
      organizationId: true,
    },
  });

  if (!invite) throw new Error("Invalid invite link");
  if (invite?.status === InviteStatus.ACCEPTED)
    throw new Error("Invite has been used");
  if (invite.expiresAt < new Date()) throw new Error("Invite has expired");

  const organizationId = invite?.organizationId;
  if (!organizationId) throw new Error("Organization does not exist");

  const existingUser = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  let user;
  if (!existingUser) {
    if (!name) throw new Error("Name is required");
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        name,
        organizationId: invite.organizationId,
        role: invite.role,
      },
    });
  } else {
    const valid = await bcrypt.compare(password, existingUser.password);
    if (!valid) throw new Error("Invalid credentials");

    if (
      existingUser.organizationId &&
      existingUser.organizationId !== invite.organizationId
    ) {
      throw new Error("This email is already part of another organization");
    }

    user =
      existingUser.organizationId === invite.organizationId
        ? existingUser
        : await prisma.user.update({
            where: { id: existingUser.id },
            data: { organizationId: invite.organizationId, role: invite.role },
          });
  }

  await prisma.invite.update({
    where: { id: invite.id },
    data: { status: InviteStatus.ACCEPTED },
  });

  const { accessToken, refreshToken } = await generateTokens(
    user.id,
    user.email,
  );

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: invite.organizationId },
    select: { id: true, name: true },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
    org: { ...org, role: user.role! },
  };
};
