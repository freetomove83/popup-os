import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="px-[18px] py-2" aria-busy="true" aria-label="불러오는 중">
      <div className="flex gap-6 h-9 items-center border-b border-line">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 flex-1 max-w-[70px]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-6 h-[52px] items-center border-b border-surface-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3 flex-1", i === 0 ? "max-w-[150px]" : "max-w-[80px]")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
