import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  hoverable,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card text-card-foreground rounded-card border border-line shadow-soft",
        hoverable &&
          "transition-shadow hover:shadow-soft-hover hover:border-brand-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  hint,
  icon,
  action,
  className,
}: {
  title: React.ReactNode;
  hint?: React.ReactNode;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-[18px] h-[52px] border-b border-line",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && <Icon name={icon} size={16} className="text-ink-3" />}
        <h3 className="text-h3 text-ink truncate">{title}</h3>
        {hint && (
          <span className="text-caption text-muted-foreground truncate">{hint}</span>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("p-[18px]", className)}>{children}</div>;
}
