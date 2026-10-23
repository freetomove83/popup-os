import * as React from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import type { SettlementView } from "@/data/admin";
import { ProjectPicker, useAdminProject } from "@/hooks/useAdminProject";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { api, useAction, useApi, won } from "@/lib/api";
import { cn } from "@/lib/utils";

const hours = (minutes: number) => `${Math.round((minutes / 60) * 10) / 10}h`;

export function SettlementScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const ctx = useAdminProject();
  const path = ctx.current ? `/admin/projects/${ctx.current.id}/settlements` : null;
  const q = useApi<SettlementView>(path);
  const d = q.data;
  const state = useScreenState(
    { isLoading: ctx.list.isLoading || q.isLoading, isError: ctx.list.isError || q.isError },
    !!d && d.rows.length === 0,
  );
  const narrow = useIsNarrow();

  const calc = useAction(() => api<SettlementView>(`${path}/calculate`, { method: "POST" }), r =>
    r.rows.length
      ? toast.success(`${r.rows.length}명 급여를 계산했어요`)
      : toast("계산할 근무 기록이 없어요", { description: "계약 서명 + 출퇴근 기록이 있어야 계산돼요." }),
  );
  const issue = useAction(
    () => api<SettlementView>(`${path}/issue`, { method: "POST" }),
    () =>
      toast.success("정산서를 발행했어요", {
        description: "워커 앱에 지급 예정으로 표시되고, 커리어에 인증 이력이 기록됩니다.",
      }),
  );

  const k = d?.kpis;
  const kpis = [
    { label: "정산 대상", value: k?.count ?? 0, unit: "명", sub: ctx.current?.period ?? "", icon: "Users" },
    { label: "총 근로시간", value: Math.round((k?.minutes ?? 0) / 60), unit: "h", sub: "휴게 제외", icon: "Timer" },
    { label: "총 지급액", value: `₩${won(k?.gross ?? 0)}`, sub: "세전", tone: "brand" as const, icon: "Wallet", zero: "₩0" },
    { label: "원천징수", value: `₩${won(k?.tax ?? 0)}`, sub: k?.disputes ? `이의신청 ${k.disputes}건` : "3.3%", icon: "Landmark", zero: "₩0" },
  ];

  const num = (v: React.ReactNode, cls = "") => <span className={cn("tabular", cls)}>{v}</span>;
  const rows = (d?.rows ?? []).map(r => ({
    n: (
      <div className="min-w-0">
        <span className="font-bold">{r.name}</span>
        {r.dispute && <span className="block text-caption text-warning-700 truncate">이의: {r.dispute}</span>}
      </div>
    ),
    d: num(`${r.days}일`),
    h: num(hours(r.minutes)),
    b: num(won(r.base)),
    x: num(won(r.extra)),
    tx: num(r.tax ? `-${won(r.tax)}` : "0", r.tax ? "text-danger-700" : ""),
    net: num(won(r.net), "font-extrabold"),
    st: r.dispute ? (
      <Badge tone="warning" icon="MessageSquareWarning">
        이의신청
      </Badge>
    ) : r.status === "draft" ? (
      <Badge tone="neutral" icon="Search">
        발행 전
      </Badge>
    ) : r.status === "paid" ? (
      <Badge tone="success">지급 완료</Badge>
    ) : (
      <Badge tone="brand">지급 예정</Badge>
    ),
    _hl: !!r.dispute,
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton rows={4} cols={8} />
    ) : state === "error" ? (
      <ErrorState
        title="급여를 계산하지 못했어요"
        desc="근무 로그 동기화 중 오류가 발생했어요. 다시 시도해 주세요."
        code="PAY-CALC-422"
        action={
          <Button variant="outline" size="sm" icon="RotateCw" onClick={() => q.refetch()}>
            다시 불러오기
          </Button>
        }
      />
    ) : state === "empty" ? (
      <EmptyState
        icon="Receipt"
        title="아직 계산된 정산서가 없어요"
        desc="출퇴근 로그를 기준으로 급여를 계산합니다. 행사 중에도 중간 계산할 수 있어요."
        action={
          <Button size="sm" icon="Calculator" loading={calc.isPending} onClick={() => calc.mutate()}>
            급여 계산
          </Button>
        }
      />
    ) : (
      <Table
        dense={narrow}
        cols={[
          { key: "n", label: "성명" },
          { key: "d", label: "근무일", align: "right" },
          { key: "h", label: "총시간", align: "right" },
          { key: "b", label: "기본급", align: "right" },
          { key: "x", label: "가산·주휴", align: "right" },
          { key: "tx", label: "원천징수", align: "right" },
          { key: "net", label: "실지급", align: "right" },
          { key: "st", label: "상태", width: narrow ? 112 : 124 },
        ]}
        rows={rows}
      />
    );

  const hasDraft = d?.rows.some(r => r.status === "draft");

  return (
    <AdminShell active="settle" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "정산·급여"]}
        title={ctx.current ? `정산 · ${ctx.current.brand} (${ctx.current.period})` : "정산"}
        actions={
          <>
            <ProjectPicker ctx={ctx} />
            <Button
              variant="outline"
              size="sm"
              icon="Calculator"
              disabled={!path || d?.issued}
              loading={calc.isPending}
              onClick={() => calc.mutate()}
            >
              {d?.rows.length ? "다시 계산" : "급여 계산"}
            </Button>
            <Button size="sm" icon="FileOutput" disabled={!hasDraft} loading={issue.isPending} onClick={() => issue.mutate()}>
              정산서 발행
            </Button>
          </>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader
          title="급여 계산서"
          hint={`근무 로그 자동 산출 · 이의신청 ${k?.disputes ?? 0}`}
        />
        {body}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-3.5">
        <Note tone="info" icon="Scale" title="계산 규칙 (초안)">
          실근무시간 = 퇴근 − 출근 − 휴게(4시간 초과 근무일). 원천징수는 3.3% 사업소득 기준이며
          가산·주휴수당은 아직 0으로 계산합니다. 일용근로소득 선택은 정산 규칙 테이블로 이어서 만들 예정이에요.
        </Note>
        <Note tone="brand" icon="Banknote" title="지급 대행(선택)">
          토스페이먼츠/포트원 연동 시 정산서 발행 → 지급 실행 → 상태 추적까지 자동화. Phase
          1.5 후보.
        </Note>
      </div>
    </AdminShell>
  );
}
