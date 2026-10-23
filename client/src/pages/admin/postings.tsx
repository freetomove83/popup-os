import * as React from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState } from "@/components/feedback";
import { KpiRow } from "@/components/kpi-row";
import { AdminShell, PageHeader, type AdminNavKey } from "@/components/layout/admin-shell";
import { Note } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table } from "@/components/ui/table";
import { useScreenState } from "@/hooks/useScreenState";
import type { AdminPosting, ClaimStatus, PostingStatus } from "@/data/postings";
import { api, useAction, useApi } from "@/lib/api";

const STATUS_TONE: Record<PostingStatus, "brand" | "warning" | "neutral"> = {
  모집중: "brand",
  마감임박: "warning",
  마감: "neutral",
};

const CLAIM_META: Record<
  ClaimStatus,
  { tone: "warning" | "info" | "success"; icon: string; label: string }
> = {
  unclaimed: { tone: "warning", icon: "UserPlus", label: "미claim" },
  invited: { tone: "info", icon: "Send", label: "초대됨" },
  claimed: { tone: "success", icon: "ShieldCheck", label: "주관사 관리" },
};

function NewPostingDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [brand, setBrand] = React.useState("");
  const [organizer, setOrganizer] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [role, setRole] = React.useState("");
  const [headcount, setHeadcount] = React.useState("");
  const [pay, setPay] = React.useState("");
  const [method, setMethod] = React.useState<"구두" | "이메일" | "서면">("구두");
  const [date, setDate] = React.useState(today);
  const [agreed, setAgreed] = React.useState(false);

  const valid =
    brand.trim() && organizer.trim() && contact.trim() && title.trim() && startDate && endDate && agreed;

  const reset = () => {
    setBrand("");
    setOrganizer("");
    setContact("");
    setTitle("");
    setVenue("");
    setStartDate("");
    setEndDate("");
    setRole("");
    setHeadcount("");
    setPay("");
    setMethod("구두");
    setDate(today);
    setAgreed(false);
  };

  const save = useAction(
    () =>
      api("/admin/projects", {
        body: {
          brand: brand.trim(),
          organizer: organizer.trim(),
          contact: contact.trim(),
          title: title.trim(),
          venue: venue.trim(),
          startDate,
          endDate,
          postedBy: "operator",
          consent: { agreed, method, date },
          role: role.trim() || undefined,
          headcount: headcount ? Number(headcount) : undefined,
          pay: pay ? Number(pay) : undefined,
        },
      }),
    () => {
      toast.success("공고를 등록했어요", {
        description: "‘미claim’ 상태입니다. 주관사에 합류 초대를 보내 소유권을 이전하세요.",
      });
      onOpenChange(false);
      reset();
    },
  );
  const submit = () => valid && save.mutate();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      width={760}
      title="대행 등록 — 새 공고"
      description="주관사 동의를 받은 공고를 더블엠이 대신 등록합니다."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button icon="Megaphone" disabled={!valid} loading={save.isPending} onClick={submit}>
            공고 등록
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="주관사·브랜드 (노출명)">
            <Input
              icon="Store"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="예: 어반핏 스탠다드"
            />
          </Field>
          <Field label="주관사 법인·단체명">
            <Input
              icon="Building2"
              value={organizer}
              onChange={e => setOrganizer(e.target.value)}
              placeholder="예: (주)어반핏"
            />
          </Field>
          <Field label="담당자 연락처 (워커에겐 마스킹)">
            <Input
              icon="Phone"
              inputMode="numeric"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="010-0000-0000"
            />
          </Field>
        </div>

        <Field label="행사·공고 제목">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 성수 팝업 판매·응대 스태프"
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="근무지">
            <Input
              icon="MapPin"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="예: 성수 팝업존 B동"
            />
          </Field>
          <Field label="시작일">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </Field>
          <Field label="종료일">
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="역할">
            <Input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="판매 스태프"
            />
          </Field>
          <Field label="인원">
            <Input
              type="number"
              inputMode="numeric"
              value={headcount}
              onChange={e => setHeadcount(e.target.value)}
              placeholder="12"
            />
          </Field>
          <Field label="시급 (원)">
            <Input
              type="number"
              inputMode="numeric"
              value={pay}
              onChange={e => setPay(e.target.value)}
              placeholder="12000"
            />
          </Field>
        </div>

        <div className="rounded-[14px] border border-line p-3.5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[13px] font-bold text-ink">주관사 동의 기록</span>
            <Badge tone="danger" icon="ShieldAlert">
              필수
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="동의 방식">
              <Select
                value={method}
                onChange={v => setMethod(v as "구두" | "이메일" | "서면")}
                options={[
                  { value: "구두", label: "구두" },
                  { value: "이메일", label: "이메일" },
                  { value: "서면", label: "서면" },
                ]}
              />
            </Field>
            <Field label="동의일">
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </Field>
          </div>
          <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-[1px]"
            />
            <span className="text-[12.5px] text-ink-2 leading-relaxed">
              주관사로부터 <b>공고 게시에 대한 동의</b>를 받았으며, 그 근거를 보관하고 있습니다.
            </span>
          </label>
        </div>
      </div>

      <Note tone="info" compact className="mt-4">
        계약·정산 주체는 <b className="text-info-700">주관사</b>이며 Popup OS는 도구를 제공합니다.
        주관사가 합류(claim)하면 공고 소유권이 이전되고 <b className="text-info-700">확인된 주관사</b>
        로 표시돼요.
      </Note>

    </Dialog>
  );
}

export function PostingsScreen({ onNavigate }: { onNavigate?: (key: AdminNavKey) => void }) {
  const q = useApi<AdminPosting[]>("/admin/projects");
  const rows = q.data ?? [];
  const state = useScreenState(q, rows.length === 0);
  const [open, setOpen] = React.useState(
    typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("new") === "1",
  );

  const unclaimed = rows.filter(r => r.claimStatus === "unclaimed").length;
  const invited = rows.filter(r => r.claimStatus === "invited").length;
  const operatorCount = rows.filter(r => r.postedBy === "operator").length;

  const invite = useAction(
    (id: string) => api(`/admin/projects/${id}/invite`, { method: "POST" }),
    () =>
      toast("주관사 초대 발송", {
        description: "알림톡·이메일로 합류 초대를 보냈어요. 합류 시 소유권이 이전됩니다.",
      }),
  );

  const table =
    state === "loading" ? (
      <div className="p-[18px] space-y-2.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-[52px] rounded-lg bg-surface-3 animate-pulse" />
        ))}
      </div>
    ) : state === "error" ? (
      <ErrorState code="POST-500" />
    ) : state === "empty" || rows.length === 0 ? (
      <EmptyState
        icon="Megaphone"
        title="등록된 공고가 없어요"
        desc="주관사 동의를 받은 공고를 대행 등록해 구인 풀을 채워보세요."
        action={
          <Button variant="soft" size="sm" icon="Plus" onClick={() => setOpen(true)}>
            새 공고 등록
          </Button>
        }
      />
    ) : (
      <Table
        cols={[
          { key: "posting", label: "공고" },
          { key: "organizer", label: "주관사", width: 190 },
          { key: "period", label: "기간 · 상태", width: 165 },
          { key: "recruit", label: "모집", width: 90, align: "right" },
          { key: "claim", label: "소유권", width: 130 },
          { key: "act", label: "", width: 132 },
        ]}
        rows={rows.map(p => {
          const cm = CLAIM_META[p.claimStatus];
          return {
            posting: (
              <div className="min-w-0">
                <div className="font-bold text-ink truncate">{p.title}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-caption text-muted-foreground truncate">{p.brand}</span>
                  {p.postedBy === "operator" ? (
                    <Badge tone="brand" noIcon className="h-[18px] px-1.5 text-[10px]">
                      더블엠 대행
                    </Badge>
                  ) : (
                    <Badge tone="neutral" noIcon className="h-[18px] px-1.5 text-[10px]">
                      주관사 직접
                    </Badge>
                  )}
                </div>
              </div>
            ),
            organizer: (
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-ink-2 truncate">{p.organizer}</div>
                <div className="text-caption text-muted-foreground tabular">
                  {p.contact}
                </div>
              </div>
            ),
            period: (
              <div className="min-w-0">
                <div className="tabular text-[13px] text-ink-3">{p.period}</div>
                <div className="mt-0.5">
                  <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                </div>
              </div>
            ),
            recruit: (
              <span>
                <b className="text-[14px] text-ink">{p.filled}</b>
                <span className="text-caption text-muted-foreground">/{p.headcount}명</span>
              </span>
            ),
            claim: <Badge tone={cm.tone} icon={cm.icon}>{cm.label}</Badge>,
            act:
              p.claimStatus === "claimed" ? (
                <span className="text-caption text-muted-foreground">소유권 이전됨</span>
              ) : (
                <Button
                  size="sm"
                  variant={p.claimStatus === "unclaimed" ? "soft" : "outline"}
                  icon={p.claimStatus === "unclaimed" ? "UserPlus" : "RotateCw"}
                  loading={invite.isPending && invite.variables === p.id}
                  onClick={() => invite.mutate(p.id)}
                >
                  {p.claimStatus === "unclaimed" ? "주관사 초대" : "초대 재발송"}
                </Button>
              ),
          };
        })}
      />
    );

  return (
    <AdminShell active="postings" onNavigate={onNavigate}>
      <PageHeader
        crumb={["운영", "공고 등록"]}
        title="대행 등록 공고"
        meta={
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="brand" icon="Megaphone">
              대행 등록 {operatorCount}건
            </Badge>
            <Badge tone="warning" icon="UserPlus">
              미claim {unclaimed}건
            </Badge>
          </div>
        }
        actions={
          <Button size="sm" icon="Plus" onClick={() => setOpen(true)}>
            새 공고 등록
          </Button>
        }
      />

      <KpiRow
        state={state}
        items={[
          { label: "전체 공고", value: rows.length, unit: "건", icon: "Megaphone", sub: "등록 공고 합계" },
          {
            label: "대행 등록",
            value: operatorCount,
            unit: "건",
            tone: "brand",
            icon: "Handshake",
            sub: "더블엠이 대신 등록",
          },
          {
            label: "미claim",
            value: unclaimed,
            unit: "건",
            tone: "warning",
            icon: "UserPlus",
            sub: "주관사 합류 대기",
          },
          {
            label: "초대 발송",
            value: invited,
            unit: "건",
            tone: "info",
            icon: "Send",
            sub: "합류 응답 대기",
          },
        ]}
      />

      <Note tone="brand" icon="ShieldCheck" title="동의 기반 대행 등록" className="mb-4">
        주관사 동의를 받은 공고만 대행 등록할 수 있어요. 계약·정산 주체는 주관사이며, Popup OS는
        도구를 제공합니다. 주관사가 합류(claim)하면 소유권이 이전되고 워커에게{" "}
        <b className="text-brand-700">확인된 주관사</b>로 표시됩니다.
      </Note>

      <Card className="overflow-hidden">
        <CardHeader
          title="등록 공고"
          hint={rows.length ? `${rows.length}건` : undefined}
          action={
            <Button variant="soft" size="sm" icon="Plus" onClick={() => setOpen(true)}>
              새 공고 등록
            </Button>
          }
        />
        {table}
      </Card>

      <NewPostingDrawer open={open} onOpenChange={setOpen} />
    </AdminShell>
  );
}
