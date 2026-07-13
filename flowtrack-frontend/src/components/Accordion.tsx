import { useState, type ReactNode } from "react";

import { ChevronDown } from "lucide-react";

export interface AccordionProps {
  headerPrefixIcon?: ReactNode;
  title: string;
  children: ReactNode;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}
export default function Accordion({
  headerPrefixIcon,
  title,
  children,
  expanded,
  onToggle,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleToggle = () => {
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  };

  return (
    <div className="bg-surface border-line w-full rounded-md border px-5 py-4">
      <div
        onClick={handleToggle}
        className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3"
      >
        {headerPrefixIcon}
        <div className="text-lg font-semibold">{title}</div>
        <ChevronDown
          size={20}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
        <div />
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
