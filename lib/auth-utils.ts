import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const authSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    console.error("SESSION ERROR:", error);
  }
};

export const authIsRequired = async () => {
  const session = await authSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

export const authIsNotRequired = async () => {
  const session = await authSession();

  if (session) {
    redirect("/");
  }

  return session;
};
