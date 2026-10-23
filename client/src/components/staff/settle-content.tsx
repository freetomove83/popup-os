import * as React from "react";

import { DocBox, SectionLabel } from "@/components/staff/parts";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
export function SettleContent() {
  return (
    <div className="space-y-4">
      <DocBox
        rows={[
          ["근무 프로젝트", "무드랩 팝업 (3일)"],
          ["총 근로시간", <span className="tabular">27시간 (휴게 제외)</span>],
          ["지급 상태", <Badge tone="brand">지급 예정 (10/14)</Badge>],
        ]}
      />
      <div>
        <SectionLabel>급여 계산</SectionLabel>
        <PayLine k="기본급 (27h × 12,000)" v="324,000" />
        <PayLine k="연장·야간 가산" v="12,000" />
        <PayLine k="주휴수당" v="19,200" />
        <PayLine k="원천징수 (3.3%)" v="-11,722" neg />
        <div className="mt-1 rounded-[14px] bg-brand-50 px-4">
          <PayLine k="실지급액" v="343,478원" total />
        </div>
      </div>
      <Note tone="warning">
        계산 결과가 다르면 <b className="text-warning-700">이의신청</b>을 눌러 근무 로그와
        함께 관리자 검토를 요청할 수 있습니다.
      </Note>
    </div>
  );
}
