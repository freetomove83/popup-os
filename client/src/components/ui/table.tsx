import * as React from "react";

import { cn } from "@/lib/utils";

export interface Column {
  key: string;
  label: React.ReactNode;
  align?: "left" | "right";
  width?: number | string;
  className?: string;
}

export interface Row {
  [key: string]: React.ReactNode;
  _hl?: boolean;
}

export function Table({
  cols,
  rows,
  dense,
}: {
  cols: Column[];
  rows: Row[];
  dense?: boolean;
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {cols.map(c => (
            <th
              key={c.key}
              style={{ width: c.width }}
              className={cn(
                "text-label uppercase text-muted-foreground px-3 h-9 border-b border-line bg-surface-2/60 first:pl-[18px] last:pr-[18px]",
                c.align === "right" ? "text-right" : "text-left",
              )}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={i}
            className={cn(
              "border-b border-surface-3 last:border-0 hover:bg-surface-2/70",
              r._hl && "bg-danger-50/40",
            )}
          >
            {cols.map(c => (
              <td
                key={c.key}
                className={cn(
                  "px-3 text-body text-ink first:pl-[18px] last:pr-[18px] align-middle",
                  dense ? "h-11" : "h-[52px]",
                  c.align === "right" && "text-right tabular",
                  c.className,
                )}
              >
                {r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Cell({ title, sub }: { title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="font-bold text-ink truncate">{title}</div>
      {sub && (
        <div className="text-caption text-muted-foreground truncate">{sub}</div>
      )}
    </div>
  );
}
