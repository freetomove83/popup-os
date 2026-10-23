import { EmptyState, ErrorState } from "@/components/feedback";
import { Icon } from "@/components/icon";
import { PhoneShell } from "@/components/layout/phone-shell";
import { CheckRow, DocBox, StaffSkeleton } from "@/components/staff/parts";
import { Button } from "@/components/ui/button";
import { useScreenState } from "@/hooks/useScreenState";

export function StaffContractScreen() {
  const state = useScreenState();

  const rows: [React.ReactNode, React.ReactNode][] = [
    ["근로장소", "더현대 서울 5F 이벤트홀"],
    ["업무내용", "운영 스태프(프로모터)"],
    ["소정근로일", "2026.10.05 ~ 10.07 (3일)"],
    ["근로시간", "10:00~19:00 (휴게 1h)"],
    ["임금", <span className="tabular">시급 12,000원 · 일급 96,000원</span>],
    ["임금 지급일", "근로종료 후 7일 이내"],
  ];

  if (state === "loading")
    return (
      <PhoneShell
        eyebrow="POPUP OS · 전자계약"
        title="표준근로계약서 서명"
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
        eyebrow="POPUP OS · 전자계약"
        title="표준근로계약서 서명"
        footer={
          <Button size="xl" block variant="outline" icon="RotateCw">
            다시 시도
          </Button>
        }
      >
        <ErrorState
          title="서명을 저장하지 못했어요"
          desc="서명은 기기에 임시 보관돼 있어요. 연결이 복구되면 다시 시도해 주세요. (Signature not saved — please retry.)"
          code="SIGN-409"
          action={<span />}
          className="pt-20"
        />
      </PhoneShell>
    );

  if (state === "empty")
    return (
      <PhoneShell eyebrow="POPUP OS · 전자계약" title="표준근로계약서 서명">
        <EmptyState
          icon="FileCheck2"
          title="서명할 계약서가 없어요"
          desc="새 계약서가 도착하면 카카오 알림톡으로 알려드려요. (No contracts to sign.)"
          className="pt-24"
        />
      </PhoneShell>
    );

  return (
    <PhoneShell
      eyebrow="POPUP OS · 전자계약"
      title="표준근로계약서 서명"
      footer={
        <Button size="xl" block icon="PenLine">
          서명 완료하고 계약 확정
        </Button>
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
            김지은님, 10/05 더현대 팝업 근로계약서가 도착했어요. 1분 내 서명해 주세요.
          </div>
        </div>

        <DocBox title="근로계약 요약 (필수 기재사항)" rows={rows} />

        <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-lg bg-success-50 border border-success-200">
          <Icon name="BadgeCheck" size={18} className="text-success-700" />
          <span className="text-[13px] font-bold text-success-700">본인확인 완료</span>
          <span className="text-[12.5px] text-ink-3">PASS · 1996년생 김지은</span>
        </div>

        <div className="relative h-[92px] rounded-[14px] border-[1.5px] border-dashed border-brand-100 bg-brand-50/50 grid place-items-center">
          <span
            className="text-[28px] text-brand-700"
            style={{
              fontFamily: '"Segoe Script","Brush Script MT",cursive',
              transform: "rotate(-6deg)",
            }}
          >
            Kim Jieun
          </span>
          <span className="absolute bottom-2 right-3 text-[11.5px] font-semibold text-muted-foreground">
            여기에 서명
          </span>
          <button
            type="button"
            className="absolute top-2 right-2 h-8 px-2.5 rounded-md text-[12px] font-bold text-ink-3 hover:bg-surface-3 inline-flex items-center gap-1"
          >
            <Icon name="Eraser" size={13} />
            지우기
          </button>
        </div>

        <div className="-my-2">
          <CheckRow>계약 내용을 확인했으며 이에 동의합니다.</CheckRow>
        </div>
      </div>
    </PhoneShell>
  );
}
