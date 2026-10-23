/* Popup OS Landing — mobile hero, key-visual board, type scale, handoff notes */

// ---------- Mobile hero (390) ----------
function HeroMobile() {
  const h = COPY.hero;
  return (
    <section data-screen-label="Hero Mobile" style={{ width: 390, minHeight: 844, overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(180deg, var(--brand-50) 0%, var(--background) 70%)' }}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <Logo size={28} />
        <Icon name="Menu" size={24} color="var(--ink)" />
      </div>
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div><Chip tone="brand" icon="Store">{h.eyebrow[0]}</Chip></div>
        <h1 className="m-display" style={{ color: 'var(--ink)' }}><L lines={h.h1} /></h1>
        <p className="m-body" style={{ color: 'var(--muted-fg)' }}><L lines={h.sub} /></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
          <Btn full icon="ArrowRight" size="lg" style={{ height: 52 }}>{h.ctaPrimary[0]}</Btn>
          <Btn full kind="secondary" style={{ height: 52 }}>{h.ctaSecondary[0]}</Btn>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-fg)', textAlign: 'center' }}>{h.aux[0]}</div>
      </div>
      <div style={{ position: 'relative', height: 360, marginTop: 32 }}>
        <ConsoleFrame shot="dashboard" width={520} style={{ position: 'absolute', left: 92, top: 24 }} />
        <Phone shot="checkin" width={176} style={{ position: 'absolute', left: 20, top: 0 }} />
      </div>
    </section>
  );
}

// ---------- Key-visual board ----------
function KVOption({ variant, label }) {
  return (
    <div style={{ width: 1440, height: 880, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--brand-50) 0%, var(--background) 72%)' }}>
      <div style={{ position: 'absolute', left: 120, top: 210, width: 460, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="kv-bar" style={{ width: 160, height: 26 }} />
        <div className="kv-bar" style={{ width: 420, height: 56 }} />
        <div className="kv-bar" style={{ width: 380, height: 56 }} />
        <div className="kv-bar light" style={{ width: 360, height: 18, marginTop: 14 }} />
        <div className="kv-bar light" style={{ width: 400, height: 18 }} />
        <div className="kv-bar light" style={{ width: 330, height: 18 }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}><div className="kv-bar brand" style={{ width: 150, height: 56 }} /><div className="kv-bar light" style={{ width: 170, height: 56 }} /></div>
      </div>
      <HeroVisual variant={variant} />
      <div style={{ position: 'absolute', left: 120, bottom: 48, fontSize: 18, fontWeight: 700, color: 'var(--ink-3)' }}>{label}</div>
    </div>
  );
}

// Section → which screenshot crop, documented visually
function KVMap() {
  const rows = [
    ['3.1 Hero', 'admin-dashboard 전체 + checkin-qr', <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}><ConsoleFrame shot="dashboard" width={260} /><Phone shot="checkin" width={84} /></div>],
    ['3.4-01 구인·매칭', '검카드 HTML 재구성 (원본 151px 저해상)', <div style={{ height: 170, overflow: 'hidden' }}><div style={{ width: 300, border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: '#fff', transform: 'scale(.6)', transformOrigin: 'left top' }}><WorkerCard compact /></div></div>],
    ['3.4-02 전자계약', 'admin-dashboard · 처리필요 패널 (603,67 / 393×272)', <Crop shot="dashboard" x={603} y={67} w={393} h={272} scale={0.62} radius={12} style={{ border: '1px solid var(--line)' }} />],
    ['3.4-03 QR 출퇴근', 'checkin-qr 전체', <Phone shot="checkin" width={110} />],
    ['3.4-04 정산·급여', 'admin-dashboard · 현장 현황 표 (190,162 / 496×180)', <Crop shot="dashboard" x={190} y={162} w={496} h={180} scale={0.5} radius={12} style={{ border: '1px solid var(--line)' }} />],
    ['3.6 대행 등록', 'postings · 본문 영역 (185,10 / 830×530)', <Crop shot="postings" x={185} y={10} w={830} h={530} scale={0.3} radius={12} style={{ border: '1px solid var(--line)' }} />],
  ];
  return (
    <div style={{ width: 1100, padding: 48, background: 'var(--surface)' }}>
      <div className="t-h3" style={{ color: 'var(--ink)', marginBottom: 8 }}>섹션별 제품 화면 소스</div>
      <p style={{ fontSize: 15, color: 'var(--muted-fg)', marginBottom: 28 }}>모든 비주얼은 실제 제품 캡처(refs/) 크롭. 좌표는 원본 px 기준.</p>
      {rows.map(([s, d, v]) => (
        <div key={s} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 360px', gap: 24, alignItems: 'center', padding: '20px 0', borderTop: '1px solid var(--line)' }}>
          <b style={{ fontSize: 16, color: 'var(--ink)' }}>{s}</b>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>{d}</span>
          <div style={{ display: 'flex', justifyContent: 'flex-start', minHeight: 120, alignItems: 'center', background: 'var(--surface-2)', borderRadius: 12, padding: 16, overflow: 'hidden' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Type scale ----------
function TypeScale() {
  const rows = [
    ['Display', 't-display', '56 / 1.18 · 800 · -0.025em', '34 / 1.24', '팝업 운영의 처음과 끝을 하나로.', 'display 38'],
    ['H1 (섹션 제목)', 't-h1', '40 / 1.3 · 800 · -0.02em', '28 / 1.32', '아직도 엑셀과 카톡으로', 'h1 28'],
    ['H2 (블록)', 't-h2', '30 / 1.35 · 700 · -0.015em', '22 / 1.4', '검증된 스태프를 한눈에', 'h2 20'],
    ['H3 (카드 제목)', 't-h3', '22 / 1.45 · 700 · -0.01em', '18 / 1.45', '단톡방 공고, 이력은 안 보이고', 'h3 15'],
    ['KPI', 't-kpi', '40 / 1.1 · 800 · tabular', '30 / 1.1', 'OO건', 'kpi 26'],
    ['Body L', 't-body-lg', '19 / 1.65 · 500', '16 / 1.6', '대행사와 브랜드를 위한 올인원 콘솔.', '—'],
    ['Body', 't-body', '16 / 1.6 · 500', '15 / 1.6', '알림톡 링크로 바로 서명·체크인', 'body 13.5'],
    ['Eyebrow', 't-eyebrow', '14 / 1.4 · 700 · +0.06em', '13', '핵심 기능', 'label 11'],
    ['Caption', 't-caption', '13 / 1.5 · 500', '12', '신용카드 없이 시작 · 14일 무료 체험', 'caption 11.5'],
  ];
  return (
    <div style={{ width: 1240, padding: 56, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <div className="t-eyebrow" style={{ color: 'var(--brand-600)' }}>Pretendard Variable</div>
          <div className="t-h1" style={{ color: 'var(--ink)', marginTop: 8 }}>랜딩 타이포 스케일</div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted-fg)', textAlign: 'right', lineHeight: 1.6 }}>
          §4.4 확장값(56/40/30/16) 기준 · 사이 단계 보간<br />숫자는 모두 tabular-nums
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 230px 90px 100px', gap: 20, padding: '10px 0', fontSize: 12, fontWeight: 700, color: 'var(--subtle)', letterSpacing: '.06em', borderBottom: '1px solid var(--line-2)' }}>
        <span>토큰</span><span>견본</span><span>DESKTOP 1440</span><span>MOBILE 390</span><span>제품 대응</span>
      </div>
      {rows.map(([n, cls, d, m, s, p]) => (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 230px 90px 100px', gap: 20, alignItems: 'center', padding: '22px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>{n}<br /><span className="mono" style={{ fontWeight: 500, color: 'var(--subtle)', fontSize: 12 }}>.{cls}</span></span>
          <span className={cls + (cls === 't-kpi' ? ' num' : '')} style={{ color: cls === 't-eyebrow' ? 'var(--brand-600)' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden' }}>{s}</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>{d}</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>{m}</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--subtle)' }}>{p}</span>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 36 }}>
        {[['섹션 상하 여백', '128px', '모바일 72px'], ['콘텐츠 폭', '1200px', '좌우 거터 120 · 1024에서 64'], ['블록 간 간격', '64 / 40 / 24', '헤드→본문 / 그룹 / 카드']].map(([k, v, s]) => (
          <div key={k} style={{ padding: 24, borderRadius: 16, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted-fg)' }}>{k}</div>
            <div className="num" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginTop: 6 }}>{v}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-fg)', marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Handoff notes ----------
function Handoff() {
  const map = [
    ['3.1 Hero', '<Hero/> · Button(primary/secondary) · Badge(brand) · <ProductMockup/>', '브랜드 그라데이션 허용 유일 구간'],
    ['3.2 Trust', '<StatRow/> · <LogoStrip/>', '숫자·로고 전부 플레이스홀더'],
    ['3.3 Problem', 'Card(surface-2) ×3 · Badge(neutral)', '카드 문구 ≤22자'],
    ['3.4 Features', '<FeatureRow/> ×4 · <ScreenCrop/>', '좌우 교차 · 제품 크롭'],
    ['3.5 Staff', '<StaffBand/> (bg sidebar) · <PhoneFrame/>', '보조 CTA: Button(light)'],
    ['3.6 Proxy', '<StepList/> · Alert(info) · <ScreenCrop/>', 'Note 문구 원문 유지'],
    ['3.7 Safety', 'Card ×4 · 아이콘 success 톤', '색+라벨 병행'],
    ['3.8 Pricing', '<PlanCard/> ×3 · Badge "인기"', 'Pro: 2px brand 보더'],
    ['3.9 Inquiry', 'Form · Input · Select · Textarea · Checkbox', '1순위 전환 · #inquiry 앵커'],
    ['3.10 FAQ', 'Accordion (shadcn)', '첫 항목 기본 펼침'],
    ['3.11 Footer', '<ClosingCTA/> · <Footer/>', 'bg sidebar'],
  ];
  const notes = [
    ['전환 우선순위', '히어로·네비·요금제 Agency·클로징에서 [도입 문의]를 primary로. 브리프 순서([무료로 시작하기] 먼저)와 달리 1순위 전환을 앞에 배치 — 원문 순서가 필요하면 교체만 하면 됨.'],
    ['신규 제안 카피', '브리프에 없던 문구: 3.4 섹션 제목·기능별 설명 2줄, 3.7·3.8 제목, 3.9 보조 문구, 클로징 밴드(태그라인 3안 재사용). 모두 30자 이하 · 승인 필요.'],
    ['플레이스홀더', 'OO 표기 숫자, 고객사 로고 6칸, 요금(₩99,000/₩290,000 = 브리프 값, "가격 확정 전" 태그), 연락처.'],
    ['검카드 이미지', 'career-profile 원본이 151px 폭이라 확대 불가 → 제품 토큰으로 HTML 재구성. 고해상 캡처(≥430px) 받으면 교체 권장.'],
    ['카피 줄바꿈', '모든 문구는 줄 배열로 관리(<br/> 고정). 1280·1024에서 자동 줄바꿈 없도록 max-width 미지정, 폰트만 축소.'],
    ['접근성', 'pop 위 흰 글자 미사용. 본문 muted-fg #5E6879 on #FFF = 5.6:1. 상태칩 아이콘+라벨.'],
    ['모션', '페이드업 1회(200ms, 16px)만. 패럴랙스·자동 캐러셀 없음.'],
  ];
  return (
    <div style={{ width: 1240, padding: 56, background: 'var(--surface)' }}>
      <div className="t-eyebrow" style={{ color: 'var(--brand-600)' }}>Vite · React 19 · TS · Tailwind · shadcn/ui · lucide-react</div>
      <div className="t-h1" style={{ color: 'var(--ink)', marginTop: 8, marginBottom: 32 }}>핸드오프 노트</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--subtle)', letterSpacing: '.06em', marginBottom: 8 }}>섹션 → 컴포넌트</div>
          {map.map(([s, c, n]) => (
            <div key={s} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 14, padding: '13px 0', borderTop: '1px solid var(--line)' }}>
              <b style={{ fontSize: 14, color: 'var(--ink)' }}>{s}</b>
              <div>
                <div className="mono" style={{ fontSize: 13, color: 'var(--brand-700)' }}>{c}</div>
                <div style={{ fontSize: 13, color: 'var(--muted-fg)', marginTop: 3 }}>{n}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--subtle)', letterSpacing: '.06em' }}>결정·주의 사항</div>
          {notes.map(([k, v]) => (
            <div key={k} style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{k}</div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 5, lineHeight: 1.6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Copy-rule audit (auto) ----------
function CopyAudit() {
  const items = [];
  const add = (where, lines, max) => lines.forEach(l => items.push({ where, l, n: [...l].length, max }));
  const c = COPY;
  add('Hero H1', c.hero.h1, 30); add('Hero Sub', c.hero.sub, 30); add('Trust', c.trust.lead, 30);
  add('Problem H2', c.problem.h2, 30); c.problem.cards.forEach(x => add('Problem 카드', x.t, 22));
  c.features.forEach(x => add('Feature', x.t, 30));
  add('Staff H2', c.staff.h2, 30); c.staff.points.forEach(x => add('Staff 포인트', x.t, 22));
  add('Proxy H2', c.proxy.h2, 30); add('Proxy 설명', c.proxy.desc, 30); add('Proxy Note', c.proxy.note, 30);
  c.safety.cards.forEach(x => { add('Safety 카드', x.t, 22); add('Safety 카드', x.s, 22); });
  add('Inquiry H2', c.inquiry.h2, 30); c.faq.forEach(x => { add('FAQ Q', x.q, 30); add('FAQ A', x.a, 30); });
  const bad = items.filter(i => i.n > i.max);
  return (
    <div style={{ width: 760, padding: 40, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="t-h3" style={{ color: 'var(--ink)' }}>카피 규칙 점검</div>
        {bad.length === 0 ? <Chip tone="success" big icon="CircleCheck">전체 {items.length}줄 통과</Chip> : <Chip tone="danger" big icon="CircleAlert">{bad.length}줄 초과</Chip>}
      </div>
      {items.map((i, k) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 70px', gap: 12, padding: '7px 0', borderTop: '1px solid var(--line)', fontSize: 13.5, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted-fg)' }}>{i.where}</span>
          <span style={{ color: 'var(--ink)' }}>{i.l}</span>
          <span className="num" style={{ textAlign: 'right', fontWeight: 700, color: i.n > i.max ? 'var(--danger-700)' : 'var(--success-700)' }}>{i.n}/{i.max}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { HeroMobile, KVOption, KVMap, TypeScale, Handoff, CopyAudit });
