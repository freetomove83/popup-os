import * as React from "react";

import { KV } from "@/components/kv";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
      {children}
    </div>
  );
}

export function DocBox({
  title,
  rows,
}: {
  title?: React.ReactNode;
  rows: [React.ReactNode, React.ReactNode][];
}) {
  return (
    <div className="rounded-[14px] border border-line overflow-hidden">
      {title && (
        <div className="px-4 h-10 flex items-center bg-surface-2 border-b border-line text-[12.5px] font-bold text-ink-2">
          {title}
        </div>
      )}
      <div className="px-4">
        <KV rows={rows} size="lg" />
      </div>
    </div>
  );
}

export function CheckRow({
  children,
  checked = true,
  onCheckedChange,
}: {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 py-3 min-h-[48px] cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} size={22} />
      <span className="text-[14px] text-ink-2 leading-snug pt-[1px]">{children}</span>
    </label>
  );
}

export function StaffSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-[64px] rounded-[14px]" />
      <div className="rounded-[14px] border border-line p-4 space-y-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-36" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[110px] rounded-[14px]" />
    </div>
  );
}
