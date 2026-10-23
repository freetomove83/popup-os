import { Link } from "wouter";

import { Mark, Wordmark } from "@/components/brand";
import { Icon } from "@/components/icon";

const CARDS = [
  {
    href: "/admin",
    icon: "LayoutDashboard",
    title: "관리자 콘솔",
    desc: "대시보드 · 프로젝트/포지션 · 지원자 스크리닝 · 전자계약 · 출퇴근 · 정산",
    badge: "데스크톱 1280 / 1024",
  },
  {
    href: "/worker",
    icon: "Smartphone",
    title: "스태프 앱 (마켓)",
    desc: "가입/로그인 · 공고 탐색 · 지원 · 검카드 · 계약/출근/정산",
    badge: "모바일 390 (PWA)",
  },
  {
    href: "/staff",
    icon: "Layers",
    title: "스태프 3화면 데모",
    desc: "계약 서명 · QR 출근 체크인 · 정산 내역 (Designer 시안)",
    badge: "레퍼런스",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[760px]">
        <div className="flex items-center gap-3 mb-3">
          <Mark size={44} />
          <div>
            <Wordmark size={26} />
            <div className="text-caption text-muted-foreground font-semibold mt-1">
              팝업스토어 운영 OS · MVP 목데이터 프로토타입
            </div>
          </div>
        </div>
        <p className="text-body text-muted-foreground mb-8 max-w-[560px]">
          구인 → 전자계약 → 출퇴근 → 정산을 한 곳에서. Designer 시안 v1(토큰·컴포넌트·9화면)을
          실제 스택(Vite + React 19 + TS + Tailwind v4 + shadcn/ui)으로 구현했습니다.
        </p>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(c => (
            <Link key={c.href} href={c.href}>
              <a className="block bg-card rounded-card border border-line shadow-soft p-5 transition-shadow hover:shadow-soft-hover hover:border-brand-100">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 mb-3">
                  <Icon name={c.icon} size={20} />
                </span>
                <div className="text-h3 text-ink flex items-center gap-1.5">
                  {c.title}
                  <Icon name="ArrowRight" size={15} className="text-subtle" />
                </div>
                <div className="text-body-sm text-muted-foreground mt-1">{c.desc}</div>
                <div className="mt-3">
                  <span className="inline-flex items-center h-6 px-2 rounded-chip bg-surface-3 text-ink-3 text-caption font-bold">
                    {c.badge}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>

        <p className="text-caption text-muted-foreground mt-6">
          화면 상태 확인: URL 에 <code className="tabular">?state=empty|loading|error</code>{" "}
          를 붙이면 빈/로딩/에러 분기를 볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}
