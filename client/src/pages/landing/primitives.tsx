import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import type { Lines as LinesT } from "./copy";

/** public/landing/* — dev `/landing/x.png`, build `/build/landing/x.png` */
export function asset(name: string) {
  return `${import.meta.env.BASE_URL}landing/${name}`;
}

/** 명시적 줄바꿈 렌더 */
export function Lines({ lines }: { lines: LinesT }) {
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i}>
          {ln}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

/* ─────────────── Brand ─────────────── */

export function Logo({ dark = false, size = 32 }: { dark?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div
        className="relative grid place-items-center font-extrabold text-white"
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: "var(--brand)",
          fontSize: size * 0.5,
        }}
      >
        P
        <span
          className="absolute rounded-full"
          style={{
            top: -2,
            right: -2,
            width: size * 0.3,
            height: size * 0.3,
            background: "var(--pop)",
            boxShadow: `0 0 0 2px ${dark ? "var(--sidebar)" : "var(--surface)"}`,
          }}
        />
      </div>
      <span
        className="font-extrabold tracking-[-0.02em]"
        style={{ fontSize: size * 0.56, color: dark ? "#fff" : "var(--ink)" }}
      >
        Popup OS
      </span>
    </div>
  );
}

/* ─────────────── Button ─────────────── */

type BtnKind = "primary" | "secondary" | "ghostDark" | "light";
type BtnSize = "lg" | "md" | "sm";

const BTN_SIZES: Record<BtnSize, string> = {
  lg: "h-[52px] px-[22px] text-[16px] lg:h-14 lg:px-[26px] lg:text-[17px]",
  md: "h-11 px-[18px] text-[15px]",
  sm: "h-[38px] px-[14px] text-[14px]",
};
const BTN_KINDS: Record<BtnKind, string> = {
  primary:
    "bg-brand text-white border border-brand shadow-brand hover:bg-brand-600",
  secondary:
    "bg-surface text-ink border border-line-2 hover:bg-surface-2",
  ghostDark:
    "bg-transparent text-white border border-white/25 hover:bg-white/10",
  light: "bg-white text-ink border border-white hover:bg-white/90",
};

export function Btn({
  children,
  kind = "primary",
  size = "lg",
  icon,
  full,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  kind?: BtnKind;
  size?: BtnSize;
  icon?: string;
  full?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[12px] font-bold tracking-[-0.01em] whitespace-nowrap transition-colors",
    BTN_SIZES[size],
    BTN_KINDS[kind],
    full && "w-full",
    className,
  );
  const inner = (
    <>
      {children}
      {icon ? <Icon name={icon} size={size === "lg" ? 18 : 16} /> : null}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

/* ─────────────── Chip ─────────────── */

type ChipTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "neutral"
  | "pop";

const CHIP_TONES: Record<ChipTone, string> = {
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-info-50 text-info-700",
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-surface-3 text-ink-3",
  pop: "bg-pop-50 text-pop-700",
};

export function Chip({
  tone = "brand",
  icon,
  children,
  big,
  className,
}: {
  tone?: ChipTone;
  icon?: string;
  children: ReactNode;
  big?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] rounded-[7px] font-bold leading-[1.2] whitespace-nowrap",
        big ? "px-3 py-1.5 text-[14px]" : "px-2 py-[3px] text-[11.5px]",
        CHIP_TONES[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={big ? 15 : 12} strokeWidth={2.4} /> : null}
      {children}
    </span>
  );
}

/* ─────────────── Mockup frames ─────────────── */

export const SHOTS = {
  dashboard: { src: "admin-dashboard.png", w: 1024, h: 640 },
  postings: { src: "admin-postings.png", w: 1024, h: 996 },
  checkin: { src: "checkin-qr.png", w: 500, h: 900 },
  profile: { src: "worker-profile.png", w: 151, h: 1007 },
} as const;
export type ShotKey = keyof typeof SHOTS;

const FRAME_SHADOW =
  "0 2px 4px rgba(16,24,40,.04), 0 32px 64px -12px rgba(16,24,40,.18)";

export function ConsoleFrame({
  shot = "dashboard",
  width = 860,
  className,
  style,
}: {
  shot?: ShotKey;
  width?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const s = SHOTS[shot];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[22px] border border-line bg-surface",
        className,
      )}
      style={{ width: "100%", maxWidth: width, boxShadow: FRAME_SHADOW, ...style }}
    >
      <div className="flex h-9 items-center gap-[7px] border-b border-line bg-surface-2 px-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-line-2" />
        ))}
        <span className="ml-3 text-[12px] font-semibold text-subtle">
          Popup OS · 관리자 콘솔
        </span>
      </div>
      <img
        src={asset(s.src)}
        alt=""
        className="block w-full"
        style={{ aspectRatio: `${s.w} / ${s.h}` }}
      />
    </div>
  );
}

export function Phone({
  width = 260,
  shot,
  children,
  className,
  style,
}: {
  width?: number;
  shot?: ShotKey;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("bg-ink p-2", className)}
      style={{
        width: "100%",
        maxWidth: width,
        borderRadius: 44,
        boxShadow:
          "0 2px 4px rgba(16,24,40,.06), 0 40px 70px -16px rgba(16,24,40,.35)",
        ...style,
      }}
    >
      <div
        className="relative overflow-hidden bg-surface"
        style={{ borderRadius: 36, aspectRatio: "500 / 900" }}
      >
        {shot ? (
          <img src={asset(SHOTS[shot].src)} alt="" className="block w-full" />
        ) : (
          children
        )}
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-ink"
          style={{ width: "30%", height: 22 }}
        />
      </div>
    </div>
  );
}

/** 원본 스크린샷의 (x,y,w,h) 영역을 잘라 쓴다. 컨테이너 폭에 맞춰 반응형으로 스케일. */
export function Crop({
  shot,
  x,
  y,
  w,
  h,
  scale = 1,
  radius = 16,
  className,
  style,
}: {
  shot: ShotKey;
  x: number;
  y: number;
  w: number;
  h: number;
  scale?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const s = SHOTS[shot];
  return (
    <div
      className={cn("relative overflow-hidden bg-surface", className)}
      style={{
        width: "100%",
        maxWidth: w * scale,
        aspectRatio: `${w} / ${h}`,
        borderRadius: radius,
        ...style,
      }}
    >
      <img
        src={asset(s.src)}
        alt=""
        className="absolute max-w-none"
        style={{
          width: `${(s.w / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </div>
  );
}

export function FloatCard({
  icon,
  tone = "brand",
  t,
  s,
  className,
  style,
}: {
  icon: string;
  tone?: "success" | "brand" | "warning";
  t: string;
  s: string;
  className?: string;
  style?: CSSProperties;
}) {
  const tones = {
    success: ["bg-success-50", "text-success-700"],
    brand: ["bg-brand-50", "text-brand-700"],
    warning: ["bg-warning-50", "text-warning-700"],
  }[tone];
  return (
    <div
      className={cn(
        "absolute flex items-center gap-3 rounded-[16px] border border-line bg-surface py-3 pr-4 pl-3",
        className,
      )}
      style={{
        boxShadow:
          "0 2px 4px rgba(16,24,40,.06), 0 18px 40px -8px rgba(16,24,40,.18)",
        ...style,
      }}
    >
      <div
        className={cn(
          "grid h-10 w-10 place-items-center rounded-[10px]",
          tones[0],
          tones[1],
        )}
      >
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className="text-[14px] font-bold text-ink">{t}</div>
        <div className="tabular mt-0.5 text-[12px] text-muted-foreground">
          {s}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Worker 검카드 (HTML rebuild) ─────────────── */

export function WorkerCard({ compact }: { compact?: boolean }) {
  const tl = [
    {
      tone: "brand" as const,
      tag: "Popup OS 검증",
      t: "MOMENT POPUP 팝업",
      d: "2026.10.05 – 10.07 · 운영",
    },
    {
      tone: "brand" as const,
      tag: "Popup OS 검증",
      t: "뷰티 체험 부스 운영",
      d: "2026.09.12 – 09.15 · 판매",
    },
    {
      tone: "neutral" as const,
      tag: "직접 추가",
      t: "타 주관 브랜드 팝업",
      d: "2026.08 · 응대",
    },
  ];
  return (
    <div
      className="flex flex-col gap-3 text-[13px]"
      style={{ padding: compact ? 16 : 18 }}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-brand-100 text-[18px] font-extrabold text-brand-700">
          김
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <b className="text-[17px] text-ink">김지은</b>
            <Chip tone="success" icon="ShieldCheck">
              본인인증 완료
            </Chip>
          </div>
          <span className="text-[12px] text-muted-foreground">
            판매·응대 · 서울 성동
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ["출근율", "OO%"],
          ["근무", "OO회"],
          ["지각", "O%"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-[10px] border border-line bg-surface-2 px-2.5 py-2"
          >
            <div className="text-[11px] font-semibold text-muted-foreground">
              {k}
            </div>
            <div className="tabular text-[17px] font-extrabold text-ink">
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Icon name="Info" size={12} /> 계약·출퇴근 로그 기반 · 표본 OO건
      </div>
      <div className="mt-0.5 text-[11px] font-bold tracking-[.06em] text-ink-3">
        커리어 타임라인
      </div>
      <div className="flex flex-col gap-2">
        {tl.map((r, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-line bg-surface px-2.5 py-[9px]"
          >
            <Chip
              tone={r.tone}
              icon={r.tone === "brand" ? "BadgeCheck" : "Pencil"}
            >
              {r.tag}
            </Chip>
            <div className="mt-1.5 font-bold text-ink">{r.t}</div>
            <div className="tabular mt-0.5 text-[11px] text-muted-foreground">
              {r.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileScreen() {
  return (
    <div className="h-full bg-background">
      <div className="flex items-center justify-between border-b border-line bg-surface px-[18px] pt-10 pb-3">
        <b className="text-[17px] text-ink">내 검카드</b>
        <Chip tone="brand" icon="Share2">
          공유
        </Chip>
      </div>
      <div className="m-3 rounded-[16px] border border-line bg-surface">
        <WorkerCard compact />
      </div>
    </div>
  );
}

/* ─────────────── Section scaffolding ─────────────── */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px]", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  innerClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-[72px] sm:px-8 lg:px-16 lg:py-32 xl:px-[120px]",
        className,
      )}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({
  children,
  dark,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn("t-eyebrow", dark ? "text-brand-100" : "text-brand-600")}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  h2,
  sub,
  dark,
  center,
}: {
  eyebrow?: string;
  h2: LinesT;
  sub?: LinesT;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[18px]",
        center ? "items-center text-center" : "items-start text-left",
      )}
    >
      {eyebrow ? <Eyebrow dark={dark}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("t-h1", dark ? "text-white" : "text-ink")}>
        <Lines lines={h2} />
      </h2>
      {sub ? (
        <p
          className={cn(
            "t-body-lg",
            dark ? "text-sidebar-foreground" : "text-muted-foreground",
          )}
        >
          <Lines lines={sub} />
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────── Reveal (fade-up 1회) ─────────────── */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("lp-fade", inView && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
