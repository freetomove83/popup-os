import * as React from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { WorkRecord, WorkStatus, WorkVisibility } from "@/data/workers";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<WorkStatus, "success" | "danger" | "warning"> = {
  완료: "success",
  노쇼: "danger",
  지각: "warning",
};

const VIS: Record<WorkVisibility, { icon: string; label: string }> = {
  public: { icon: "Globe", label: "전체 공개" },
  link: { icon: "Link2", label: "링크 공유" },
  private: { icon: "Lock", label: "비공개" },
};

const VIS_OPTIONS = [
  { value: "public", label: "전체 공개 — 누구나 검색·열람" },
  { value: "link", label: "링크 공유 — 링크 받은 사람만" },
  { value: "private", label: "비공개 — 나만 보기" },
];

function CareerItem({ record: r }: { record: WorkRecord }) {
  const vis = VIS[r.visibility];
  return (
    <li className="rounded-[14px] border border-line p-3.5">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid place-items-center w-9 h-9 rounded-full shrink-0",
            r.verified ? "bg-brand-50 text-brand-600" : "bg-surface-3 text-ink-3",
          )}
        >
          <Icon name={r.verified ? "BadgeCheck" : "PencilLine"} size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-brand-600 truncate">{r.organizer}</span>
            {r.verified ? (
              <Badge tone="success" icon="ShieldCheck">
                인증
              </Badge>
            ) : (
              <Badge tone="neutral" icon="CircleDashed">
                미인증
              </Badge>
            )}
          </div>
          <div className="text-[14px] font-extrabold text-ink mt-0.5">{r.project}</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground mt-1.5">
            <span className="inline-flex items-center gap-1">
              <Icon name="Briefcase" size={13} />
              {r.role}
            </span>
            <span className="inline-flex items-center gap-1 tabular">
              <Icon name="CalendarDays" size={13} />
              {r.dates}
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            {r.status && <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>}
            {r.source === "self" &&
              (r.evidence ? (
                <span className="text-[11px] font-semibold text-ink-3 inline-flex items-center gap-1">
                  <Icon name="Paperclip" size={12} />
                  증빙 첨부
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-muted-foreground inline-flex items-center gap-1">
                  <Icon name="Paperclip" size={12} />
                  증빙 없음
                </span>
              ))}
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground inline-flex items-center gap-1">
              <Icon name={vis.icon} size={12} />
              {vis.label}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export function CareerTimeline({ records }: { records: WorkRecord[] }) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon="History"
        title="아직 커리어 이력이 없어요"
        desc="플랫폼 행사 근무는 자동 기록되고, 다른 주관사 행사는 직접 추가할 수 있어요."
      />
    );
  }
  return (
    <ol className="space-y-2">
      {records.map(r => (
        <CareerItem key={r.id} record={r} />
      ))}
    </ol>
  );
}

export function AddCareerDrawer({ onAdd }: { onAdd: (record: WorkRecord) => void }) {
  const [open, setOpen] = React.useState(false);
  const [project, setProject] = React.useState("");
  const [organizer, setOrganizer] = React.useState("");
  const [role, setRole] = React.useState("");
  const [dates, setDates] = React.useState("");
  const [visibility, setVisibility] = React.useState<WorkVisibility>("link");
  const [evidence, setEvidence] = React.useState(false);

  const valid = project.trim() && organizer.trim() && role.trim() && dates.trim();

  const reset = () => {
    setProject("");
    setOrganizer("");
    setRole("");
    setDates("");
    setVisibility("link");
    setEvidence(false);
  };

  const submit = () => {
    if (!valid) return;
    onAdd({
      id: `self-${Date.now()}`,
      organizer: organizer.trim(),
      project: project.trim(),
      role: role.trim(),
      dates: dates.trim(),
      source: "self",
      verified: false,
      evidence,
      visibility,
    });
    toast("외부 이력이 추가됐어요", {
      description: "‘미인증’으로 표시되며, 주관사 확인 시 인증으로 전환됩니다.",
    });
    setOpen(false);
    reset();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="soft" icon="Plus">
          외부 이력
        </Button>
      </DrawerTrigger>
      <DrawerContent className="left-1/2 right-auto -translate-x-1/2 w-full max-w-[430px]">
        <div className="text-[17px] font-extrabold text-ink">외부 이력 추가</div>
        <p className="text-[12.5px] text-muted-foreground mt-1">
          다른 주관사·브랜드에서 근무한 경력을 등록해 커리어를 쌓아보세요.
        </p>

        <div className="space-y-3.5 mt-4">
          <Field label="행사·프로젝트명">
            <Input
              value={project}
              onChange={e => setProject(e.target.value)}
              placeholder="예: 어반핏 스탠다드 성수 팝업"
            />
          </Field>
          <Field label="주관사·브랜드">
            <Input
              icon="Building2"
              value={organizer}
              onChange={e => setOrganizer(e.target.value)}
              placeholder="예: 어반핏"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="역할">
              <Input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="예: 판매 스태프"
              />
            </Field>
            <Field label="근무 기간">
              <Input
                value={dates}
                onChange={e => setDates(e.target.value)}
                placeholder="2026.06.10~06.15"
              />
            </Field>
          </div>

          <div>
            <span className="block text-[12px] font-semibold text-ink-2 mb-1.5">증빙 자료 (선택)</span>
            <button
              type="button"
              onClick={() => setEvidence(v => !v)}
              className={cn(
                "w-full flex items-center gap-2.5 h-11 px-3 rounded-lg border text-left transition-colors",
                evidence
                  ? "border-success-200 bg-success-50"
                  : "border-dashed border-line-2 bg-surface-2",
              )}
            >
              <Icon
                name={evidence ? "FileCheck2" : "Paperclip"}
                size={16}
                className={evidence ? "text-success-700" : "text-ink-3"}
              />
              <span
                className={cn(
                  "text-[13px] font-semibold",
                  evidence ? "text-success-700" : "text-muted-foreground",
                )}
              >
                {evidence ? "근무 증빙 첨부됨" : "계약서·급여명세 등 첨부하기"}
              </span>
            </button>
          </div>

          <Field label="공개 범위">
            <Select
              value={visibility}
              onChange={v => setVisibility(v as WorkVisibility)}
              options={VIS_OPTIONS}
              icon={VIS[visibility].icon}
            />
          </Field>
        </div>

        <Note tone="info" compact className="mt-4">
          자기기입 이력은 <b className="text-info-700">‘미인증’</b>으로 표시되고 신뢰 지표엔 반영되지
          않아요. 주관사가 Popup OS에 합류하면 <b className="text-info-700">확인 요청</b>으로 인증
          전환할 수 있어요.
        </Note>

        <div className="flex gap-2 mt-4">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" block>
              취소
            </Button>
          </DrawerClose>
          <Button size="lg" block icon="Plus" disabled={!valid} onClick={submit}>
            이력 추가
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
