import { authIsRequired } from "@/lib/auth-utils";
import { getCurrentUserProfile } from "@/app/actions/user";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/update-profile";
import ChangePasswordForm from "@/components/change-password";
import { Toaster } from "sonner";
import ToggleOTPForm from "@/components/toggle-otp-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ProfilePage = async () => {
  await authIsRequired();
  const user = await getCurrentUserProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col justify-center items-start gap-2 mx-12 h-screen overflow-y-auto">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl text-sm px-4 py-2 hover hover:bg-slate-800"
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="w-full p-6 shadow-lg rounded-2xl flex justify-center items-start gap-6 mx-auto max-w-7xl">
        <ProfileForm
          email={user.email}
          name={user.name ?? ""}
          image={user.image ?? ""}
          twoFactorEnabled={user.twoFactorEnabled}
        />

        <ChangePasswordForm />

        <ToggleOTPForm twoFactorEnabled={user.twoFactorEnabled} />
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default ProfilePage;
