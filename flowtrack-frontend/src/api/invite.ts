import { queryOptions } from "@tanstack/react-query";
import api from "./axios";
import type { ApiResponse } from "../types/api";
import type { MemberRole } from "../utils/permissions";

export type InvitableRole = Exclude<MemberRole, "OWNER">;

export interface InviteResult {
  email: string;
  role: InvitableRole;
  status: "PENDING" | "ACCEPTED";
}

export const sendInvites = (emails: string[], role: InvitableRole) =>
  api
    .post<ApiResponse<InviteResult[]>>("/invites", { emails, role })
    .then((r) => r.data);

export interface InviteInfo {
  email: string;
  role: InvitableRole;
  organizationName: string;
  organizationLogo?: string | null;
  userExists: boolean;
}

export const getInvite = (token: string) =>
  api.get<ApiResponse<InviteInfo>>(`/invites/${token}`).then((r) => r.data);

export const inviteQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["invite", token],
    queryFn: () => getInvite(token).then((r) => r.data),
    retry: false,
  });

export interface AcceptInviteData {
  name?: string;
  password: string;
}

export interface AcceptInviteResult {
  accessToken: string;
  user: { id: string; email: string; name: string };
  org: { id: string; name: string; role: string };
}

export const acceptInvite = (token: string, data: AcceptInviteData) =>
  api
    .post<ApiResponse<AcceptInviteResult>>(`/invites/${token}/accept`, data)
    .then((r) => r.data);
