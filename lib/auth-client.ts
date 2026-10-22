import { createAuthClient } from "better-auth/react";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";
import { ac, roles } from "./permission";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    adminClient({
      ac,
      roles,
    }),
  ],
});
