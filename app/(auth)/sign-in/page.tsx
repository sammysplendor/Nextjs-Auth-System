import SignInForm from "@/components/auth/sign-in";
import { authIsNotRequired } from "@/lib/auth-utils";

const SignInPage = async () => {
  await authIsNotRequired();
  return <SignInForm />;
};

export default SignInPage;
