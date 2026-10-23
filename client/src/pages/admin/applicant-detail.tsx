import * as React from "react";
import { toast } from "sonner";

import { Icon } from "@/components/icon";
import { KV } from "@/components/kv";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { WorkerBadges } from "@/components/worker-badges";
import { Note } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { heightLabel, weightLabel } from "@/lib/body";
import { ErrorState } from "@/components/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import type { Applicant } from "@/data/admin";
import type { PhotoStatus, Worker, WorkStatus } from "@/data/workers";
import { api, useAction, useApi } from "@/lib/api";
import { CONTACT_LABEL } from "@/lib/mask";
import { WorkerActions, type SetStatus } from "@/pages/admin/screening";
import { cn } from "@/lib/utils";

const STAT_TONE: Record<string, string> = {
  success: "text-success-700",
  brand: "text-brand-600",
  warning: "text-warning-700",
  danger: "text-danger-700",
};

const HIST_TONE: Record<WorkStatus, "success" | "danger" | "warning"> = {
  완료: "success",
  노쇼: "danger",
  지각: "warning",
};

const PHOTO_LABEL: Record<PhotoStatus, { text: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
  none: { text: "사진 미등록", tone: "neutral" },
  pending: { text: "사진 검수 대기", tone: "warning" },
  approved: { text: "사진 승인됨", tone: "success" },
  rejected: { text: "사진 반려됨", tone: "danger" },
};

function StatBox({ stat }: { stat: Worker["stats"][number] }) {
  return (
    <div className="px-4 py-3.5">
      <div className="text-[11.5px] font-semibold text-muted-foreground">{stat.label}</div>
      <div
        className={cn(
          "text-[24px] font-extrabold tabular leading-tight mt-0.5",
          stat.value === "—" ? "text-subtle" : STAT_TONE[stat.tone ?? ""] || "text-ink",
        )}
      >
        {stat.value}
      </div>
      <div className="text-[10.5px] font-semibold text-muted-foreground tabular h-[15px]">
        {stat.note || ""}
      </div>
    </div>
  );
}

function PhotoBlock({ worker }: { worker: Worker }) {
  const status = worker.photoStatus;
  const meta = PHOTO_LABEL[status];
  const review = useAction(
    (s: "approved" | "rejected") => api(`/admin/workers/${worker.id}/photo`, { body: { status: s } }),
    () => undefined,
  );

  return (
    <CardBody>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {status === "approved" ? (
            <Avatar initials={worker.ini} size={84} tone={worker.tone} src={worker.photoUrl ?? undefined} />
          ) : status === "pending" && worker.reviewPhotoUrl ? (
            <img
              src={worker.reviewPhotoUrl}
              alt="검수 대기 사진"
              className="w-[84px] h-[84px] rounded-[22px] object-cover border border-warning-200"
            />
          ) : (
            <div
              className={cn(
                "w-[84px] h-[84px] rounded-[22px] border grid place-items-center",
                status === "pending"
                  ? "border-warning-200 bg-warning-50 text-warning-700"
                  : status === "rejected"
                    ? "border-danger-200 bg-danger-50 text-danger-700"
                    : "border-dashed border-line-2 bg-surface-2 text-ink-3",
              )}
            >
              <Icon
                name={status === "pending" ? "Clock" : status === "rejected" ? "ImageOff" : "ImageOff"}
                size={26}
              />
            </div>
          )}
          <span
            className={cn(
              "absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full border-2 border-card",
              status === "approved"
                ? "bg-success-700 text-white"
                : status === "pending"
                  ? "bg-warning text-white"
                  : status === "rejected"
                    ? "bg-danger text-white"
                    : "bg-surface-3 text-ink-3",
            )}
          >
            <Icon
              name={
                status === "approved"
                  ? "Check"
                  : status === "pending"
                    ? "Clock"
                    : status === "rejected"
                      ? "X"
                      : "ImageOff"
              }
              size={14}
              strokeWidth={3}
            />
          </span>
        </div>
        <div className="min-w-0">
          <div className="text-[18px] font-extrabold text-ink">{worker.name}</div>
          <div className="text-[12.5px] text-muted-foreground mt-1">{worker.meta}</div>
          <div className="mt-1.5">
            <Badge tone={meta.tone}>{meta.text}</Badge>
          </div>
        </div>
      </div>

      {status === "pending" && (
        <div className="mt-3.5 flex items-center justify-between gap-2 rounded-lg bg-warning-50 border border-warning-200 px-3 py-2.5">
          <span className="text-[12.5px] font-bold text-warning-700 inline-flex items-center gap-1.5">
            <Icon name="ShieldAlert" size={14} />
            사진 검수 후 검카드에 노출됩니다
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              icon="X"
              loading={review.isPending && review.variables === "rejected"}
              onClick={() =>
                review.mutate("rejected", {
                  onSuccess: () => toast("사진 반려", { description: "워커에게 재등록 안내가 표시됩니다." }),
                })
              }
            >
              반려
            </Button>
            <Button
              size="sm"
              icon="Check"
              loading={review.isPending && review.variables === "approved"}
              onClick={() =>
                review.mutate("approved", {
                  onSuccess: () => toast.success("사진 승인됨", { description: "검카드에 사진이 노출됩니다." }),
                })
              }
            >
              사진 승인
            </Button>
          </div>
        </div>
      )}
      {status === "none" && (
        <Note tone="info" compact className="mt-3.5">
          아직 사진을 등록하지 않았습니다. 사진이 승인되면 검카드에 노출됩니다.
        </Note>
      )}
      {status === "rejected" && (
        <Note tone="danger" compact className="mt-3.5">
          사진이 반려되었습니다. 워커가 재등록하면 다시 검수할 수 있어요.
        </Note>
      )}
      {worker.bio && (
        <p className="text-body text-ink-2 mt-4 leading-relaxed">{worker.bio}</p>
      )}
    </CardBody>
  );
}

export function ApplicantDetail({
  workerId,
  applicant,
  setStatus,
  onBack,
  onNavigate,
}: {
  workerId: string;
  applicant?: Applicant;
  setStatus: SetStatus;
  onBack: () => void;
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const q = useApi<Worker>(`/admin/workers/${workerId}`);
  const worker = q.data;
  if (!worker) {
    return (
      <AdminShell active="screen" onNavigate={onNavigate}>
        {q.isError ? (
          <Card>
            <ErrorState
              title="지원자 정보를 불러오지 못했어요"
              action={
                <Button variant="outline" size="sm" icon="ChevronLeft" onClick={onBack}>
                  목록으로
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-[1fr_1.6fr]">
            <Skeleton className="h-[320px] rounded-card" />
            <Skeleton className="h-[320px] rounded-card" />
          </div>
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell active="screen" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "지원자 스크리닝", "상세"]}
        title={worker.name}
        meta={
          <div className="flex items-center gap-2 flex-wrap">
            <WorkerBadges flags={worker.flags} />
            {worker.photoStatus === "pending" && (
              <Badge tone="warning" icon="Clock">
                사진 검수 대기
              </Badge>
            )}
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="sm" icon="ChevronLeft" onClick={onBack}>
              목록으로
            </Button>
            {applicant && <WorkerActions applicant={{ ...applicant, worker }} setStatus={setStatus} row />}
          </>
        }
      />

      <div className="grid gap-4 grid-cols-[1fr_1.6fr] items-start">
        {/* 좌측 */}
        <div className="space-y-4">
          <Card>
            <PhotoBlock worker={worker} />
          </Card>

          <Card>
            <CardHeader title="기본 정보" icon="User" />
            <CardBody className="pt-1">
              <KV
                rows={[
                  ["성별", worker.gender],
                  ["나이", `${worker.age}세`],
                  ["활동 지역", worker.area],
                  ["가능일", worker.available],
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="신체 조건" icon="Ruler" hint="구간 표기" />
            <CardBody className="pt-1">
              <KV
                rows={[
                  ["키", <span className="tabular">{heightLabel(worker.height)}</span>],
                  ["몸무게", <span className="tabular">{weightLabel(worker.weight)}</span>],
                ]}
              />
              <Note tone="info" compact className="mt-3">
                정확한 수치는 비공개이며 <b className="text-info-700">구간으로만</b> 표시됩니다.
                인력 검색 시 이 구간으로 조건 검색할 수 있어요.
              </Note>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="연락처 · 마스킹" icon="ShieldCheck" />
            <CardBody className="pt-2">
              {worker.contact ? (
                <>
                  <KV
                    rows={[
                      [
                        CONTACT_LABEL[worker.contact.type],
                        <span className="tabular">{worker.contact.value}</span>,
                      ],
                      ...(worker.instagram
                        ? [[CONTACT_LABEL.instagram, <span className="tabular">{worker.instagram}</span>] as [string, React.ReactNode]]
                        : []),
                    ]}
                  />
                  <Note tone="info" compact className="mt-3">
                    개인 연락처는 <b className="text-info-700">자동 마스킹</b>되어 표시됩니다.
                    실제 연락은 Popup OS 안에서만 가능해요.
                  </Note>
                </>
              ) : (
                <div className="py-2 text-body-sm text-muted-foreground">
                  등록된 연락처가 없습니다.
                </div>
              )}
              <Note tone="warning" compact className="mt-3">
                검카드 본문(자기소개 등)에 전화번호·SNS를 직접 기재하면 승인이 거부될 수 있어요.
              </Note>
              <Button
                variant="outline"
                size="lg"
                block
                icon="MessagesSquare"
                className="mt-3"
                disabled
              >
                플랫폼 내 메시지 (Phase 1.5)
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="태그 · 스킬" icon="Tags" />
            <CardBody className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {worker.tags.map(([kind, label], i) => (
                  <Badge
                    key={i}
                    tone={kind === "lang" ? "info" : kind === "pos" ? "brand" : "neutral"}
                    icon="Hash"
                  >
                    {label.replace(/^#/, "")}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 우측 */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="신뢰 지표" hint="출퇴근 로그 기반 · 표본 수 병기" />
            <div className="grid grid-cols-4 divide-x divide-line">
              {worker.stats.map((s, i) => (
                <StatBox key={i} stat={s} />
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader
              title="커리어 이력"
              hint={worker.history.length ? `${worker.history.length}건` : undefined}
            />
            {worker.history.length === 0 ? (
              <div className="px-5 py-10 text-center text-body-sm text-muted-foreground">
                아직 등록된 커리어 이력이 없습니다.
              </div>
            ) : (
              <Table
                cols={[
                  { key: "project", label: "프로젝트" },
                  { key: "role", label: "역할", width: 120 },
                  { key: "dates", label: "기간", width: 160 },
                  { key: "verify", label: "검증", width: 130 },
                ]}
                rows={worker.history.map(h => ({
                  project: (
                    <div className="min-w-0">
                      <span className="font-bold">{h.project}</span>
                      <span className="block text-caption text-muted-foreground">
                        {h.organizer}
                      </span>
                    </div>
                  ),
                  role: <span className="text-ink-3">{h.role}</span>,
                  dates: <span className="tabular text-ink-3">{h.dates}</span>,
                  verify: h.verified ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Badge tone="success" icon="ShieldCheck">
                        인증
                      </Badge>
                      {h.status && <Badge tone={HIST_TONE[h.status]}>{h.status}</Badge>}
                    </span>
                  ) : (
                    <Badge tone="neutral" icon="CircleDashed">
                      미인증
                    </Badge>
                  ),
                }))}
              />
            )}
          </Card>

          <Card>
            <CardHeader title="리뷰 · 평가" hint="Phase 1.5" />
            <CardBody>
              <div className="flex items-center gap-3 text-body-sm text-muted-foreground">
                <Icon name="Star" size={18} className="text-subtle" />
                이중 블라인드 평가는 Phase 1.5에서 제공됩니다. 현재는 출퇴근 로그 기반 지표만
                사용합니다.
              </div>
            </CardBody>
          </Card>

          <Note tone="brand" icon="ShieldCheck" title="검증 기준">
            실계약 + 출퇴근 기록이 있는 근무만 신뢰 지표에 반영됩니다. 사진은 검수 후 노출되며, 개인
            연락처는 마스킹됩니다. 허위 정보·반복 노쇼는 승인 거부·이용 제한 사유가 됩니다.
          </Note>
        </div>
      </div>
    </AdminShell>
  );
}
