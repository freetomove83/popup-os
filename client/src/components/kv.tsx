import * as React from "react";

import { cn } from "@/lib/utils";

export function KV({
  rows,
  size = "md",
  className,
}: {
  rows: [React.ReactNode, React.ReactNode][];
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-surface-3", className)}>
      {rows.map(([k, v], i) => (
        <div
          key={i}
          className={cn(
            "flex items-start justify-between gap-4",
            size === "lg" ? "py-2.5 text-[14px]" : "py-2.5 text-body",
          )}
        >
          <dt className="text-muted-foreground font-medium shrink-0">{k}</dt>
          <dd className="font-bold text-ink text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
