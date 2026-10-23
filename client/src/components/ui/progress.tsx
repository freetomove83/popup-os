import { cn } from "@/lib/utils";

export function Progress({
  value,
  tone = "brand",
  className,
}: {
  value: number;
  tone?: "brand" | "success" | "neutral";
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 rounded-full bg-surface-3 overflow-hidden", className)}
    >
      <div
        className={cn(
          "h-full rounded-full",
          tone === "success" ? "bg-success" : tone === "neutral" ? "bg-subtle" : "bg-brand",
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
