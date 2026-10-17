import SignUpForm from "@/components/auth/sign-up";
import { authIsNotRequired } from "@/lib/auth-utils";

const SignUpPage = async () => {
  await authIsNotRequired();
  return <SignUpForm />;
};

export default SignUpPage;
