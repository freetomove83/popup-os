import * as React from "react";

import { Mark, Wordmark } from "@/components/brand";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/ui/avatar";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { api, session } from "@/lib/api";
import { cn } from "@/lib/utils";

export type AdminNavKey =
  | "dashboard"
  | "project"
  | "postings"
  | "screen"
  | "contract"
  | "attend"
  | "settle"
  | "wait"
  | "ws"
  | "review";

interface NavItem {
  sec?: string;
  key?: AdminNavKey;
  label?: string;
  icon?: string;
  soon?: boolean;
}

export const NAV: NavItem[] = [
  { sec: "운영" },
  { key: "dashboard", label: "대시보드", icon: "LayoutDashboard" },
  { key: "project", label: "프로젝트·포지션", icon: "FolderKanban" },
  { key: "postings", label: "공고 등록", icon: "Megaphone" },
  { key: "screen", label: "지원자 스크리닝", icon: "UserSearch" },
  { key: "contract", label: "전자계약", icon: "FileSignature" },
  { key: "attend", label: "출퇴근 현황", icon: "ScanLine" },
  { key: "settle", label: "정산·급여", icon: "Wallet" },
  { sec: "Phase 1.5" },
  { key: "wait", label: "웨이팅콜", icon: "Hourglass", soon: true },
  { key: "ws", label: "워크스페이스", icon: "MessagesSquare", soon: true },
  { key: "review", label: "리뷰·평가", icon: "Star", soon: true },
];

function Sidebar({
  active,
  rail,
  onNavigate,
}: {
  active: AdminNavKey;
  rail: boolean;
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const adminName = session.get("admin")?.name ?? "관리자";
  const logout = async () => {
    await api("/admin/logout", { method: "POST" }).catch(() => undefined);
    session.clear("admin");
    window.location.assign("/admin/login");
  };
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col shrink-0 py-[18px] pb-4",
        rail ? "w-[72px] px-3" : "w-[240px] px-3.5",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 pb-[18px] mb-3 border-b border-sidebar-border",
          rail ? "justify-center px-0" : "px-2",
        )}
      >
        <Mark size={32} ring="ring-sidebar" />
        {!rail && (
          <div className="min-w-0">
            <Wordmark size={15} dark />
            <div className="text-[11px] text-sidebar-muted font-semibold mt-1">
              더블엠 · 관리자
            </div>
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-0.5" aria-label="주 메뉴">
        {NAV.map((n, i) =>
          n.sec ? (
            rail ? (
              <div key={i} className="h-px bg-sidebar-border my-3 mx-2" />
            ) : (
              <div
                key={i}
                className="text-[10.5px] tracking-[0.14em] uppercase text-sidebar-muted font-bold px-3 pt-4 pb-1.5"
              >
                {n.sec}
              </div>
            )
          ) : (
            <button
              key={n.key}
              type="button"
              aria-current={active === n.key ? "page" : undefined}
              aria-disabled={n.soon || undefined}
              disabled={n.soon}
              title={rail ? n.label : undefined}
              onClick={() => !n.soon && n.key && onNavigate?.(n.key)}
              className={cn(
                "flex items-center gap-2.5 h-10 rounded-lg text-[13.5px] font-semibold transition-colors text-left",
                rail ? "justify-center" : "px-3",
                active === n.key
                  ? "bg-sidebar-primary text-white"
                  : n.soon
                    ? "text-sidebar-muted cursor-not-allowed"
                    : "hover:bg-sidebar-accent hover:text-white",
              )}
            >
              <Icon name={n.icon!} size={18} strokeWidth={active === n.key ? 2.2 : 1.9} />
              {!rail && <span className="flex-1 truncate">{n.label}</span>}
              {!rail && n.soon && (
                <span className="text-[10px] font-bold px-1.5 h-[18px] inline-flex items-center rounded-[5px] border border-sidebar-border text-sidebar-muted">
                  준비 중
                </span>
              )}
            </button>
          ),
        )}
      </nav>
      <div
        className={cn(
          "mt-auto pt-4 border-t border-sidebar-border flex items-center gap-2.5",
          rail ? "justify-center" : "px-1.5",
        )}
      >
        <Avatar initials={adminName.slice(0, 1)} size={32} tone="dark" round />
        {!rail && (
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-bold text-white truncate">{adminName}</div>
            <div className="text-[11px] text-sidebar-muted">대행사 관리자</div>
          </div>
        )}
        {!rail && (
          <button
            type="button"
            title="로그아웃"
            aria-label="로그아웃"
            onClick={logout}
            className="grid place-items-center w-8 h-8 rounded-md text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          >
            <Icon name="LogOut" size={15} />
          </button>
        )}
      </div>
    </aside>
  );
}

export function PageHeader({
  crumb,
  title,
  actions,
  meta,
}: {
  crumb: string[];
  title: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          {crumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="ChevronRight" size={12} />}
              <span className={i === crumb.length - 1 ? "text-ink-3" : ""}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-h2 text-ink mt-1 truncate">{title}</h1>
        {meta && <div className="mt-1">{meta}</div>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function AdminShell({
  active,
  onNavigate,
  children,
}: {
  active: AdminNavKey;
  onNavigate?: (key: AdminNavKey) => void;
  children: React.ReactNode;
}) {
  const rail = useIsNarrow();
  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <Sidebar active={active} rail={rail} onNavigate={onNavigate} />
      <main
        className={cn(
          "flex-1 min-w-0 overflow-auto",
          rail ? "px-6 py-[22px]" : "px-7 py-6",
        )}
      >
        {children}
      </main>
    </div>
  );
}
