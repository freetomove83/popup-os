import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/** shadcn ToggleGroupItem 대응 — 필터 칩. */
export function FilterChip({
  on,
  onClick,
  children,
}: {
  on?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={!!on}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        on
          ? "bg-ink text-white border-ink"
          : "bg-surface text-ink-2 border-line-2 hover:bg-surface-2",
      )}
    >
      {on && <Icon name="Check" size={13} strokeWidth={2.6} />}
      {children}
    </button>
  );
}
