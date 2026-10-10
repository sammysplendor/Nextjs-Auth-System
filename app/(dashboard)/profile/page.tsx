import { authIsRequired } from "@/lib/auth-utils";
import ProfileForm from "@/components/update-profile";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/user";

const ProfilePage = async () => {
  await authIsRequired();
  const user = await updateProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full p-6 shadow-lg rounded-2xl h-full flex gap-6">
      <ProfileForm
        email={user.email}
        name={user.name ?? ""}
        image={user.image ?? ""}
        twoFactorEnabled={false}
      />
    </div>
  );
};

export default ProfilePage;
