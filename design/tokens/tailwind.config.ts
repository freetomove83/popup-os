// Popup OS — tailwind.config.ts (Tailwind v3 · shadcn/ui)
// 토큰 확정본 v1. 값의 원본은 globals.css의 CSS 변수 — 여기서는 참조만 한다.
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./resources/**/*.{ts,tsx,blade.php}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "24px", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: { DEFAULT: "hsl(var(--card) / <alpha-value>)", foreground: "hsl(var(--card-foreground) / <alpha-value>)" },
        popover: { DEFAULT: "hsl(var(--popover) / <alpha-value>)", foreground: "hsl(var(--popover-foreground) / <alpha-value>)" },
        primary: { DEFAULT: "hsl(var(--primary) / <alpha-value>)", foreground: "hsl(var(--primary-foreground) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--secondary) / <alpha-value>)", foreground: "hsl(var(--secondary-foreground) / <alpha-value>)" },
        muted: { DEFAULT: "hsl(var(--muted) / <alpha-value>)", foreground: "hsl(var(--muted-foreground) / <alpha-value>)" },
        accent: { DEFAULT: "hsl(var(--accent) / <alpha-value>)", foreground: "hsl(var(--accent-foreground) / <alpha-value>)" },
        destructive: { DEFAULT: "hsl(var(--destructive) / <alpha-value>)", foreground: "hsl(var(--destructive-foreground) / <alpha-value>)" },

        brand: { DEFAULT: "hsl(var(--brand) / <alpha-value>)", 50: "hsl(var(--brand-50) / <alpha-value>)", 100: "hsl(var(--brand-100) / <alpha-value>)", 600: "hsl(var(--brand-600) / <alpha-value>)", 700: "hsl(var(--brand-700) / <alpha-value>)" },
        pop: { DEFAULT: "hsl(var(--pop) / <alpha-value>)", 50: "hsl(var(--pop-50) / <alpha-value>)", 700: "hsl(var(--pop-700) / <alpha-value>)" },
        ink: { DEFAULT: "hsl(var(--ink) / <alpha-value>)", 2: "hsl(var(--ink-2) / <alpha-value>)", 3: "hsl(var(--ink-3) / <alpha-value>)" },
        subtle: "hsl(var(--subtle) / <alpha-value>)",
        surface: { DEFAULT: "hsl(var(--surface) / <alpha-value>)", 2: "hsl(var(--surface-2) / <alpha-value>)", 3: "hsl(var(--surface-3) / <alpha-value>)" },
        line: { DEFAULT: "hsl(var(--line) / <alpha-value>)", 2: "hsl(var(--line-2) / <alpha-value>)" },

        success: { DEFAULT: "hsl(var(--success) / <alpha-value>)", 50: "hsl(var(--success-50) / <alpha-value>)", 200: "hsl(var(--success-200) / <alpha-value>)", 700: "hsl(var(--success-700) / <alpha-value>)" },
        warning: { DEFAULT: "hsl(var(--warning) / <alpha-value>)", 50: "hsl(var(--warning-50) / <alpha-value>)", 200: "hsl(var(--warning-200) / <alpha-value>)", 700: "hsl(var(--warning-700) / <alpha-value>)" },
        danger:  { DEFAULT: "hsl(var(--danger) / <alpha-value>)", 50: "hsl(var(--danger-50) / <alpha-value>)", 200: "hsl(var(--danger-200) / <alpha-value>)", 700: "hsl(var(--danger-700) / <alpha-value>)" },
        info:    { DEFAULT: "hsl(var(--info) / <alpha-value>)", 50: "hsl(var(--info-50) / <alpha-value>)", 200: "hsl(var(--info-200) / <alpha-value>)", 700: "hsl(var(--info-700) / <alpha-value>)" },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          muted: "hsl(var(--sidebar-muted) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", '"Apple SD Gothic Neo"', '"Malgun Gothic"', "sans-serif"],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight }]
        display: ["38px", { lineHeight: "1.16", letterSpacing: "-0.02em", fontWeight: "800" }],
        h1: ["28px", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["20px", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "800" }],
        h3: ["15px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "700" }],
        kpi: ["26px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-lg": ["15px", { lineHeight: "1.55" }],   // 스태프 앱 본문
        body: ["13.5px", { lineHeight: "1.55" }],      // 관리자 본문
        "body-sm": ["12.5px", { lineHeight: "1.5" }],
        caption: ["11.5px", { lineHeight: "1.45" }],
        label: ["11px", { lineHeight: "1.3", letterSpacing: "0.06em", fontWeight: "700" }], // 대문자 라벨
      },
      borderRadius: {
        shell: "var(--radius-shell)",   // 22
        card: "var(--radius-card)",     // 16
        xl: "var(--radius-card)",       // shadcn Card 기본(rounded-xl) = 16
        lg: "var(--radius)",            // 10 — Button/Input (shadcn rounded-lg)
        md: "calc(var(--radius) - 2px)",// 8  — Button sm
        chip: "var(--radius-chip)",     // 7  — Badge
        sm: "calc(var(--radius) - 4px)",// 6  — Tag
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.05), 0 10px 28px rgba(16,24,40,.06)",
        "soft-hover": "0 1px 2px rgba(16,24,40,.06), 0 12px 32px rgba(16,24,40,.10)",
        brand: "0 6px 16px -4px hsl(var(--brand) / .45)",
        overlay: "0 30px 70px rgba(16,24,40,.18)",
      },
      screens: { mobile: "620px" }, // lg=1024 · xl=1280 · 2xl=1440 은 Tailwind 기본과 동일
      keyframes: {
        "dot-pulse": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--success) / .5)" },
          "70%": { boxShadow: "0 0 0 7px hsl(var(--success) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--success) / 0)" },
        },
      },
      animation: { "dot-pulse": "dot-pulse 1.8s infinite" },
    },
  },
  plugins: [animate],
} satisfies Config;
