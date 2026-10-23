import * as React from "react";
import { Link } from "wouter";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { Badge } from "@/components/ui/badge";
import { FilterChip } from "@/components/ui/filter-chip";
import { Input } from "@/components/ui/input";
import type { JobPosting } from "@/data/jobs";
import { useApi } from "@/lib/api";
import { useScreenState } from "@/hooks/useScreenState";
import { cn } from "@/lib/utils";

function payRange(job: JobPosting) {
  const pays = job.roles.map(r => r.pay);
  const min = Math.min(...pays);
  const max = Math.max(...pays);
  return min === max ? `${min.toLocaleString()}원` : `${min.toLocaleString()}~${max.toLocaleString()}원`;
}

function StatusBadge({ job }: { job: JobPosting }) {
  if (job.status === "마감임박")
    return <Badge tone="warning" icon="AlarmClock">마감임박 D-{job.dday}</Badge>;
  if (job.status === "마감") return <Badge tone="neutral">마감</Badge>;
  return <Badge tone="brand" icon="CalendarClock">모집중 D-{job.dday}</Badge>;
}

function JobCard({ job }: { job: JobPosting }) {
  return (
    <Link href={`/worker/job/${job.id}`} className="block">
      <div className="bg-card rounded-card border border-line shadow-soft p-4 transition-shadow hover:shadow-soft-hover hover:border-brand-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-brand-600 tracking-[0.02em]">
              {job.brand}
            </div>
            <div className="text-[15px] font-extrabold text-ink mt-0.5 truncate">
              {job.title}
            </div>
          </div>
          <StatusBadge job={job} />
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-2.5">
          <span className="inline-flex items-center gap-1">
            <Icon name="MapPin" size={13} />
            {job.area}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="CalendarDays" size={13} />
            {job.startDate}~{job.endDate.slice(5)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.tags.slice(0, 3).map(t => (
            <span
              key={t}
              className="inline-flex items-center h-[22px] px-2 rounded-sm bg-surface-3 text-ink-3 text-[11px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-surface-3">
          <span className="text-[15px] font-extrabold text-ink tabular">
            {payRange(job)}
            <span className="text-[11px] font-semibold text-muted-foreground"> /시급</span>
          </span>
          <span className="text-[11.5px] text-muted-foreground inline-flex items-center gap-1">
            <Icon name="Users" size={12} />
            {job.applicants}명 지원
          </span>
        </div>
      </div>
    </Link>
  );
}

const day = (s: string) => new Date(s.replace(/\./g, "-"));
const today = () => new Date().toLocaleDateString("sv-SE").replace(/-/g, ".");

const FILTERS: { label: string; test: (j: JobPosting) => boolean }[] = [
  { label: "전체", test: () => true },
  { label: "서울", test: j => j.area.startsWith("서울") },
  {
    label: "주말",
    test: j => {
      for (let d = day(j.startDate); d <= day(j.endDate); d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0 || d.getDay() === 6) return true;
      }
      return false;
    },
  },
  { label: "상하차", test: j => j.roles.some(r => r.name.includes("상하차")) },
  { label: "외국어", test: j => [...j.tags, ...j.roles.flatMap(r => r.tags)].some(t => t.includes("외국어")) },
  { label: "당일", test: j => j.startDate <= today() && today() <= j.endDate },
];

export default function WorkerJobs() {
  const query = useApi<JobPosting[]>("/jobs");
  const [active, setActive] = React.useState(0);
  const [q, setQ] = React.useState("");

  const list = (query.data ?? []).filter(
    j =>
      FILTERS[active].test(j) &&
      (q ? j.title.includes(q) || j.brand.includes(q) || j.area.includes(q) || j.roles.some(r => r.name.includes(q)) : true),
  );
  const state = useScreenState(query);

  return (
    <WorkerFrame>
      <WorkerHeader
        eyebrow="POPUP OS · 공고"
        title="공고 탐색"
        action={
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-brand-600">
            <Icon name="Bell" size={16} />
          </span>
        }
      />
      <div className="px-5 py-4">
        <Input
          icon="Search"
          placeholder="브랜드·지역·역할로 검색"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-3.5" role="group" aria-label="공고 필터">
          {FILTERS.map((f, i) => (
            <FilterChip key={f.label} on={i === active} onClick={() => setActive(i)}>
              {f.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {state === "loading" ? (
            [0, 1, 2].map(i => (
              <div key={i} className="h-[168px] rounded-card bg-surface-3 animate-pulse" />
            ))
          ) : state === "error" ? (
            <EmptyState
              icon="CloudOff"
              title="공고를 불러오지 못했어요"
              desc="잠시 후 다시 시도해 주세요."
            />
          ) : state === "empty" || list.length === 0 ? (
            <EmptyState
              icon="SearchX"
              title="조건에 맞는 공고가 없어요"
              desc="필터를 줄이거나 검색어를 바꿔 보세요."
            />
          ) : (
            list.map(j => <JobCard key={j.id} job={j} />)
          )}
        </div>

        <div className={cn("mt-5 text-center text-[11.5px] text-muted-foreground", state !== "default" && "hidden")}>
          공고 {list.length}건 · 지원 전 <b className="text-ink-2">검카드</b>를 완성하면 승인율이 올라가요
        </div>
      </div>
    </WorkerFrame>
  );
}
