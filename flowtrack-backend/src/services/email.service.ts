import { resend } from "../lib/resend.js";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) throw new Error(error.message);
};
