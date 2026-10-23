import * as React from "react";

import { EmptyState, ErrorState } from "@/components/feedback";
import { PhoneShell } from "@/components/layout/phone-shell";
import { DisputeForm, SettleContent } from "@/components/staff/settle-content";
import { StaffSkeleton } from "@/components/staff/parts";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Select } from "@/components/ui/select";
import type { Payslip } from "@/data/worker-app";
import { useScreenState } from "@/hooks/useScreenState";
import { session, useApi } from "@/lib/api";
import { LoginNeeded } from "@/pages/staff/contract";

/** 내 정산서 목록 + 선택 — 스태프 화면과 워커 탭이 함께 쓴다. */
export function usePayslips(enabled = true) {
  const q = useApi<Payslip[]>(enabled ? "/worker/settlements" : null);
  const [id, setId] = React.useState<number | null>(null);
  const slips = q.data ?? [];
  const slip = slips.find(s => s.id === id) ?? slips[0];
  const picker =
    slips.length > 1 ? (
      <Select
        ariaLabel="정산 프로젝트"
        icon="Receipt"
        value={String(slip?.id)}
        onChange={v => setId(Number(v))}
        options={slips.map(s => ({ value: String(s.id), label: s.project }))}
        className="mb-4"
      />
    ) : null;
  return { q, slip, picker };
}

export function StaffSettleScreen() {
  const authed = !!session.get("worker");
  const { q, slip, picker } = usePayslips(authed);
  const state = useScreenState(q, !slip);
  const [open, setOpen] = React.useState(false);
  const eb = "POPUP OS · 내 정산";
  const tt = "정산 내역";

  if (!authed) return <LoginNeeded eyebrow={eb} title={tt} />;

  if (state === "loading")
    return (
      <PhoneShell
        eyebrow={eb}
        title={tt}
        footer={
          <Button size="xl" variant="outline" block disabled>
            이의신청
          </Button>
        }
      >
        <StaffSkeleton />
      </PhoneShell>
    );

  if (state === "error")
    return (
      <PhoneShell eyebrow={eb} title={tt}>
        <ErrorState
          title="정산 내역을 불러오지 못했어요"
          desc="잠시 후 다시 시도해 주세요. (Couldn’t load your payslip.)"
          code="PAY-W-503"
          action={
            <Button size="lg" variant="outline" icon="RotateCw" onClick={() => q.refetch()}>
              다시 시도
            </Button>
          }
          className="pt-24"
        />
      </PhoneShell>
    );

  if (state === "empty" || !slip)
    return (
      <PhoneShell eyebrow={eb} title={tt}>
        <EmptyState
          icon="Receipt"
          title="아직 정산 내역이 없어요"
          desc="근무가 끝나고 정산서가 발행되면 여기에서 확인할 수 있어요. (No payslips yet.)"
          className="pt-24"
        />
      </PhoneShell>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <PhoneShell
        eyebrow={eb}
        title={tt}
        footer={
          <DrawerTrigger asChild>
            <Button size="xl" variant="outline" block icon="MessageSquareWarning" disabled={!!slip.dispute}>
              {slip.dispute ? "이의신청 접수됨" : "이의신청"}
            </Button>
          </DrawerTrigger>
        }
      >
        {picker}
        <SettleContent slip={slip} />
      </PhoneShell>

      <DrawerContent>
        <DisputeForm slipId={slip.id} onDone={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
