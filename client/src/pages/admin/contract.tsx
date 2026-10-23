import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow, zeroKpis } from "@/components/kpi-row";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { TableSkeleton } from "@/components/table-skeleton";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";

export function ContractScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const state = useScreenState();

  const kpis = [
    { label: "발송", value: "48", sub: "표준근로계약서", icon: "Send" },
    { label: "서명 완료", value: "41", sub: "85.4%", tone: "success" as const, icon: "FileCheck2", zeroSub: "0%" },
    { label: "서명 대기", value: "7", sub: "재발송 대상 2", icon: "Clock", zeroSub: "대기 없음" },
    { label: "만료 예정", value: "1", sub: "24시간 내 미서명", tone: "danger" as const, icon: "AlarmClock", zeroSub: "만료 예정 없음" },
  ];

  const view = (
    <Button variant="outline" size="sm" icon="FileText">
      계약서 보기
    </Button>
  );
  const resend = (
    <Button variant="soft" size="sm" icon="RotateCw">
      재발송
    </Button>
  );

  const rows = [
    { n: "김지은", p: "운영", s: "10/03 09:12", g: "10/03 09:14", st: <Badge tone="success">계약 확정</Badge>, a: view },
    { n: "Emma Müller", p: "운영", s: "10/03 09:12", g: "10/03 10:02", st: <Badge tone="success">계약 확정</Badge>, a: view },
    { n: "박서준", p: "서버", s: "10/03 09:12", g: "—", st: <Badge tone="warning">서명 대기</Badge>, a: resend },
    { n: "이하늘", p: "운영", s: "10/03 09:12", g: "—", st: <Badge tone="warning">서명 대기</Badge>, a: resend },
    { n: "최민준", p: "상하차", s: "10/03 09:12", g: "—", st: <Badge tone="danger" icon="AlarmClock">만료 임박</Badge>, a: resend, _hl: true },
  ].map(r => ({
    ...r,
    n: <span className="font-bold">{r.n}</span>,
    s: <span className="tabular text-ink-3">{r.s}</span>,
    g: <span className={r.g === "—" ? "tabular text-subtle" : "tabular text-ink-3"}>{r.g}</span>,
  }));

  const body =
    state === "loading" ? (
      <TableSkeleton cols={6} />
    ) : state === "error" ? (
      <ErrorState title="발송 내역을 불러오지 못했어요" code="CTR-504" />
    ) : state === "empty" ? (
      <EmptyState
        icon="FileSignature"
        title="발송한 계약서가 없어요"
        desc="지원자를 승인하면 표준근로계약서를 알림톡으로 일괄 발송할 수 있어요."
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
          { key: "p", label: "포지션", width: 90 },
          { key: "s", label: "발송", width: 120 },
          { key: "g", label: "서명", width: 120 },
          { key: "st", label: "상태", width: 120 },
          { key: "a", label: "", width: 120, align: "right" },
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
          <Button icon="SendHorizontal" disabled={state === "empty" || state === "loading"}>
            승인자 전원 일괄 발송
          </Button>
        }
      />
      <KpiRow items={state === "empty" ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="발송 대상" hint="알림톡(알리고) · 실패 시 이메일 폴백" />
        {body}
      </Card>
      <Note tone="brand" icon="LockKeyhole" title="무결성 저장" className="mt-3.5">
        서명 완료 시 계약 PDF + 서명 해시 + 타임스탬프 + 본인확인 결과를 함께 보관합니다.
        계약서에는 근로기준법 제17조 필수 기재사항(장소·업무·소정근로시간·임금·휴일)이
        포함됩니다.
      </Note>
    </AdminShell>
  );
}
