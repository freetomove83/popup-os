import { EmptyState, ErrorState } from "@/components/feedback";
import { KV } from "@/components/kv";
import { AdminShell, PageHeader } from "@/components/layout/admin-shell";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsNarrow } from "@/hooks/useMediaQuery";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminNavKey } from "@/components/layout/admin-shell";
import { cn } from "@/lib/utils";

export function ProjectScreen({
  onNavigate,
}: {
  onNavigate?: (key: AdminNavKey) => void;
}) {
  const state = useScreenState();
  const narrow = useIsNarrow();

  const positions = [
    { t: "운영 스태프", s: "프로모터 · 10:00~19:00", n: 12, pay: "12,000", f: 12, st: <Badge tone="success">모집 완료</Badge> },
    { t: "서버", s: "음료·응대 · 11:00~20:00", n: 4, pay: "13,000", f: 2, st: <Badge tone="warning" icon="Hourglass">모집 중</Badge> },
    { t: "상하차", s: "08:00~12:00", n: 3, pay: "14,000", f: 2, st: <Badge tone="warning" icon="Hourglass">모집 중</Badge> },
  ];

  const posBody =
    state === "loading" ? (
      <div className="p-[18px] space-y-2.5">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-[62px] rounded-lg" />
        ))}
      </div>
    ) : state === "error" ? (
      <ErrorState code="POS-500" />
    ) : state === "empty" ? (
      <EmptyState
        icon="Users"
        title="등록된 포지션이 없어요"
        desc="역할·인원·시급·근무시간을 등록하면 모집 공고를 열 수 있어요."
        action={
          <Button variant="soft" size="sm" icon="Plus">
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
        {positions.map((p, i) => (
          <div
            key={i}
            className={cn(
              "grid gap-3 px-[18px] h-[64px] items-center border-b border-surface-3 last:border-0 hover:bg-surface-2/70",
              narrow
                ? "grid-cols-[1fr_56px_84px_110px_96px]"
                : "grid-cols-[1fr_70px_100px_150px_104px]",
            )}
          >
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-ink">{p.t}</div>
              <div className="text-caption text-muted-foreground truncate">{p.s}</div>
            </div>
            <div className="text-right tabular">
              <b className="text-[14px]">{p.n}</b>
              <span className="text-caption text-muted-foreground">명</span>
            </div>
            <div className="text-right tabular">
              <span className="text-caption text-muted-foreground">₩</span>
              <b className="text-[14px]">{p.pay}</b>
            </div>
            <div>
              <Progress value={(p.f / p.n) * 100} tone={p.f === p.n ? "success" : "brand"} />
              <div className="text-caption text-muted-foreground mt-1 tabular">
                <b className="text-ink-2">
                  {p.f}/{p.n}
                </b>{" "}
                충원
              </div>
            </div>
            <div>{p.st}</div>
          </div>
        ))}
      </div>
    );

  const info: [React.ReactNode, React.ReactNode][] = [
    ["장소", "더현대 서울 5F 이벤트홀"],
    ["기간", "2026.10.05 ~ 10.07 (3일)"],
    ["인증 방식", "현장 매니저 QR 스캔 (+ 사진)"],
    ["담당", "김매니저"],
  ];

  return (
    <AdminShell active="project" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "프로젝트·포지션"]}
        title="무드랩 MOMENT POPUP 팝업"
        meta={
          state !== "loading" && (
            <div className="flex items-center gap-2">
              <Badge tone="success" dot pulse>
                진행 중
              </Badge>
              <span className="text-caption text-muted-foreground">
                더현대 서울 · 10.05 ~ 10.07
              </span>
            </div>
          )
        }
        actions={
          <>
            <Button variant="outline" size="sm" icon="Pencil">
              수정
            </Button>
            <Button size="sm" icon="Megaphone" disabled={state === "empty"}>
              모집 공고 열기
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
            {state === "loading" ? (
              <div className="space-y-4 pt-2">
                {info.map((_, i) => (
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
              state !== "empty" && (
                <Button variant="soft" size="sm" icon="Plus">
                  포지션 추가
                </Button>
              )
            }
          />
          {posBody}
        </Card>
      </div>
    </AdminShell>
  );
}
