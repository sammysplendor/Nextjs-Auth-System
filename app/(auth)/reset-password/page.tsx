import ResetPasswordForm from "@/components/auth/reset-password-form";
import { authIsNotRequired } from "@/lib/auth-utils";

const ResetPasswordPage = async () => {
  await authIsNotRequired;
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
