import * as React from "react";

import { EmptyState, ErrorState } from "@/components/feedback";
import { PhoneShell } from "@/components/layout/phone-shell";
import { SettleContent } from "@/components/staff/settle-content";
import { StaffSkeleton } from "@/components/staff/parts";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useScreenState } from "@/hooks/useScreenState";

export function StaffSettleScreen() {
  const state = useScreenState();
  const [open, setOpen] = React.useState(false);
  const eb = "POPUP OS · 내 정산";
  const tt = "10월 정산 내역";

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
            <Button size="lg" variant="outline" icon="RotateCw">
              다시 시도
            </Button>
          }
          className="pt-24"
        />
      </PhoneShell>
    );

  if (state === "empty")
    return (
      <PhoneShell eyebrow={eb} title={tt}>
        <EmptyState
          icon="Receipt"
          title="아직 정산 내역이 없어요"
          desc="근무가 끝나면 급여 계산 결과를 여기에서 확인할 수 있어요. (No payslips yet.)"
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
            <Button size="xl" variant="outline" block icon="MessageSquareWarning">
              이의신청
            </Button>
          </DrawerTrigger>
        }
      >
        <SettleContent />
      </PhoneShell>

      <DrawerContent>
        <div className="text-[17px] font-extrabold text-ink mb-1">이의신청</div>
        <p className="text-body-sm text-muted-foreground mb-4">
          근무 로그(출퇴근 기록)와 함께 관리자에게 전달됩니다. 내용을 적어주세요.
        </p>
        <Input placeholder="예: 10/06 퇴근 기록이 19:00보다 늦게 반영됐어요" />
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="xl" className="flex-1" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button size="xl" className="flex-1" onClick={() => setOpen(false)}>
            이의신청 제출
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
