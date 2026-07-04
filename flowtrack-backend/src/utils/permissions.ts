import { MemberRole } from "../generated/prisma/client.js";

export type Permission =
  | "org:view"
  | "org:edit"
  | "org:invite"
  | "members:view"
  | "members:manage"
  | "roles:manage"
  | "settings:manage";

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  [MemberRole.OWNER]: [
    "org:view",
    "org:edit",
    "org:invite",
    "members:view",
    "members:manage",
    "roles:manage",
    "settings:manage",
  ],
  [MemberRole.ADMIN]: ["org:view", "org:invite", "members:view", "members:manage"],
  [MemberRole.MEMBER]: ["org:view", "members:view"],
};

export const hasPermission = (
  role: MemberRole | null | undefined,
  permission: Permission,
): boolean => !!role && ROLE_PERMISSIONS[role].includes(permission);
