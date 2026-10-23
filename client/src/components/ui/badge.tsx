import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type Tone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

interface ToneStyle {
  chip: string;
  icon: string;
  dot: string;
  text: string;
  border: string;
}

export const TONE: Record<Tone, ToneStyle> = {
  success: {
    chip: "bg-success-50 text-success-700",
    icon: "CircleCheck",
    dot: "bg-success",
    text: "text-success-700",
    border: "border-success-200",
  },
  warning: {
    chip: "bg-warning-50 text-warning-700",
    icon: "Clock",
    dot: "bg-warning",
    text: "text-warning-700",
    border: "border-warning-200",
  },
  danger: {
    chip: "bg-danger-50 text-danger-700",
    icon: "CircleX",
    dot: "bg-danger",
    text: "text-danger-700",
    border: "border-danger-200",
  },
  info: {
    chip: "bg-info-50 text-info-700",
    icon: "Info",
    dot: "bg-info",
    text: "text-info-700",
    border: "border-info-200",
  },
  brand: {
    chip: "bg-brand-50 text-brand-700",
    icon: "CalendarClock",
    dot: "bg-brand",
    text: "text-brand-600",
    border: "border-brand-100",
  },
  neutral: {
    chip: "bg-surface-3 text-ink-3",
    icon: "CircleMinus",
    dot: "bg-subtle",
    text: "text-ink-3",
    border: "border-line-2",
  },
};

export interface BadgeProps {
  tone?: Tone;
  icon?: string;
  noIcon?: boolean;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** 상태 배지 — 색 + 아이콘 + 라벨을 항상 함께 사용한다. */
export function Badge({
  tone = "neutral",
  icon,
  noIcon,
  dot,
  pulse,
  className,
  children,
}: BadgeProps) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-6 px-2 rounded-chip text-caption font-bold whitespace-nowrap shrink-0",
        t.chip,
        className,
      )}
    >
      {dot ? (
        <span
          className={cn("w-[7px] h-[7px] rounded-full", t.dot, pulse && "animate-dot-pulse")}
        />
      ) : !noIcon ? (
        <Icon name={icon || t.icon} size={13} strokeWidth={2.4} />
      ) : null}
      {children}
    </span>
  );
}

export function Dot({ tone = "success", pulse }: { tone?: Tone; pulse?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-[7px] h-[7px] rounded-full",
        TONE[tone].dot,
        pulse && "animate-dot-pulse",
      )}
    />
  );
}

/** 태그 (shadcn Badge variant="tag") */
export function Tag({
  kind = "default",
  children,
}: {
  kind?: "default" | "pos" | "lang";
  children: React.ReactNode;
}) {
  const k = {
    default: "bg-surface-3 text-ink-3",
    pos: "bg-brand-50 text-brand-700",
    lang: "bg-info-50 text-info-700",
  }[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-[22px] px-2 rounded-sm text-[11px] font-semibold",
        k,
      )}
    >
      {kind === "lang" && <Icon name="Languages" size={11} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
