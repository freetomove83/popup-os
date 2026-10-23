/* Popup OS Landing — base primitives (tokens are CSS vars in the HTML) */

// ---------- Copy (single source; every string is an array of explicit lines) ----------
const COPY = {
  hero: {
    eyebrow: ['팝업스토어 운영 OS'],
    h1: ['팝업 운영의', '처음과 끝을 하나로.'],
    sub: ['구인·전자계약·QR 출퇴근·정산을', '한 곳에서 관리하는 팝업스토어 운영 OS.', '대행사와 브랜드를 위한 올인원 콘솔.'],
    ctaPrimary: ['도입 문의'],
    ctaSecondary: ['무료로 시작하기'],
    aux: ['신용카드 없이 시작 · 14일 무료 체험'],
  },
  trust: {
    lead: ['이미 OO개 대행사가 Popup OS로 운영하고 있어요'],
    stats: [['누적 프로젝트', 'OO건'], ['등록 스태프', 'OO명'], ['정산 완료', 'OO건']],
  },
  problem: {
    h2: ['아직도 엑셀과 카톡으로', '팝업을 운영하시나요?'],
    cards: [
      { k: '구인', t: ['단톡방 공고, 이력은 안 보이고'], icon: 'MessagesSquare' },
      { k: '계약', t: ['종이 계약서, 분실에 누락까지'], icon: 'FileX' },
      { k: '정산', t: ['수기 근태 집계, 매번 다른 계산'], icon: 'Calculator' },
    ],
  },
  features: [
    { k: '구인·매칭', t: ['검증된 스태프를', '한눈에'], icon: 'UserSearch' },
    { k: '전자계약', t: ['서명부터 보관까지', '자동'], icon: 'FilePenLine' },
    { k: 'QR 출퇴근', t: ['현장에서 스캔하면', '끝'], icon: 'ScanLine' },
    { k: '정산·급여', t: ['근태 그대로', '자동 정산'], icon: 'Wallet' },
  ],
  staff: {
    h2: ['스태프는 검카드 하나로', '일자리를 관리해요'],
    points: [
      { t: ['검카드로 지원하고 바로 계약'], icon: 'IdCard' },
      { t: ['근무 이력이 커리어로 쌓여요'], s: ['타 주관 행사도 직접 추가'], icon: 'History' },
      { t: ['정산 내역을 한 곳에서 확인'], icon: 'Receipt' },
    ],
    cta: ['스태프로 시작하기'],
  },
  proxy: {
    h2: ['주관사 동의만 받으면', '공고를 대신 등록해 드려요'],
    desc: ['초기 구인 풀을 빠르게 채우도록', '더블엠이 동의 기반으로 공고를 대행 등록해요.', '주관사가 합류하면 소유권이 이전됩니다.'],
    note: ['계약·정산 주체는 주관사입니다.', 'Popup OS는 도구를 제공합니다.'],
  },
  safety: {
    h2: ['개인정보와 신뢰,', '처음부터 안전하게'],
    cards: [
      { t: ['연락처 자동 마스킹'], s: ['외부 직접 연락 차단'], icon: 'EyeOff' },
      { t: ['사진 검수 후 노출'], s: ['부적절 사진 반려'], icon: 'ImageOff' },
      { t: ['실데이터 신뢰지표'], s: ['계약·근태 로그 기반'], icon: 'BadgeCheck' },
      { t: ['전자계약 무결성'], s: ['위·변조 방지 보관'], icon: 'FileLock' },
    ],
  },
  pricing: {
    h2: ['운영 규모에 맞춰', '시작하세요'],
    plans: [
      { name: 'Lite', price: '₩99,000', unit: '/월', who: ['소규모 대행사·단일 브랜드'],
        inc: ['동시 프로젝트 1개', '스태프 50명', '전자계약', 'QR 출퇴근', '기본 정산'], cta: '무료로 시작하기' },
      { name: 'Pro', price: '₩290,000', unit: '/월', who: ['성장하는 대행사'], hot: true,
        inc: ['동시 프로젝트 5개', '스태프 300명', '정산 자동화', '커리어 타임라인', '대행 등록'], cta: '무료로 시작하기' },
      { name: 'Agency', price: '별도 문의', unit: '', who: ['다수 클라이언트 운영'],
        inc: ['무제한 프로젝트', '다중 워크스페이스', '지급 대행', '전담 지원'], cta: '도입 문의' },
    ],
    foot: ['언제든 해지 · 부가세 별도 · 세금계산서 발행'],
  },
  inquiry: {
    h2: ['도입이 고민되시나요?', '20분이면 충분해요.'],
    submit: ['도입 문의 보내기'],
    consent: ['개인정보 수집·이용에 동의합니다'],
  },
  faq: [
    { q: ['도입까지 얼마나 걸리나요?'], a: ['보통 1~2일 내 세팅,', '첫 프로젝트까지 함께 도와드려요.'] },
    { q: ['기존 엑셀 데이터를 옮길 수 있나요?'], a: ['스태프·프로젝트 명단 이관을 지원합니다.'] },
    { q: ['스태프 교육이 필요한가요?'], a: ['알림톡 링크로 바로 서명·체크인,', '별도 교육이 필요 없어요.'] },
    { q: ['세금계산서 발행되나요?'], a: ['네, 구독료에 대해 발행됩니다.'] },
    { q: ['정산 지급도 대행해 주나요?'], a: ['Agency 플랜에서 지급 대행을 지원합니다.'] },
  ],
};

// ---------- Lines: render explicit line breaks ----------
function L({ lines }) {
  return lines.map((ln, i) => <React.Fragment key={i}>{ln}{i < lines.length - 1 && <br />}</React.Fragment>);
}

// ---------- Icon (lucide UMD) ----------
function Icon({ name, size = 20, stroke = 2, color = 'currentColor', style }) {
  const lib = window.lucide && window.lucide.icons;
  let node = lib && lib[name];
  if (!node) {
    return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke={color} strokeWidth={stroke} /></svg>;
  }
  const children = node[0] === 'svg' ? node[2] : node;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', ...style }}>
      {children.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

// ---------- Brand mark ----------
function Logo({ dark = false, size = 32 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: size, height: size, borderRadius: size * 0.28, background: 'var(--brand)',
        color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: size * 0.5 }}>
        P
        <span style={{ position: 'absolute', top: -2, right: -2, width: size * 0.3, height: size * 0.3, borderRadius: 99,
          background: 'var(--pop)', boxShadow: `0 0 0 2px ${dark ? 'var(--sidebar)' : 'var(--surface)'}` }} />
      </div>
      <span style={{ fontWeight: 800, fontSize: size * 0.56, letterSpacing: '-0.02em', color: dark ? '#fff' : 'var(--ink)' }}>Popup OS</span>
    </div>
  );
}

// ---------- Button ----------
function Btn({ children, kind = 'primary', size = 'lg', icon, full, style }) {
  const sz = { lg: { h: 56, px: 26, fs: 17 }, md: { h: 44, px: 18, fs: 15 }, sm: { h: 38, px: 14, fs: 14 } }[size];
  const kinds = {
    primary: { background: 'var(--brand)', color: '#fff', boxShadow: 'var(--shadow-brand)', border: '1px solid var(--brand)' },
    secondary: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line-2)' },
    ghostDark: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.22)' },
    light: { background: '#fff', color: 'var(--ink)', border: '1px solid #fff' },
  };
  return (
    <button className="lp-btn" style={{ height: sz.h, padding: `0 ${sz.px}px`, fontSize: sz.fs, width: full ? '100%' : undefined, ...kinds[kind], ...style }}>
      {children}{icon && <Icon name={icon} size={sz.fs + 1} />}
    </button>
  );
}

// ---------- Chip (status: success/warning/danger/info/brand/neutral/pop) ----------
function Chip({ tone = 'brand', icon, children, big }) {
  const t = {
    success: ['var(--success-50)', 'var(--success-700)'], warning: ['var(--warning-50)', 'var(--warning-700)'],
    danger: ['var(--danger-50)', 'var(--danger-700)'], info: ['var(--info-50)', 'var(--info-700)'],
    brand: ['var(--brand-50)', 'var(--brand-700)'], neutral: ['var(--surface-3)', 'var(--ink-3)'], pop: ['var(--pop-50)', 'var(--pop-700)'],
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: t[0], color: t[1], borderRadius: 7,
      fontSize: big ? 14 : 11.5, fontWeight: 700, padding: big ? '6px 12px' : '3px 8px', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
      {icon && <Icon name={icon} size={big ? 15 : 12} stroke={2.4} />}{children}
    </span>
  );
}

// ---------- Mockup frames ----------
const SHOTS = {
  dashboard: { src: 'refs/admin-dashboard.png', w: 1024, h: 640 },
  postings: { src: 'refs/admin-postings.png', w: 1024, h: 996 },
  checkin: { src: 'refs/checkin-qr.png', w: 500, h: 900 },
  profile: { src: 'refs/worker-profile.png', w: 151, h: 1007 },
};

// Browser-ish shell for admin console (shell radius 22 token)
function ConsoleFrame({ shot = 'dashboard', width = 860, cropH, style }) {
  const s = SHOTS[shot];
  const scale = width / s.w;
  const h = cropH ? cropH : s.h * scale;
  return (
    <div style={{ width, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)',
      boxShadow: '0 2px 4px rgba(16,24,40,.04), 0 32px 64px -12px rgba(16,24,40,.18)', overflow: 'hidden', ...style }}>
      <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 7, padding: '0 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--line-2)' }} />)}
        <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--subtle)', fontWeight: 600 }}>Popup OS · 관리자 콘솔</span>
      </div>
      <div style={{ height: h, overflow: 'hidden' }}>
        <img src={s.src} style={{ width, display: 'block' }} alt="" />
      </div>
    </div>
  );
}

// Phone shell
function Phone({ width = 260, children, shot, style }) {
  const screenW = width - 16;
  const screenH = Math.round(screenW * 900 / 500);
  return (
    <div style={{ width, padding: 8, borderRadius: 44, background: 'var(--ink)',
      boxShadow: '0 2px 4px rgba(16,24,40,.06), 0 40px 70px -16px rgba(16,24,40,.35)', ...style }}>
      <div style={{ position: 'relative', width: screenW, height: screenH, borderRadius: 36, overflow: 'hidden', background: 'var(--surface)' }}>
        {shot ? <img src={SHOTS[shot].src} style={{ width: screenW, display: 'block' }} alt="" /> : children}
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: width * 0.3, height: 22, borderRadius: 99, background: 'var(--ink)' }} />
      </div>
    </div>
  );
}

// Region crop from a screenshot: (x,y,w,h) in source px, rendered at `scale`
function Crop({ shot, x, y, w, h, scale = 1, radius = 16, style }) {
  const s = SHOTS[shot];
  return (
    <div style={{ width: w * scale, height: h * scale, overflow: 'hidden', position: 'relative', borderRadius: radius,
      background: 'var(--surface)', ...style }}>
      <img src={s.src} alt="" style={{ position: 'absolute', width: s.w * scale, left: -x * scale, top: -y * scale, maxWidth: 'none' }} />
    </div>
  );
}

// ---------- Worker 검카드 (HTML rebuild — source capture is 151px wide, too low-res) ----------
function WorkerCard({ compact }) {
  const tl = [
    { tone: 'brand', tag: 'Popup OS 검증', t: 'MOMENT POPUP 팝업', d: '2026.10.05 – 10.07 · 운영' },
    { tone: 'brand', tag: 'Popup OS 검증', t: '뷰티 체험 부스 운영', d: '2026.09.12 – 09.15 · 판매' },
    { tone: 'neutral', tag: '직접 추가', t: '타 주관 브랜드 팝업', d: '2026.08 · 응대' },
  ];
  return (
    <div style={{ padding: compact ? 16 : 18, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--brand-100)', color: 'var(--brand-700)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 18 }}>김</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <b style={{ fontSize: 17, color: 'var(--ink)' }}>김지은</b>
            <Chip tone="success" icon="ShieldCheck">본인인증 완료</Chip>
          </div>
          <span style={{ color: 'var(--muted-fg)', fontSize: 12 }}>판매·응대 · 서울 성동</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {[['출근율', 'OO%'], ['근무', 'OO회'], ['지각', 'O%']].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted-fg)', fontWeight: 600 }}>{k}</div>
            <div className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted-fg)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon name="Info" size={12} /> 계약·출퇴근 로그 기반 · 표본 OO건
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 2 }}>커리어 타임라인</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tl.map((r, i) => (
          <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '9px 11px', background: 'var(--surface)' }}>
            <Chip tone={r.tone} icon={r.tone === 'brand' ? 'BadgeCheck' : 'Pencil'}>{r.tag}</Chip>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: 6 }}>{r.t}</div>
            <div className="num" style={{ fontSize: 11, color: 'var(--muted-fg)', marginTop: 2 }}>{r.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={{ height: '100%', background: 'var(--background)' }}>
      <div style={{ padding: '40px 18px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ fontSize: 17, color: 'var(--ink)' }}>내 검카드</b>
        <Chip tone="brand" icon="Share2">공유</Chip>
      </div>
      <div style={{ margin: 12, background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <WorkerCard compact />
      </div>
    </div>
  );
}

// ---------- Section scaffolding ----------
function Eyebrow({ children, dark }) {
  return <div className="t-eyebrow" style={{ color: dark ? 'var(--brand-100)' : 'var(--brand-600)' }}>{children}</div>;
}
function SectionHead({ eyebrow, h2, sub, dark, center }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left' }}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2 className="t-h1" style={{ color: dark ? '#fff' : 'var(--ink)' }}><L lines={h2} /></h2>
      {sub && <p className="t-body-lg" style={{ color: dark ? 'var(--sidebar-fg)' : 'var(--muted-fg)' }}><L lines={sub} /></p>}
    </div>
  );
}

Object.assign(window, { COPY, L, Icon, Logo, Btn, Chip, SHOTS, ConsoleFrame, Phone, Crop, WorkerCard, ProfileScreen, Eyebrow, SectionHead });
