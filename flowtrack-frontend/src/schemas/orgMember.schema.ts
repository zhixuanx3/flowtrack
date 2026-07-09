import { z } from "zod";

export const inviteOrgMemberSchema = z.object({
  emails: z
    .string()
    .min(1, "Enter at least one email")
    .refine((val) => {
      const emails = val
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
      return (
        emails.length > 0 &&
        emails.every((email) => z.email().safeParse(email).success)
      );
    }, "One or more emails are invalid"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type InviteOrgMemberFormData = z.infer<typeof inviteOrgMemberSchema>;
