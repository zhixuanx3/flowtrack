import { useState } from "react";
import {
  Plus,
  Dot,
  Crown,
  Calendar,
  User,
  Building2,
  UserRoundPlus,
  Pencil,
} from "lucide-react";
import Button from "../../components/Button";
import MembersTab from "./MembersTab";

const TABS = ["Members", "Roles", "Settings", "Billing", "Audit Log"];

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState("Members");

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">Organization</div>
        <div className="text-md text-muted">
          Manage your organization's settings and members
        </div>
      </div>

      <div className="border-line my-4 rounded-md border bg-white p-6">
        <div className="flex">
          <div className="bg-primary-light rounded-xl p-5">
            <Building2 size={50} className="text-primary" />
          </div>
          <div className="flex flex-col justify-around px-4 py-1">
            <div className="text-xl font-bold">FlowTrack Pte Ltd</div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <div className="text-md text-muted flex items-center gap-1 whitespace-nowrap">
                <User size={18} />
                <div>25 members</div>
              </div>
              <Dot className="text-muted" size={20} />
              <div className="text-md text-muted flex items-center gap-1 whitespace-nowrap">
                <Crown size={18} />
                <div>Owner</div>
              </div>
              <Dot className="text-muted" size={20} />
              <div className="text-md text-muted flex items-center gap-1 whitespace-nowrap">
                <Calendar size={18} />
                <div>Created on 12 Mar 2024</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline-grey" type="button">
            <Pencil size={16} className="mr-2" />
            Edit Organization
          </Button>
          <Button variant="outline" type="button">
            <UserRoundPlus size={16} className="mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      <div className="border-line mt-4 flex gap-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-3 text-sm font-medium transition ${
              activeTab === tab
                ? "border-primary text-primary border-b-2"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Members" && <MembersTab />}
    </div>
  );
}
