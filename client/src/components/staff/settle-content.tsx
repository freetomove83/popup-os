import * as React from "react";
import { toast } from "sonner";

import { DocBox, SectionLabel } from "@/components/staff/parts";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Payslip } from "@/data/worker-app";
import { api, useAction, won } from "@/lib/api";
import { cn } from "@/lib/utils";

export function PayLine({
  k,
  v,
  neg,
  total,
}: {
  k: React.ReactNode;
  v: React.ReactNode;
  neg?: boolean;
  total?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-baseline py-3",
        !total && "border-b border-dashed border-line",
      )}
    >
      <span
        className={cn(
          total
            ? "text-[15px] font-bold text-ink"
            : "text-[14px] text-muted-foreground font-medium",
        )}
      >
        {k}
      </span>
      <span
        className={cn(
          "tabular",
          total
            ? "text-[22px] font-extrabold text-brand-600 tracking-[-0.02em]"
            : "text-[15px] font-bold",
          neg ? "text-danger-700" : !total && "text-ink",
        )}
      >
        {v}
      </span>
    </div>
  );
}

/** 정산 내역 본문 — 스태프 앱(PhoneShell)과 워커 탭에서 공용. */
export function SettleContent({ slip }: { slip: Payslip }) {
  const h = Math.round((slip.minutes / 60) * 10) / 10;
  return (
    <div className="space-y-4">
      <DocBox
        rows={[
          ["근무 프로젝트", `${slip.project} (${slip.days}일)`],
          ["총 근로시간", <span className="tabular">{h}시간 (휴게 제외)</span>],
          [
            "지급 상태",
            slip.status === "paid" ? (
              <Badge tone="success">지급 완료</Badge>
            ) : (
              <Badge tone="brand">지급 예정 ({slip.payDate})</Badge>
            ),
          ],
        ]}
      />
      <div>
        <SectionLabel>급여 계산</SectionLabel>
        <PayLine k={`기본급 (${h}h × ${won(slip.pay)})`} v={won(slip.base)} />
        <PayLine k="연장·야간 가산 · 주휴수당" v={won(slip.extra)} />
        <PayLine k="원천징수 (3.3%)" v={slip.tax ? `-${won(slip.tax)}` : "0"} neg={slip.tax > 0} />
        <div className="mt-1 rounded-[14px] bg-brand-50 px-4">
          <PayLine k="실지급액" v={`${won(slip.net)}원`} total />
        </div>
      </div>
      {slip.dispute ? (
        <Note tone="info" icon="MessageSquareWarning" title="이의신청 접수됨">
          {slip.dispute}
        </Note>
      ) : (
        <Note tone="warning">
          계산 결과가 다르면 <b className="text-warning-700">이의신청</b>을 눌러 근무 로그와
          함께 관리자 검토를 요청할 수 있습니다.
        </Note>
      )}
    </div>
  );
}

/** 이의신청 입력 Drawer 본문 */
export function DisputeForm({ slipId, onDone }: { slipId: number; onDone: () => void }) {
  const [note, setNote] = React.useState("");
  const submit = useAction(
    () => api(`/worker/settlements/${slipId}/dispute`, { body: { note } }),
    () => {
      toast.success("이의신청을 접수했어요", { description: "관리자가 근무 로그와 함께 검토합니다." });
      setNote("");
      onDone();
    },
  );
  return (
    <>
      <div className="text-[17px] font-extrabold text-ink mb-1">이의신청</div>
      <p className="text-body-sm text-muted-foreground mb-4">
        근무 로그(출퇴근 기록)와 함께 관리자에게 전달됩니다. 내용을 적어주세요.
      </p>
      <Input
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="예: 10/06 퇴근 기록이 19:00보다 늦게 반영됐어요"
      />
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="xl" className="flex-1" onClick={onDone}>
          취소
        </Button>
        <Button size="xl" className="flex-1" disabled={note.trim().length < 5} loading={submit.isPending} onClick={() => submit.mutate()}>
          이의신청 제출
        </Button>
      </div>
    </>
  );
}
