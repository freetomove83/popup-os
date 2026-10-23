import * as React from "react";
import { toast } from "sonner";
import { Link } from "wouter";

import { EmptyState, ErrorState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { PhoneShell } from "@/components/layout/phone-shell";
import { CheckRow, DocBox, StaffSkeleton } from "@/components/staff/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContractDoc } from "@/data/worker-app";
import { useScreenState } from "@/hooks/useScreenState";
import { api, session, useAction, useApi, won } from "@/lib/api";

export function LoginNeeded({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <PhoneShell eyebrow={eyebrow} title={title}>
      <EmptyState
        icon="LogIn"
        title="로그인이 필요해요"
        desc="휴대폰 인증 후 내 계약·출근·정산을 확인할 수 있어요."
        action={
          <Link
            href={`/worker/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            className="text-[13px] font-bold text-brand-600 hover:underline"
          >
            로그인하기
          </Link>
        }
        className="pt-24"
      />
    </PhoneShell>
  );
}

export function StaffContractScreen() {
  const authed = !!session.get("worker");
  const id = new URLSearchParams(window.location.search).get("id");
  const q = useApi<{ contract: ContractDoc | null }>(authed ? `/worker/contract${id ? `?id=${id}` : ""}` : null);
  const c = q.data?.contract;
  const state = useScreenState(q, !c);
  const [signature, setSignature] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const sign = useAction(
    () => api(`/worker/contracts/${c!.id}/sign`, { body: { signature: signature.trim(), agreed } }),
    () => toast.success("계약이 확정됐어요", { description: "근무 당일 현장 매니저 QR로 출근 체크인하세요." }),
  );

  const eb = "POPUP OS · 전자계약";
  const tt = "표준근로계약서 서명";
  if (!authed) return <LoginNeeded eyebrow={eb} title={tt} />;

  if (state === "loading")
    return (
      <PhoneShell
        eyebrow={eb}
        title={tt}
        footer={
          <Button size="xl" block loading>
            계약서 불러오는 중
          </Button>
        }
      >
        <StaffSkeleton />
      </PhoneShell>
    );

  if (state === "error")
    return (
      <PhoneShell
        eyebrow={eb}
        title={tt}
        footer={
          <Button size="xl" block variant="outline" icon="RotateCw" onClick={() => q.refetch()}>
            다시 시도
          </Button>
        }
      >
        <ErrorState
          title="계약서를 불러오지 못했어요"
          desc="잠시 후 다시 시도해 주세요."
          code="SIGN-409"
          action={<span />}
          className="pt-20"
        />
      </PhoneShell>
    );

  if (state === "empty" || !c)
    return (
      <PhoneShell eyebrow={eb} title={tt}>
        <EmptyState
          icon="FileCheck2"
          title="서명할 계약서가 없어요"
          desc="지원이 승인되고 계약서가 발송되면 지원 현황에서 서명할 수 있어요."
          action={
            <Link href="/worker/applications" className="text-[13px] font-bold text-brand-600 hover:underline">
              지원 현황 보기
            </Link>
          }
          className="pt-24"
        />
      </PhoneShell>
    );

  const signed = c.state === "signed";
  const expired = c.state === "expired";
  const rows: [React.ReactNode, React.ReactNode][] = [
    ["근로장소", c.venue],
    ["업무내용", c.role],
    ["소정근로일", c.period],
    ["근로시간", c.hours],
    ["임금", <span className="tabular">시급 {won(c.pay)}원 · 일급 {won(c.dailyPay)}원</span>],
    ["임금 지급일", c.payday],
  ];

  return (
    <PhoneShell
      eyebrow={eb}
      title={tt}
      footer={
        signed ? (
          <Link href="/worker/applications" className="block">
            <Button size="xl" block variant="outline" icon="ClipboardList">
              지원 현황으로
            </Button>
          </Link>
        ) : (
          <Button
            size="xl"
            block
            icon="PenLine"
            disabled={expired || !agreed || signature.trim().length < 2}
            loading={sign.isPending}
            onClick={() => sign.mutate()}
          >
            {expired ? "서명 기한 만료" : "서명 완료하고 계약 확정"}
          </Button>
        )
      }
    >
      <div className="space-y-3">
        <div
          className="flex gap-3 items-start rounded-[14px] p-3.5"
          style={{ background: "#FEE500", color: "#3C1E1E" }}
        >
          <span
            className="grid place-items-center w-7 h-7 rounded-lg shrink-0"
            style={{ background: "#3C1E1E", color: "#FEE500" }}
          >
            <Icon name="MessageCircle" size={15} strokeWidth={2.6} />
          </span>
          <div className="text-[13px] font-bold leading-snug">
            {c.workerName}님, {c.brand} 근로계약서가 도착했어요.
            {c.state === "expiring" && " 곧 서명 기한이 끝나요."}
          </div>
        </div>

        <DocBox title="근로계약 요약 (필수 기재사항)" rows={rows} />

        {signed ? (
          <div className="flex items-center gap-2.5 min-h-11 px-3.5 py-2 rounded-lg bg-success-50 border border-success-200">
            <Icon name="BadgeCheck" size={18} className="text-success-700" />
            <span className="text-[13px] font-bold text-success-700">서명 완료</span>
            <span className="text-[12.5px] text-ink-3 tabular">
              {c.signature} · {c.signedAt}
            </span>
          </div>
        ) : (
          <>
            <div className="rounded-[14px] border-[1.5px] border-dashed border-brand-100 bg-brand-50/50 p-3.5">
              <span className="block text-[12px] font-semibold text-ink-2 mb-1.5">서명 (이름 입력)</span>
              <Input
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder={c.workerName}
                disabled={expired}
                style={{ fontFamily: '"Segoe Script","Brush Script MT",cursive' }}
              />
            </div>
            <div className="-my-2">
              <CheckRow checked={agreed} onCheckedChange={setAgreed}>
                계약 내용을 확인했으며 이에 동의합니다.
              </CheckRow>
            </div>
          </>
        )}
      </div>
    </PhoneShell>
  );
}
