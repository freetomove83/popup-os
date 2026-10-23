import * as React from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { PhoneShell } from "@/components/layout/phone-shell";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Shift } from "@/data/worker-app";
import { useScreenState } from "@/hooks/useScreenState";
import { api, session, useAction, useApi } from "@/lib/api";
import { LoginNeeded } from "@/pages/staff/contract";
import { cn } from "@/lib/utils";

function QrPanel({ scanned = true }: { scanned?: boolean }) {
  return (
    <div className="relative h-[200px] rounded-[16px] border border-line overflow-hidden bg-surface-2 grid place-items-center">
      <div className="relative w-[132px] h-[132px]">
        <span className="absolute left-0 top-0 w-7 h-7 border-l-[3px] border-t-[3px] border-brand rounded-tl-md" />
        <span className="absolute right-0 top-0 w-7 h-7 border-r-[3px] border-t-[3px] border-brand rounded-tr-md" />
        <span className="absolute left-0 bottom-0 w-7 h-7 border-l-[3px] border-b-[3px] border-brand rounded-bl-md" />
        <span className="absolute right-0 bottom-0 w-7 h-7 border-r-[3px] border-b-[3px] border-brand rounded-br-md" />
        <div
          className={cn(
            "absolute inset-0 grid place-items-center",
            scanned ? "text-success-700" : "text-ink-3",
          )}
        >
          <Icon name={scanned ? "QrCode" : "ScanQrCode"} size={scanned ? 60 : 54} strokeWidth={1.7} />
        </div>
        {!scanned && (
          <span className="absolute left-2 right-2 top-1/2 h-[2px] bg-brand/70 animate-pulse" />
        )}
      </div>
      <span
        className={cn(
          "absolute left-3 top-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-surface shadow-soft text-[12px] font-bold",
          scanned ? "text-success-700" : "text-ink-3",
        )}
      >
        <Icon name={scanned ? "CircleCheck" : "ScanQrCode"} size={14} />
        {scanned ? "출근 인증 완료" : "QR 스캔 대기 중"}
      </span>
      <span className="absolute left-3 bottom-3 text-[11px] text-muted-foreground">
        현장에 게시된 매니저 QR을 스캔하세요
      </span>
    </div>
  );
}

function StepRow({
  icon,
  title,
  sub,
  st,
}: {
  icon: string;
  title: string;
  sub: string;
  st: "done" | "wait" | "fail";
}) {
  const done = st === "done";
  return (
    <div className="flex items-center gap-3 h-[56px]">
      <span
        className={cn(
          "grid place-items-center w-9 h-9 rounded-[11px] shrink-0",
          done
            ? "bg-success-50 text-success-700"
            : st === "fail"
              ? "bg-danger-50 text-danger-700"
              : "bg-surface-3 text-ink-3",
        )}
      >
        <Icon name={icon} size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-ink">{title}</div>
        <div className="text-[12px] text-muted-foreground">{sub}</div>
      </div>
      {done ? (
        <Badge tone="success">완료</Badge>
      ) : st === "fail" ? (
        <Badge tone="danger">미스캔</Badge>
      ) : (
        <Badge tone="neutral" icon="Circle">
          대기
        </Badge>
      )}
    </div>
  );
}

export function StaffCheckinScreen() {
  const authed = !!session.get("worker");
  const q = useApi<{ shift: Shift | null }>(authed ? "/worker/shift" : null);
  const shift = q.data?.shift;
  const state = useScreenState(q, !shift);
  const [code, setCode] = React.useState("");
  const attend = useAction(
    () => api<{ shift: Shift }>("/worker/attendance", { body: { code } }),
    r => {
      setCode("");
      toast.success(r.shift.checkOut ? `퇴근 완료 ${r.shift.checkOut}` : `출근 완료 ${r.shift.checkIn}`, {
        description: r.shift.late && !r.shift.checkOut ? "근무 시작 10분이 지나 지각으로 기록됐어요." : undefined,
      });
    },
  );

  const eb = "POPUP OS · 출퇴근";
  if (!authed) return <LoginNeeded eyebrow={eb} title="출근 체크인" />;

  if (state === "loading" || state === "error")
    return (
      <PhoneShell eyebrow={eb} title="출근 체크인">
        {state === "error" ? (
          <EmptyState icon="CloudOff" title="근무 정보를 불러오지 못했어요" desc="잠시 후 다시 시도해 주세요." className="pt-24" />
        ) : (
          <div className="space-y-4">
            <div className="relative h-[200px] rounded-[16px] bg-surface-3 animate-pulse grid place-items-center">
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink-3">
                <Icon name="LoaderCircle" size={16} className="animate-spin" />
                QR 스캔 준비 중…
              </span>
            </div>
            <Skeleton className="h-[130px] rounded-[14px]" />
          </div>
        )}
      </PhoneShell>
    );

  if (state === "empty" || !shift)
    return (
      <PhoneShell eyebrow={eb} title="오늘 근무 일정 없음">
        <EmptyState
          icon="CalendarX2"
          title="오늘 예정된 근무가 없어요"
          desc="계약이 확정된 근무일에만 체크인할 수 있어요. (No shift scheduled today.)"
          className="pt-24"
        />
      </PhoneShell>
    );

  const done = !!shift.checkOut;
  const foot = (
    <div className="flex justify-between text-[12.5px] text-muted-foreground font-medium tabular">
      <span>
        근무 {shift.startTime}~{shift.endTime}
      </span>
      <span>
        근무 {shift.days}일 중 {shift.day}일차
      </span>
    </div>
  );

  return (
    <PhoneShell eyebrow={eb} title={`${shift.venue} · ${shift.day}일차`} footer={foot}>
      <div className="space-y-3.5">
        <QrPanel scanned={!!shift.checkIn} />
        <div className="rounded-[14px] border border-line px-3.5 divide-y divide-surface-3">
          <StepRow
            icon="LogIn"
            title={`출근 ${shift.checkIn ?? ""}`}
            sub={shift.late ? "매니저 QR · 지각 기록" : "매니저 QR 스캔 · 필수"}
            st={shift.checkIn ? "done" : "wait"}
          />
          <StepRow
            icon="LogOut"
            title={`퇴근 ${shift.checkOut ?? ""}`}
            sub="같은 QR을 다시 스캔"
            st={shift.checkOut ? "done" : "wait"}
          />
        </div>
        {done ? (
          <Note tone="success" icon="CircleCheck" title="오늘 근무를 마쳤어요">
            정산은 행사 종료 후 출퇴근 기록으로 자동 계산돼요.
          </Note>
        ) : (
          <>
            <Note tone="info">
              현장에 게시된 <b className="text-info-700">매니저 QR 아래 6자리 코드</b>를 입력하세요.
              GPS·위치 권한은 필요 없어요.
            </Note>
            <div className="flex gap-2">
              <Input
                icon="ScanQrCode"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="QR 코드 6자리"
                className="flex-1 h-12 tabular"
              />
              <Button
                variant="success"
                size="xl"
                icon={shift.checkIn ? "LogOut" : "LogIn"}
                disabled={code.length !== 6}
                loading={attend.isPending}
                onClick={() => attend.mutate()}
              >
                {shift.checkIn ? "퇴근" : "출근"}
              </Button>
            </div>
          </>
        )}
      </div>
    </PhoneShell>
  );
}
