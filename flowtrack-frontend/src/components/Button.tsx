import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "outline-grey";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer disabled:opacity-50";

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    outline: "border border-primary text-primary hover:bg-primary-light",
    "outline-grey": "border border-line text-foreground hover:bg-gray-100",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
