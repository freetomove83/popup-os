import { Link } from "wouter";

import { Mark, Wordmark } from "@/components/brand";
import { PhoneFrame } from "@/components/layout/phone-shell";
import { StaffCheckinScreen } from "@/pages/staff/checkin";
import { StaffContractScreen } from "@/pages/staff/contract";
import { StaffSettleScreen } from "@/pages/staff/settle";

export default function StaffDemo() {
  return (
    <div className="min-h-dvh bg-background px-6 py-8">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Mark size={32} />
            <Wordmark size={18} />
            <span className="text-caption font-bold text-muted-foreground tracking-[0.04em]">
              스태프 앱 (PWA · 알림톡 진입)
            </span>
          </div>
          <Link
            href="/admin"
            className="text-[13px] font-bold text-brand-600 hover:underline"
          >
            관리자 콘솔 →
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <PhoneFrame>
            <StaffContractScreen />
          </PhoneFrame>
          <PhoneFrame>
            <StaffCheckinScreen />
          </PhoneFrame>
          <PhoneFrame>
            <StaffSettleScreen />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
