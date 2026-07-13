import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  desc?: string;
  backTo?: string;
}

export default function PageHeader({ title, desc, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {backTo && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="hover:bg-surface-secondary cursor-pointer rounded p-1"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="text-xl font-bold sm:text-2xl">{title}</div>
      </div>
      {desc && <div className="sm:text-md text-muted text-sm">{desc}</div>}
    </div>
  );
}
