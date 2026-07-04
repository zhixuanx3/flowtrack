import { useEffect, useState } from "react";
import {
  Dot,
  Crown,
  Calendar,
  User,
  Building2,
  UserRoundPlus,
  Pencil,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import Button from "../../components/Button";
import MembersTab from "./members/MembersTab";
import { getOrganization } from "../../api/org";
import { setOrg } from "../../store/authSlice";
import { hasPermission, type MemberRole } from "../../utils/permissions";
import { withMinDuration } from "../../utils/withMinDuration";
import EditOrganizationModal from "./EditOrganizationModal";

const ALL_TABS = [
  { key: "Members", permission: "members:view" },
  { key: "Roles", permission: "roles:manage" },
  { key: "Settings", permission: "settings:manage" },
] as const;

export default function OrganizationPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Members");
  const reduxOrg = useSelector((state: RootState) => state.auth.org);

  const { data: org = reduxOrg } = useQuery({
    queryKey: ["organization"],
    queryFn: () => withMinDuration(getOrganization().then((r) => r.data)),
  });

  // Keep Redux in sync so AppLayout's nav-permission check sees fresh org/role data too.
  useEffect(() => {
    if (org) dispatch(setOrg(org));
  }, [org, dispatch]);

  const role = org?.role as MemberRole | undefined;
  const tabs = ALL_TABS.filter((tab) => hasPermission(role, tab.permission));

  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold sm:text-2xl">Organization</div>
        <div className="sm:text-md text-muted text-sm">
          Manage your organization's settings and members
        </div>
      </div>

      <div className="border-line my-2 rounded-md border bg-white px-4 py-3 sm:my-4 sm:p-6">
        <div className="flex">
          <div className="bg-primary-light flex size-16 shrink-0 items-center justify-center rounded-xl sm:size-24">
            <Building2 className="text-primary size-9.5 sm:size-13" />
          </div>
          <div className="flex flex-col justify-around px-4 py-1">
            <div className="text-lg font-semibold sm:text-xl">
              {org?.name ?? "—"}
            </div>
            <div className="mt-1 flex flex-col flex-wrap gap-x-2 gap-y-0.5 sm:mt-0 sm:flex-row sm:items-center">
              <div className="sm:text-md text-muted flex items-center gap-1 text-sm whitespace-nowrap">
                <User className="sm:size5 size-3.5" />
                <div>{org?.memberCount ?? "—"} members</div>
              </div>
              <Dot className="text-muted hidden sm:flex" size={20} />
              <div className="sm:text-md text-muted flex items-center gap-1 text-sm whitespace-nowrap">
                <Crown className="sm:size5 size-3.5" />
                <div>
                  {org?.role
                    ? org.role.charAt(0) + org.role.slice(1).toLowerCase()
                    : "—"}
                </div>
              </div>
              <Dot className="text-muted hidden sm:flex" size={20} />
              <div className="sm:text-md text-muted flex items-center gap-1 text-sm whitespace-nowrap">
                <Calendar className="sm:size5 size-3.5" />
                <div>
                  Created on{" "}
                  {org?.createdAt
                    ? new Date(org.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 hidden gap-3 md:flex">
          {hasPermission(role, "org:edit") && (
            <Button
              variant="outline-grey"
              type="button"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil size={16} className="mr-2" />
              Edit Organization
            </Button>
          )}
          {hasPermission(role, "org:invite") && (
            <Button variant="outline" type="button">
              <UserRoundPlus size={16} className="mr-2" />
              Invite Members
            </Button>
          )}
        </div>
      </div>

      <div className="border-line mt-2 flex gap-6 border-b sm:mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer pb-2 text-sm font-medium transition sm:pb-3 ${
              activeTab === tab.key
                ? "border-primary text-primary border-b-2"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.key}
          </button>
        ))}
      </div>

      {activeTab === "Members" && <MembersTab />}

      <EditOrganizationModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
