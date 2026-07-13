import PageHeader from "../../components/PageHeader";

export default function CreateProjectPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Create Project"
        desc="Add a new project to get started."
        backTo="/project"
      />
    </div>
  );
}
