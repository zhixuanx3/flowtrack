import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export default function Input({
  label,
  error,
  helperText,
  required,
  wrapperClassName = "",
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-line px-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none ${className}`}
        {...props}
      />
      <p className={`min-h-4 text-xs ${error ? "text-error" : "text-muted"}`}>
        {error || helperText}
      </p>
    </div>
  );
}
