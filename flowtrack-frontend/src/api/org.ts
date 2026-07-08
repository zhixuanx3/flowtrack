import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import api from "./axios";
import type { ApiResponse } from "../types/api";
import { withMinDuration } from "../utils/withMinDuration";

export interface OrgData {
  id: string;
  name: string;
  email?: string;
  website?: string;
  logo?: string;
  role: string;
  createdAt: string;
  memberCount: number;
}

export const getOrganization = () =>
  api.get<ApiResponse<OrgData>>("/organizations").then((r) => r.data);

export const organizationQueryOptions = queryOptions({
  queryKey: ["organization"],
  queryFn: () => withMinDuration(getOrganization().then((r) => r.data)),
});

export interface UpdateOrgData {
  name: string;
  email?: string;
  website?: string;
  logo?: string;
}

export const updateOrganization = (data: UpdateOrgData) =>
  api
    .patch<ApiResponse<OrgData>>("/organizations", data)
    .then((r) => r.data);

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

export const organizationMembersQueryOptions = (pageSize: number) =>
  infiniteQueryOptions({
    queryKey: ["organizationMembers"],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      withMinDuration(
        getOrganizationMembers(pageParam, pageSize).then((r) => r.data),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total
        ? lastPage.page + 1
        : undefined,
  });
