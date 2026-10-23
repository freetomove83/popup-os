import * as React from "react";
import { toast } from "sonner";

import { Icon } from "@/components/icon";
import { WorkerFrame, WorkerHeader } from "@/components/layout/worker-frame";
import { Note } from "@/components/ui/alert";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AddCareerDrawer, CareerTimeline } from "@/components/worker/career-timeline";
import type { MyProfile } from "@/data/worker-app";
import { useRequireWorker } from "@/hooks/useRequireWorker";
import { api, session, useAction, useApi } from "@/lib/api";
import { heightLabel, weightLabel } from "@/lib/body";
import { maskHandle, maskPhone } from "@/lib/mask";
import { cn } from "@/lib/utils";

const valCls: Record<string, string> = {
  success: "text-success-700",
  brand: "text-brand-600",
  warning: "text-warning-700",
  danger: "text-danger-700",
};

type Form = {
  name: string;
  gender: string;
  age: string;
  area: string;
  available: string;
  bio: string;
  height: string;
  weight: string;
  instagram: string;
  tags: MyProfile["tags"];
};

const toForm = (p: MyProfile): Form => ({
  name: p.name ?? "",
  gender: p.gender ?? "",
  age: p.age ? String(p.age) : "",
  area: p.area ?? "",
  available: p.available ?? "",
  bio: p.bio ?? "",
  height: p.height ? String(p.height) : "",
  weight: p.weight ? String(p.weight) : "",
  instagram: p.instagram ?? "",
  tags: p.tags,
});

const PHOTO_BADGE = {
  pending: { tone: "warning" as const, icon: "Clock", text: "사진 검수 대기" },
  rejected: { tone: "danger" as const, icon: "ImageOff", text: "사진 반려됨" },
};

export default function WorkerProfile() {
  const authed = useRequireWorker();
  const onboarding =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("onboarding") === "1";

  const q = useApi<MyProfile>(authed ? "/worker/me" : null);
  const me = q.data;
  const [f, setF] = React.useState<Form | null>(null);
  React.useEffect(() => {
    if (me && !f) setF(toForm(me));
  }, [me, f]);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [tagDraft, setTagDraft] = React.useState("");

  const save = useAction(
    (form: Form) =>
      api<MyProfile>("/worker/me", {
        method: "PUT",
        body: {
          ...form,
          gender: form.gender || null,
          age: form.age ? Number(form.age) : null,
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          instagram: form.instagram || null,
        },
      }),
    "검카드를 저장했어요",
  );
  const upload = useAction(
    (file: File) => {
      const fd = new FormData();
      fd.append("photo", file);
      return api<MyProfile>("/worker/me/photo", { body: fd });
    },
    () => toast("사진 등록됨", { description: "관리자 검수 후 검카드에 노출됩니다." }),
  );
  const addRecord = useAction(
    (r: { organizer: string; project: string; role: string; dates: string; evidence: boolean; visibility: string }) =>
      api("/worker/records", { body: r }),
    () =>
      toast("외부 이력이 추가됐어요", {
        description: "‘미인증’으로 표시되며, 주관사 확인 시 인증으로 전환됩니다.",
      }),
  );

  if (!me || !f) {
    return (
      <WorkerFrame>
        <WorkerHeader eyebrow="POPUP OS · 검카드" title="내 검카드" />
        <div className="px-5 py-4 space-y-3">
          {[90, 140, 160].map(h => (
            <div key={h} className="rounded-card bg-surface-3 animate-pulse" style={{ height: h }} />
          ))}
        </div>
      </WorkerFrame>
    );
  }

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const hNum = Number(f.height);
  const wNum = Number(f.weight);
  const hValid = hNum >= 140 && hNum <= 210;
  const wValid = wNum >= 30 && wNum <= 150;
  const verifiedCount = me.records.filter(r => r.verified).length;
  const photoBadge = me.photoStatus === "pending" || me.photoStatus === "rejected" ? PHOTO_BADGE[me.photoStatus] : null;

  const addTag = () => {
    const label = tagDraft.trim().replace(/^#?/, "#");
    if (label.length < 2 || f.tags.some(([, t]) => t === label)) return;
    const kind = /어|語|english|영어|일어|중국어/i.test(label) ? "lang" : /POS|계산/i.test(label) ? "pos" : "default";
    setF({ ...f, tags: [...f.tags, [kind, label]] });
    setTagDraft("");
  };

  const saveBtn = (
    <Button variant="soft" size="sm" icon="Save" loading={save.isPending} disabled={!f.name.trim()} onClick={() => save.mutate(f)}>
      저장
    </Button>
  );

  return (
    <WorkerFrame>
      <WorkerHeader eyebrow="POPUP OS · 검카드" title="내 검카드" action={saveBtn} />
      <div className="px-5 py-4 space-y-4">
        {(onboarding || !me.name) && (
          <Note tone="brand" icon="Sparkles" title="검카드를 완성해 주세요">
            이름을 입력하고 저장해야 공고에 지원할 수 있어요. 사진·태그·경력을 채우면 승인율이
            올라가요.
          </Note>
        )}

        {/* 사진 + 신원 */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-[76px] h-[76px] rounded-[22px] overflow-hidden bg-brand-50 grid place-items-center">
              {me.photoUrl ? (
                <img src={me.photoUrl} alt="검카드 사진" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[26px] font-extrabold text-brand-700">{(f.name || "?").slice(0, 2)}</span>
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
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) upload.mutate(file);
                e.target.value = "";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[18px] font-extrabold text-ink">{me.name || "이름 미입력"}</span>
              {me.verified && (
                <Badge tone="success" icon="BadgeCheck">
                  본인인증 완료
                </Badge>
              )}
              {photoBadge && (
                <Badge tone={photoBadge.tone} icon={photoBadge.icon}>
                  {photoBadge.text}
                </Badge>
              )}
            </div>
            <div className="text-[12.5px] text-muted-foreground mt-1 tabular">{maskPhone(me.phone)} · 로그인 번호</div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[12px] font-bold text-brand-600 mt-1.5 inline-flex items-center gap-1"
            >
              <Icon name="ImagePlus" size={13} />
              {upload.isPending ? "업로드 중…" : me.photoUrl ? "사진 변경" : "사진 등록"}
            </button>
          </div>
        </div>
        {photoBadge && (
          <Note tone={me.photoStatus === "rejected" ? "danger" : "warning"} compact icon="ShieldAlert">
            {me.photoStatus === "rejected" ? (
              <>사진이 반려됐어요. 얼굴이 잘 보이는 사진으로 다시 등록해 주세요.</>
            ) : (
              <>
                사진은 <b className="text-warning-700">관리자 검수 후</b> 검카드에 노출됩니다. 부적절한
                사진은 반려될 수 있어요.
              </>
            )}
          </Note>
        )}

        {/* 기본 정보 */}
        <div className="rounded-[14px] border border-line p-3.5 space-y-3">
          <div className="flex items-center gap-2">
            <Icon name="User" size={16} className="text-ink-3" />
            <span className="text-[13px] font-bold text-ink">기본 정보</span>
          </div>
          <Field label="이름 (필수)">
            <Input value={f.name} onChange={set("name")} placeholder="실명" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="성별">
              <Select
                value={f.gender}
                onChange={v => setF({ ...f, gender: v })}
                options={[
                  { value: "", label: "선택" },
                  { value: "여", label: "여" },
                  { value: "남", label: "남" },
                ]}
              />
            </Field>
            <Field label="나이">
              <Input type="number" inputMode="numeric" value={f.age} onChange={set("age")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="활동 지역">
              <Input value={f.area} onChange={set("area")} placeholder="서울 마포" />
            </Field>
            <Field label="가능일">
              <Input value={f.available} onChange={set("available")} placeholder="주말 전체" />
            </Field>
          </div>
          <Field label="자기소개" hint="전화번호·SNS는 적을 수 없어요">
            <Input value={f.bio} onChange={set("bio")} placeholder="경력·강점을 한두 줄로" />
          </Field>
        </div>

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
                value={f.height}
                onChange={set("height")}
                className={cn(!hValid && f.height !== "" && "border-danger")}
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
                value={f.weight}
                onChange={set("weight")}
                className={cn(!wValid && f.weight !== "" && "border-danger")}
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
              <Input icon="Phone" value={me.phone} disabled />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                검카드 표시: <b className="text-ink-2 tabular">{maskPhone(me.phone)}</b>
              </span>
            </div>
            <div>
              <span className="block text-[11.5px] font-semibold text-ink-2 mb-1.5">
                인스타그램 (선택)
              </span>
              <Input icon="AtSign" value={f.instagram} onChange={set("instagram")} placeholder="@handle" />
              <span className="block text-[11px] text-muted-foreground mt-1.5">
                검카드 표시:{" "}
                <b className="text-ink-2 tabular">{f.instagram ? maskHandle(f.instagram) : "—"}</b>
              </span>
            </div>
          </div>
          <Note tone="info" compact className="mt-3">
            입력한 연락처는 <b className="text-info-700">자동 마스킹</b>되어 대행사에 그대로 보이지
            않습니다. 연락은 Popup OS 안에서만 이루어져요.
          </Note>
        </div>

        {/* 신뢰 지표 */}
        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            신뢰 지표
          </div>
          <div className="grid grid-cols-4 rounded-[14px] border border-line bg-surface-2/60 divide-x divide-line">
            {me.stats.map((s, i) => (
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
                인증 {verifiedCount} · 외부 {me.records.length - verifiedCount}
              </span>
            </div>
            <AddCareerDrawer onAdd={r => addRecord.mutate({ ...r, evidence: !!r.evidence })} />
          </div>
          <CareerTimeline records={me.records} />
          <Note tone="info" compact className="mt-2">
            Popup OS 행사 근무는 정산이 끝나면 <b className="text-info-700">인증 이력</b>으로 자동
            기록되고, 다른 주관사 행사는 직접 추가해 <b className="text-info-700">미인증</b>으로
            표시돼요. 미인증 이력은 신뢰 지표에 반영되지 않습니다.
          </Note>
        </div>

        {/* 태그 */}
        <div>
          <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">
            보유 태그·스킬
          </div>
          <div className="flex flex-wrap gap-1.5">
            {f.tags.map(([kind, label]) => (
              <button
                key={label}
                type="button"
                title="눌러서 삭제"
                onClick={() => setF({ ...f, tags: f.tags.filter(([, t]) => t !== label) })}
              >
                <Tag kind={kind}>{label} ×</Tag>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={tagDraft}
              onChange={e => setTagDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
              placeholder="#재고정리"
              className="flex-1"
            />
            <Button variant="outline" icon="Plus" onClick={addTag}>
              추가
            </Button>
          </div>
        </div>

        <Note tone="info" icon="ShieldCheck" title="신뢰 지표는 어떻게 쌓이나요?">
          플랫폼 내 전자계약 + 출퇴근 기록이 있는 근무만 반영됩니다. 노쇼·지각은 출퇴근 로그로
          기록되고, 정산 이의신청으로 정정을 요청할 수 있어요.
        </Note>

        <Button size="xl" block icon="Save" loading={save.isPending} disabled={!f.name.trim()} onClick={() => save.mutate(f)}>
          검카드 저장
        </Button>
        <button
          type="button"
          onClick={async () => {
            await api("/worker/logout", { method: "POST" }).catch(() => undefined);
            session.clear("worker");
            window.location.assign("/worker/login");
          }}
          className="w-full text-[12.5px] font-semibold text-muted-foreground py-2"
        >
          로그아웃
        </button>
      </div>
    </WorkerFrame>
  );
}
