import * as React from "react";

import { EmptyState } from "@/components/feedback";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { DisputeForm, SettleContent } from "@/components/staff/settle-content";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useRequireWorker } from "@/hooks/useRequireWorker";
import { usePayslips } from "@/pages/staff/settle";

export default function WorkerSettle() {
  const authed = useRequireWorker();
  const { q, slip, picker } = usePayslips(authed);
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <WorkerFrame>
        <WorkerHeader eyebrow="POPUP OS · 내 정산" title="정산 내역" />
        <div className="px-5 py-4">
          {q.isLoading || !authed ? (
            <div className="h-[320px] rounded-card bg-surface-3 animate-pulse" />
          ) : q.isError ? (
            <EmptyState icon="CloudOff" title="정산 내역을 불러오지 못했어요" desc="잠시 후 다시 시도해 주세요." />
          ) : !slip ? (
            <EmptyState
              icon="Receipt"
              title="아직 정산 내역이 없어요"
              desc="근무가 끝나고 정산서가 발행되면 여기에서 확인할 수 있어요."
            />
          ) : (
            <>
              {picker}
              <SettleContent slip={slip} />
            </>
          )}
        </div>
        {slip && (
          <div className="px-5 pb-5">
            <DrawerTrigger asChild>
              <Button size="xl" variant="outline" block icon="MessageSquareWarning" disabled={!!slip.dispute}>
                {slip.dispute ? "이의신청 접수됨" : "이의신청"}
              </Button>
            </DrawerTrigger>
          </div>
        )}
      </WorkerFrame>

      {slip && (
        <DrawerContent>
          <DisputeForm slipId={slip.id} onDone={() => setOpen(false)} />
        </DrawerContent>
      )}
    </Drawer>
  );
}
