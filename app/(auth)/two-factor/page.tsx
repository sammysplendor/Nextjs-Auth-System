import OTPCodeForm from "@/components/otp-code-form";
import { authIsNotRequired } from "@/lib/auth-utils";

const TwoFactorCodePage = async () => {
  await authIsNotRequired();

  return <OTPCodeForm />;
};

export default TwoFactorCodePage;
