import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "outline-grey" | "grey" | "grey-error";
  size?: "sm" | "md";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "flex items-center justify-center rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50";

  const sizes = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
  };

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    outline: "border border-primary text-primary hover:bg-primary-light",
    "outline-grey": "border border-line text-foreground hover:bg-gray-100",
    grey: "bg-gray-100 text-foreground hover:bg-gray-200",
    "grey-error": "bg-gray-100 text-error hover:bg-gray-200",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
