import { useState } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import { COPY, type Plan } from "./copy";
import {
  Btn,
  Chip,
  ConsoleFrame,
  Container,
  Crop,
  FloatCard,
  Lines,
  Logo,
  Phone,
  ProfileScreen,
  Reveal,
  Section,
  SectionHead,
  WorkerCard,
} from "./primitives";

/* ─────────────── §Nav ─────────────── */

const NAV_LINKS: [string, string][] = [
  ["기능", "#features"],
  ["스태프", "#staff"],
  ["대행 등록", "#proxy"],
  ["요금제", "#pricing"],
  ["FAQ", "#faq"],
];

export function Nav() {
  return (
    <div className="relative z-20">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[76px] lg:px-[120px]">
        <Logo size={30} />
        <div className="hidden items-center gap-9 text-[15px] font-semibold text-ink-3 lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a key={label} href={href} className="transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden px-3 text-[15px] font-semibold text-ink-3 lg:inline">
            로그인
          </span>
          <Btn size="md" href="#inquiry">
            도입 문의
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── §3.1 Hero ─────────────── */

const HERO_BG =
  "linear-gradient(180deg, var(--brand-50) 0%, var(--background) 72%)";

function HeroText({ mobile }: { mobile?: boolean }) {
  const h = COPY.hero;
  return (
    <div className={cn("flex flex-col gap-6", mobile ? "" : "gap-7")}>
      <div>
        <Chip tone="brand" big icon="Store">
          {h.eyebrow[0]}
        </Chip>
      </div>
      <h1 className="t-display text-ink">
        <Lines lines={h.h1} />
      </h1>
      <p className="t-body-lg text-muted-foreground">
        <Lines lines={h.sub} />
      </p>
      <div
        className={cn(
          mobile ? "flex flex-col gap-2.5" : "flex flex-wrap gap-3",
        )}
      >
        <Btn icon="ArrowRight" full={mobile} href="#inquiry">
          {h.ctaPrimary[0]}
        </Btn>
        <Btn kind="secondary" full={mobile} href="#inquiry">
          {h.ctaSecondary[0]}
        </Btn>
      </div>
      <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
        <Icon name="CreditCard" size={15} /> {h.aux[0]}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative h-[760px] w-[900px]">
      <ConsoleFrame
        shot="dashboard"
        width={900}
        className="absolute left-[70px] top-[30px]"
      />
      <Phone
        shot="checkin"
        width={252}
        className="absolute left-0 top-[250px]"
      />
      <FloatCard
        icon="CircleCheck"
        tone="success"
        t="출근 체크인 완료"
        s="매니저 QR · 09:52"
        className="left-[600px] top-[560px]"
      />
      <FloatCard
        icon="FilePenLine"
        tone="brand"
        t="전자계약 서명 12/12"
        s="알림톡 자동 발송"
        className="left-[290px] top-[640px]"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: HERO_BG }}
      data-screen-label="3.1 Hero"
    >
      <Nav />

      {/* 데스크톱(lg+) */}
      <div className="relative mx-auto hidden h-[804px] max-w-[1440px] lg:block">
        <div className="absolute left-[120px] top-[120px] z-10 w-[520px]">
          <HeroText />
        </div>
        <div className="absolute left-[700px] top-[150px]">
          <HeroVisual />
        </div>
      </div>

      {/* 모바일(< lg) */}
      <div className="px-5 pb-12 pt-2 sm:px-8 lg:hidden">
        <HeroText mobile />
        <div className="relative mt-10 h-[340px] overflow-hidden">
          <div className="absolute left-[74px] top-[14px] w-[520px]">
            <ConsoleFrame shot="dashboard" width={520} />
          </div>
          <div className="absolute left-0 top-0 w-[168px]">
            <Phone shot="checkin" width={168} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── §3.2 Trust ─────────────── */

export function TrustBar() {
  const c = COPY.trust;
  return (
    <section className="bg-background px-5 pt-[72px] pb-[88px] sm:px-8 lg:px-16 xl:px-[120px]">
      <Container>
      <div className="grid items-end gap-8 border-b border-line-2 pb-10 lg:grid-cols-[1fr_auto]">
        <p className="t-h3 text-ink">
          <Lines lines={c.lead} />
        </p>
        <div className="flex gap-10 lg:gap-16">
          {c.stats.map(([k, v]) => (
            <div key={k}>
              <div className="t-kpi tabular text-ink">{v}</div>
              <div className="mt-1.5 text-[15px] text-muted-foreground">
                {k}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="lp-ph h-14 rounded-[10px] whitespace-nowrap"
          >
            LOGO {i + 1}
          </div>
        ))}
      </div>
      </Container>
    </section>
  );
}

/* ─────────────── §3.3 Problem ─────────────── */

export function Problem() {
  const c = COPY.problem;
  return (
    <Section className="bg-surface">
      <SectionHead eyebrow="지금의 운영 방식" h2={c.h2} />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {c.cards.map((card) => (
          <Reveal key={card.k}>
            <div className="flex h-full flex-col gap-10 rounded-[16px] border border-line bg-surface-2 p-8">
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-[12px] border border-line bg-surface text-ink-3">
                  <Icon name={card.icon} size={22} />
                </div>
                <Chip tone="neutral">{card.k}</Chip>
              </div>
              <p className="t-h3 text-ink">
                <Lines lines={card.t} />
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── §3.4 Features ─────────────── */

function FeatureVisuals() {
  return [
    <div
      key="0"
      className="w-full max-w-[520px] overflow-hidden rounded-[22px] border border-line bg-surface shadow-soft"
    >
      <WorkerCard />
    </div>,
    <Crop
      key="1"
      shot="dashboard"
      x={603}
      y={67}
      w={393}
      h={272}
      scale={1.32}
      radius={22}
      className="shadow-soft"
      style={{ border: "1px solid var(--line)" }}
    />,
    <Phone key="2" shot="checkin" width={280} />,
    <Crop
      key="3"
      shot="dashboard"
      x={190}
      y={162}
      w={496}
      h={180}
      scale={1.05}
      radius={22}
      className="shadow-soft"
      style={{ border: "1px solid var(--line)" }}
    />,
  ];
}

export function Features() {
  const f = COPY.features;
  const visuals = FeatureVisuals();
  return (
    <Section id="features" className="bg-background">
      <SectionHead
        eyebrow="핵심 기능"
        h2={["구인부터 정산까지,", "한 흐름으로."]}
        center
      />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {f.map((x, i) => (
          <div key={x.k} className="flex items-center gap-3">
            <Chip tone="brand" big icon={x.icon}>
              {x.k}
            </Chip>
            {i < f.length - 1 ? (
              <Icon name="ChevronRight" size={18} className="text-subtle" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-[72px] flex flex-col gap-8">
        {f.map((x, i) => (
          <Reveal key={x.k}>
            <div className="grid items-center gap-10 rounded-[22px] border border-line bg-surface p-7 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-14">
              <div
                className={cn(
                  "flex flex-col gap-5",
                  i % 2 ? "lg:order-2" : "lg:order-1",
                )}
              >
                <div className="t-eyebrow tabular text-brand-600">
                  0{i + 1} · {x.k}
                </div>
                <h3 className="t-h1 text-ink">
                  <Lines lines={x.t} />
                </h3>
                <p className="t-body-lg text-muted-foreground">
                  <Lines lines={x.desc} />
                </p>
              </div>
              <div
                className={cn(
                  "flex min-h-[300px] items-center justify-center overflow-hidden rounded-[16px] bg-surface-2 p-8 lg:min-h-[360px]",
                  i % 2 ? "lg:order-1" : "lg:order-2",
                )}
              >
                {visuals[i]}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── §3.5 Staff ─────────────── */

export function Staff() {
  const c = COPY.staff;
  return (
    <Section id="staff" className="relative overflow-hidden bg-sidebar">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_520px]">
        <div className="flex flex-col gap-12">
          <SectionHead eyebrow="스태프·프로모터" h2={c.h2} dark />
          <div className="flex flex-col">
            {c.points.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-5 border-t border-sidebar-border py-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-[12px] bg-brand/20 text-brand-100">
                  <Icon name={p.icon} size={22} />
                </div>
                <div>
                  <div className="t-h3 text-white">
                    <Lines lines={p.t} />
                  </div>
                  {p.s ? (
                    <div className="mt-1 text-[15px] text-sidebar-muted">
                      <Lines lines={p.s} />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Btn kind="light" icon="ArrowRight" href="#inquiry">
              {c.cta[0]}
            </Btn>
          </div>
        </div>
        <div className="relative h-[560px] lg:h-[620px]">
          <Phone width={290} className="absolute left-0 top-0">
            <ProfileScreen />
          </Phone>
          <Phone
            shot="checkin"
            width={250}
            className="absolute left-[240px] top-[90px] opacity-95 lg:left-[260px]"
          />
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── §3.6 Proxy ─────────────── */

const PROXY_STEPS: [string, string, "brand" | "success"][] = [
  ["동의 확인", "ShieldCheck", "brand"],
  ["대행 등록 · 구인 시작", "Megaphone", "brand"],
  ["주관사 합류 · 소유권 이전", "UserPlus", "success"],
];

export function Proxy() {
  const c = COPY.proxy;
  return (
    <Section id="proxy" className="bg-surface">
      <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-[72px]">
        <div className="flex flex-col gap-7">
          <SectionHead eyebrow="대행 등록" h2={c.h2} sub={c.desc} />
          <div className="mt-2 flex flex-col gap-3">
            {PROXY_STEPS.map(([t, ic, tone], i) => (
              <div key={t} className="flex items-center gap-3.5">
                <span className="tabular grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-[13px] font-extrabold text-brand-700">
                  {i + 1}
                </span>
                <Chip tone={tone} big icon={ic}>
                  {t}
                </Chip>
              </div>
            ))}
          </div>
          <div className="flex gap-3 rounded-[12px] border border-info-200 bg-info-50 px-[18px] py-4 text-[15px] leading-[1.6] text-info-700">
            <Icon name="Info" size={18} className="mt-[3px]" />
            <div>
              <Lines lines={c.note} />
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-[22px] bg-background p-7">
          <Crop
            shot="postings"
            x={185}
            y={10}
            w={830}
            h={530}
            scale={0.81}
            radius={16}
            className="shadow-soft"
            style={{ border: "1px solid var(--line)" }}
          />
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── §3.7 Safety ─────────────── */

export function Safety() {
  const c = COPY.safety;
  return (
    <Section className="bg-background">
      <SectionHead eyebrow="신뢰·안전" h2={c.h2} />
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {c.cards.map((card) => (
          <Reveal key={card.t[0]}>
            <div className="flex h-full flex-col gap-7 rounded-[16px] border border-line bg-surface p-7 shadow-soft">
              <div className="grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-success-50 text-success-700">
                <Icon name={card.icon} size={24} />
              </div>
              <div>
                <div className="t-h3 text-ink">
                  <Lines lines={card.t} />
                </div>
                <div className="mt-2 text-[15px] text-muted-foreground">
                  <Lines lines={card.s ?? []} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── §3.8 Pricing ─────────────── */

function PlanCard({ p }: { p: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-7 rounded-[16px] bg-surface p-9",
        p.hot
          ? "border-2 border-brand shadow-[0_24px_48px_-16px_rgb(108_92_231_/_0.28)]"
          : "border border-line shadow-soft",
      )}
    >
      {p.hot ? (
        <div className="absolute -top-3.5 left-9">
          <span className="rounded-[7px] bg-brand px-3 py-[5px] text-[13px] font-bold text-white">
            인기
          </span>
        </div>
      ) : null}
      <div>
        <div className="flex items-center justify-between">
          <div className="text-[22px] font-extrabold tracking-[-0.015em] text-ink">
            {p.name}
          </div>
          {p.unit ? <span className="lp-ph-tag">가격 확정 전</span> : null}
        </div>
        <div className="mt-1.5 text-[15px] text-muted-foreground">
          <Lines lines={p.who} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 border-b border-line pb-7">
        <span className="t-price tabular text-ink">{p.price}</span>
        {p.unit ? (
          <span className="text-[16px] text-muted-foreground">{p.unit}</span>
        ) : null}
      </div>
      <ul className="m-0 flex flex-1 list-none flex-col gap-3.5 p-0">
        {p.inc.map((x) => (
          <li
            key={x}
            className="flex items-center gap-2.5 text-[16px] text-ink-2"
          >
            <Icon
              name="Check"
              size={18}
              className={p.hot ? "text-brand" : "text-success"}
              strokeWidth={2.6}
            />
            {x}
          </li>
        ))}
      </ul>
      <Btn
        kind={p.hot || p.cta === "도입 문의" ? "primary" : "secondary"}
        full
        href="#inquiry"
      >
        {p.cta}
      </Btn>
    </div>
  );
}

export function Pricing() {
  const c = COPY.pricing;
  return (
    <Section id="pricing" className="bg-surface">
      <SectionHead eyebrow="요금제" h2={c.h2} center />
      <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
        {c.plans.map((p) => (
          <PlanCard key={p.name} p={p} />
        ))}
      </div>
      <p className="mt-8 text-center text-[15px] text-muted-foreground">
        <Lines lines={c.foot} />
      </p>
    </Section>
  );
}

/* ─────────────── §3.9 Inquiry ─────────────── */

function Field({
  label,
  req,
  ph,
  area,
  half,
}: {
  label: string;
  req?: boolean;
  ph: string;
  area?: boolean;
  half?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex flex-col gap-2",
        half ? "sm:col-span-1" : "sm:col-span-2",
      )}
    >
      <span className="text-[14px] font-bold text-ink-2">
        {label}
        {req ? <span className="text-danger"> *</span> : null}
      </span>
      {area ? (
        <textarea
          rows={3}
          placeholder={ph}
          className="min-h-[112px] resize-y rounded-[10px] border border-line-2 bg-surface px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      ) : (
        <input
          placeholder={ph}
          className="h-[52px] rounded-[10px] border border-line-2 bg-surface px-4 text-[15px] text-ink outline-none placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      )}
    </label>
  );
}

export function Inquiry() {
  const c = COPY.inquiry;
  return (
    <Section id="inquiry" className="bg-background">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_640px] lg:gap-20">
        <div className="flex flex-col gap-9 lg:sticky lg:top-8">
          <SectionHead eyebrow="도입 문의" h2={c.h2} sub={c.sub} />
          <div className="flex flex-col gap-4">
            {c.points.map(([ic, t]) => (
              <div
                key={t}
                className="flex items-center gap-3 text-[16px] font-semibold text-ink-2"
              >
                <Icon name={ic} size={20} className="text-brand" />
                {t}
              </div>
            ))}
          </div>
        </div>
        <form
          className="rounded-[22px] border border-line bg-surface p-7 shadow-soft lg:p-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="회사·브랜드명" req ph="예: 더블엠" half />
            <Field label="담당자 성함" req ph="홍길동" half />
            <Field label="연락처" req ph="010-0000-0000" half />
            <Field label="이메일" req ph="name@company.com" half />
            <Field label="월 예상 프로젝트 수" ph="선택해 주세요" />
            <Field
              label="문의 내용"
              ph="운영 중인 팝업 규모, 고민 중인 부분을 적어 주세요."
              area
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[15px] text-ink-2">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand text-white">
              <Icon name="Check" size={14} strokeWidth={3} />
            </span>
            <Lines lines={c.consent} />
            <span className="font-bold text-danger-700">(필수)</span>
            <span className="ml-auto text-[14px] text-muted-foreground underline">
              내용 보기
            </span>
          </div>
          <Btn full icon="Send" className="mt-7">
            {c.submit[0]}
          </Btn>
        </form>
      </div>
    </Section>
  );
}

/* ─────────────── §3.10 FAQ ─────────────── */

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:gap-20">
        <SectionHead eyebrow="FAQ" h2={["자주 묻는", "질문"]} />
        <div>
          {COPY.faq.map((f, i) => {
            const isOpen = open === i;
            const last = i === COPY.faq.length - 1;
            return (
              <div
                key={i}
                className={cn(
                  "border-t border-line py-7",
                  last && "border-b border-line",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                >
                  <div className="t-h3 text-ink">
                    <Lines lines={f.q} />
                  </div>
                  <Icon
                    name={isOpen ? "Minus" : "Plus"}
                    size={22}
                    className="shrink-0 text-ink-3"
                  />
                </button>
                {isOpen ? (
                  <p className="t-body-lg mt-3.5 text-muted-foreground">
                    <Lines lines={f.a} />
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── §3.11 Footer ─────────────── */

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="px-5 sm:px-8 lg:px-16 xl:px-[120px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 border-b border-sidebar-border py-16 lg:flex-row lg:items-center lg:py-24">
          <h2 className="t-h1 text-white">
            <Lines lines={COPY.closing} />
          </h2>
          <div className="flex flex-wrap gap-3">
            <Btn icon="ArrowRight" href="#inquiry">
              도입 문의
            </Btn>
            <Btn kind="ghostDark" href="#inquiry">
              무료로 시작하기
            </Btn>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-10 py-12 text-[14px] lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo dark size={28} />
              <span className="text-sidebar-muted">by 더블엠</span>
            </div>
            <div className="flex flex-wrap gap-6">
              {COPY.footer.links.map((x, i) => (
                <span
                  key={x}
                  className={cn(
                    i === 1 ? "font-bold text-white" : "text-sidebar-foreground",
                  )}
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-7">
            {COPY.footer.contacts.map(([ic, t]) => (
              <span key={t} className="flex items-center gap-2">
                <Icon name={ic} size={16} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */

export function LandingSections() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <Features />
      <Staff />
      <Proxy />
      <Safety />
      <Pricing />
      <Inquiry />
      <FAQ />
      <Footer />
    </>
  );
}
