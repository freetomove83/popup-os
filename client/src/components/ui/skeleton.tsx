import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-md bg-surface-3 animate-pulse", className)} />;
}
