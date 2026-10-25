import * as React from "react";
import { toast } from "sonner";
import { Link, useLocation, useParams } from "wouter";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { KV } from "@/components/kv";
import { WorkerFrame } from "@/components/layout/worker-frame";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { payRanges, type JobPosting } from "@/data/jobs";
import { api, session, useAction, useApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function WorkerJobDetail() {
  const params = useParams<{ id: string }>();
  const [, go] = useLocation();
  const q = useApi<JobPosting>(`/jobs/${params.id}`);
  const job = q.data;
  const [picked, setPicked] = React.useState<number | null>(null);
  const apply = useAction(
    (positionId: number) => api("/worker/applications", { body: { positionId } }),
    () =>
      toast.success("지원 완료", {
        description: `${role?.name} 포지션에 지원했어요. 승인되면 지원 현황에서 계약서를 확인할 수 있어요.`,
      }),
  );

  if (q.isLoading) {
    return (
      <WorkerFrame>
        <div className="px-5 py-6 space-y-3">
          <div className="h-[90px] rounded-card bg-surface-3 animate-pulse" />
          <div className="h-[220px] rounded-card bg-surface-3 animate-pulse" />
        </div>
      </WorkerFrame>
    );
  }

  if (!job) {
    return (
      <WorkerFrame>
        <EmptyState
          icon="FileQuestion"
          title="공고를 찾을 수 없어요"
          desc="삭제되었거나 잘못된 주소예요."
          action={
            <Link href="/worker" className="text-[13px] font-bold text-brand-600 hover:underline">
              공고 목록으로
            </Link>
          }
          className="pt-24"
        />
      </WorkerFrame>
    );
  }

  const mine = job.myApplication;
  const firstOpen = job.roles.findIndex(r => r.filled < r.headcount);
  const roleIdx = mine
    ? job.roles.findIndex(r => r.id === mine.position_id)
    : (picked ?? Math.max(0, firstOpen));
  const role = job.roles[roleIdx];
  const closed = job.status === "마감" || firstOpen === -1;
  const onApply = () => {
    if (!session.get("worker")) {
      toast("로그인이 필요해요", { description: "휴대폰 인증 후 바로 지원할 수 있어요." });
      go(`/worker/login?next=/worker/job/${job.id}`);
      return;
    }
    apply.mutate(role.id);
  };
  const payRange = payRanges(job.roles).map(p => `${p.unit} ${p.range}`).join(" · ") || "—";

  return (
    <WorkerFrame>
      <header className="px-5 pt-3 pb-3.5 border-b border-line sticky top-0 bg-surface z-10">
        <Link
          href="/worker"
          className="inline-flex items-center gap-1 text-[12.5px] font-bold text-muted-foreground"
        >
          <Icon name="ChevronLeft" size={16} />공고 목록
        </Link>
        <div className="text-[11px] font-bold text-brand-600 tracking-[0.02em] mt-2">
          {job.brand}
        </div>
        <h1 className="text-[20px] font-extrabold tracking-[-0.015em] text-ink mt-0.5">
          {job.title}
        </h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {job.status === "마감임박" ? (
            <Badge tone="warning" icon="AlarmClock">마감임박 D-{job.dday}</Badge>
          ) : (
            <Badge tone="brand" icon="CalendarClock">모집중 D-{job.dday}</Badge>
          )}
          {job.ownerVerified ? (
            <Badge tone="success" icon="BadgeCheck">확인된 주관사</Badge>
          ) : (
            <Badge tone="neutral" icon="Megaphone">Popup OS 대행 등록</Badge>
          )}
          <span className="text-[11.5px] text-muted-foreground inline-flex items-center gap-1">
            <Icon name="Users" size={12} />
            {job.applicants}명 지원
          </span>
        </div>
      </header>

      <div className="px-5 py-4 space-y-4">
        <div className="rounded-[14px] border border-line overflow-hidden">
          <div className="px-4">
            <KV
              size="lg"
              rows={[
                ["주관사", job.organizer],
                ["근무 장소", job.venue],
                ["근무 기간", `${job.startDate} ~ ${job.endDate}`],
                ["급여", <span className="tabular">{payRange}</span>],
                ["모집 인원", `${job.roles.reduce((a, r) => a + r.headcount, 0)}명`],
              ]}
            />
          </div>
        </div>

        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            모집 포지션 (지원할 역할 선택)
          </div>
          <div className="space-y-2">
            {job.roles.map((r, i) => {
              const full = r.filled >= r.headcount;
              const on = i === roleIdx;
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={full || !!mine}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "w-full text-left rounded-[14px] border p-3.5 transition-colors",
                    full
                      ? "border-line bg-surface-2 opacity-60 cursor-not-allowed"
                      : on
                        ? "border-brand bg-brand-50/40 ring-1 ring-brand"
                        : "border-line hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-ink">{r.name}</div>
                      <div className="text-[12px] text-muted-foreground mt-0.5">{r.hours}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[15px] font-extrabold text-ink tabular">
                        {r.pay.toLocaleString()}
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {" "}
                          {r.payType === "daily" ? "원/일" : "원/시"}
                        </span>
                      </div>
                      {full ? (
                        <Badge tone="neutral">마감</Badge>
                      ) : (
                        <div className="text-[11px] text-muted-foreground tabular">
                          {r.filled}/{r.headcount} 충원
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={(r.filled / r.headcount) * 100}
                      tone={full ? "neutral" : "brand"}
                      className="h-1.5"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            업무 내용
          </div>
          <p className="text-[14px] text-ink-2 leading-relaxed">{job.desc}</p>
        </div>

        <Note tone="info">
          지원하면 대행사가 <b className="text-info-700">검카드(프로필)</b>를 보고 승인합니다. 승인
          후 근로계약서가 알림톡으로 발송돼요.
        </Note>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-3 pb-4">
        {mine ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 h-12 px-3.5 rounded-lg bg-success-50 border border-success-200">
              <Icon name="CircleCheck" size={18} className="text-success-700" />
              <span className="text-[13px] font-bold text-success-700">지원 완료</span>
              <span className="text-[12px] text-ink-3">
                {role?.name} · {mine.status === "approved" ? "승인됨" : mine.status === "rejected" ? "미선정" : "검토 중"}
              </span>
            </div>
            <Link href="/worker/applications" className="block">
              <Button variant="outline" size="xl" block icon="ClipboardList">
                지원 현황 보기
              </Button>
            </Link>
          </div>
        ) : (
          <Button size="xl" block icon="Send" disabled={closed} loading={apply.isPending} onClick={onApply}>
            {closed ? "모집 마감" : `${role.name} 지원하기`}
          </Button>
        )}
      </div>
    </WorkerFrame>
  );
}
