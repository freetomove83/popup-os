import * as React from "react";

import { EmptyState, ErrorState } from "@/components/feedback";
import { KV } from "@/components/kv";
import { AdminShell, PageHeader, SubPage } from "@/components/layout/admin-shell";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProjectDetail } from "@/data/admin";
import { ProjectPicker, useAdminProject } from "@/hooks/useAdminProject";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { api, useAction, useApi, won } from "@/lib/api";
import { cn } from "@/lib/utils";

function ModalFooter({ onCancel, onSubmit, busy, disabled, label }: { onCancel: () => void; onSubmit: () => void; busy: boolean; disabled: boolean; label: string }) {
  return (
    <>
      <Button variant="outline" onClick={onCancel}>
        취소
      </Button>
      <Button loading={busy} disabled={disabled} onClick={onSubmit}>
        {label}
      </Button>
    </>
  );
}

function PositionDialog({ projectId, open, onOpenChange }: { projectId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [f, setF] = React.useState({ name: "", pay: "12000", headcount: "1", startTime: "10:00", endTime: "19:00", breakMinutes: "60" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }));
  const save = useAction(
    () =>
      api(`/admin/projects/${projectId}/positions`, {
        body: { ...f, pay: Number(f.pay), headcount: Number(f.headcount), breakMinutes: Number(f.breakMinutes) },
      }),
    () => {
      onOpenChange(false);
      setF(p => ({ ...p, name: "" }));
    },
  );
  return (
    <SubPage
      open={open}
      onOpenChange={onOpenChange}
      crumb={["운영", "프로젝트·포지션"]}
      title="포지션 추가"
      description="역할·시급·인원·근무시간을 등록하면 워커 공고에 바로 노출돼요."
      footer={
        <ModalFooter
          label="추가"
          busy={save.isPending}
          disabled={!f.name.trim()}
          onCancel={() => onOpenChange(false)}
          onSubmit={() => save.mutate()}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_140px_120px] gap-3">
          <Field label="역할">
            <Input value={f.name} onChange={set("name")} placeholder="예: 운영 스태프" />
          </Field>
          <Field label="시급 (원)">
            <Input type="number" inputMode="numeric" value={f.pay} onChange={set("pay")} />
          </Field>
          <Field label="모집 인원">
            <Input type="number" inputMode="numeric" value={f.headcount} onChange={set("headcount")} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="시작">
            <Input type="time" value={f.startTime} onChange={set("startTime")} />
          </Field>
          <Field label="종료">
            <Input type="time" value={f.endTime} onChange={set("endTime")} />
          </Field>
          <Field label="휴게 (분)">
            <Input type="number" inputMode="numeric" value={f.breakMinutes} onChange={set("breakMinutes")} />
          </Field>
        </div>
        <p className="text-caption text-muted-foreground">2026 최저시급 10,030원 이상만 등록할 수 있어요.</p>
      </div>
    </SubPage>
  );
}

function EditDialog({ project, open, onOpenChange }: { project: ProjectDetail; open: boolean; onOpenChange: (o: boolean) => void }) {
  const init = () => ({
    title: project.title,
    venue: project.venue,
    area: project.area,
    startDate: project.startDate,
    endDate: project.endDate,
    manager: project.manager ?? "",
    description: project.description ?? "",
  });
  const [f, setF] = React.useState(init);
  React.useEffect(() => {
    if (open) setF(init());
  }, [open]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));
  const save = useAction(
    () => api(`/admin/projects/${project.id}`, { method: "PATCH", body: f }),
    () => onOpenChange(false),
  );
  return (
    <SubPage
      open={open}
      onOpenChange={onOpenChange}
      crumb={["운영", "프로젝트·포지션"]}
      title="프로젝트 수정"
      description={`${project.brand} · ${project.organizer}`}
      footer={
        <ModalFooter
          label="저장"
          busy={save.isPending}
          disabled={!f.title.trim()}
          onCancel={() => onOpenChange(false)}
          onSubmit={() => save.mutate()}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_200px] gap-3">
          <Field label="행사·공고 제목">
            <Input value={f.title} onChange={set("title")} />
          </Field>
          <Field label="현장 담당">
            <Input icon="User" value={f.manager} onChange={set("manager")} />
          </Field>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_200px] gap-3">
          <Field label="근무지">
            <Input icon="MapPin" value={f.venue} onChange={set("venue")} />
          </Field>
          <Field label="지역">
            <Input value={f.area} onChange={set("area")} placeholder="서울 성동" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="시작일">
            <Input type="date" value={f.startDate} onChange={set("startDate")} />
          </Field>
          <Field label="종료일">
            <Input type="date" value={f.endDate} onChange={set("endDate")} />
          </Field>
        </div>
        <Field label="업무 내용" hint="워커 공고 상세에 그대로 노출돼요">
          <textarea
            value={f.description}
            onChange={set("description")}
            rows={4}
            className="w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-body text-ink outline-none resize-y focus:border-brand focus:ring-[3px] focus:ring-brand/20"
          />
        </Field>
      </div>
    </SubPage>
  );
}

export function ProjectScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const ctx = useAdminProject();
  const q = useApi<ProjectDetail>(ctx.current ? `/admin/projects/${ctx.current.id}` : null);
  const p = q.data;
  const state = useScreenState(
    { isLoading: ctx.list.isLoading || q.isLoading, isError: ctx.list.isError || q.isError },
    !!p && p.positions.length === 0,
  );
  const narrow = useIsNarrow();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const posBody =
    state === "loading" ? (
      <div className="p-[18px] space-y-2.5">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-[62px] rounded-lg" />
        ))}
      </div>
    ) : state === "error" ? (
      <ErrorState code="POS-500" />
    ) : state === "empty" || !p ? (
      <EmptyState
        icon="Users"
        title="등록된 포지션이 없어요"
        desc="역할·인원·시급·근무시간을 등록하면 모집 공고를 열 수 있어요."
        action={
          <Button variant="soft" size="sm" icon="Plus" onClick={() => setAddOpen(true)}>
            포지션 추가
          </Button>
        }
      />
    ) : (
      <div>
        <div
          className={cn(
            "grid gap-3 px-[18px] h-9 items-center border-b border-line bg-surface-2/60 text-label uppercase text-muted-foreground",
            narrow
              ? "grid-cols-[1fr_56px_84px_110px_96px]"
              : "grid-cols-[1fr_70px_100px_150px_104px]",
          )}
        >
          <span>역할</span>
          <span className="text-right">모집</span>
          <span className="text-right">시급</span>
          <span>충원</span>
          <span>상태</span>
        </div>
        {p.positions.map(r => (
          <div
            key={r.id}
            className={cn(
              "grid gap-3 px-[18px] h-[64px] items-center border-b border-surface-3 last:border-0 hover:bg-surface-2/70",
              narrow
                ? "grid-cols-[1fr_56px_84px_110px_96px]"
                : "grid-cols-[1fr_70px_100px_150px_104px]",
            )}
          >
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-ink">{r.name}</div>
              <div className="text-caption text-muted-foreground truncate">
                {r.hours} · 지원 {r.applicants}
              </div>
            </div>
            <div className="text-right tabular">
              <b className="text-[14px]">{r.headcount}</b>
              <span className="text-caption text-muted-foreground">명</span>
            </div>
            <div className="text-right tabular">
              <span className="text-caption text-muted-foreground">₩</span>
              <b className="text-[14px]">{won(r.pay)}</b>
            </div>
            <div>
              <Progress value={(r.filled / r.headcount) * 100} tone={r.filled >= r.headcount ? "success" : "brand"} />
              <div className="text-caption text-muted-foreground mt-1 tabular">
                <b className="text-ink-2">
                  {r.filled}/{r.headcount}
                </b>{" "}
                충원
              </div>
            </div>
            <div>
              {r.filled >= r.headcount ? (
                <Badge tone="success">모집 완료</Badge>
              ) : (
                <Badge tone="warning" icon="Hourglass">
                  모집 중
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );

  const info: [React.ReactNode, React.ReactNode][] = p
    ? [
        ["주관사", p.organizer],
        ["장소", p.venue],
        ["기간", `${p.startDate.replace(/-/g, ".")} ~ ${p.endDate.slice(5).replace("-", ".")} (${p.days}일)`],
        ["인증 방식", "현장 매니저 QR 스캔 (+ 사진)"],
        ["담당", p.manager ?? "—"],
      ]
    : [];

  return (
    <AdminShell active="project" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "프로젝트·포지션"]}
        title={p ? `${p.brand} ${p.title}` : "프로젝트"}
        meta={
          p && (
            <div className="flex items-center gap-2">
              <Badge tone={p.status === "진행 중" ? "success" : p.status === "종료" ? "neutral" : "info"} dot pulse={p.status === "진행 중"}>
                {p.status}
              </Badge>
              <span className="text-caption text-muted-foreground">
                {p.venue} · {p.startDate.slice(5).replace("-", ".")} ~ {p.endDate.slice(5).replace("-", ".")}
              </span>
            </div>
          )
        }
        actions={
          <>
            <ProjectPicker ctx={ctx} />
            <Button variant="outline" size="sm" icon="Pencil" disabled={!p} onClick={() => setEditOpen(true)}>
              수정
            </Button>
            <Button
              size="sm"
              icon="ExternalLink"
              disabled={!p || state === "empty"}
              onClick={() => p && window.open(`/worker/job/${p.id}`, "_blank")}
            >
              공고 보기
            </Button>
          </>
        }
      />
      <div
        className={cn(
          "grid gap-4",
          narrow ? "grid-cols-[300px_1fr]" : "grid-cols-[1fr_1.45fr]",
        )}
      >
        <Card>
          <CardHeader title="현장 정보" icon="MapPin" />
          <CardBody className="pt-2">
            {state === "loading" || !p ? (
              <div className="space-y-4 pt-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <KV rows={info} />
            )}
            <Note tone="info" className="mt-3" compact>
              출근 인증은 현장 매니저 QR 스캔으로만 진행합니다. GPS·위치 권한이 필요 없어
              실내에서도 오차 없이 체크인할 수 있어요.
            </Note>
          </CardBody>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader
            title="모집 포지션"
            hint="Positions"
            action={
              state === "default" && (
                <Button variant="soft" size="sm" icon="Plus" onClick={() => setAddOpen(true)}>
                  포지션 추가
                </Button>
              )
            }
          />
          {posBody}
        </Card>
      </div>
      {p && <PositionDialog projectId={p.id} open={addOpen} onOpenChange={setAddOpen} />}
      {p && <EditDialog project={p} open={editOpen} onOpenChange={setEditOpen} />}
    </AdminShell>
  );
}
