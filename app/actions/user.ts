"use server";

import { authSession } from "@/lib/auth-utils";
import { db } from "../../lib/db";

export const updateProfile = async () => {
  const session = await authSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, image: true },
  });

  return user;
};
