import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import { organizationQueryOptions } from "../../api/org";
import ProjectsTable from "./ProjectsTable";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { data: org } = useQuery(organizationQueryOptions);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <PageHeader
          title="Projects"
          desc="Plan, track and deliver your work across all projects."
        />
        <Button type="button" onClick={() => navigate("/project/new")}>
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {org && <ProjectsTable organizationId={org.id} />}
    </div>
  );
}
