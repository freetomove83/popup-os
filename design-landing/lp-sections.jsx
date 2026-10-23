/* Popup OS Landing — sections §3.1–§3.11 (desktop 1440) */

const W = 1440;
const PAD = 120; // side gutter at 1440 → content 1200

function Nav({ dark }) {
  return (
    <div style={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${PAD}px` }}>
      <Logo />
      <div style={{ display: 'flex', gap: 36, fontSize: 15, fontWeight: 600, color: 'var(--ink-3)' }}>
        <span>기능</span><span>스태프</span><span>대행 등록</span><span>요금제</span><span>FAQ</span>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-3)', padding: '0 12px' }}>로그인</span>
        <Btn size="md">도입 문의</Btn>
      </div>
    </div>
  );
}

// §3.1 Hero — the one place a brand gradient is permitted
function HeroDesktop({ visual = 'overlap' }) {
  const h = COPY.hero;
  return (
    <section data-screen-label="3.1 Hero" style={{ position: 'relative', width: W, height: 880, overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--brand-50) 0%, var(--background) 72%)' }}>
      <Nav />
      <div style={{ position: 'absolute', left: PAD, top: 196, width: 520, display: 'flex', flexDirection: 'column', gap: 28, zIndex: 2 }}>
        <div><Chip tone="brand" big icon="Store">{h.eyebrow[0]}</Chip></div>
        <h1 className="t-display" style={{ color: 'var(--ink)' }}><L lines={h.h1} /></h1>
        <p className="t-body-lg" style={{ color: 'var(--muted-fg)' }}><L lines={h.sub} /></p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Btn icon="ArrowRight">{h.ctaPrimary[0]}</Btn>
          <Btn kind="secondary">{h.ctaSecondary[0]}</Btn>
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted-fg)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="CreditCard" size={15} /> {h.aux[0]}
        </div>
      </div>
      <HeroVisual variant={visual} />
    </section>
  );
}

// Key visual compositions — also reused in "키비주얼 배치안" board
function HeroVisual({ variant = 'overlap', origin = { left: 700, top: 150 } }) {
  if (variant === 'tilt') {
    return (
      <div style={{ position: 'absolute', left: origin.left + 20, top: origin.top - 10, width: 900, height: 760, perspective: 2400 }}>
        <div style={{ transform: 'rotateY(-14deg) rotateX(6deg) rotateZ(1deg)', transformOrigin: 'left center' }}>
          <ConsoleFrame shot="dashboard" width={860} />
        </div>
        <Phone shot="checkin" width={250} style={{ position: 'absolute', left: -40, top: 290, transform: 'rotate(-4deg)' }} />
      </div>
    );
  }
  if (variant === 'side') {
    return (
      <div style={{ position: 'absolute', left: origin.left + 10, top: origin.top + 30, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <ConsoleFrame shot="dashboard" width={560} />
        <Phone shot="checkin" width={230} />
      </div>
    );
  }
  // overlap (default): console bleeds right, phone overlaps lower-left, floating proof chips
  return (
    <div style={{ position: 'absolute', left: origin.left, top: origin.top, width: 900, height: 760 }}>
      <ConsoleFrame shot="dashboard" width={900} style={{ position: 'absolute', left: 70, top: 30 }} />
      <Phone shot="checkin" width={252} style={{ position: 'absolute', left: 0, top: 250 }} />
      <FloatCard style={{ left: 600, top: 560 }} icon="CircleCheck" tone="success" t="출근 체크인 완료" s="매니저 QR · 09:52" />
      <FloatCard style={{ left: 290, top: 640 }} icon="FilePenLine" tone="brand" t="전자계약 서명 12/12" s="알림톡 자동 발송" />
    </div>
  );
}

function FloatCard({ icon, tone, t, s, style }) {
  const bg = { success: 'var(--success-50)', brand: 'var(--brand-50)', warning: 'var(--warning-50)' }[tone];
  const fg = { success: 'var(--success-700)', brand: 'var(--brand-700)', warning: 'var(--warning-700)' }[tone];
  return (
    <div style={{ position: 'absolute', display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px 12px 12px',
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--shadow-float)', ...style }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{t}</div>
        <div className="num" style={{ fontSize: 12, color: 'var(--muted-fg)', marginTop: 2 }}>{s}</div>
      </div>
    </div>
  );
}

// §3.2 Trust bar
function TrustBar() {
  const c = COPY.trust;
  return (
    <section data-screen-label="3.2 Trust" style={{ width: W, padding: `72px ${PAD}px 88px`, background: 'var(--background)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 40, paddingBottom: 40, borderBottom: '1px solid var(--line-2)' }}>
        <p className="t-h3" style={{ color: 'var(--ink)' }}><L lines={c.lead} /></p>
        <div style={{ display: 'flex', gap: 64 }}>
          {c.stats.map(([k, v]) => (
            <div key={k}>
              <div className="t-kpi num" style={{ color: 'var(--ink)' }}>{v}</div>
              <div style={{ fontSize: 15, color: 'var(--muted-fg)', marginTop: 6 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginTop: 40 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="ph" style={{ height: 56, borderRadius: 10, whiteSpace: 'nowrap' }}>LOGO {i + 1}</div>
        ))}
      </div>
    </section>
  );
}

// §3.3 Problem
function Problem() {
  const c = COPY.problem;
  return (
    <section data-screen-label="3.3 Problem" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--surface)' }}>
      <SectionHead eyebrow="지금의 운영 방식" h2={c.h2} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 64 }}>
        {c.cards.map(card => (
          <div key={card.k} style={{ padding: 32, borderRadius: 16, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
                <Icon name={card.icon} size={22} />
              </div>
              <Chip tone="neutral">{card.k}</Chip>
            </div>
            <p className="t-h3" style={{ color: 'var(--ink)' }}><L lines={card.t} /></p>
          </div>
        ))}
      </div>
    </section>
  );
}

// §3.4 Features — 4 rows, alternating, each anchored on a real product crop
function Features() {
  const f = COPY.features;
  const visuals = [
    <div key="0" style={{ width: 520, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}><WorkerCard /></div>,
    <Crop key="1" shot="dashboard" x={603} y={67} w={393} h={272} scale={1.32} radius={22} style={{ boxShadow: 'var(--shadow-soft)', border: '1px solid var(--line)' }} />,
    <Phone key="2" shot="checkin" width={280} />,
    <Crop key="3" shot="dashboard" x={190} y={162} w={496} h={180} scale={1.05} radius={22} style={{ boxShadow: 'var(--shadow-soft)', border: '1px solid var(--line)' }} />,
  ];
  const desc = [
    ['신뢰지표와 커리어 이력으로', '지원자를 바로 비교해요.'],
    ['알림톡으로 계약서를 보내고', '서명 현황을 실시간으로 봐요.'],
    ['매니저 QR 스캔과 사진 인증으로', '대리출근 없이 기록돼요.'],
    ['출퇴근 로그가 그대로', '정산서로 이어져요.'],
  ];
  return (
    <section data-screen-label="3.4 Features" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--background)' }}>
      <SectionHead eyebrow="핵심 기능" h2={['구인부터 정산까지,', '한 흐름으로.']} center />
      {/* flow strip */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 40 }}>
        {f.map((x, i) => (
          <React.Fragment key={x.k}>
            <Chip tone="brand" big icon={x.icon}>{x.k}</Chip>
            {i < f.length - 1 && <Icon name="ChevronRight" size={18} color="var(--subtle)" />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 72 }}>
        {f.map((x, i) => (
          <div key={x.k} style={{ display: 'grid', gridTemplateColumns: i % 2 ? '1fr 1fr' : '1fr 1fr', alignItems: 'center', gap: 80,
            padding: '56px 64px', borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)', minHeight: 440 }}>
            <div style={{ order: i % 2 ? 2 : 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="t-eyebrow num" style={{ color: 'var(--brand-600)' }}>0{i + 1} · {x.k}</div>
              <h3 className="t-h1" style={{ color: 'var(--ink)' }}><L lines={x.t} /></h3>
              <p className="t-body-lg" style={{ color: 'var(--muted-fg)' }}><L lines={desc[i]} /></p>
            </div>
            <div style={{ order: i % 2 ? 1 : 2, display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: 'var(--surface-2)', borderRadius: 16, padding: 32, minHeight: 360, overflow: 'hidden' }}>
              {visuals[i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// §3.5 Staff (supply side) — dark band, sidebar token
function Staff() {
  const c = COPY.staff;
  return (
    <section data-screen-label="3.5 Staff" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--sidebar)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 80, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <SectionHead eyebrow="스태프·프로모터" h2={c.h2} dark />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {c.points.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '24px 0', borderTop: '1px solid var(--sidebar-border)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,92,231,.18)', color: 'var(--brand-100)', display: 'grid', placeItems: 'center' }}>
                  <Icon name={p.icon} size={22} />
                </div>
                <div>
                  <div className="t-h3" style={{ color: '#fff' }}><L lines={p.t} /></div>
                  {p.s && <div style={{ fontSize: 15, color: 'var(--sidebar-muted)', marginTop: 4 }}><L lines={p.s} /></div>}
                </div>
              </div>
            ))}
          </div>
          <div><Btn kind="light" icon="ArrowRight">{c.cta[0]}</Btn></div>
        </div>
        <div style={{ position: 'relative', height: 620 }}>
          <Phone width={290} style={{ position: 'absolute', left: 0, top: 0 }}><ProfileScreen /></Phone>
          <Phone shot="checkin" width={250} style={{ position: 'absolute', left: 260, top: 90, opacity: .96 }} />
        </div>
      </div>
    </section>
  );
}

// §3.6 Proxy registration
function Proxy() {
  const c = COPY.proxy;
  return (
    <section data-screen-label="3.6 Proxy" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--surface)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 72, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <SectionHead eyebrow="대행 등록" h2={c.h2} sub={c.desc} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {[['동의 확인', 'ShieldCheck', 'brand'], ['대행 등록 · 구인 시작', 'Megaphone', 'brand'], ['주관사 합류 · 소유권 이전', 'UserPlus', 'success']].map(([t, ic, tone], i) => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span className="num" style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--brand-50)', color: 'var(--brand-700)', fontWeight: 800, fontSize: 13, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                <Chip tone={tone} big icon={ic}>{t}</Chip>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '16px 18px', borderRadius: 12, background: 'var(--info-50)', border: '1px solid var(--info-200)', color: 'var(--info-700)', fontSize: 15, lineHeight: 1.6 }}>
            <Icon name="Info" size={18} style={{ marginTop: 3 }} />
            <div><L lines={c.note} /></div>
          </div>
        </div>
        <div style={{ background: 'var(--background)', borderRadius: 22, padding: 28, overflow: 'hidden' }}>
          <Crop shot="postings" x={185} y={10} w={830} h={530} scale={0.81} radius={16} style={{ boxShadow: 'var(--shadow-soft)', border: '1px solid var(--line)' }} />
        </div>
      </div>
    </section>
  );
}

// §3.7 Safety badges
function Safety() {
  const c = COPY.safety;
  return (
    <section data-screen-label="3.7 Safety" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--background)' }}>
      <SectionHead eyebrow="신뢰·안전" h2={c.h2} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 64 }}>
        {c.cards.map(card => (
          <div key={card.t[0]} style={{ padding: 28, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--success-50)', color: 'var(--success-700)', display: 'grid', placeItems: 'center' }}>
              <Icon name={card.icon} size={24} />
            </div>
            <div>
              <div className="t-h3" style={{ color: 'var(--ink)' }}><L lines={card.t} /></div>
              <div style={{ fontSize: 15, color: 'var(--muted-fg)', marginTop: 8 }}><L lines={card.s} /></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// §3.8 Pricing
function PlanCard({ p }) {
  return (
    <div style={{ position: 'relative', padding: 36, borderRadius: 16, background: 'var(--surface)',
      border: p.hot ? '2px solid var(--brand)' : '1px solid var(--line)', boxShadow: p.hot ? '0 24px 48px -16px rgb(108 92 231 / .28)' : 'var(--shadow-soft)',
      display: 'flex', flexDirection: 'column', gap: 28 }}>
      {p.hot && <div style={{ position: 'absolute', top: -14, left: 36 }}><span style={{ background: 'var(--brand)', color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, padding: '5px 12px' }}>인기</span></div>}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.015em' }}>{p.name}</div>
          {p.unit && <span className="ph-tag">가격 확정 전</span>}
        </div>
        <div style={{ fontSize: 15, color: 'var(--muted-fg)', marginTop: 6 }}><L lines={p.who} /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, paddingBottom: 28, borderBottom: '1px solid var(--line)' }}>
        <span className="t-price num" style={{ color: 'var(--ink)' }}>{p.price}</span>
        {p.unit && <span style={{ fontSize: 16, color: 'var(--muted-fg)' }}>{p.unit}</span>}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {p.inc.map(x => (
          <li key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 16, color: 'var(--ink-2)' }}>
            <Icon name="Check" size={18} color={p.hot ? 'var(--brand)' : 'var(--success)'} stroke={2.6} />{x}
          </li>
        ))}
      </ul>
      <Btn kind={p.hot || p.cta === '도입 문의' ? 'primary' : 'secondary'} full>{p.cta}</Btn>
    </div>
  );
}
function Pricing({ standalone }) {
  const c = COPY.pricing;
  return (
    <section data-screen-label="3.8 Pricing" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--surface)' }}>
      <SectionHead eyebrow="요금제" h2={c.h2} center />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 64, alignItems: 'stretch' }}>
        {c.plans.map(p => <PlanCard key={p.name} p={p} />)}
      </div>
      <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--muted-fg)', marginTop: 32 }}><L lines={c.foot} /></p>
    </section>
  );
}

// §3.9 Inquiry — primary conversion
function Field({ label, req, ph, area, half }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: half ? 'span 1' : 'span 2' }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>{label}{req && <span style={{ color: 'var(--danger)' }}> *</span>}</span>
      <div style={{ height: area ? 112 : 52, borderRadius: 10, border: '1px solid var(--line-2)', background: 'var(--surface)', padding: '14px 16px', fontSize: 15, color: 'var(--subtle)' }}>{ph}</div>
    </label>
  );
}
function Inquiry() {
  const c = COPY.inquiry;
  return (
    <section data-screen-label="3.9 Inquiry" id="inquiry" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--background)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 640px', gap: 80, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, position: 'sticky', top: 0 }}>
          <SectionHead eyebrow="도입 문의" h2={c.h2} sub={['운영 방식을 들려주시면', '맞는 플랜과 세팅 일정을 안내해 드려요.']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['Video', '20분 데모로 흐름 확인'], ['FileSpreadsheet', '기존 엑셀 명단 이관 지원']].map(([ic, t]) => (
              <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 16, color: 'var(--ink-2)', fontWeight: 600 }}>
                <Icon name={ic} size={20} color="var(--brand)" />{t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 40, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="회사·브랜드명" req ph="예: 더블엠" half />
            <Field label="담당자 성함" req ph="홍길동" half />
            <Field label="연락처" req ph="010-0000-0000" half />
            <Field label="이메일" req ph="name@company.com" half />
            <Field label="월 예상 프로젝트 수" ph="선택해 주세요  ▾" />
            <Field label="문의 내용" ph="운영 중인 팝업 규모, 고민 중인 부분을 적어 주세요." area />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 24, fontSize: 15, color: 'var(--ink-2)' }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name="Check" size={14} stroke={3} /></span>
            <L lines={c.consent} /> <span style={{ color: 'var(--danger-700)', fontWeight: 700 }}>(필수)</span>
            <span style={{ marginLeft: 'auto', color: 'var(--muted-fg)', textDecoration: 'underline', fontSize: 14 }}>내용 보기</span>
          </div>
          <Btn full icon="Send" style={{ marginTop: 28 }}>{c.submit[0]}</Btn>
        </div>
      </div>
    </section>
  );
}

// §3.10 FAQ
function FAQ() {
  return (
    <section data-screen-label="3.10 FAQ" style={{ width: W, padding: `128px ${PAD}px`, background: 'var(--surface)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 80 }}>
        <SectionHead eyebrow="FAQ" h2={['자주 묻는', '질문']} />
        <div>
          {COPY.faq.map((f, i) => (
            <div key={i} style={{ padding: '28px 0', borderTop: '1px solid var(--line)', borderBottom: i === COPY.faq.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="t-h3" style={{ color: 'var(--ink)' }}><L lines={f.q} /></div>
                <Icon name={i === 0 ? 'Minus' : 'Plus'} size={22} color="var(--ink-3)" />
              </div>
              {i === 0 && <p className="t-body-lg" style={{ color: 'var(--muted-fg)', marginTop: 14 }}><L lines={f.a} /></p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Closing CTA band + §3.11 Footer
function Footer() {
  return (
    <footer data-screen-label="3.11 Footer" style={{ width: W, background: 'var(--sidebar)', color: 'var(--sidebar-fg)' }}>
      <div style={{ padding: `96px ${PAD}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sidebar-border)' }}>
        <h2 className="t-h1" style={{ color: '#fff' }}><L lines={['팝업은 자주,', '운영은 가볍게.']} /></h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn icon="ArrowRight">도입 문의</Btn>
          <Btn kind="ghostDark">무료로 시작하기</Btn>
        </div>
      </div>
      <div style={{ padding: `48px ${PAD}px 56px`, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, fontSize: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Logo dark size={28} /><span style={{ color: 'var(--sidebar-muted)' }}>by 더블엠</span></div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['이용약관', '개인정보처리방침', '도입 문의', '사업자 정보'].map((x, i) => <span key={x} style={{ color: i === 1 ? '#fff' : 'var(--sidebar-fg)', fontWeight: i === 1 ? 700 : 500 }}>{x}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
          {[['Mail', 'hello@OO.kr'], ['Phone', '02-000-0000'], ['MessageCircle', '카카오채널 @OO']].map(([ic, t]) => (
            <span key={t} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name={ic} size={16} />{t}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FullPage() {
  return (
    <div style={{ width: W }}>
      <HeroDesktop /><TrustBar /><Problem /><Features /><Staff /><Proxy /><Safety /><Pricing /><Inquiry /><FAQ /><Footer />
    </div>
  );
}

Object.assign(window, { HeroDesktop, HeroVisual, FloatCard, TrustBar, Problem, Features, Staff, Proxy, Safety, Pricing, PlanCard, Inquiry, FAQ, Footer, FullPage, LP_W: W });
