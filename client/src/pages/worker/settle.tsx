import * as React from "react";

import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { SettleContent } from "@/components/staff/settle-content";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function WorkerSettle() {
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <WorkerFrame>
        <WorkerHeader eyebrow="POPUP OS · 내 정산" title="10월 정산 내역" />
        <div className="px-5 py-4">
          <SettleContent />
        </div>
        <div className="px-5 pb-5">
          <DrawerTrigger asChild>
            <Button size="xl" variant="outline" block icon="MessageSquareWarning">
              이의신청
            </Button>
          </DrawerTrigger>
        </div>
      </WorkerFrame>

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
