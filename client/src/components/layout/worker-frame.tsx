import * as React from "react";
import { Link, useLocation } from "wouter";

import { Mark } from "@/components/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/worker", label: "공고", icon: "Search" },
  { href: "/worker/applications", label: "지원", icon: "ClipboardList" },
  { href: "/worker/profile", label: "검카드", icon: "IdCard" },
  { href: "/worker/settle", label: "정산", icon: "Wallet" },
];

function WorkerTabBar() {
  const [loc] = useLocation();
  return (
    <nav className="shrink-0 border-t border-line bg-surface flex" aria-label="스태프 탭">
      {TABS.map(t => {
        const active =
          t.href === "/worker" ? loc === "/worker" : loc.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
              active ? "text-brand-600" : "text-muted-foreground hover:text-ink-3",
            )}
          >
            <Icon name={t.icon} size={20} strokeWidth={active ? 2.4 : 2} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** 스태프(워커) 앱 셸 — 모바일에서는 전체 화면, 데스크톱에서는 폰 프레임. */
export function WorkerFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background flex justify-center overflow-x-hidden sm:py-8">
      <div className="w-full max-w-[430px] min-w-0 bg-surface flex flex-col h-dvh sm:h-[844px] sm:rounded-[33px] sm:shadow-overlay sm:border sm:border-line overflow-hidden">
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</div>
        <WorkerTabBar />
      </div>
    </div>
  );
}

export function WorkerHeader({
  eyebrow = "POPUP OS",
  title,
  action,
  back,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  back?: React.ReactNode;
}) {
  return (
    <header className="px-5 pt-3 pb-3.5 border-b border-line sticky top-0 bg-surface z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {back}
          <Mark size={18} variant="b" />
          <span className="text-[11.5px] font-bold text-muted-foreground tracking-[0.04em] truncate">
            {eyebrow}
          </span>
        </div>
        {action}
      </div>
      <h1 className="text-[20px] font-extrabold tracking-[-0.015em] text-ink mt-1.5">
        {title}
      </h1>
    </header>
  );
}
