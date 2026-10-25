import * as React from "react";
import { Link, useLocation } from "wouter";

import { Mark, Wordmark } from "@/components/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/worker", label: "공고", icon: "Search" },
  { href: "/worker/applications", label: "지원", icon: "ClipboardList" },
  { href: "/worker/profile", label: "검카드", icon: "IdCard" },
  { href: "/worker/settle", label: "정산", icon: "Wallet" },
];

const isActive = (loc: string, href: string) => (href === "/worker" ? loc === "/worker" : loc.startsWith(href));

/** 웹(md 이상) 상단 메뉴 — 모바일에서는 하단 탭바를 쓴다. */
function WorkerTopNav() {
  const [loc] = useLocation();
  return (
    <header className="hidden md:flex shrink-0 h-16 items-center gap-8 px-8 border-b border-line bg-surface">
      <Link href="/worker" className="flex items-center gap-2">
        <Mark size={28} />
        <Wordmark size={17} />
      </Link>
      <nav className="flex items-center gap-1" aria-label="스태프 메뉴">
        {TABS.map(t => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={isActive(loc, t.href) ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[14px] font-semibold transition-colors",
              isActive(loc, t.href) ? "bg-brand-50 text-brand-700" : "text-ink-3 hover:bg-surface-2",
            )}
          >
            <Icon name={t.icon} size={17} />
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function WorkerTabBar() {
  const [loc] = useLocation();
  return (
    <nav className="md:hidden shrink-0 border-t border-line bg-surface flex" aria-label="스태프 탭">
      {TABS.map(t => {
        const active = isActive(loc, t.href);
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

/** 스태프(워커) 앱 셸 — 모바일은 전체 화면 + 하단 탭, 웹(md 이상)은 상단 메뉴 + 가운데 본문 패널. */
export function WorkerFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh flex flex-col bg-surface md:bg-background overflow-hidden">
      <WorkerTopNav />
      <div className="flex-1 min-h-0 md:p-6">
        <div className="h-full w-full md:max-w-[880px] mx-auto bg-surface md:rounded-[20px] md:border md:border-line md:shadow-soft overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
      <WorkerTabBar />
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
