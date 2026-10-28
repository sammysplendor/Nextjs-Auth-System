import { authIsRequired, authSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserManagementForm from "./user-client";

const UserManagement = async () => {
  await authIsRequired();

  const session = await authSession();

  if (!session) {
    redirect("/sign-in");
  } else if (
    typeof session.user.role !== "string" ||
    !["admin", "superAdmin"].includes(session.user.role)
  ) {
    redirect("/");
  }

  const { users } = await auth.api.listUsers({
    query: {},
    headers: await headers(),
  });

  const hasDeletePermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions: {
        user: ["delete"],
      },
    },
  });

  const formattedUsers = users
    .map((user) => {
      return {
        id: user.id,
        name: user.name,
        role: user.role ?? "",
        email: user.email,
        emailVerify: user.emailVerified,
        hasDeletePermission: hasDeletePermission.success,
      };
    })
    .filter((f) => ["user", "admin", "superAdmin"].includes(f.role));

  if (!users) redirect("/sign-in");

  return (
    <div className="w-full p-6 shadow-lg rounded-2xl h-screen flex justify-center items-start gap-6 mx-auto max-w-7xl">
      <UserManagementForm users={formattedUsers} />

      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default UserManagement;
