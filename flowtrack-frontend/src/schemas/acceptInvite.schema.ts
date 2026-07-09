import { z } from "zod";

export const signupInviteSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInviteFormData = z.infer<typeof signupInviteSchema>;

export const loginInviteSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type LoginInviteFormData = z.infer<typeof loginInviteSchema>;
