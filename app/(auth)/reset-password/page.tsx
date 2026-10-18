import RequestPasswordForm from "@/components/auth/request-password-form";
import { authIsNotRequired } from "@/lib/auth-utils";

const ResetPasswordPage = async () => {
  await authIsNotRequired;
  return <RequestPasswordForm />;
};

export default ResetPasswordPage;
