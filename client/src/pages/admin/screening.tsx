import * as React from "react";

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
import { WORKERS, type Worker } from "@/data/workers";
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

function WorkerActions({ worker, row }: { worker: Worker; row?: boolean }) {
  const primary =
    worker.act === "approve" ? (
      <Button size="sm" icon="Check" block={!row}>
        승인
      </Button>
    ) : worker.act === "trial" ? (
      <Button variant="soft" size="sm" icon="FlaskConical" block={!row}>
        시범 채용
      </Button>
    ) : (
      <Button variant="outline" size="sm" icon="Check" block={!row}>
        승인
      </Button>
    );
  return (
    <>
      {primary}
      <Button variant="outline" size="sm" icon="Pause" block={!row}>
        보류
      </Button>
    </>
  );
}

function WorkerCard({
  worker,
  narrow,
  selected,
  onToggle,
  onOpen,
}: {
  worker: Worker;
  narrow: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
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
        <Checkbox checked={selected} onCheckedChange={onToggle} />
      </span>
      <Avatar initials={worker.ini} size={narrow ? 44 : 52} tone={worker.tone} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-extrabold text-ink">{worker.name}</span>
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
            <WorkerActions worker={worker} row />
          </div>
        )}
      </div>
      {!narrow && <StatGrid worker={worker} />}
      {!narrow && (
        <div
          className="flex flex-col gap-1.5 w-[92px]"
          onClick={e => e.stopPropagation()}
        >
          <WorkerActions worker={worker} />
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
  const state = useScreenState();
  const narrow = useIsNarrow();
  const [selected, setSelected] = React.useState<Set<string>>(
    () => new Set(WORKERS.filter(w => w.sel).map(w => w.id)),
  );
  const [activeFilter, setActiveFilter] = React.useState(0);
  const [height, setHeight] = React.useState("all");
  const [weight, setWeight] = React.useState("all");
  const [detail, setDetail] = React.useState<Worker | null>(() => {
    if (typeof window === "undefined") return null;
    const id = new URLSearchParams(window.location.search).get("applicant");
    return WORKERS.find(w => w.id === id) ?? null;
  });

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (detail) {
    return <ApplicantDetail worker={detail} onBack={() => setDetail(null)} />;
  }

  const hb = findBucket(HEIGHT_OPTIONS, height);
  const wb = findBucket(WEIGHT_OPTIONS, weight);
  const tagTest = TAG_FILTERS[activeFilter].test;

  const filtered = WORKERS.filter(
    w =>
      tagTest(w) &&
      inBucket(w.height, hb.min, hb.max) &&
      inBucket(w.weight, wb.min, wb.max),
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
                  setHeight("all");
                  setWeight("all");
                }}
              >
                필터 초기화
              </Button>
              <Button size="sm" icon="Megaphone">
                모집 공고 열기
              </Button>
            </div>
          }
        />
      </Card>
    ) : (
      <div className="space-y-2.5">
        {filtered.map(w => (
          <WorkerCard
            key={w.id}
            worker={w}
            narrow={narrow}
            selected={selected.has(w.id)}
            onToggle={() => toggle(w.id)}
            onOpen={() => setDetail(w)}
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
            운영 스태프 지원자 <span className="text-muted-foreground tabular">({count})</span>
          </>
        }
        actions={
          <Button icon="CheckCheck" disabled={state !== "default"}>
            선택 승인 ({state === "default" ? selected.size : 0})
          </Button>
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
