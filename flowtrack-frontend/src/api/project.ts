import { infiniteQueryOptions } from "@tanstack/react-query";
import api from "./axios";
import type { ApiResponse } from "../types/api";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export interface ProjectMemberUser {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  key: string | null;
  description: string | null;
  status: ProjectStatus;
  dueDate: string | null;
  members: { user: ProjectMemberUser }[];
}

export interface ProjectsData {
  projects: Project[];
  page: number;
  pageSize: number;
  total: number;
}

export const getProjects = (
  organizationId: string,
  page: number,
  pageSize: number,
) =>
  api
    .get<
      ApiResponse<ProjectsData>
    >(`/organizations/${organizationId}/projects?page=${page}&pageSize=${pageSize}`)
    .then((r) => r.data);

export const projectsQueryOptions = (organizationId: string, pageSize: number) =>
  infiniteQueryOptions({
    queryKey: ["projects", organizationId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getProjects(organizationId, pageParam, pageSize).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total
        ? lastPage.page + 1
        : undefined,
    enabled: !!organizationId,
  });
