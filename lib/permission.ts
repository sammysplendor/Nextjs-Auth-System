import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"], // <-- Permissions available for created roles
} as const;

export const ac = createAccessControl(statement);

// Ordinary users: limited project permissions.
export const userRole = ac.newRole({
  user: [],
  project: ["create"],
});

// Administrators: default admin permissions plus project management.
export const adminRole = ac.newRole({
  user: ["list", "set-password", "update"],
  project: ["create", "update"],
});

// Custom role: can manage projects and has the permission to ban users.
export const superAdminRole = ac.newRole({
  user: [...adminAc.statements.user],
  project: ["create", "update", "delete"],
});

export const roles = {
  user: userRole,
  admin: adminRole,
  superAdmin: superAdminRole,
} as const;

export type RoleName = keyof typeof roles;
