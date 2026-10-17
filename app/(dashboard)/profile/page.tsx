import { authIsRequired } from "@/lib/auth-utils";
import { getCurrentUserProfile } from "@/app/actions/user";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/update-profile";
import ChangePasswordForm from "@/components/change-password";
import { Toaster } from "sonner";
import ToggleOTPForm from "@/components/toggle-otp-form";

const ProfilePage = async () => {
  await authIsRequired();
  const user = await getCurrentUserProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full p-6 shadow-lg rounded-2xl h-screen flex justify-center items-start gap-6">
      <ProfileForm
        email={user.email}
        name={user.name ?? ""}
        image={user.image ?? ""}
        twoFactorEnabled={user.twoFactorEnabled}
      />

      <ChangePasswordForm />

      <ToggleOTPForm twoFactorEnabled={user.twoFactorEnabled} />

      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default ProfilePage;
