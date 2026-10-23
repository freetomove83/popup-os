import { Link } from "wouter";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScreenState } from "@/hooks/useScreenState";
import { cn } from "@/lib/utils";

interface AppRow {
  brand: string;
  title: string;
  role: string;
  dates: string;
  pay: string;
  status: "지원 완료" | "승인됨" | "계약 완료" | "근무중" | "정산 완료";
  action?: { label: string; href: string; icon: string };
}

const APPS: AppRow[] = [
  {
    brand: "무드랩",
    title: "MOMENT POPUP 팝업 운영 스태프",
    role: "운영 스태프(프로모터)",
    dates: "10.05 ~ 10.07",
    pay: "12,000원/시",
    status: "근무중",
    action: { label: "출근 체크인", href: "/worker/checkin", icon: "LogIn" },
  },
  {
    brand: "뉴욕의 거장들",
    title: "미술 전시 팝업 안내·운영",
    role: "안내 스태프",
    dates: "10.08 ~ 10.12",
    pay: "12,500원/시",
    status: "계약 완료",
    action: { label: "근무 안내 보기", href: "/worker/checkin", icon: "CalendarCheck" },
  },
  {
    brand: "퍼스트 라운딩",
    title: "성수 팝업 물류·상하차",
    role: "상하차",
    dates: "10.05 ~ 10.06",
    pay: "15,000원/시",
    status: "승인됨",
    action: { label: "계약 서명하기", href: "/worker/contract", icon: "PenLine" },
  },
  {
    brand: "티랩(T-LAB)",
    title: "신제품 체험 부스 운영",
    role: "부스 운영",
    dates: "10.15 ~ 10.18",
    pay: "13,000원/시",
    status: "지원 완료",
  },
];

const STATUS_TONE: Record<AppRow["status"], "brand" | "success" | "warning" | "info" | "neutral"> = {
  "지원 완료": "neutral",
  승인됨: "info",
  "계약 완료": "brand",
  근무중: "success",
  "정산 완료": "success",
};

export default function WorkerApplications() {
  const state = useScreenState();

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
        ) : state === "empty" || APPS.length === 0 ? (
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
          APPS.map((a, i) => (
            <div
              key={i}
              className="bg-card rounded-card border border-line shadow-soft p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-brand-600 tracking-[0.02em]">
                    {a.brand}
                  </div>
                  <div className="text-[14px] font-extrabold text-ink mt-0.5 truncate">
                    {a.title}
                  </div>
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
