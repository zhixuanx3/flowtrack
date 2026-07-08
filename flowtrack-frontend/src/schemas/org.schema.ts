import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  email: z.email("Invalid email").or(z.literal("")).optional(),
  website: z.url("Invalid website URL").or(z.literal("")).optional(),
  logo: z.url("Invalid logo URL").or(z.literal("")).optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
