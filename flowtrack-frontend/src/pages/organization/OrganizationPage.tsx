import { useEffect, useRef, useState } from "react";
import {
  Dot,
  Crown,
  Calendar,
  User,
  Building2,
  UserRoundPlus,
  Pencil,
  MoreVertical,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import Skeleton from "../../components/Skeleton";
import MembersTab from "./members/MembersTab";
import { organizationQueryOptions } from "../../api/org";
import { setOrg } from "../../store/authSlice";
import { hasPermission, type MemberRole } from "../../utils/permissions";
import EditOrganizationModal from "./EditOrganizationModal";
import InviteMembersModal from "./members/InviteMembersModal";
import PageHeader from "../../components/PageHeader";

const ALL_TABS = [
  { key: "Members", permission: "members:view" },
  // { key: "Roles", permission: "roles:manage" },
  // { key: "Settings", permission: "settings:manage" },
] as const;

export default function OrganizationPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Members");
  const { data: org, isLoading } = useQuery(organizationQueryOptions);

  // Keep Redux in sync so AppLayout's nav-permission check sees fresh org/role data too.
  useEffect(() => {
    if (org) dispatch(setOrg(org));
  }, [org, dispatch]);

  const role = org?.role as MemberRole | undefined;
  const tabs = ALL_TABS.filter((tab) => hasPermission(role, tab.permission));

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Organization"
        desc="Manage your organization's settings and members"
      />

      <div className="border-line relative my-2 rounded-md border bg-white px-4 py-3 sm:my-4 sm:p-6">
        {(hasPermission(role, "org:edit") ||
          hasPermission(role, "org:invite")) && (
          <div className="absolute top-3 right-3 md:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="hover:bg-surface-secondary cursor-pointer rounded p-1"
            >
              <MoreVertical size={20} className="text-muted" />
            </button>
            {isMenuOpen && (
              <div className="border-line shadow-card absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border bg-white py-1">
                {hasPermission(role, "org:edit") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="hover:bg-surface-secondary flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm"
                  >
                    <Pencil size={16} />
                    Edit Organization
                  </button>
                )}
                {hasPermission(role, "org:invite") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="hover:bg-surface-secondary flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm"
                  >
                    <UserRoundPlus size={16} />
                    Invite Members
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex">
          <div className="bg-primary-light flex size-16 shrink-0 items-center justify-center rounded-xl sm:size-24">
            <Building2 className="text-primary size-9.5 sm:size-13" />
          </div>
          <div className="flex flex-col justify-around px-4 py-1">
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <div className="text-lg font-semibold sm:text-xl">
                {org?.name}
              </div>
            )}
            {isLoading ? (
              <div className="mt-2 flex flex-wrap gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ) : (
              <div className="mt-1 flex flex-col flex-wrap gap-x-2 gap-y-0.5 sm:mt-0 sm:flex-row sm:items-center">
                <div className="sm:text-md text-muted flex items-center gap-1 text-sm whitespace-nowrap">
                  <User className="sm:size5 size-3.5" />
                  <div>{org?.memberCount} members</div>
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
            )}
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
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsInviteOpen(true)}
            >
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

      {activeTab === "Members" && <MembersTab role={role} />}

      {org && (
        <EditOrganizationModal
          org={org}
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <InviteMembersModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
