import { cn } from "@/lib/utils";

export type AvatarTone = "brand" | "pop" | "info" | "danger" | "neutral" | "dark";

const AVATAR_TONE: Record<AvatarTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  pop: "bg-pop-50 text-pop-700",
  info: "bg-info-50 text-info-700",
  danger: "bg-danger-50 text-danger-700",
  neutral: "bg-surface-3 text-ink-3",
  dark: "bg-[#2A2F47] text-[#C9CFE0]",
};

export function Avatar({
  initials,
  size = 32,
  tone = "brand",
  round,
  className,
}: {
  initials: string;
  size?: number;
  tone?: AvatarTone;
  round?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center font-extrabold shrink-0",
        AVATAR_TONE[tone],
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: round ? 999 : Math.round(size * 0.27),
        fontSize: Math.round(size * 0.34),
      }}
    >
      {initials}
    </span>
  );
}
