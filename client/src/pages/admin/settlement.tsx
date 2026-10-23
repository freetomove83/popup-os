import * as React from "react";

import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { cn } from "@/lib/utils";

export function SettlementScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const state = useScreenState();
  const narrow = useIsNarrow();

  const kpis = [
    { label: "정산 대상", value: "19", unit: "명", sub: "무드랩 3일", icon: "Users" },
    { label: "총 근로시간", value: "513", unit: "h", sub: "휴게 제외", icon: "Timer" },
    { label: "총 지급액", value: "₩6.24M", sub: "세전", tone: "brand" as const, icon: "Wallet", zero: "₩0" },
    { label: "원천징수", value: "₩206K", sub: "3.3% / 일용 구분", icon: "Landmark", zero: "₩0" },
  ];

  const num = (v: React.ReactNode, cls = "") => (
    <span className={cn("tabular", cls)}>{v}</span>
  );

  const raw: [string, string, string, string, string, string, string, React.ReactNode][] = [
    ["김지은", "3일", "27h", "324,000", "31,200", "-11,722", "343,478", <Badge tone="brand">지급 예정</Badge>],
    ["Emma Müller", "3일", "27h", "324,000", "31,200", "-11,722", "343,478", <Badge tone="brand">지급 예정</Badge>],
    ["박서준", "2일", "16h", "208,000", "8,000", "-7,128", "208,872", <Badge tone="warning" icon="Search">검토 중</Badge>],
    ["이하늘", "2일", "18h", "216,000", "0", "-7,128", "208,872", <Badge tone="neutral" icon="UserX">미출근 정산</Badge>],
  ];
  const rows = raw.map(([n, d, h, b, x, tx, net, st]) => ({
    n: <span className="font-bold">{n}</span>,
    d: num(d),
    h: num(h),
    b: num(b),
    x: num(x),
    tx: num(tx, "text-danger-700"),
    net: num(net, "font-extrabold"),
    st,
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton rows={4} cols={8} />
    ) : state === "error" ? (
      <ErrorState
        title="급여를 계산하지 못했어요"
        desc="근무 로그 동기화 중 오류가 발생했어요. 정산 규칙을 확인하거나 다시 시도해 주세요."
        code="PAY-CALC-422"
        action={
          <>
            <Button variant="outline" size="sm" icon="Settings2">
              정산 규칙
            </Button>
            <Button variant="outline" size="sm" icon="RotateCw">
              다시 계산
            </Button>
          </>
        }
      />
    ) : state === "empty" ? (
      <EmptyState
        icon="Receipt"
        title="정산할 근무 기록이 없어요"
        desc="프로젝트 기간이 끝나면 출퇴근 로그를 기반으로 급여가 자동 계산돼요."
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

  return (
    <AdminShell active="settle" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "정산·급여"]}
        title="정산 마감 · 무드랩 (10/05~10/07)"
        actions={
          <>
            <Button variant="outline" size="sm" icon="Settings2">
              정산 규칙
            </Button>
            <Button size="sm" icon="FileOutput" disabled={state !== "default"}>
              정산서 발행
            </Button>
          </>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="급여 계산서" hint="근무 로그 자동 산출 · 이의신청 0" />
        {body}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-3.5">
        <Note tone="info" icon="Scale" title="일용/단기 구분">
          1개월 미만 단기 근로는 일용근로소득(소득세 6%·지방소득세 0.6%) 또는 3.3%
          사업소득 중 계약 형태에 따라 선택. 정산 규칙 테이블로 관리합니다.
        </Note>
        <Note tone="brand" icon="Banknote" title="지급 대행(선택)">
          토스페이먼츠/포트원 연동 시 정산서 발행 → 지급 실행 → 상태 추적까지 자동화. Phase
          1.5 후보.
        </Note>
      </div>
    </AdminShell>
  );
}
