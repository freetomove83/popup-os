import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type NoteTone = "warning" | "info" | "brand" | "danger" | "success";

const NOTE_MAP: Record<
  NoteTone,
  { bg: string; ic: string; i: string }
> = {
  warning: { bg: "bg-warning-50 border-warning-200", ic: "text-warning-700", i: "TriangleAlert" },
  info: { bg: "bg-info-50 border-info-200", ic: "text-info-700", i: "Info" },
  brand: { bg: "bg-brand-50 border-brand-100", ic: "text-brand-700", i: "ShieldCheck" },
  danger: { bg: "bg-danger-50 border-danger-200", ic: "text-danger-700", i: "CircleAlert" },
  success: { bg: "bg-success-50 border-success-200", ic: "text-success-700", i: "CircleCheck" },
};

export function Note({
  tone = "warning",
  icon,
  title,
  children,
  className,
  compact,
}: {
  tone?: NoteTone;
  icon?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const map = NOTE_MAP[tone];
  return (
    <div
      role="note"
      className={cn(
        "flex gap-2.5 border rounded-lg text-body-sm text-ink-2",
        compact ? "px-3 py-2.5" : "px-3.5 py-3",
        map.bg,
        className,
      )}
    >
      <Icon name={icon || map.i} size={16} className={cn("mt-[2px]", map.ic)} />
      <div className="min-w-0">
        {title && <b className={cn("font-bold", map.ic)}>{title}</b>}
        {title && children && <span className="text-ink-2"> — </span>}
        <span>{children}</span>
      </div>
    </div>
  );
}
