import { EmptyState, ErrorState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Badge, Dot, TONE, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Table } from "@/components/ui/table";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import type { Dashboard } from "@/data/admin";
import { useApi, won } from "@/lib/api";
import { cn } from "@/lib/utils";

function AttendCell({ n, of, warn }: { n: number; of: number; warn?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "tabular font-bold w-[38px]",
          warn ? "text-danger-700" : "text-ink",
        )}
      >
        {n}/{of}
      </span>
      <Progress
        value={(n / of) * 100}
        tone={n === of ? "success" : "brand"}
        className="flex-1 max-w-[80px] h-1.5"
      />
    </div>
  );
}

export function DashboardScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const q = useApi<Dashboard>("/admin/dashboard");
  const d = q.data;
  const state = useScreenState(q, !!d && d.sites.length === 0);
  const narrow = useIsNarrow();
  const k = d?.kpis;

  const kpis = [
    { label: "진행 중 프로젝트", value: k?.activeProjects ?? 0, sub: `이번 주 종료 ${k?.endingThisWeek ?? 0}`, tone: "brand" as Tone, icon: "FolderKanban" },
    { label: "오늘 출근", value: k?.attended ?? 0, unit: `/${k?.expected ?? 0}`, sub: `지각 ${k?.late ?? 0} · 미출근 ${k?.absent ?? 0}`, tone: "success" as Tone, pulse: true, icon: "UserCheck", zeroSub: "오늘 예정 인원 없음" },
    { label: "서명 대기 계약", value: k?.unsigned ?? 0, sub: k?.expiring ? `만료 임박 ${k.expiring}` : "만료 임박 없음", icon: "FileSignature", zeroSub: "대기 중인 계약 없음" },
    { label: "정산 예정", value: `₩${won(k?.payable ?? 0)}`, sub: `대상 ${k?.payableCount ?? 0}명`, icon: "Wallet", zero: "₩0", zeroSub: "대상 0명" },
  ];

  const rows = (d?.sites ?? []).map(r => ({
    site: <Cell title={r.title} sub={r.venue} />,
    pos: r.positions,
    att: r.expected ? <AttendCell n={r.attended} of={r.expected} warn={r.absent > 0} /> : <span className="text-subtle">근무자 없음</span>,
    con: (
      <span className={cn("tabular font-semibold", r.signed < r.contracts && "text-warning-700")}>
        {r.signed}/{r.contracts}
      </span>
    ),
    st: r.absent ? (
      <Badge tone="danger" icon="UserX">미출근 {r.absent}</Badge>
    ) : r.late ? (
      <Badge tone="warning">지각 {r.late}</Badge>
    ) : (
      <Badge tone="success">정상</Badge>
    ),
    _hl: r.absent > 0,
  }));

  const todo = d?.todo ?? [];
  const open = (to: AdminNavKey, projectId?: number) => {
    if (projectId) {
      const url = new URL(window.location.href);
      url.searchParams.set("project", String(projectId));
      window.history.replaceState(null, "", url.toString());
    }
    onNavigate?.(to);
  };

  const today = new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" });

  const body =
    state === "loading" ? (
      <TableSkeleton rows={3} />
    ) : state === "error" ? (
      <ErrorState code="DASH-503" />
    ) : state === "empty" ? (
      <EmptyState
        icon="CalendarX2"
        title="오늘 운영 중인 현장이 없어요"
        desc="새 프로젝트를 만들고 포지션을 등록하면 이곳에서 현장별 출근·계약 현황을 실시간으로 볼 수 있어요."
        action={
          <Button size="sm" icon="Plus" onClick={() => onNavigate?.("postings")}>
            새 프로젝트
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "site", label: "현장" },
          { key: "pos", label: <span className="whitespace-nowrap">포지션</span>, width: 110, className: "whitespace-nowrap" },
          { key: "att", label: "출근", width: narrow ? 120 : 150 },
          { key: "con", label: "계약", width: 80 },
          { key: "st", label: "상태", width: 110 },
        ]}
        rows={rows}
      />
    );

  return (
    <AdminShell active="dashboard" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "대시보드"]}
        title="대시보드"
        actions={
          <>
            <Button variant="outline" size="sm" icon="CalendarDays">
              오늘 · {today}
            </Button>
            <Button icon="Plus" onClick={() => onNavigate?.("postings")}>
              새 프로젝트
            </Button>
          </>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <div
        className={cn(
          "grid gap-4",
          narrow ? "grid-cols-[1fr_300px]" : "grid-cols-[1.6fr_1fr]",
        )}
      >
        <Card className="overflow-hidden">
          <CardHeader
            title="오늘 현장 현황"
            action={
              state === "default" && (
                <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-success-700">
                  <Dot pulse /> 실시간
                </span>
              )
            }
          />
          {body}
        </Card>
        <Card>
          <CardHeader title="처리 필요" hint={state === "default" && todo.length ? `${todo.length}건` : undefined} />
          {state === "loading" ? (
            <div className="p-[18px] space-y-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : state === "error" ? (
            <ErrorState title="불러오지 못했어요" desc="잠시 후 다시 시도해 주세요." className="py-9" />
          ) : state === "empty" || todo.length === 0 ? (
            <EmptyState
              icon="CircleCheckBig"
              title="처리할 항목이 없어요"
              desc="미출근·서명 대기·정산 마감 알림이 생기면 여기에 모아 보여드려요."
              className="py-9"
            />
          ) : (
            <ul className="p-2">
              {todo.map((t, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => open(t.to, t.projectId)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-2 cursor-pointer group text-left"
                  >
                    <span
                      className={cn(
                        "grid place-items-center w-9 h-9 rounded-lg shrink-0",
                        TONE[t.tone].chip,
                      )}
                    >
                      <Icon name={t.icon} size={17} />
                    </span>
                    <span className="flex-1 min-w-0 pt-0.5">
                      <span className={cn("block text-[13px] font-bold", TONE[t.tone].text)}>
                        {t.title}
                      </span>
                      <span className="block text-caption text-ink-3 mt-0.5 text-pretty">
                        {t.desc}
                      </span>
                    </span>
                    <Icon
                      name="ChevronRight"
                      size={16}
                      className="text-subtle mt-2.5 group-hover:text-ink-3"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
