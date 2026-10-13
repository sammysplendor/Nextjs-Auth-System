import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export const OTPEmail = ({ otp }: OtpEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-koala">
        <Preview>This is your login code for Better Auth Practice.</Preview>
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-[16px] leading-6.5">
            Please find below your OTP to login.
          </Text>

          <Text className="text-[40px] leading-6">{otp}</Text>

          <Text className="text-[16px] leading-6.5">
            Best,
            <br />
            The Better-Auth-Practice team
          </Text>
          <Hr className="border-[#cccccc] my-5" />
          <Text className="text-[#8898aa] text-[12px]">
            If you did not request for a code, please safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OTPEmail;
