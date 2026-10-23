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
  const state = useScreenState();
  const narrow = useIsNarrow();

  const kpis = [
    { label: "진행 중 프로젝트", value: "3", sub: "이번 주 종료 1", tone: "brand" as Tone, icon: "FolderKanban" },
    { label: "오늘 출근", value: "42", unit: "/48", sub: "지각 2 · 미출근 4", tone: "success" as Tone, pulse: true, icon: "UserCheck", zeroSub: "오늘 예정 인원 없음" },
    { label: "서명 대기 계약", value: "7", sub: "재발송 필요 2", icon: "FileSignature", zeroSub: "대기 중인 계약 없음" },
    { label: "이번 주 정산 예정", value: "₩6.24M", sub: "대상 48명", icon: "Wallet", zero: "₩0", zeroSub: "대상 0명" },
  ];

  const rows = [
    { site: <Cell title="무드랩 MOMENT POPUP" sub="더현대 서울 5F" />, pos: "운영 12", att: <AttendCell n={11} of={12} />, con: <span className="tabular font-semibold">12/12</span>, st: <Badge tone="success">정상</Badge> },
    { site: <Cell title="뉴욕의 거장들" sub="롯데백화점 잠실" />, pos: "서버 8", att: <AttendCell n={7} of={8} />, con: <span className="tabular font-semibold">8/8</span>, st: <Badge tone="warning">지각 1</Badge> },
    {
      site: <Cell title="퍼스트 라운딩" sub="성수 팝업존" />,
      pos: "상하차 6",
      att: <AttendCell n={4} of={6} warn />,
      con: (
        <span className="tabular font-semibold text-warning-700 inline-flex items-center gap-1">
          <Icon name="Clock" size={13} />5/6
        </span>
      ),
      st: <Badge tone="danger" icon="UserX">미출근 2</Badge>,
      _hl: true,
    },
  ];

  const todo: { tone: Tone; icon: string; title: string; desc: string }[] = [
    { tone: "warning", icon: "UserX", title: "미출근 2명", desc: "퍼스트 라운딩 상하차. 대체 인력 매칭 필요" },
    { tone: "info", icon: "FileSignature", title: "서명 미완료 7건", desc: "알림톡 재발송 가능" },
    { tone: "brand", icon: "Wallet", title: "정산 마감 임박", desc: "무드랩 10/07 종료, 정산서 발행 대기" },
  ];

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
          <Button size="sm" icon="Plus" onClick={() => onNavigate?.("project")}>
            새 프로젝트
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "site", label: "현장" },
          { key: "pos", label: "포지션", width: 90 },
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
              오늘 · 10/05 (일)
            </Button>
            <Button icon="Plus">새 프로젝트</Button>
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
          <CardHeader title="처리 필요" hint={state === "default" ? "3건" : undefined} />
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
          ) : state === "empty" ? (
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
