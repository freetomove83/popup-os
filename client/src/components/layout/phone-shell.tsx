import * as React from "react";

import { Mark } from "@/components/brand";
import { Icon } from "@/components/icon";

// 가짜 상태바(9:41)는 데모 기기 프레임 안에서만 보인다.
const InPhoneFrame = React.createContext(false);

export function PhoneShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const framed = React.useContext(InPhoneFrame);
  return (
    <div className="bg-surface flex flex-col overflow-hidden w-full h-full">
      <div className={framed ? "flex justify-between items-center px-6 h-[44px] text-[13px] font-bold text-ink-2 tabular shrink-0" : "hidden"}>
        <span>9:41</span>
        <span className="flex items-center gap-1.5 text-ink-2">
          <Icon name="Signal" size={15} />
          <Icon name="Wifi" size={15} />
          <Icon name="BatteryFull" size={18} />
        </span>
      </div>
      <header className={framed ? "px-5 pt-1 pb-3.5 border-b border-line shrink-0" : "px-5 pt-3 pb-3.5 border-b border-line shrink-0"}>
        <div className="flex items-center gap-1.5">
          <Mark size={18} variant="b" />
          <span className="text-[11.5px] font-bold text-muted-foreground tracking-[0.04em]">
            {eyebrow}
          </span>
        </div>
        <h1 className="text-[20px] font-extrabold tracking-[-0.015em] text-ink mt-1.5">
          {title}
        </h1>
      </header>
      <div className="flex-1 overflow-auto px-5 py-4">{children}</div>
      {footer && (
        <footer className="px-5 pt-3 pb-7 border-t border-line bg-surface shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
}

/** 스태프 데모 페이지에서 쓰는 기기 프레임. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ink rounded-[42px] p-[11px] shadow-overlay border border-[#262C40]">
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[24px] bg-ink rounded-b-[16px] z-[5]" />
        <div className="w-[390px] h-[844px] rounded-[33px] overflow-hidden bg-surface">
          <InPhoneFrame.Provider value>{children}</InPhoneFrame.Provider>
        </div>
      </div>
    </div>
  );
}
