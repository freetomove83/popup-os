import * as React from "react";
import { toast } from "sonner";

import { Icon } from "@/components/icon";
import { KV } from "@/components/kv";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { Note } from "@/components/ui/alert";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCareerDrawer, CareerTimeline } from "@/components/worker/career-timeline";
import { WORKERS, type WorkRecord } from "@/data/workers";
import { heightLabel, weightLabel } from "@/lib/body";
import { maskHandle, maskPhone } from "@/lib/mask";
import { cn } from "@/lib/utils";

const STATS: { label: string; value: string; tone?: string; note?: string }[] = [
  { label: "노쇼율", value: "0%", tone: "success", note: "표본 28건" },
  { label: "완료 건수", value: "31" },
  { label: "재고용률", value: "92%", tone: "brand", note: "실제 재고용 23/25" },
  { label: "지각률", value: "3%", tone: "warning" },
];

const valCls: Record<string, string> = {
  success: "text-success-700",
  brand: "text-brand-600",
  warning: "text-warning-700",
  danger: "text-danger-700",
};

export default function WorkerProfile() {
  const onboarding =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("onboarding") === "1";

  const fileRef = React.useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [photoPending, setPhotoPending] = React.useState(false);
  const [height, setHeight] = React.useState("168");
  const [weight, setWeight] = React.useState("52");
  const [phone, setPhone] = React.useState("010-4821-7733");
  const [sns, setSns] = React.useState("@jieun_kim");
  const [career, setCareer] = React.useState<WorkRecord[]>(WORKERS[0].history);
  const verifiedCount = career.filter(r => r.verified).length;

  const hNum = Number(height);
  const wNum = Number(weight);
  const hValid = hNum >= 140 && hNum <= 210;
  const wValid = wNum >= 30 && wNum <= 150;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhotoUrl(URL.createObjectURL(f));
      setPhotoPending(true);
      toast("사진 등록됨", { description: "관리자 검수 후 검카드에 노출됩니다." });
    }
  };

  return (
    <WorkerFrame>
      <WorkerHeader
        eyebrow="POPUP OS · 검카드"
        title="내 검카드"
        action={
          <Button
            variant="soft"
            size="sm"
            icon="Save"
            onClick={() =>
              toast.success("검카드 저장됨", { description: "변경 사항이 저장되었어요(목업)." })
            }
          >
            저장
          </Button>
        }
      />
      <div className="px-5 py-4 space-y-4">
        {onboarding && (
          <Note tone="brand" icon="Sparkles" title="검카드를 완성해 주세요">
            사진·태그·가능일·경력을 채우면 승인율이 올라가요. 신뢰 지표는 근무 이력이 쌓이면 자동으로
            표시됩니다.
          </Note>
        )}

        {/* 사진 + 신원 */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-[76px] h-[76px] rounded-[22px] overflow-hidden bg-brand-50 grid place-items-center">
              {photoUrl ? (
                <img src={photoUrl} alt="검카드 사진" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[26px] font-extrabold text-brand-700">김지</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="사진 등록"
              className="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-brand text-white border-2 border-surface shadow-brand"
            >
              <Icon name="Camera" size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[18px] font-extrabold text-ink">김지은</span>
              <Badge tone="success" icon="BadgeCheck">
                본인인증 완료
              </Badge>
              {photoPending && (
                <Badge tone="warning" icon="Clock">
                  사진 검수 대기
                </Badge>
              )}
            </div>
            <div className="text-[12.5px] text-muted-foreground mt-1">여 · 28세 · 서울 마포</div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[12px] font-bold text-brand-600 mt-1.5 inline-flex items-center gap-1"
            >
              <Icon name="ImagePlus" size={13} />
              {photoUrl ? "사진 변경" : "사진 등록"}
            </button>
          </div>
        </div>
        {photoPending && (
          <Note tone="warning" compact icon="ShieldAlert">
            사진은 <b className="text-warning-700">관리자 검수 후</b> 검카드에 노출됩니다. 부적절한
            사진은 반려될 수 있어요.
          </Note>
        )}

        {/* 신체 조건 */}
        <div className="rounded-[14px] border border-line p-3.5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Ruler" size={16} className="text-ink-3" />
            <span className="text-[13px] font-bold text-ink">신체 조건</span>
            <span className="text-[11px] text-muted-foreground">검색 조건으로만 사용</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[11.5px] font-semibold text-ink-2 mb-1.5">키 (cm)</span>
              <Input
                type="number"
                inputMode="numeric"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className={cn(!hValid && height !== "" && "border-danger")}
              />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                표시: <b className="text-ink-2 tabular">{hValid ? heightLabel(hNum) : "—"}</b>
              </span>
            </div>
            <div>
              <span className="block text-[11.5px] font-semibold text-ink-2 mb-1.5">
                몸무게 (kg)
              </span>
              <Input
                type="number"
                inputMode="numeric"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className={cn(!wValid && weight !== "" && "border-danger")}
              />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                표시: <b className="text-ink-2 tabular">{wValid ? weightLabel(wNum) : "—"}</b>
              </span>
            </div>
          </div>
          <Note tone="info" compact className="mt-3">
            정확한 수치는 <b className="text-info-700">대행사에 표시되지 않습니다.</b> 5cm·5kg
            구간으로만 노출되어 조건 검색에 사용돼요.
          </Note>
        </div>

        {/* 연락처 · 마스킹 */}
        <div className="rounded-[14px] border border-line p-3.5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ShieldCheck" size={16} className="text-ink-3" />
            <span className="text-[13px] font-bold text-ink">연락처</span>
            <span className="text-[11px] text-muted-foreground">검카드엔 마스킹 표시</span>
          </div>
          <div className="space-y-3">
            <div>
              <span className="block text-[11.5px] font-semibold text-ink-2 mb-1.5">휴대폰</span>
              <Input
                icon="Phone"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                검카드 표시:{" "}
                <b className="text-ink-2 tabular">{phone ? maskPhone(phone) : "—"}</b>
              </span>
            </div>
            <div>
              <span className="block text-[11.5px] font-semibold text-ink-2 mb-1.5">
                인스타그램 (선택)
              </span>
              <Input
                icon="AtSign"
                value={sns}
                onChange={e => setSns(e.target.value)}
                placeholder="@handle"
              />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                검카드 표시:{" "}
                <b className="text-ink-2 tabular">{sns ? maskHandle(sns) : "—"}</b>
              </span>
            </div>
          </div>
          <Note tone="info" compact className="mt-3">
            입력한 연락처는 <b className="text-info-700">자동 마스킹</b>되어 대행사에 그대로 보이지
            않습니다. 연락은 Popup OS 안에서만 이루어져요.
          </Note>
          <Note tone="warning" compact className="mt-2">
            검카드 본문(자기소개 등)에 전화번호·SNS를 직접 적으면 승인이 거부될 수 있어요.
          </Note>
        </div>

        {/* 신뢰 지표 */}
        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            신뢰 지표
          </div>
          <div className="grid grid-cols-4 rounded-[14px] border border-line bg-surface-2/60 divide-x divide-line">
            {STATS.map((s, i) => (
              <div key={i} className="px-2.5 py-2.5">
                <div className="text-[10.5px] font-semibold text-muted-foreground">{s.label}</div>
                <div
                  className={cn(
                    "text-[17px] font-extrabold tabular leading-tight mt-0.5",
                    s.value === "—" ? "text-subtle" : valCls[s.tone ?? ""] || "text-ink",
                  )}
                >
                  {s.value}
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground tabular h-[14px]">
                  {s.note || ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 커리어 타임라인 */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-[12px] font-bold text-muted-foreground tracking-[0.04em]">
                커리어 타임라인
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground tabular">
                인증 {verifiedCount} · 외부 {career.length - verifiedCount}
              </span>
            </div>
            <AddCareerDrawer onAdd={r => setCareer(prev => [r, ...prev])} />
          </div>
          <CareerTimeline records={career} />
          <Note tone="info" compact className="mt-2">
            Popup OS 행사 근무는 <b className="text-info-700">인증 이력</b>으로 자동 기록되고, 다른
            주관사 행사는 직접 추가해 <b className="text-info-700">미인증</b>으로 표시돼요. 미인증
            이력은 신뢰 지표에 반영되지 않습니다.
          </Note>
        </div>

        {/* 태그 */}
        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            보유 태그·스킬
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Tag kind="pos">#POS숙달</Tag>
            <Tag kind="pos">#프로모터 경력 2년</Tag>
            <Tag kind="lang">#일어가능</Tag>
            <Tag kind="default">#응대</Tag>
            <Tag kind="default">#재고정리</Tag>
            <button
              type="button"
              onClick={() =>
                toast("태그 추가", { description: "태그 선택 화면은 다음 단계에서 연결됩니다." })
              }
              className="inline-flex items-center gap-1 h-[22px] px-2 rounded-sm border border-dashed border-line-2 text-ink-3 text-[11px] font-semibold"
            >
              <Icon name="Plus" size={11} />
              추가
            </button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="rounded-[14px] border border-line overflow-hidden">
          <div className="px-4">
            <KV
              size="lg"
              rows={[
                ["활동 지역", "서울 · 경기"],
                ["가능 요일", "월~일 (주말 가능)"],
                ["가능 시간", "종일"],
                ["경력", "팝업·행사 스태프 2년"],
                ["포트폴리오", "notion.so/… (링크 1개)"],
              ]}
            />
          </div>
        </div>

        <Note tone="info" icon="ShieldCheck" title="신뢰 지표는 어떻게 쌓이나요?">
          플랫폼 내 전자계약 + 출퇴근 기록이 있는 근무만 반영됩니다. 노쇼·지각은 관리자 확인을 거쳐
          기록되고, 이의신청으로 정정할 수 있어요.
        </Note>

        <Note tone="brand" icon="IdCard" title="공개 프로필로도 쓸 수 있어요">
          검카드는 Popup OS 밖에서도 <b className="text-brand-700">이력서처럼</b> 공유할 수 있어요.
          이력별 공개 범위(전체·링크·비공개)는 커리어 타임라인에서 설정합니다.
        </Note>

        <Button
          variant="outline"
          size="xl"
          block
          icon="Share2"
          onClick={() =>
            toast("공개 프로필 링크 복사됨", {
              description: "onoff.link/p/kimjieun — 링크 받은 사람은 검카드·커리어를 볼 수 있어요.",
            })
          }
        >
          공개 프로필 링크 공유
        </Button>
      </div>
    </WorkerFrame>
  );
}
