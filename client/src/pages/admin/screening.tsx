import * as React from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { WorkerBadges } from "@/components/worker-badges";
import { Note } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterChip } from "@/components/ui/filter-chip";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { ApplicantDetail } from "@/pages/admin/applicant-detail";
import {
  findBucket,
  HEIGHT_OPTIONS,
  inBucket,
  WEIGHT_OPTIONS,
} from "@/lib/body";
import type { Applicant, ApplicationStatus } from "@/data/admin";
import type { Worker } from "@/data/workers";
import { ProjectPicker, useAdminProject } from "@/hooks/useAdminProject";
import { api, useAction, useApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const STAT_TONE: Record<string, string> = {
  success: "text-success-700",
  brand: "text-brand-600",
  warning: "text-warning-700",
  danger: "text-danger-700",
};

const TAG_FILTERS: { label: string; test: (w: Worker) => boolean }[] = [
  { label: "전체", test: () => true },
  { label: "#POS숙달", test: w => w.tags.some(([k]) => k === "pos") },
  { label: "#외국어가능", test: w => w.tags.some(([k]) => k === "lang") },
  { label: "#상하차가능", test: w => w.tags.some(([, t]) => t === "#상하차가능") },
  { label: "신규만", test: w => !!w.flags.newcomer },
  { label: "노쇼 0%", test: w => w.stats.some(s => s.label === "노쇼율" && s.value === "0%") },
];

function StatGrid({ worker }: { worker: Worker }) {
  return (
    <div className="grid grid-cols-4 rounded-lg border border-line bg-surface-2/60 divide-x divide-line">
      {worker.stats.map((s, i) => (
        <div key={i} className="px-3 py-2 min-w-[86px]">
          <div className="text-[11px] font-semibold text-muted-foreground">{s.label}</div>
          <div
            className={cn(
              "text-[17px] font-extrabold tabular leading-tight mt-0.5",
              s.value === "—" ? "text-subtle" : STAT_TONE[s.tone ?? ""] || "text-ink",
            )}
          >
            {s.value}
          </div>
          <div className="text-[10.5px] font-semibold text-muted-foreground tabular h-[15px]">
            {s.note || ""}
          </div>
        </div>
      ))}
    </div>
  );
}

const APP_STATUS: Record<ApplicationStatus, { tone: "neutral" | "success" | "warning" | "danger"; label: string }> = {
  applied: { tone: "neutral", label: "검토 대기" },
  held: { tone: "warning", label: "보류" },
  approved: { tone: "success", label: "승인됨" },
  rejected: { tone: "danger", label: "미선정" },
};

export type SetStatus = (ids: number[], status: "approved" | "held" | "rejected") => void;

export function WorkerActions({
  applicant,
  setStatus,
  row,
}: {
  applicant: Applicant;
  setStatus: SetStatus;
  row?: boolean;
}) {
  const { worker, status, applicationId: id } = applicant;
  if (status === "approved") {
    return applicant.contracted ? (
      <Badge tone="success" icon="FileCheck2">
        계약 발송됨
      </Badge>
    ) : (
      <Button variant="outline" size="sm" icon="Undo2" block={!row} onClick={() => setStatus([id], "held")}>
        승인 취소
      </Button>
    );
  }
  const primary =
    worker.act === "trial" ? (
      <Button variant="soft" size="sm" icon="FlaskConical" block={!row} onClick={() => setStatus([id], "approved")}>
        시범 채용
      </Button>
    ) : (
      <Button
        variant={worker.act === "caution" ? "outline" : "primary"}
        size="sm"
        icon="Check"
        block={!row}
        onClick={() => setStatus([id], "approved")}
      >
        승인
      </Button>
    );
  return (
    <>
      {primary}
      {status === "held" ? (
        <Button variant="outline" size="sm" icon="X" block={!row} onClick={() => setStatus([id], "rejected")}>
          미선정
        </Button>
      ) : (
        <Button variant="outline" size="sm" icon="Pause" block={!row} onClick={() => setStatus([id], "held")}>
          보류
        </Button>
      )}
    </>
  );
}

function WorkerCard({
  applicant,
  narrow,
  selected,
  onToggle,
  onOpen,
  setStatus,
}: {
  applicant: Applicant;
  narrow: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
  setStatus: SetStatus;
}) {
  const worker = applicant.worker;
  const st = APP_STATUS[applicant.status];
  return (
    <Card
      hoverable
      onClick={onOpen}
      className={cn(
        "p-4 grid gap-4 items-start cursor-pointer",
        narrow ? "grid-cols-[auto_44px_1fr]" : "grid-cols-[auto_52px_1fr_auto_auto]",
        selected && "border-brand-100 bg-brand-50/25",
      )}
    >
      <span className="pt-4" onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onCheckedChange={onToggle} disabled={applicant.status === "approved"} />
      </span>
      <Avatar initials={worker.ini} size={narrow ? 44 : 52} tone={worker.tone} src={worker.photoUrl ?? undefined} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-extrabold text-ink">{worker.name}</span>
          <Badge tone={st.tone} noIcon>
            {st.label}
          </Badge>
          <span className="text-caption font-semibold text-ink-3">{applicant.position}</span>
          <WorkerBadges flags={worker.flags} />
          {worker.photoStatus === "pending" && (
            <Badge tone="warning" icon="Clock">
              사진 검수 대기
            </Badge>
          )}
        </div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{worker.meta}</div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {worker.tags.map(([k, t], i) => (
            <Tag key={i} kind={k}>
              {t}
            </Tag>
          ))}
        </div>
        {worker.note && (
          <Note tone="warning" compact className="mt-2.5 max-w-[520px]">
            이력 데이터가 없습니다. <b className="text-warning-700">시범 채용</b> 또는 현장 매니저
            확인을 권장합니다.
          </Note>
        )}
        {narrow && (
          <div className="mt-3">
            <StatGrid worker={worker} />
          </div>
        )}
        {narrow && (
          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
            <WorkerActions applicant={applicant} setStatus={setStatus} row />
          </div>
        )}
      </div>
      {!narrow && <StatGrid worker={worker} />}
      {!narrow && (
        <div
          className="flex flex-col gap-1.5 w-[92px]"
          onClick={e => e.stopPropagation()}
        >
          <WorkerActions applicant={applicant} setStatus={setStatus} />
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center justify-center gap-1 h-8 rounded-md text-[12px] font-bold text-ink-3 hover:bg-surface-3"
          >
            <Icon name="Eye" size={13} />
            상세
          </button>
        </div>
      )}
    </Card>
  );
}

export function ScreeningScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const ctx = useAdminProject();
  const q = useApi<Applicant[]>(ctx.current ? `/admin/projects/${ctx.current.id}/applicants` : null);
  const all = q.data ?? [];
  const narrow = useIsNarrow();
  const [selected, setSelected] = React.useState<Set<number>>(() => new Set());
  const [activeFilter, setActiveFilter] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState("open");
  const [height, setHeight] = React.useState("all");
  const [weight, setWeight] = React.useState("all");
  const [detailId, setDetailId] = React.useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("applicant"),
  );

  const update = useAction(
    (v: { ids: number[]; status: "approved" | "held" | "rejected" }) =>
      api<{ updated: number }>("/admin/applications/status", { body: v }),
    r => {
      toast.success(`${r.updated}명 처리했어요`);
      setSelected(new Set());
    },
  );
  const setStatus: SetStatus = (ids, status) => update.mutate({ ids, status });

  const toggle = (id: number) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const detail = all.find(a => a.worker.id === detailId);
  if (detailId) {
    return (
      <ApplicantDetail
        workerId={detailId}
        applicant={detail}
        setStatus={setStatus}
        onBack={() => setDetailId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  const hb = findBucket(HEIGHT_OPTIONS, height);
  const wb = findBucket(WEIGHT_OPTIONS, weight);
  const tagTest = TAG_FILTERS[activeFilter].test;

  const filtered = all.filter(
    ({ worker: w, status }) =>
      (statusFilter === "all" ||
        (statusFilter === "open" ? status === "applied" || status === "held" : status === statusFilter)) &&
      tagTest(w) &&
      inBucket(w.height, hb.min, hb.max) &&
      inBucket(w.weight, wb.min, wb.max),
  );
  const state = useScreenState(
    { isLoading: ctx.list.isLoading || q.isLoading, isError: ctx.list.isError || q.isError },
    all.length === 0,
  );

  const body =
    state === "loading" ? (
      <div className="space-y-2.5">
        {[0, 1, 2].map(i => (
          <Card key={i} className="p-4 flex gap-4">
            <Skeleton className="w-[52px] h-[52px] rounded-[14px]" />
            <div className="flex-1 space-y-2.5 pt-1">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-72" />
              <Skeleton className="h-5 w-56" />
            </div>
            <Skeleton className="w-[340px] h-[60px] rounded-lg" />
          </Card>
        ))}
      </div>
    ) : state === "error" ? (
      <Card>
        <ErrorState code="APP-502" />
      </Card>
    ) : state === "empty" || filtered.length === 0 ? (
      <Card>
        <EmptyState
          icon="UserSearch"
          title="조건에 맞는 지원자가 없어요"
          desc="필터를 줄이거나 검색 조건을 바꿔 보세요. 조건을 초기화할 수도 있어요."
          action={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon="FilterX"
                onClick={() => {
                  setActiveFilter(0);
                  setStatusFilter("all");
                  setHeight("all");
                  setWeight("all");
                }}
              >
                필터 초기화
              </Button>
              <Button size="sm" icon="Megaphone" onClick={() => onNavigate?.("postings")}>
                공고 관리
              </Button>
            </div>
          }
        />
      </Card>
    ) : (
      <div className="space-y-2.5">
        {filtered.map(a => (
          <WorkerCard
            key={a.applicationId}
            applicant={a}
            narrow={narrow}
            selected={selected.has(a.applicationId)}
            onToggle={() => toggle(a.applicationId)}
            onOpen={() => setDetailId(a.worker.id)}
            setStatus={setStatus}
          />
        ))}
      </div>
    );

  const count = state === "empty" ? 0 : filtered.length;

  return (
    <AdminShell active="screen" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "지원자 스크리닝"]}
        title={
          <>
            {ctx.current ? ctx.current.brand : ""} 지원자{" "}
            <span className="text-muted-foreground tabular">({count})</span>
          </>
        }
        actions={
          <>
            <ProjectPicker ctx={ctx} />
            <Button
              icon="CheckCheck"
              disabled={state !== "default" || selected.size === 0}
              loading={update.isPending}
              onClick={() => setStatus(Array.from(selected), "approved")}
            >
              선택 승인 ({state === "default" ? selected.size : 0})
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="지원자 태그 필터">
          {TAG_FILTERS.map((f, i) => (
            <FilterChip key={f.label} on={i === activeFilter} onClick={() => setActiveFilter(i)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Select
            ariaLabel="지원 상태"
            icon="ListFilter"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "open", label: "검토 필요" },
              { value: "approved", label: "승인됨" },
              { value: "rejected", label: "미선정" },
              { value: "all", label: "전체 상태" },
            ]}
            className="w-[140px]"
          />
          <Select
            ariaLabel="키 구간"
            icon="Ruler"
            value={height}
            onChange={setHeight}
            options={HEIGHT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            className="w-[150px]"
          />
          <Select
            ariaLabel="몸무게 구간"
            icon="Weight"
            value={weight}
            onChange={setWeight}
            options={WEIGHT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            className="w-[150px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3.5">
        <span className="text-caption text-muted-foreground flex items-center gap-1">
          <Icon name="Info" size={13} />
          키·몸무게는 구간으로만 검색됩니다 · 신뢰 지표는 표본 수와 함께 표시
        </span>
        {!narrow && (
          <span className="text-caption text-muted-foreground">
            카드를 누르면 상세 검카드를 볼 수 있어요
          </span>
        )}
      </div>

      {body}
    </AdminShell>
  );
}
