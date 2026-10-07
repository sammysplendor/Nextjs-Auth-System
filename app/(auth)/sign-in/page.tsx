import SignInForm from "@/components/sign-in";
import { authIsNotRequired } from "@/lib/auth-utils";

const SignInPage = async () => {
  await authIsNotRequired();
  return <SignInForm />;
};

export default SignInPage;
