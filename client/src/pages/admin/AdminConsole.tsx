import * as React from "react";

import { EmptyState } from "@/components/feedback";
import { AdminShell, type AdminNavKey } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { AttendanceScreen } from "@/pages/admin/attendance";
import { ContractScreen } from "@/pages/admin/contract";
import { DashboardScreen } from "@/pages/admin/dashboard";
import { PostingsScreen } from "@/pages/admin/postings";
import { ProjectScreen } from "@/pages/admin/project";
import { ScreeningScreen } from "@/pages/admin/screening";
import { SettlementScreen } from "@/pages/admin/settlement";

function ComingSoonScreen({
  onNavigate,
}: {
  onNavigate: (k: AdminNavKey) => void;
}) {
  return (
    <AdminShell active="wait" onNavigate={onNavigate}>
      <Card>
        <EmptyState
          icon="Hourglass"
          title="Phase 1.5 · 웨이팅콜 / 워크스페이스 / 리뷰"
          desc="MVP 핵심 흐름(구인·계약·출퇴근·정산)이 안정화된 뒤 순차 오픈합니다. 문서안에서 Phase 1에 함께 묶여 있던 모듈을 이연한 것입니다."
          className="py-24"
        />
      </Card>
    </AdminShell>
  );
}

const VALID: AdminNavKey[] = [
  "dashboard",
  "project",
  "postings",
  "screen",
  "contract",
  "attend",
  "settle",
  "wait",
  "ws",
  "review",
];

export default function AdminConsole() {
  const [active, setActive] = React.useState<AdminNavKey>(() => {
    if (typeof window === "undefined") return "dashboard";
    const v = new URLSearchParams(window.location.search).get("screen");
    return (VALID as string[]).includes(v ?? "") ? (v as AdminNavKey) : "dashboard";
  });

  const navigate = React.useCallback((key: AdminNavKey) => {
    setActive(key);
    const url = new URL(window.location.href);
    url.searchParams.set("screen", key);
    window.history.replaceState(null, "", url.toString());
  }, []);

  switch (active) {
    case "project":
      return <ProjectScreen onNavigate={navigate} />;
    case "postings":
      return <PostingsScreen onNavigate={navigate} />;
    case "screen":
      return <ScreeningScreen onNavigate={navigate} />;
    case "contract":
      return <ContractScreen onNavigate={navigate} />;
    case "attend":
      return <AttendanceScreen onNavigate={navigate} />;
    case "settle":
      return <SettlementScreen onNavigate={navigate} />;
    case "wait":
    case "ws":
    case "review":
      return <ComingSoonScreen onNavigate={navigate} />;
    default:
      return <DashboardScreen onNavigate={navigate} />;
  }
}
