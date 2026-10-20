import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  url: string;
  to: string;
}

export const ResetPasswordEmail = ({ url, to }: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-koala">
        <Preview>Reset your password for better-auth practice.</Preview>
        <Container className="mx-auto py-5 pb-12">
          <Heading
            as="h1"
            className="mb-3 text-center text-[20px] font-semibold"
          >
            {" "}
            Hello,
          </Heading>
          <Text className="text-[16px] leading-6.5">
            We recieved a request to reset the password for better-auth practice
            account associated with {to}
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={url}
            >
              Reset your password
            </Button>
          </Section>
          <Text className="text-[16px] leading-6.5">
            Best,
            <br />
            The Better-Auth-Practice team
          </Text>
          <Hr className="border-[#cccccc] my-5" />
          <Text className="text-[#8898aa] text-[12px]">
            If you did not request to reset your password, please safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetPasswordEmail;
