export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export type Permission =
  | "org:view"
  | "org:edit"
  | "org:invite"
  | "members:view"
  | "members:manage"
  | "roles:manage"
  | "settings:manage";

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  OWNER: [
    "org:view",
    "org:edit",
    "org:invite",
    "members:view",
    "members:manage",
    "roles:manage",
    "settings:manage",
  ],
  ADMIN: ["org:view", "org:invite", "members:view", "members:manage"],
  MEMBER: ["org:view", "members:view"],
};

export const hasPermission = (
  role: MemberRole | null | undefined,
  permission: Permission,
): boolean => !!role && ROLE_PERMISSIONS[role].includes(permission);
