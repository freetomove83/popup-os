import * as React from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "Inbox",
  title,
  desc,
  action,
  className,
}: {
  icon?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center py-12 px-6",
        className,
      )}
    >
      <span className="grid place-items-center w-12 h-12 rounded-[14px] bg-surface-2 border border-line text-ink-3 mb-3.5">
        <Icon name={icon} size={22} />
      </span>
      <div className="text-h3 text-ink">{title}</div>
      {desc && (
        <div className="text-body-sm text-muted-foreground mt-1 max-w-[340px] text-pretty">
          {desc}
        </div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "데이터를 불러오지 못했어요",
  desc = "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
  code,
  action,
  className,
}: {
  title?: React.ReactNode;
  desc?: React.ReactNode;
  code?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center text-center py-12 px-6", className)}
    >
      <span className="grid place-items-center w-12 h-12 rounded-[14px] bg-danger-50 border border-danger-200 text-danger-700 mb-3.5">
        <Icon name="CloudOff" size={22} />
      </span>
      <div className="text-h3 text-ink">{title}</div>
      <div className="text-body-sm text-muted-foreground mt-1 max-w-[360px] text-pretty">
        {desc}
      </div>
      <div className="mt-4 flex gap-2">
        {action || (
          <Button variant="outline" size="sm" icon="RotateCw">
            다시 시도
          </Button>
        )}
      </div>
      {code && (
        <div className="mt-3 text-caption text-muted-foreground tabular">
          오류 코드 {code}
        </div>
      )}
    </div>
  );
}
