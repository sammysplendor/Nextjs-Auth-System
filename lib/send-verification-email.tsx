import { VerificationEmail } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
  to: string;
  verificationUrl: string;
  userName: string;
};

const sendVerificationEmail = async ({
  to,
  verificationUrl,
  userName,
}: EmailProps) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Welcome to Better-Auth Practice",
    react: (
      <VerificationEmail
        verificationUrl={verificationUrl}
        userName={userName}
      />
    ),
  });
};

export default sendVerificationEmail;
