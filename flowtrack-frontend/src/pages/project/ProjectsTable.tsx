import { Search, SlidersHorizontal, MoreVertical, Folder } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import DataTable, { type Column } from "../../components/DataTable";
import { useNearBottomScroll } from "../../hooks/useNearBottomScroll";
import {
  projectsQueryOptions,
  type Project,
  type ProjectStatus,
} from "../../api/project";

const PAGE_SIZE = 6;

const STATUS_STYLES: Record<ProjectStatus, string> = {
  ACTIVE: "bg-blue-50 text-blue-600",
  ARCHIVED: "bg-surface-secondary text-foreground border border-line",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

const ICON_COLORS = [
  "bg-primary-light text-primary",
  "bg-blue-50 text-blue-600",
  "bg-green-50 text-green-600",
  "bg-orange-50 text-orange-600",
  "bg-pink-50 text-pink-600",
  "bg-purple-50 text-purple-600",
];

// No icon/color field on Project yet, so derive a stable one from the id
// instead of every project rendering the same look.
const getIconColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ICON_COLORS[Math.abs(hash) % ICON_COLORS.length];
};

interface ProjectsTableProps {
  organizationId: string;
}

export default function ProjectsTable({ organizationId }: ProjectsTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(projectsQueryOptions(organizationId, PAGE_SIZE));

  const projects = data?.pages.flatMap((p) => p.projects) ?? [];

  const scrollContainerRef = useNearBottomScroll(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  const columns: Column<Project>[] = [
    {
      key: "project",
      header: "Project",
      headerClassName: "w-[40%] pr-2 pl-3 sm:pl-4 lg:w-[30%]",
      cellClassName: "pr-2 pl-3 sm:pl-4",
      render: (project) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIconColor(project.id)}`}
          >
            <Folder size={16} />
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{project.name}</div>
            {project.description && (
              <div className="text-muted truncate text-xs">
                {project.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "key",
      header: "Key",
      dataIndex: "key",
      headerClassName: "hidden px-4 lg:table-cell lg:w-[10%]",
      cellClassName: "text-muted hidden px-4 lg:table-cell",
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "w-[25%] px-2 sm:px-4 lg:w-[15%]",
      cellClassName: "px-2 sm:px-4",
      render: (project) => (
        <span
          className={`block max-w-24 truncate rounded px-3 py-1 text-center text-xs font-medium ${STATUS_STYLES[project.status]}`}
        >
          {STATUS_LABELS[project.status]}
        </span>
      ),
    },
    {
      key: "members",
      header: "Members",
      headerClassName: "hidden px-4 lg:table-cell lg:w-[20%]",
      cellClassName: "hidden px-4 lg:table-cell",
      render: (project) => (
        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map(({ user }) => (
            <div
              key={user.id}
              className="bg-primary-light text-primary flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-medium"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="bg-surface-secondary text-muted flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-medium">
              +{project.members.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due date",
      dataIndex: "dueDate",
      type: "date",
      headerClassName: "w-[20%] px-2 sm:px-4 lg:w-[20%]",
      cellClassName: "text-muted px-2 sm:px-4",
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[15%] pr-3 pl-2 sm:pr-4 lg:w-[5%]",
      cellClassName: "pr-3 pl-2 text-center sm:pr-4",
      render: () => (
        <button
          type="button"
          className="hover:bg-surface-secondary cursor-pointer rounded p-1"
        >
          <MoreVertical size={16} className="text-muted" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={projects}
      rowKey={(project) => project.id}
      isLoading={isLoading}
      isFetchingMore={isFetchingNextPage}
      emptyMessage="No projects found"
      containerRef={scrollContainerRef}
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={14}
              className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search projects..."
              className="border-line focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-8 text-sm focus:ring-1 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="border-line hover:bg-surface-secondary flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:flex">Filter</span>
          </button>
        </div>
      }
    />
  );
}
