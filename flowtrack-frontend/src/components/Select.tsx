import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export default function Select({
  label,
  error,
  helperText,
  required,
  wrapperClassName = "",
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-lg border border-line bg-white px-4 py-2 pr-9 text-sm focus:ring-1 focus:ring-primary focus:outline-none ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
      </div>
      <p className={`min-h-4 text-xs ${error ? "text-error" : "text-muted"}`}>
        {error || helperText}
      </p>
    </div>
  );
}
