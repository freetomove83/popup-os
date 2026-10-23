import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/**
 * 관리자(PC)용 가운데 모달. 네이티브 <dialog> 라 Esc 닫기·포커스 가둠·배경 레이어가 기본 제공된다.
 * 모바일 워커 앱은 계속 Drawer(바텀시트)를 쓴다.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  width = 560,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      // 배경(=dialog 자신) 클릭 시 닫기
      onMouseDown={e => e.target === e.currentTarget && onOpenChange(false)}
      style={{ width: `min(${width}px, calc(100vw - 32px))` }}
      className="m-auto p-0 rounded-[18px] border border-line bg-surface text-ink shadow-overlay max-h-[85dvh] backdrop:bg-ink/40"
    >
      <div className="flex flex-col max-h-[85dvh]">
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-line">
          <div className="min-w-0">
            <h2 className="text-[17px] font-extrabold text-ink">{title}</h2>
            {description && (
              <p className="text-[12.5px] text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="grid place-items-center w-8 h-8 -mr-2 rounded-md text-ink-3 hover:bg-surface-3 shrink-0"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className={cn("flex-1 overflow-y-auto overflow-x-hidden px-6 py-5", className)}>{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-line bg-surface-2/60">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
