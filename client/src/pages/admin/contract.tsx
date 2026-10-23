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
import type { ContractState, ContractsView } from "@/data/admin";
import { ProjectPicker, useAdminProject } from "@/hooks/useAdminProject";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { api, useAction, useApi } from "@/lib/api";

const STATE_BADGE: Record<ContractState, React.ReactNode> = {
  signed: <Badge tone="success">계약 확정</Badge>,
  pending: <Badge tone="warning">서명 대기</Badge>,
  expiring: (
    <Badge tone="danger" icon="AlarmClock">
      만료 임박
    </Badge>
  ),
  expired: <Badge tone="neutral">기한 만료</Badge>,
  unsent: <Badge tone="info">발송 전</Badge>,
};

export function ContractScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const ctx = useAdminProject();
  const q = useApi<ContractsView>(ctx.current ? `/admin/projects/${ctx.current.id}/contracts` : null);
  const d = q.data;
  const state = useScreenState(
    { isLoading: ctx.list.isLoading || q.isLoading, isError: ctx.list.isError || q.isError },
    !!d && d.rows.length === 0,
  );

  const send = useAction(
    () => api<{ sent: number }>(`/admin/projects/${ctx.current!.id}/contracts/send`, { method: "POST" }),
    r => toast.success(`${r.sent}명에게 계약서를 발송했어요`),
  );
  const resend = useAction(
    (id: number) => api(`/admin/contracts/${id}/resend`, { method: "POST" }),
    "재발송했어요 · 서명 기한 24시간 연장",
  );

  const k = d?.kpis;
  const rate = k && k.sent ? `${Math.round((k.signed / k.sent) * 1000) / 10}%` : "0%";
  const kpis = [
    { label: "발송", value: k?.sent ?? 0, sub: k?.unsent ? `발송 전 ${k.unsent}명` : "표준근로계약서", icon: "Send" },
    { label: "서명 완료", value: k?.signed ?? 0, sub: rate, tone: "success" as const, icon: "FileCheck2", zeroSub: "0%" },
    { label: "서명 대기", value: k?.pending ?? 0, sub: k?.expired ? `기한 만료 ${k.expired}` : "재발송 가능", icon: "Clock", zeroSub: "대기 없음" },
    { label: "만료 예정", value: k?.expiring ?? 0, sub: "3시간 내 미서명", tone: "danger" as const, icon: "AlarmClock", zeroSub: "만료 예정 없음" },
  ];

  const rows = (d?.rows ?? []).map(r => ({
    n: <span className="font-bold">{r.name}</span>,
    p: r.position,
    s: <span className={r.sentAt ? "tabular text-ink-3" : "tabular text-subtle"}>{r.sentAt ?? "—"}</span>,
    g: <span className={r.signedAt ? "tabular text-ink-3" : "tabular text-subtle"}>{r.signedAt ?? "—"}</span>,
    st: STATE_BADGE[r.state],
    a:
      r.contractId && r.state !== "signed" ? (
        <Button
          variant="soft"
          size="sm"
          icon="RotateCw"
          loading={resend.isPending && resend.variables === r.contractId}
          onClick={() => resend.mutate(r.contractId!)}
        >
          재발송
        </Button>
      ) : null,
    _hl: r.state === "expiring",
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton cols={6} />
    ) : state === "error" ? (
      <ErrorState title="발송 내역을 불러오지 못했어요" code="CTR-504" />
    ) : state === "empty" ? (
      <EmptyState
        icon="FileSignature"
        title="승인된 지원자가 없어요"
        desc="지원자를 승인하면 표준근로계약서를 일괄 발송할 수 있어요."
        action={
          <Button
            size="sm"
            variant="outline"
            icon="UserSearch"
            onClick={() => onNavigate?.("screen")}
          >
            지원자 스크리닝으로
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "n", label: "성명" },
          { key: "p", label: "포지션", width: 160 },
          { key: "s", label: "발송", width: 110, className: "whitespace-nowrap" },
          { key: "g", label: "서명", width: 110, className: "whitespace-nowrap" },
          { key: "st", label: "상태", width: 120 },
          { key: "a", label: "", width: 110, align: "right" },
        ]}
        rows={rows}
      />
    );

  return (
    <AdminShell active="contract" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "전자계약"]}
        title="계약 발송·서명 현황"
        actions={
          <>
            <ProjectPicker ctx={ctx} />
            <Button
              icon="SendHorizontal"
              disabled={state !== "default" || !k?.unsent}
              loading={send.isPending}
              onClick={() => send.mutate()}
            >
              승인자 일괄 발송{k?.unsent ? ` (${k.unsent})` : ""}
            </Button>
          </>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="발송 대상" hint="승인된 지원자 · 워커 앱 '지원 현황'에서 서명" />
        {body}
      </Card>
      <Note tone="brand" icon="LockKeyhole" title="무결성 저장" className="mt-3.5">
        서명 시 계약 요약 + 서명 + 타임스탬프를 SHA-256 해시로 함께 보관합니다. 계약서에는
        근로기준법 제17조 필수 기재사항(장소·업무·소정근로시간·임금·지급일)이 포함됩니다.
        알림톡(알리고) 발송은 아직 연동 전입니다.
      </Note>
    </AdminShell>
  );
}
