import * as React from "react";

import { AuthBadge } from "@/components/auth-badge";
import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Note } from "@/components/ui/alert";
import { Badge, Dot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import type { AttendanceView, DayStatus } from "@/data/admin";
import { ProjectPicker, useAdminProject } from "@/hooks/useAdminProject";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { api, useAction, useApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<DayStatus, React.ReactNode> = {
  정상: <Badge tone="success">정상</Badge>,
  지각: <Badge tone="warning">지각</Badge>,
  퇴근: <Badge tone="info" icon="LogOut">퇴근</Badge>,
  미출근: (
    <Badge tone="danger" icon="UserX">
      미출근
    </Badge>
  ),
  "출근 전": <Badge tone="neutral">출근 전</Badge>,
};

const isoToday = () => new Date().toLocaleDateString("sv-SE");

/**
 * 현장 매니저가 띄우는 출근 QR.
 * shortcut: QR 이미지 대신 6자리 코드를 크게 보여준다(워커가 코드 입력). 카메라 스캐너 붙일 때 QR 렌더 추가.
 */
function QrDrawer({ projectId, code, open, onOpenChange }: { projectId: string; code: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const rotate = useAction(
    () => api(`/admin/projects/${projectId}/attendance-code`, { method: "POST" }),
    "새 코드로 바꿨어요 · 이전 코드는 더 이상 쓸 수 없어요",
  );
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="left-1/2 right-auto -translate-x-1/2 w-full max-w-[420px] text-center">
        <div className="text-[17px] font-extrabold text-ink">현장 출근 QR</div>
        <p className="text-[12.5px] text-muted-foreground mt-1">
          스태프는 앱의 <b className="text-ink-2">출근 체크인</b>에서 이 코드를 입력합니다.
        </p>
        <div className="mt-5 mx-auto w-fit rounded-[18px] border-2 border-brand bg-brand-50/40 px-7 py-5">
          <div className="text-[44px] font-extrabold tracking-[0.18em] text-brand-700 tabular">{code}</div>
        </div>
        <Button
          variant="outline"
          size="lg"
          icon="RefreshCw"
          className="mt-5"
          loading={rotate.isPending}
          onClick={() => rotate.mutate()}
        >
          코드 새로 만들기
        </Button>
      </DrawerContent>
    </Drawer>
  );
}

export function AttendanceScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const ctx = useAdminProject();
  const [date, setDate] = React.useState(isoToday);
  const q = useApi<AttendanceView>(ctx.current ? `/admin/projects/${ctx.current.id}/attendance?date=${date}` : null);
  const d = q.data;
  const state = useScreenState(
    { isLoading: ctx.list.isLoading || q.isLoading, isError: ctx.list.isError || q.isError },
    !!d && d.rows.length === 0,
  );
  const [qrOpen, setQrOpen] = React.useState(false);
  const isToday = date === isoToday();

  const manual = useAction(
    (v: { id: number; action: "in" | "out" }) =>
      api(`/admin/applications/${v.id}/attendance`, { body: { action: v.action } }),
    "매니저 확인으로 처리했어요",
  );

  const k = d?.kpis;
  const kpis = [
    { label: "출근", value: k?.in ?? 0, sub: `/${k?.expected ?? 0} 예정`, tone: "success" as const, pulse: isToday, icon: "UserCheck", zeroSub: "/0 예정" },
    { label: "지각", value: k?.late ?? 0, sub: "10분 초과", tone: "warning" as const, icon: "Clock" },
    { label: "미출근", value: k?.absent ?? 0, sub: "매니저 확인 필요", tone: "danger" as const, icon: "UserX", zeroSub: "—" },
    { label: "퇴근 완료", value: k?.out ?? 0, sub: k?.endTime ? `퇴근 예정 ${k.endTime}` : "—", icon: "LogOut" },
  ];

  const busy = (id: number) => manual.isPending && manual.variables?.id === id;
  const rows = (d?.rows ?? []).map(r => ({
    n: <span className="font-bold">{r.name}</span>,
    s: <span className="text-ink-3">{r.position}</span>,
    t: <span className={cn("tabular font-semibold", !r.checkIn && "text-subtle")}>{r.checkIn ?? "—"}</span>,
    o: <span className={cn("tabular", !r.checkOut && "text-subtle")}>{r.checkOut ?? "—"}</span>,
    a: <AuthBadge kind={r.method === "manager" ? "manual" : (r.method ?? undefined)} />,
    st: STATUS_BADGE[r.status],
    x: !isToday ? null : !r.checkIn ? (
      <Button variant="soft" size="sm" icon="UserCheck" loading={busy(r.applicationId)} onClick={() => manual.mutate({ id: r.applicationId, action: "in" })}>
        출근 확인
      </Button>
    ) : !r.checkOut ? (
      <Button variant="outline" size="sm" icon="LogOut" loading={busy(r.applicationId)} onClick={() => manual.mutate({ id: r.applicationId, action: "out" })}>
        퇴근 처리
      </Button>
    ) : null,
    _hl: r.status === "미출근",
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton cols={7} />
    ) : state === "error" ? (
      <ErrorState
        title="근태 로그를 불러오지 못했어요"
        code="ATT-RT-01"
        action={
          <Button variant="outline" size="sm" icon="RotateCw" onClick={() => q.refetch()}>
            다시 불러오기
          </Button>
        }
      />
    ) : state === "empty" ? (
      <EmptyState
        icon="ScanLine"
        title="계약을 마친 근무자가 없어요"
        desc="계약 서명이 끝난 스태프가 매니저 QR을 스캔하면 출근 기록이 쌓여요."
        action={
          <Button size="sm" icon="FileSignature" onClick={() => onNavigate?.("contract")}>
            전자계약으로
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "n", label: "성명" },
          { key: "s", label: "포지션", width: 150 },
          { key: "t", label: "출근", width: 70 },
          { key: "o", label: "퇴근", width: 70 },
          { key: "a", label: "인증", width: 120 },
          { key: "st", label: "상태", width: 100 },
          { key: "x", label: "", width: 120, align: "right" },
        ]}
        rows={rows}
      />
    );

  return (
    <AdminShell active="attend" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "출퇴근 현황"]}
        title={`${isToday ? "실시간 " : ""}출퇴근 · ${date.slice(5).replace("-", "/")}`}
        meta={d && !d.active && <span className="text-caption text-muted-foreground">이 날짜는 행사 기간이 아니에요</span>}
        actions={
          <>
            <ProjectPicker ctx={ctx} />
            <Input type="date" value={date} onChange={e => e.target.value && setDate(e.target.value)} className="w-[150px]" />
            <Button size="sm" icon="QrCode" disabled={!d} onClick={() => setQrOpen(true)}>
              QR 표시
            </Button>
          </>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader
          title="근태 로그"
          hint="인증방식: 현장 매니저 QR 스캔 (+ 사진)"
          action={
            state === "default" &&
            isToday && (
              <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-success-700">
                <Dot pulse /> 실시간
              </span>
            )
          }
        />
        {body}
      </Card>
      <Note tone="info" icon="QrCode" title="현장 QR 인증 방식" className="mt-3.5">
        출근 인증은 <b className="text-info-700">현장 매니저 QR 스캔</b>으로만 진행합니다. GPS·위치
        권한이 필요 없어 실내에서도 오차 없이 동작해요. QR 미스캔은 매니저 확인으로 처리하고, 같은
        코드를 다시 스캔하면 퇴근으로 기록됩니다.
      </Note>
      {ctx.current && d && <QrDrawer projectId={ctx.current.id} code={d.code} open={qrOpen} onOpenChange={setQrOpen} />}
    </AdminShell>
  );
}
