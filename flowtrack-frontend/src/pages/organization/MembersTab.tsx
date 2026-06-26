import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MOCK_MEMBERS = [
  {
    id: "1",
    name: "John Tan",
    email: "john.tan@example.com",
    role: "OWNER",
    joinedAt: "12 Mar 2024",
  },
  {
    id: "2",
    name: "Sarah Lim",
    email: "sarah.lim@example.com",
    role: "ADMIN",
    joinedAt: "18 Mar 2024",
  },
  {
    id: "3",
    name: "Daniel Wong",
    email: "daniel.wong@example.com",
    role: "MEMBER",
    joinedAt: "22 Mar 2024",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    role: "MEMBER",
    joinedAt: "25 Mar 2024",
  },
  {
    id: "5",
    name: "Wei Sheng",
    email: "wei.sheng@example.com",
    role: "MEMBER",
    joinedAt: "28 Mar 2024",
  },
  {
    id: "6",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    role: "ADMIN",
    joinedAt: "2 Apr 2024",
  },
  {
    id: "7",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    role: "MEMBER",
    joinedAt: "5 Apr 2024",
  },
  {
    id: "8",
    name: "James Koh",
    email: "james.koh@example.com",
    role: "MEMBER",
    joinedAt: "8 Apr 2024",
  },
  {
    id: "9",
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    role: "MEMBER",
    joinedAt: "10 Apr 2024",
  },
  {
    id: "10",
    name: "Kevin Goh",
    email: "kevin.goh@example.com",
    role: "MEMBER",
    joinedAt: "12 Apr 2024",
  },
  {
    id: "11",
    name: "Nina Teo",
    email: "nina.teo@example.com",
    role: "MEMBER",
    joinedAt: "14 Apr 2024",
  },
  {
    id: "12",
    name: "Ryan Ong",
    email: "ryan.ong@example.com",
    role: "ADMIN",
    joinedAt: "16 Apr 2024",
  },
  {
    id: "13",
    name: "Mei Lin",
    email: "mei.lin@example.com",
    role: "MEMBER",
    joinedAt: "18 Apr 2024",
  },
  {
    id: "14",
    name: "Arjun Patel",
    email: "arjun.patel@example.com",
    role: "MEMBER",
    joinedAt: "20 Apr 2024",
  },
  {
    id: "15",
    name: "Fiona Ng",
    email: "fiona.ng@example.com",
    role: "MEMBER",
    joinedAt: "22 Apr 2024",
  },
  {
    id: "16",
    name: "David Chua",
    email: "david.chua@example.com",
    role: "MEMBER",
    joinedAt: "24 Apr 2024",
  },
  {
    id: "17",
    name: "Sophie Tan",
    email: "sophie.tan@example.com",
    role: "MEMBER",
    joinedAt: "26 Apr 2024",
  },
  {
    id: "18",
    name: "Ethan Yeo",
    email: "ethan.yeo@example.com",
    role: "MEMBER",
    joinedAt: "28 Apr 2024",
  },
  {
    id: "19",
    name: "Chloe Sim",
    email: "chloe.sim@example.com",
    role: "MEMBER",
    joinedAt: "30 Apr 2024",
  },
  {
    id: "20",
    name: "Brandon Ho",
    email: "brandon.ho@example.com",
    role: "MEMBER",
    joinedAt: "2 May 2024",
  },
  {
    id: "21",
    name: "Jasmine Wu",
    email: "jasmine.wu@example.com",
    role: "MEMBER",
    joinedAt: "4 May 2024",
  },
  {
    id: "22",
    name: "Lucas Ang",
    email: "lucas.ang@example.com",
    role: "MEMBER",
    joinedAt: "6 May 2024",
  },
  {
    id: "23",
    name: "Olivia Kwek",
    email: "olivia.kwek@example.com",
    role: "MEMBER",
    joinedAt: "8 May 2024",
  },
  {
    id: "24",
    name: "Nathan Lim",
    email: "nathan.lim@example.com",
    role: "MEMBER",
    joinedAt: "10 May 2024",
  },
  {
    id: "25",
    name: "Grace Foo",
    email: "grace.foo@example.com",
    role: "MEMBER",
    joinedAt: "12 May 2024",
  },
];

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-primary-light text-primary",
  ADMIN: "bg-blue-50 text-blue-600",
  MEMBER: "bg-surface-secondary text-foreground border border-line",
};

const PAGE_SIZE = 20;

export default function MembersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="border-line mt-4 flex min-h-0 flex-1 flex-col rounded-md border bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="text-sm font-medium">{filtered.length} Members</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search members..."
              className="border-line focus:ring-primary rounded-lg border py-2 pr-4 pl-8 text-sm focus:ring-1 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="border-line hover:bg-surface-secondary flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
        </div>
      </div>

      <div className="scrollbar-white min-h-0 flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-line bg-surface-secondary sticky top-0 border-y">
            <tr>
              <th className="text-muted px-4 py-3 text-left font-medium">
                Member
              </th>
              <th className="text-muted px-4 py-3 text-left font-medium">
                Role
              </th>
              <th className="text-muted hidden px-4 py-3 text-left font-medium lg:table-cell">
                Joined
              </th>
              <th className="text-muted hidden px-4 py-3 text-left font-medium lg:table-cell">
                Status
              </th>
              <th className="text-muted px-4 py-3 text-left font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-8 text-center">
                  No members found
                </td>
              </tr>
            ) : (
              paginated.map((member) => (
                <tr
                  key={member.id}
                  className="border-line hover:bg-surface-secondary border-b last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-light text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-muted text-xs">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-3 py-1 text-xs font-medium ${ROLE_STYLES[member.role]}`}
                    >
                      {member.role.charAt(0) +
                        member.role.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="text-muted hidden px-4 py-3 lg:table-cell">{member.joinedAt}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
      </div>

      <div className="border-line flex items-center justify-between border-t px-4 py-3">
        <div className="text-muted text-sm">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="hover:bg-surface-secondary cursor-pointer rounded p-1 disabled:cursor-default disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`h-7 w-7 cursor-pointer rounded text-sm ${p === page ? "bg-primary text-white" : "hover:bg-surface-secondary"}`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="hover:bg-surface-secondary cursor-pointer rounded p-1 disabled:cursor-default disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
