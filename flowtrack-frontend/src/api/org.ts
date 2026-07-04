import api from "./axios";
import type { ApiResponse } from "../types/api";

export interface OrgData {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  memberCount: number;
}

export const getOrganization = () =>
  api.get<ApiResponse<OrgData>>("/organizations").then((r) => r.data);

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface MembersData {
  members: Member[];
  page: number;
  pageSize: number;
  total: number;
}

export const getOrganizationMembers = (page: number, pageSize: number) =>
  api
    .get<
      ApiResponse<MembersData>
    >(`/organizations/members?page=${page}&pageSize=${pageSize}`)
    .then((r) => r.data);
