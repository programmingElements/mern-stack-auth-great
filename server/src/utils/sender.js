import { resend } from "./resend.js";

async function sendVerificationEmail(email, subject, html) {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: subject,
        html: html,
      });

      if (error) {
        throw new ApiError(400, error.message);
      }

      return data;
}

export { sendVerificationEmail };