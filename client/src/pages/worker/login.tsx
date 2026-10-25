import * as React from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

import { Mark, Wordmark } from "@/components/brand";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, session } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function WorkerLogin() {
  const [, navigate] = useLocation();
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const [busy, setBusy] = React.useState(false);
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const next = new URLSearchParams(window.location.search).get("next");

  const sendOtp = async () => {
    setBusy(true);
    try {
      const r = await api<{ debugCode?: string }>("/worker/otp", { body: { phone } });
      setStep("otp");
      // 개발 환경에서만 서버가 코드를 돌려준다(SMS 미연동).
      if (r.debugCode) toast("개발용 인증번호", { description: r.debugCode, duration: 15000 });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    try {
      const r = await api<{ token: string; onboarding: boolean }>("/worker/verify", {
        body: { phone, code: otp },
      });
      session.set("worker", { token: r.token });
      navigate(r.onboarding ? "/worker/profile?onboarding=1" : next || "/worker");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface md:bg-background flex justify-center md:items-center md:py-10">
      <div className="w-full max-w-[460px] bg-surface flex flex-col h-dvh md:h-auto md:rounded-[20px] md:shadow-soft md:border md:border-line overflow-hidden">
        <div className="flex-1 overflow-auto px-6 pt-14 md:px-9 md:pt-10 md:pb-9">
          <div className="flex items-center gap-2.5 mb-8">
            <Mark size={40} />
            <Wordmark size={22} />
          </div>
          <h1 className="text-h1 text-ink">
            {step === "phone" ? "휴대폰으로 시작하기" : "인증번호 입력"}
          </h1>
          <p className="text-body text-muted-foreground mt-2">
            {step === "phone"
              ? "가입/로그인 후 공고에 지원하고 검카드를 만들 수 있어요."
              : `${phone} 로 인증번호를 보냈어요.`}
          </p>

          <div className="mt-8 space-y-4">
            {step === "phone" ? (
              <>
                <Input
                  icon="Phone"
                  inputMode="numeric"
                  placeholder="휴대폰 번호 (숫자만)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <label className="flex items-start gap-2.5 text-[12.5px] text-ink-3 cursor-pointer">
                  <button
                    type="button"
                    aria-pressed={agree}
                    onClick={() => setAgree(v => !v)}
                    className={cn(
                      "grid place-items-center w-[18px] h-[18px] rounded-[5px] border shrink-0 mt-[1px]",
                      agree ? "bg-brand border-brand text-white" : "bg-surface border-line-2",
                    )}
                  >
                    {agree && <Icon name="Check" size={12} strokeWidth={3.2} />}
                  </button>
                  <span>
                    [필수] 서비스 이용약관 및 <b className="text-ink-2">개인정보 수집·이용</b>에
                    동의합니다. (근로계약·정산 목적)
                  </span>
                </label>
                <Button
                  size="xl"
                  block
                  disabled={!phoneOk || !agree}
                  loading={busy}
                  onClick={sendOtp}
                >
                  인증번호 받기
                </Button>
              </>
            ) : (
              <>
                <Input
                  icon="ShieldCheck"
                  inputMode="numeric"
                  placeholder="6자리 인증번호"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <Button
                  size="xl"
                  block
                  disabled={otp.replace(/\D/g, "").length !== 6}
                  loading={busy}
                  onClick={verify}
                >
                  인증하고 시작하기
                </Button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full text-[12.5px] font-semibold text-brand-600"
                >
                  인증번호 다시 받기
                </button>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-full text-[12.5px] font-semibold text-muted-foreground"
                >
                  번호 다시 입력
                </button>
              </>
            )}
          </div>

          <div className="mt-8 rounded-[14px] bg-surface-2 border border-line p-3.5 text-[12px] text-muted-foreground leading-relaxed">
            가입하면 <b className="text-ink-2">검카드</b>를 만들어 공고에 지원할 수 있어요. 계약은
            지원 → 대행사 승인 후 체결됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
