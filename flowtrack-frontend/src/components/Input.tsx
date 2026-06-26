import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className={`w-full rounded-lg border border-line px-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none ${className}`}
        {...props}
      />
      <p className="h-4 text-xs text-error">{error}</p>
    </div>
  );
}
