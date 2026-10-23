import { Dot, TONE, type Tone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const VAL_CLS: Record<string, string> = {
  success: "text-success-700",
  danger: "text-danger-700",
  brand: "text-brand-600",
  warning: "text-warning-700",
};

export interface KpiProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: React.ReactNode;
  tone?: Tone;
  icon?: string;
  pulse?: boolean;
  state?: "default" | "loading" | "error";
}

export function Kpi({
  label,
  value,
  unit,
  sub,
  tone,
  icon,
  pulse,
  state = "default",
}: KpiProps) {
  if (state === "loading") {
    return (
      <Card className="p-[18px]">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-16 mt-3" />
        <Skeleton className="h-3 w-24 mt-2" />
      </Card>
    );
  }
  return (
    <Card className="p-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          {pulse && <Dot tone="success" pulse />}
          {label}
        </div>
        {icon && (
          <span
            className={cn(
              "grid place-items-center w-7 h-7 rounded-lg",
              tone ? TONE[tone].chip : "bg-surface-2 text-ink-3",
            )}
          >
            <Icon name={icon} size={15} />
          </span>
        )}
      </div>
      <div
        className={cn(
          "text-kpi mt-2 tabular",
          state === "error" ? "text-subtle" : VAL_CLS[tone ?? ""] || "text-ink",
        )}
      >
        {state === "error" ? "—" : value}
        {unit && state !== "error" && (
          <span className="text-[15px] font-bold text-muted-foreground ml-0.5">
            {unit}
          </span>
        )}
      </div>
      <div className="text-caption text-muted-foreground mt-1">
        {state === "error" ? "불러오지 못함" : sub}
      </div>
    </Card>
  );
}
