import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  SearchIcon,
} from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { organizationMembersQueryOptions } from "../../../api/org";
import type { Member } from "../../../api/org";
import { useNearBottomScroll } from "../../../hooks/useNearBottomScroll";
import { hasPermission, type MemberRole } from "../../../utils/permissions";
import DataTable, { type Column } from "../../../components/DataTable";

const PAGE_SIZE = 10;

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-primary-light text-primary",
  ADMIN: "bg-blue-50 text-blue-600",
  MEMBER: "bg-surface-secondary text-foreground border border-line",
};

interface MembersTabProps {
  role: MemberRole | undefined;
}

export default function MembersTab({ role }: MembersTabProps) {
  const canManage = hasPermission(role, "members:manage");
  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(organizationMembersQueryOptions(PAGE_SIZE));

  const members: Member[] = data?.pages.flatMap((p) => p.members) ?? [];

  const scrollContainerRef = useNearBottomScroll(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: (Column<Member> | false)[] = [
    {
      key: "member",
      header: "Member",
      headerClassName: "w-[55%] pr-2 pl-3 sm:pl-4 lg:w-[35%]",
      cellClassName: "pr-2 pl-3 sm:pl-4",
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary-light text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {member.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{member.name}</div>
            <div className="text-muted truncate text-xs">{member.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      headerClassName: "w-[30%] px-2 sm:px-4 lg:w-1/5",
      cellClassName: "px-2 sm:px-4",
      render: (member) => (
        <span
          className={`block max-w-20 truncate rounded px-3 py-1 text-center text-xs font-medium ${ROLE_STYLES[member.role]}`}
        >
          {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      dataIndex: "createdAt" as const,
      type: "date" as const,
      headerClassName: "hidden px-4 lg:table-cell lg:w-1/5",
      cellClassName: "text-muted hidden px-4 lg:table-cell",
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "hidden px-4 lg:table-cell lg:w-1/5",
      cellClassName: "hidden px-4 lg:table-cell",
      render: () => (
        <span className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
          Active
        </span>
      ),
    },
    canManage && {
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
      data={filtered}
      rowKey={(member) => member.id}
      isLoading={isLoading}
      isFetchingMore={isFetchingNextPage}
      emptyMessage="No members found"
      containerRef={scrollContainerRef}
      toolbar={
        <div className="flex items-center justify-between px-3 py-3 sm:p-4">
          <div className="text-sm font-medium">{filtered.length} Members</div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:flex">
              <Search
                size={14}
                className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="border-line focus:ring-primary rounded-lg border py-2 pr-4 pl-8 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="border-line hover:bg-surface-secondary flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm sm:hidden"
            >
              <SearchIcon size={14} />
            </button>
            <button
              type="button"
              className="border-line hover:bg-surface-secondary flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:flex">Filter</span>
            </button>
          </div>
        </div>
      }
    />
  );
}
