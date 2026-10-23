import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[12px] font-semibold text-ink-2 mb-1.5">{label}</span>
      )}
      {children}
      {(error || hint) && (
        <span
          className={cn(
            "flex items-center gap-1 mt-1.5 text-caption",
            error ? "text-danger-700" : "text-muted-foreground",
          )}
        >
          {error && <Icon name="CircleAlert" size={12} />}
          {error || hint}
        </span>
      )}
    </label>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center gap-2 h-10 px-3 rounded-lg border border-input bg-surface transition-colors",
        "focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/20",
        className,
      )}
    >
      {icon && <Icon name={icon} size={15} className="text-muted-foreground" />}
      <input
        ref={ref}
        className="flex-1 min-w-0 bg-transparent text-body text-ink outline-none placeholder:text-muted-foreground disabled:text-subtle"
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
