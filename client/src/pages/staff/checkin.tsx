import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { PhoneShell } from "@/components/layout/phone-shell";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScreenState } from "@/hooks/useScreenState";
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
        {scanned ? "매니저 QR 인증 완료" : "QR 스캔 대기 중"}
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
  const state = useScreenState();
  const foot = (
    <div className="flex justify-between text-[12.5px] text-muted-foreground font-medium tabular">
      <span>퇴근 예정 19:00</span>
      <span>근무 3일 중 1일차</span>
    </div>
  );
  const eb = "POPUP OS · 출퇴근";
  const tt = "더현대 서울 5F · 1일차";

  if (state === "loading")
    return (
      <PhoneShell eyebrow={eb} title={tt} footer={foot}>
        <div className="space-y-4">
          <div className="relative h-[200px] rounded-[16px] bg-surface-3 animate-pulse grid place-items-center">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink-3">
              <Icon name="LoaderCircle" size={16} className="animate-spin" />
              QR 스캔 준비 중…
            </span>
          </div>
          <Skeleton className="h-[130px] rounded-[14px]" />
          <Skeleton className="h-14 rounded-[14px]" />
        </div>
      </PhoneShell>
    );

  if (state === "empty")
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

  const err = state === "error";
  return (
    <PhoneShell eyebrow={eb} title={tt} footer={foot}>
      <div className="space-y-3.5">
        <QrPanel scanned={!err} />
        <div className="rounded-[14px] border border-line px-3.5 divide-y divide-surface-3">
          <StepRow
            icon="QrCode"
            title="매니저 QR 스캔"
            sub="출근 인증 · 필수"
            st={err ? "wait" : "done"}
          />
          <StepRow icon="Camera" title="사진 인증" sub="현장 셀피 · 선택" st="done" />
        </div>
        {err ? (
          <Note tone="danger" icon="QrCode" title="매니저 QR을 스캔해 주세요">
            현장에 게시된 매니저 QR을 스캔하면 체크인이 완료돼요.
          </Note>
        ) : (
          <Note tone="info">
            출근 인증은 <b className="text-info-700">현장 매니저 QR 스캔</b>으로만 이루어져요. GPS·위치
            권한이 필요 없고, 사진 인증과 함께 대리출근을 방지합니다.
          </Note>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="xl"
            icon="ScanQrCode"
            className={err ? "flex-1" : "w-[120px]"}
          >
            {err ? "매니저 QR 스캔" : "QR"}
          </Button>
          <Button
            variant="success"
            size="xl"
            icon="LogIn"
            className="flex-1"
            disabled={err}
          >
            출근 체크인{" "}
            <span className="tabular font-semibold opacity-90">09:52</span>
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}
