import { cn } from "@/lib/utils";

/** 마크 B · 팝 도트 (확정안) */
export function Mark({
  variant = "b",
  size = 32,
  ring = "ring-white",
  className,
}: {
  variant?: "b" | "c";
  size?: number;
  ring?: string;
  className?: string;
}) {
  const r = Math.round(size * 0.3);
  const fs = Math.round(size * 0.54);
  const base =
    "relative inline-grid place-items-center bg-brand text-white font-extrabold select-none shrink-0";
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: r,
    fontSize: fs,
    letterSpacing: "-0.04em",
    lineHeight: 1,
  };
  if (variant === "c") {
    return (
      <span
        className={cn(base, className)}
        style={{ ...style, borderBottomLeftRadius: Math.max(2, Math.round(size * 0.06)) }}
      >
        <span style={{ transform: "translate(3%, -2%)" }}>P</span>
      </span>
    );
  }
  return (
    <span className={cn(base, className)} style={style}>
      <span style={{ transform: "translateX(-3%)" }}>P</span>
      <span
        className={cn("absolute rounded-full bg-pop ring-2", ring)}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: -size * 0.07,
          right: -size * 0.07,
        }}
      />
    </span>
  );
}

export function Wordmark({
  size = 20,
  dark = false,
  className,
}: {
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-extrabold whitespace-nowrap",
        dark ? "text-white" : "text-ink",
        className,
      )}
      style={{ fontSize: size, letterSpacing: "-0.02em", lineHeight: 1 }}
    >
      Popup <span className={dark ? "text-brand-100" : "text-brand"}>OS</span>
    </span>
  );
}
