import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  SearchIcon,
} from "lucide-react";
import { getOrganizationMembers } from "../../../api/org";
import type { Member } from "../../../api/org";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";

const PAGE_SIZE = 10;
const MOCK_TOTAL = 47;

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-primary-light text-primary",
  ADMIN: "bg-blue-50 text-blue-600",
  MEMBER: "bg-surface-secondary text-foreground border border-line",
};

// Generates fake pages of members so infinite scroll can be tested without a big real dataset.
const getMockMembersPage = async (page: number, pageSize: number) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const start = (page - 1) * pageSize;
  const items: Member[] = Array.from(
    { length: Math.max(0, Math.min(pageSize, MOCK_TOTAL - start)) },
    (_, i) => {
      const n = start + i + 1;
      return {
        id: String(n),
        name: `Mock User ${n}`,
        email: `mock.user${n}@example.com`,
        role: n % 7 === 0 ? "OWNER" : n % 3 === 0 ? "ADMIN" : "MEMBER",
        createdAt: new Date().toISOString(),
      };
    },
  );
  return { items, hasMore: start + items.length < MOCK_TOTAL };
};

export default function MembersTab() {
  const [search, setSearch] = useState("");
  const {
    items: members,
    isLoading,
    containerRef: scrollContainerRef,
  } = useInfiniteScroll<Member>(async (page) => {
    // Real API call — uncomment to switch back, and comment out the mock line below.
    const { data } = await getOrganizationMembers(page, PAGE_SIZE);
    return {
      items: data.members,
      hasMore: data.page * data.pageSize < data.total,
    };

    // return getMockMembersPage(page, PAGE_SIZE);
  });

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="border-line mt-4 flex min-h-0 flex-1 flex-col rounded-md border bg-white">
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

      <div
        ref={scrollContainerRef}
        className="scrollbar-white min-h-0 flex-1 overflow-auto"
      >
        <table className="w-full table-fixed text-sm">
          <thead className="border-line bg-surface-secondary sticky top-0 border-y">
            <tr>
              <th className="text-muted w-[55%] py-3 pr-2 pl-3 text-left font-medium sm:pl-4 lg:w-2/5">
                Member
              </th>
              <th className="text-muted w-[30%] px-2 py-3 text-left font-medium sm:px-4 lg:w-1/5">
                Role
              </th>
              <th className="text-muted hidden px-4 py-3 text-left font-medium lg:table-cell lg:w-1/5">
                Joined
              </th>
              <th className="text-muted hidden px-4 py-3 text-left font-medium lg:table-cell lg:w-1/5">
                Status
              </th>
              <th className="w-[15%] py-3 pr-3 pl-2 sm:pr-4 lg:w-auto" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-8 text-center">
                  No members found
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr
                  key={member.id}
                  className="border-line hover:bg-surface-secondary border-b last:border-0"
                >
                  <td className="py-3 pr-2 pl-3 sm:pl-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-light text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {member.name}
                        </div>
                        <div className="text-muted truncate text-xs">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 sm:px-4">
                    <span
                      className={`block max-w-20 truncate rounded px-3 py-1 text-center text-xs font-medium ${ROLE_STYLES[member.role]}`}
                    >
                      {member.role.charAt(0) +
                        member.role.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="text-muted hidden px-4 py-3 lg:table-cell">
                    {new Date(member.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="py-3 pr-3 pl-2 text-center sm:pr-4">
                    <button
                      type="button"
                      className="hover:bg-surface-secondary cursor-pointer rounded p-1"
                    >
                      <MoreVertical size={16} className="text-muted" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isLoading && (
          <div className="text-muted py-4 text-center text-sm">Loading...</div>
        )}
      </div>
    </div>
  );
}
