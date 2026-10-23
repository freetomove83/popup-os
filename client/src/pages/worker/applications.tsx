import { Link } from "wouter";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScreenState } from "@/hooks/useScreenState";
import type { AppStage, MyApplication } from "@/data/worker-app";
import { useRequireWorker } from "@/hooks/useRequireWorker";
import { useApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<AppStage, "brand" | "success" | "warning" | "info" | "neutral" | "danger"> = {
  "지원 완료": "neutral",
  미선정: "danger",
  승인됨: "info",
  "계약 완료": "brand",
  근무중: "success",
  "근무 종료": "neutral",
  "정산 완료": "success",
};

export default function WorkerApplications() {
  const authed = useRequireWorker();
  const q = useApi<MyApplication[]>(authed ? "/worker/applications" : null);
  const apps = q.data ?? [];
  const state = useScreenState({ isLoading: !authed || q.isLoading, isError: q.isError }, apps.length === 0);

  return (
    <WorkerFrame>
      <WorkerHeader eyebrow="POPUP OS · 지원" title="내 지원 현황" />
      <div className="px-5 py-4 space-y-3">
        {state === "loading" ? (
          [0, 1, 2].map(i => (
            <div key={i} className="h-[140px] rounded-card bg-surface-3 animate-pulse" />
          ))
        ) : state === "error" ? (
          <EmptyState
            icon="CloudOff"
            title="지원 현황을 불러오지 못했어요"
            desc="잠시 후 다시 시도해 주세요."
          />
        ) : state === "empty" ? (
          <EmptyState
            icon="ClipboardList"
            title="아직 지원한 공고가 없어요"
            desc="공고 탭에서 마음에 드는 공고에 지원해 보세요."
            action={
              <Link href="/worker" className="text-[13px] font-bold text-brand-600 hover:underline">
                공고 둘러보기
              </Link>
            }
          />
        ) : (
          apps.map(a => (
            <div
              key={a.id}
              className="bg-card rounded-card border border-line shadow-soft p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-brand-600 tracking-[0.02em]">
                    {a.brand}
                  </div>
                  <Link href={`/worker/job/${a.jobId}`} className="block text-[14px] font-extrabold text-ink mt-0.5 truncate hover:underline">
                    {a.title}
                  </Link>
                </div>
                <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground mt-2.5">
                <span className="inline-flex items-center gap-1">
                  <Icon name="Briefcase" size={13} />
                  {a.role}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="CalendarDays" size={13} />
                  {a.dates}
                </span>
                <span className="tabular font-semibold text-ink-3">{a.pay}</span>
              </div>
              {a.action && (
                <Link href={a.action.href} className="block mt-3.5">
                  <Button size="lg" block icon={a.action.icon} className={cn(a.status === "근무중" && "bg-success-700 hover:bg-[#055C38]")}>
                    {a.action.label}
                  </Button>
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </WorkerFrame>
  );
}
