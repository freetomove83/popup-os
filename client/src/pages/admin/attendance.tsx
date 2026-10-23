import { AuthBadge } from "@/components/auth-badge";
import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Note } from "@/components/ui/alert";
import { Badge, Dot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { cn } from "@/lib/utils";

export function AttendanceScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const state = useScreenState();

  const kpis = [
    { label: "출근", value: "42", sub: "/48 예정", tone: "success" as const, pulse: true, icon: "UserCheck", zeroSub: "/0 예정" },
    { label: "지각", value: "2", sub: "10분 초과", tone: "warning" as const, icon: "Clock" },
    { label: "미출근", value: "4", sub: "대체 매칭 필요", tone: "danger" as const, icon: "UserX", zeroSub: "—" },
    { label: "퇴근 완료", value: "0", sub: "퇴근 예정 19:00", icon: "LogOut" },
  ];

  const rows = [
    { n: "김지은", s: "더현대 5F", t: "09:52", a: <AuthBadge kind="qrphoto" />, st: <Badge tone="success">정상</Badge>, x: <span className="text-subtle">—</span> },
    { n: "Emma Müller", s: "더현대 5F", t: "09:58", a: <AuthBadge kind="qrphoto" />, st: <Badge tone="success">정상</Badge>, x: <span className="text-subtle">—</span> },
    {
      n: "박서준",
      s: "롯데 잠실",
      t: "10:14",
      a: <AuthBadge kind="qr" />,
      st: <Badge tone="warning">지각</Badge>,
      x: <span className="text-caption text-muted-foreground">QR 15분 지연</span>,
    },
    {
      n: "이하늘",
      s: "성수 팝업존",
      t: "—",
      a: <AuthBadge />,
      st: <Badge tone="danger" icon="UserX">미출근</Badge>,
      x: (
        <Button variant="soft" size="sm" icon="UserPlus">
          대체 매칭
        </Button>
      ),
      _hl: true,
    },
    {
      n: "최민준",
      s: "성수 팝업존",
      t: "09:47",
      a: <AuthBadge />,
      st: <Badge tone="warning" icon="FilePen">정정요청</Badge>,
      x: (
        <Button variant="outline" size="sm" icon="Eye">
          검토
        </Button>
      ),
    },
  ].map(r => ({
    ...r,
    n: <span className="font-bold">{r.n}</span>,
    s: <span className="text-ink-3">{r.s}</span>,
    t: <span className={cn("tabular font-semibold", r.t === "—" && "text-subtle")}>{r.t}</span>,
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton cols={6} />
    ) : state === "error" ? (
      <ErrorState
        title="근태 로그를 불러오지 못했어요"
        desc="실시간 연결이 끊겼어요. 마지막 동기화 09:58"
        code="ATT-RT-01"
        action={
          <Button variant="outline" size="sm" icon="RotateCw">
            다시 연결
          </Button>
        }
      />
    ) : state === "empty" ? (
      <EmptyState
        icon="ScanLine"
        title="아직 체크인 기록이 없어요"
        desc="스태프가 매니저 QR을 스캔하면 출근 기록이 실시간으로 쌓여요."
        action={
          <Button size="sm" icon="QrCode">
            QR 표시
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "n", label: "성명" },
          { key: "s", label: "현장", width: 120 },
          { key: "t", label: "출근", width: 72 },
          { key: "a", label: "인증", width: 120 },
          { key: "st", label: "상태", width: 110 },
          { key: "x", label: "", width: 130, align: "right" },
        ]}
        rows={rows}
      />
    );

  return (
    <AdminShell active="attend" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "출퇴근 현황"]}
        title="실시간 출퇴근 · 10/05"
        actions={
          <>
            <Button variant="outline" size="sm" icon="FilePen">
              정정요청{" "}
              <span className="ml-0.5 inline-grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-warning-50 text-warning-700 text-[11px] tabular">
                {state === "default" ? 3 : 0}
              </span>
            </Button>
            <Button size="sm" icon="QrCode">
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
            state === "default" && (
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
        권한이 필요 없어 실내에서도 오차 없이 동작해요. QR 미스캔·시간 오류는 정정요청으로 처리하고,
        대리출근은 사진 인증·매니저 확인으로 방지합니다.
      </Note>
    </AdminShell>
  );
}
