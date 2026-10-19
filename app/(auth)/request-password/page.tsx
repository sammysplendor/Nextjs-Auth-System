import RequestPasswordForm from "@/components/auth/request-password-form";
import { authIsNotRequired } from "@/lib/auth-utils";

const RequestPasswordPage = async () => {
  await authIsNotRequired;
  return <RequestPasswordForm />;
};

export default RequestPasswordPage;
