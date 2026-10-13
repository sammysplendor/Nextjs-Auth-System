import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationUrl: string;
  userName: string;
  appName?: string;
}

export const VerificationEmail = ({
  verificationUrl,
  userName,
  appName = "better-auth-practice",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-koala">
        <Preview>
          Verify your email for {appName} Please confirm your email address by
          clicking thr button below.
        </Preview>
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-[16px] leading-6.5">Hi {userName},</Text>
          <Text className="text-[16px] leading-6.5">
            Welcome to Better-Auth-Practice, the tutorial project used to learn
            Better Auth with Prisma and Neon. Thank you for signing up.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={verificationUrl}
            >
              Verify Your Email
            </Button>
          </Section>
          <Text className="text-[16px] leading-6.5">
            Best,
            <br />
            The Better-Auth-Practice team
          </Text>
          <Hr className="border-[#cccccc] my-5" />
          <Text className="text-[#8898aa] text-[12px]">
            If you did not create an account, please safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerificationEmail;
