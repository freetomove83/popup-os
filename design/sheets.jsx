// 01 브랜드 시트 · 02 토큰 · 03 컴포넌트 · 05 핸드오프 아트보드
const SH = { pad: 'p-10' };
function SheetTitle({ no, title, sub }) {
  return (
    <div className="mb-8">
      <div className="text-label uppercase text-brand-600">{no}</div>
      <h2 className="text-h1 text-ink mt-1">{title}</h2>
      {sub && <p className="text-body text-muted-foreground mt-1.5 max-w-[720px] text-pretty">{sub}</p>}
    </div>
  );
}
function Lbl({ children, className = '' }) {
  return <div className={cx('text-label uppercase text-muted-foreground mb-3', className)}>{children}</div>;
}

/* ───────── 01-A 마크 ───────── */
function BrandMarks() {
  const opts = [
    { v: 'a', name: 'A · 기본형', desc: '현행 P 마크 정제. 그라데이션 제거, 단색 Violet + r30%.', pick: false },
    { v: 'b', name: 'B · 팝 도트', desc: '우상단 Amber 도트 = "지금 열린 팝업". 상태점(dot) 언어와 연결.', pick: true },
    { v: 'c', name: 'C · 말풍선 컷', desc: '좌하단 모서리를 각지게 — 알림톡/팝업 말풍선 연상.', pick: false },
  ];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="01 · Brand Sheet" title="마크 & 워드마크" sub="확정: B · 팝 도트 (2026-10). 워드마크 'Popup OS' 유지, 단색 Violet 라운드 사각형 + 우상단 Pop Amber 도트. 그라데이션·글로우 제거." />
      <div className="grid grid-cols-3 gap-5">
        {opts.map((o) => (
          <div key={o.v} className={cx('rounded-card border p-6', o.pick ? 'border-brand ring-4 ring-brand/10' : 'border-line')}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-h3 text-ink">{o.name}</span>
              {o.pick ? <Badge tone="success">확정</Badge> : <Badge tone="neutral" icon="FlaskConical">미채택</Badge>}
            </div>
            <div className="h-[150px] rounded-lg bg-surface-2 grid place-items-center mb-4"><Mark variant={o.v} size={88} ring="ring-surface-2" /></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-16 rounded-lg bg-sidebar flex items-center justify-center gap-2.5"><Mark variant={o.v} size={30} ring="ring-sidebar" /><Wordmark size={16} dark /></div>
              <div className="h-16 rounded-lg border border-line flex items-center justify-center gap-2.5"><Mark variant={o.v} size={30} /><Wordmark size={16} /></div>
            </div>
            <div className="flex items-end gap-4 mb-4">
              {[48, 32, 24, 16].map((s) => <div key={s} className="flex flex-col items-center gap-1.5"><Mark variant={o.v} size={s} /><span className="text-[10.5px] text-muted-foreground tabular">{s}</span></div>)}
            </div>
            <p className="text-body-sm text-ink-3 text-pretty">{o.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1fr] gap-5 mt-6">
        <div className="rounded-card border border-line p-6">
          <Lbl>로고 사용 규칙</Lbl>
          <ul className="space-y-2.5 text-body text-ink-2">
            {[
              ['Check', 'success', '최소 크기 — 마크 16px(파비콘), 락업 높이 24px 이상'],
              ['Check', 'success', '여백 — 마크 높이의 25% 이상 사방 확보'],
              ['Check', 'success', '배경 — 흰색/surface-2/sidebar(#12141F) 3종만 허용'],
              ['Check', 'success', "워드마크 'OS'는 brand 컬러(다크 배경에선 brand-100)"],
              ['X', 'danger', '그라데이션·글로우·그림자 추가 금지'],
              ['X', 'danger', 'Pop Amber 배경 위 배치 금지(대비 부족) · 회전·늘림 금지'],
            ].map(([i, t, s], k) => <li key={k} className="flex gap-2.5"><Icon name={i} size={16} className={cx('mt-[3px]', TONE[t].text)} strokeWidth={2.6} />{s}</li>)}
          </ul>
        </div>
        <div className="rounded-card border border-line p-6">
          <Lbl>락업</Lbl>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Mark size={42} /><div><Wordmark size={22} /><div className="text-[10.5px] tracking-[0.22em] uppercase text-muted-foreground mt-1.5 font-semibold">Operational OS for Popup Stores</div></div></div>
            <div className="flex items-center gap-2.5"><Mark size={32} /><div><Wordmark size={15} /><div className="text-[11px] text-muted-foreground font-semibold mt-1">더블엠 · 관리자</div></div></div>
            <div className="flex items-center gap-1.5"><Mark size={18} /><span className="text-[11.5px] font-bold text-muted-foreground tracking-[0.04em]">POPUP OS · 전자계약</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── 01-B 팔레트 ───────── */
const SW = (name, hex, token, onDark, note) => ({ name, hex, token, onDark, note });
function Swatch({ s, big }) {
  return (
    <div>
      <div className={cx('rounded-lg border border-black/5 flex items-end p-2.5', big ? 'h-[92px]' : 'h-[64px]')} style={{ background: s.hex }}>
        {s.note && <span className={cx('text-[10.5px] font-bold tabular', s.onDark ? 'text-white' : 'text-ink')}>{s.note}</span>}
      </div>
      <div className="mt-2 text-[12px] font-bold text-ink">{s.name}</div>
      <div className="text-[11px] text-muted-foreground tabular font-mono">{s.hex} · {s.token}</div>
    </div>
  );
}
function BrandPalette() {
  const core = [SW('Electric Violet', '#6C5CE7', 'brand', 1, 'Aa 4.86'), SW('Violet 600', '#5A49D6', 'brand-600', 1, 'Aa 6.25'), SW('Violet 700', '#4638B8', 'brand-700', 1, 'Aa 8.34'), SW('Violet 100', '#DFD9FF', 'brand-100'), SW('Violet 50', '#EEEBFF', 'brand-50'), SW('Pop Amber', '#FF9F1C', 'pop', 0, 'Ink 9.32'), SW('Amber 700', '#93530A', 'pop-700', 1), SW('Amber 50', '#FFF4E3', 'pop-50')];
  const neu = [SW('Ink', '#0B0F1A', 'ink', 1), SW('Ink 2', '#1A2233', 'ink-2', 1), SW('Ink 3', '#3B4658', 'ink-3', 1), SW('Muted fg', '#5E6879', 'muted-foreground', 1, '정제'), SW('Subtle', '#98A2B3', 'subtle', 1, '비텍스트'), SW('Line 2', '#D3D8E8', 'line-2'), SW('Line', '#E4E7F1', 'line'), SW('Surface 3', '#ECEEF6', 'surface-3'), SW('Background', '#EEF0F7', 'background'), SW('Surface 2', '#F6F7FB', 'surface-2'), SW('Surface', '#FFFFFF', 'surface')];
  const sem = [
    ['success', '정상 · 완료 · 출근', '#12B76A', '#ABEFC6', '#E6F8EF', '#067647', 'CircleCheck'],
    ['warning', '지각 · 대기 · 주의', '#F79009', '#FEDF89', '#FEF3E4', '#B54708', 'Clock'],
    ['danger', '미출근 · 오류 · 위험', '#F04438', '#FECDCA', '#FEECEB', '#B42318', 'CircleX'],
    ['info', '정보 · 외국인 · 안내', '#2E90FA', '#B2DDFF', '#EAF3FF', '#175CD3', 'Info'],
  ];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="01 · Brand Sheet" title="팔레트" sub="§3 기준값을 유지하고, AA 미달 지점만 텍스트 전용 단계(700)와 muted-foreground 정제값을 추가했습니다. 원색(500)은 점·아이콘·진행바 전용입니다." />
      <Lbl>Brand + Accent</Lbl>
      <div className="grid grid-cols-8 gap-3 mb-8">{core.map((s) => <Swatch key={s.token} s={s} big />)}</div>
      <Lbl>Neutral</Lbl>
      <div className="grid grid-cols-11 gap-3 mb-8">{neu.map((s) => <Swatch key={s.token} s={s} />)}</div>
      <Lbl>Semantic — 500 점·아이콘 / 200 보더 / 50 배경 / 700 텍스트</Lbl>
      <div className="grid grid-cols-4 gap-4">
        {sem.map(([k, d, c5, c2, c0, c7, ic]) => (
          <div key={k} className="rounded-card border border-line overflow-hidden">
            <div className="grid grid-cols-4 h-12">{[c5, c2, c0, c7].map((h) => <div key={h} style={{ background: h }} />)}</div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-h3 text-ink">{k}</span>
                <Badge tone={k} icon={ic}>{d.split(' · ')[0]}</Badge>
              </div>
              <div className="text-caption text-muted-foreground mt-1">{d}</div>
              <div className="text-[11px] font-mono text-ink-3 mt-2 tabular">{c7} on {c0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── 01-C 대안 팔레트 ───────── */
function AltPalette() {
  const sets = [
    { name: '기준안 · Violet × Amber', pick: true, b: '#6C5CE7', b6: '#5A49D6', b0: '#EEEBFF', a: '#FF9F1C', side: '#12141F', note: '팝업의 생기 + B2B 신뢰. 현행 자산과 연속성 유지. 최종 확정.' },
    { name: '대안 · Cobalt × Coral', b: '#2F5BEA', b6: '#2249C9', b0: '#E8EEFF', a: '#FF7A59', side: '#0F1626', note: '더 "업무 도구"스러운 신뢰감. 단, info(블루)와 충돌 → info를 teal로 이동 필요. 이식 비용 ↑' },
  ];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="01 · Brand Sheet" title="대안 팔레트 1안" sub="확정: 기준안 Violet × Amber (2026-10). 대안은 기록용으로만 보관합니다." />
      <div className="grid grid-cols-2 gap-6">
        {sets.map((s) => (
          <div key={s.name} className={cx('rounded-card border p-6', s.pick ? 'border-brand ring-4 ring-brand/10' : 'border-line')}>
            <div className="flex items-center justify-between mb-4"><span className="text-h3">{s.name}</span>{s.pick ? <Badge tone="success">확정</Badge> : <Badge tone="neutral" icon="FlaskConical">비교용</Badge>}</div>
            <div className="flex h-[200px] rounded-lg overflow-hidden border border-line">
              <div className="w-[64px] p-2.5 flex flex-col gap-2" style={{ background: s.side }}>
                <span className="w-9 h-9 rounded-[10px] grid place-items-center text-white font-extrabold" style={{ background: s.b }}>P</span>
                <span className="h-8 rounded-lg mt-2" style={{ background: s.b }} />
                {[0, 1, 2].map((i) => <span key={i} className="h-8 rounded-lg bg-white/5" />)}
              </div>
              <div className="flex-1 bg-background p-4 space-y-3">
                <div className="flex gap-2">
                  <span className="h-9 px-4 rounded-lg grid place-items-center text-white text-[13px] font-bold" style={{ background: s.b }}>새 프로젝트</span>
                  <span className="h-9 px-4 rounded-lg grid place-items-center text-ink text-[13px] font-bold" style={{ background: s.a }}>CTA</span>
                  <span className="h-9 px-4 rounded-lg grid place-items-center text-[13px] font-bold" style={{ background: s.b0, color: s.b6 }}>재발송</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['3', '42', '7'].map((v, i) => <div key={i} className="bg-white rounded-lg border border-line p-2.5"><div className="text-[10px] text-muted-foreground">KPI</div><div className="text-[20px] font-extrabold" style={{ color: i === 0 ? s.b6 : '#0B0F1A' }}>{v}</div></div>)}
                </div>
                <div className="h-2 rounded-full bg-surface-3"><div className="h-full w-2/3 rounded-full" style={{ background: s.b }} /></div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">{[s.b, s.b6, s.b0, s.a, s.side].map((h) => <span key={h} className="flex-1 h-8 rounded-md border border-black/5" style={{ background: h }} />)}</div>
            <p className="text-body-sm text-ink-3 mt-3 text-pretty">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── 01-D 타이포 ───────── */
function TypeScale() {
  const rows = [
    ['display', '38 / 800 / -0.02em', '팝업스토어 운영을 한 곳에서', 'text-display'],
    ['h1', '28 / 800 / -0.02em', '정산 마감 · 무드랩', 'text-h1'],
    ['h2', '20 / 800 / -0.015em', '실시간 출퇴근 · 10/05', 'text-h2'],
    ['h3', '15 / 700 / -0.01em', '오늘 현장 현황', 'text-h3'],
    ['kpi', '26 / 800 / tabular', '₩6,240,000', 'text-kpi tabular'],
    ['body-lg', '15 / 400 · 스태프', '계약 내용을 확인했으며 이에 동의합니다.', 'text-body-lg'],
    ['body', '13.5 / 400 · 관리자', '실내 특성상 GPS 오차가 크므로 현장 QR을 1차 인증으로 사용합니다.', 'text-body'],
    ['body-sm', '12.5 / 400', '알림톡(알리고) · 실패 시 이메일 폴백', 'text-body-sm'],
    ['caption', '11.5 / 400', '이번 주 종료 1 · 표본 28건', 'text-caption'],
    ['label', '11 / 700 / +0.06em', 'POSITION · STATUS · 실지급', 'text-label uppercase'],
  ];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="01 · Brand Sheet" title="타이포 스케일 — Pretendard" sub="Tailwind fontSize 토큰으로 정의(행간·자간·굵기 포함). 13.5/11.5 같은 비정수 값을 임의값(text-[13.5px]) 대신 이름으로 사용합니다." />
      <div className="divide-y divide-line border-y border-line">
        {rows.map(([t, spec, s, c]) => (
          <div key={t} className="grid grid-cols-[150px_200px_1fr] items-center gap-6 py-4">
            <code className="text-[12px] font-mono text-brand-700 bg-brand-50 px-2 py-1 rounded-sm w-fit">text-{t}</code>
            <span className="text-caption text-muted-foreground tabular">{spec}</span>
            <span className={cx(c, 'text-ink truncate')}>{s}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 mt-6">
        <div className="rounded-card border border-line p-5">
          <Lbl>숫자 — tabular-nums</Lbl>
          <div className="grid grid-cols-2 gap-6">
            <div><div className="text-caption text-muted-foreground mb-1">proportional ✗</div>{['111,111', '343,478', '208,872'].map((n) => <div key={n} className="text-[18px] font-bold text-right" style={{ fontVariantNumeric: 'proportional-nums' }}>{n}</div>)}</div>
            <div><div className="text-caption text-success-700 mb-1">tabular ✓</div>{['111,111', '343,478', '208,872'].map((n) => <div key={n} className="text-[18px] font-bold text-right tabular">{n}</div>)}</div>
          </div>
        </div>
        <div className="rounded-card border border-line p-5">
          <Lbl>국·영 병기 (외국인 스태프)</Lbl>
          <div className="text-h3 text-ink">서명을 저장하지 못했어요</div>
          <div className="text-body-sm text-muted-foreground">Signature not saved — please retry.</div>
          <p className="text-caption text-ink-3 mt-3 text-pretty">영문 보조문은 한 단계 작은 크기 + muted-foreground. 오류·빈 상태·법적 고지 등 '행동이 막히는 순간'에만 병기합니다.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── 02 토큰 ───────── */
function TokenSheet() {
  const shapes = [['rounded-shell', 22, 'App shell'], ['rounded-card', 16, 'Card · KPI'], ['rounded-lg', 10, 'Button · Input'], ['rounded-md', 8, 'Button sm'], ['rounded-chip', 7, 'Badge'], ['rounded-sm', 6, 'Tag']];
  const shadows = [['shadow-soft', 'Card 기본'], ['shadow-soft-hover', 'Card hover'], ['shadow-brand', 'Primary 버튼'], ['shadow-overlay', 'Dialog · Toast']];
  const space = [4, 8, 12, 16, 24, 32];
  const aa = [
    ['primary-foreground / primary', '#FFFFFF', '#6C5CE7', '4.86', 1],
    ['ink / pop (CTA)', '#0B0F1A', '#FF9F1C', '9.32', 1],
    ['white / pop', '#FFFFFF', '#FF9F1C', '2.05', 0],
    ['muted-fg / background', '#5E6879', '#EEF0F7', '4.94', 1],
    ['(구) muted / background', '#6B7688', '#EEF0F7', '4.03', 0],
    ['(구) muted-2 / surface', '#98A2B3', '#FFFFFF', '2.58', 0],
    ['success-700 / success-50', '#067647', '#E6F8EF', '5.16', 1],
    ['warning-700 / warning-50', '#B54708', '#FEF3E4', '4.95', 1],
    ['(구) #B56A00 / amber-50', '#B56A00', '#FEF3E4', '3.81', 0],
    ['danger-700 / danger-50', '#B42318', '#FEECEB', '5.76', 1],
    ['info-700 / info-50', '#175CD3', '#EAF3FF', '5.35', 1],
    ['secondary-fg / secondary', '#4638B8', '#EEEBFF', '7.13', 1],
    ['white / success-700 (버튼)', '#FFFFFF', '#067647', '5.69', 1],
    ['(구) white / green', '#FFFFFF', '#12B76A', '2.62', 0],
    ['sidebar-muted / sidebar', '#8A93AB', '#12141F', '5.97', 1],
    ['(구) #5B6379 / sidebar', '#5B6379', '#12141F', '3.06', 0],
  ];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="02 · Tokens" title="토큰 확정본" sub="원본은 tokens/globals.css(CSS 변수, HSL 채널) → tokens/tailwind.config.ts가 참조. shadcn/ui 시맨틱 이름(primary, muted, destructive, ring…)을 그대로 사용해 컴포넌트 수정 없이 테마가 적용됩니다." />
      <div className="grid grid-cols-[1fr_1fr] gap-6">
        <div>
          <Lbl>Radius</Lbl>
          <div className="grid grid-cols-6 gap-3 mb-7">
            {shapes.map(([c, v, u]) => <div key={c}><div className="h-16 bg-brand-50 border-2 border-brand-100" style={{ borderRadius: v }} /><div className="text-[11.5px] font-bold mt-2 font-mono">{c}</div><div className="text-[11px] text-muted-foreground tabular">{v}px · {u}</div></div>)}
          </div>
          <Lbl>Shadow</Lbl>
          <div className="grid grid-cols-4 gap-4 mb-7 bg-background p-5 rounded-card">
            {shadows.map(([c, u]) => <div key={c}><div className={cx('h-16 bg-surface rounded-card', c, c === 'shadow-brand' && 'bg-brand')} /><div className="text-[11.5px] font-bold mt-2 font-mono">{c}</div><div className="text-[11px] text-muted-foreground">{u}</div></div>)}
          </div>
          <Lbl>Spacing — 4px 그리드</Lbl>
          <div className="flex items-end gap-5">
            {space.map((s) => <div key={s} className="flex flex-col items-center gap-1.5"><div className="bg-brand rounded-[2px]" style={{ width: s, height: s }} /><span className="text-[11px] tabular text-muted-foreground">{s} · {s / 4}</span></div>)}
          </div>
          <div className="mt-7"><Lbl>Breakpoints</Lbl>
            <div className="flex gap-2 flex-wrap">{[['mobile', '620'], ['lg', '1024'], ['xl', '1280'], ['2xl', '1440']].map(([k, v]) => <span key={k} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-line text-[12px]"><code className="font-mono font-bold text-brand-700">{k}</code><span className="tabular text-muted-foreground">{v}px</span></span>)}</div>
          </div>
        </div>
        <div>
          <Lbl>접근성 대비 (WCAG 2.1 · 본문 4.5:1)</Lbl>
          <div className="rounded-card border border-line overflow-hidden">
            {aa.map(([n, f, b, r, ok], i) => (
              <div key={i} className={cx('grid grid-cols-[52px_1fr_64px_80px] items-center gap-3 px-3.5 h-[38px] border-b border-surface-3 last:border-0', !ok && 'bg-surface-2/60')}>
                <span className="h-6 rounded-[6px] grid place-items-center text-[12px] font-bold" style={{ background: b, color: f, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)' }}>Aa</span>
                <span className={cx('text-[12px] font-mono truncate', ok ? 'text-ink-2' : 'text-muted-foreground line-through decoration-danger/40')}>{n}</span>
                <span className="text-[12.5px] font-bold tabular text-right">{r}</span>
                {ok ? <Badge tone="success">AA</Badge> : <Badge tone="danger" icon="Ban">폐기</Badge>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function CodeSheet({ title, file, code, w = 760, h = 980 }) {
  return (
    <div className="bg-sidebar text-sidebar-foreground flex flex-col" style={{ width: w, height: h }}>
      <div className="flex items-center gap-2 h-11 px-4 border-b border-sidebar-border text-[12px] font-semibold"><Icon name="FileCode2" size={15} className="text-brand-100" /><span className="text-white">{file}</span><span className="text-sidebar-muted ml-auto">{title}</span></div>
      <pre className="flex-1 overflow-hidden m-0 p-4 text-[11px] leading-[1.6] font-mono whitespace-pre text-[#C9CFE0]">{code}</pre>
    </div>
  );
}

/* ───────── 03 컴포넌트 ───────── */
const STATES = ['default', 'hover', 'focus', 'disabled', 'loading'];
function StateHead() {
  return <>{['', ...STATES].map((s) => <div key={s} className="text-label uppercase text-muted-foreground pb-2 border-b border-line">{s}</div>)}</>;
}
function CompButtons() {
  const vs = [['primary', '새 프로젝트', 'Plus'], ['dark', '확인', null], ['outline', '보류', 'Pause'], ['soft', '재발송', 'RotateCw'], ['success', '출근 체크인', 'LogIn'], ['pop', '모집 공고 열기', 'Megaphone'], ['ghost', '취소', null], ['destructive', '계약 파기', 'Trash2']];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="03 · Components" title="Button" sub="shadcn Button + cva. variant 8 · size sm(32)/md(40)/lg(48)/xl(56, 스태프 CTA). focus는 ring-2 ring-ring ring-offset-2, loading은 LoaderCircle + aria-busy, disabled는 opacity-45." />
      <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-x-4 gap-y-4 items-center">
        <StateHead />
        {vs.map(([v, l, i]) => (
          <React.Fragment key={v}>
            <code className="text-[12px] font-mono text-ink-2">variant="{v}"</code>
            {STATES.map((s) => <div key={s}><Button variant={v} icon={i} state={s}>{l}</Button></div>)}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-line flex items-end gap-4">
        {['sm', 'md', 'lg', 'xl'].map((s) => <div key={s} className="flex flex-col gap-2"><Button size={s} icon="Check">승인</Button><code className="text-[11px] font-mono text-muted-foreground">size="{s}"</code></div>)}
        <div className="flex flex-col gap-2"><Button size="icon" variant="outline"><Icon name="Ellipsis" size={16} /></Button><code className="text-[11px] font-mono text-muted-foreground">size="icon"</code></div>
        <div className="ml-auto max-w-[420px]"><Note tone="warning" icon="TriangleAlert" title="pop(Amber) 버튼은 ink 텍스트">흰 텍스트 2.05:1 → 금지. 화면당 최대 1개, 전환 유도 CTA에만.</Note></div>
      </div>
    </div>
  );
}
function CompBadges() {
  const tones = [['success', '정상'], ['warning', '서명 대기'], ['danger', '미출근'], ['info', '외국인'], ['brand', '지급 예정'], ['neutral', '미인증']];
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="03 · Components" title="Badge · Tag · Filter chip · Status dot" sub="상태는 반드시 색 + 아이콘 + 라벨 3중 표기. 아이콘은 상태 의미로 고정(success=CircleCheck, warning=Clock, danger=CircleX, info=Info, brand=CalendarClock, neutral=CircleMinus) — 맥락 아이콘으로 교체 가능." />
      <div className="grid grid-cols-6 gap-4">
        {tones.map(([t, l]) => (
          <div key={t} className="rounded-card border border-line p-4 space-y-2.5">
            <code className="text-[11.5px] font-mono text-ink-2">tone="{t}"</code>
            <div><Badge tone={t}>{l}</Badge></div>
            <div><Badge tone={t} dot pulse={t === 'success'}>{l}</Badge></div>
            <div className="flex items-center gap-1.5 pt-1 text-caption text-ink-3"><Dot tone={t} pulse={t === 'success'} />상태점 7px</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5 mt-6">
        <div className="rounded-card border border-line p-5">
          <Lbl>Tag (11px · r6)</Lbl>
          <div className="flex flex-wrap gap-1.5"><Tag kind="pos">#POS숙달</Tag><Tag kind="lang">#일어가능</Tag><Tag>#프로모터 경력 2년</Tag></div>
          <p className="text-caption text-muted-foreground mt-3">pos=브랜드 · lang=블루+Languages 아이콘 · 일반=회색</p>
        </div>
        <div className="rounded-card border border-line p-5">
          <Lbl>Filter chip (ToggleGroup)</Lbl>
          <div className="flex flex-wrap gap-2"><FilterChip on>전체</FilterChip><FilterChip>기본</FilterChip><FilterChip state="hover">hover</FilterChip><FilterChip state="focus">focus</FilterChip></div>
          <p className="text-caption text-muted-foreground mt-3">선택 시 ink 배경 + Check 아이콘 · aria-pressed</p>
        </div>
        <div className="rounded-card border border-line p-5">
          <Lbl>Status dot pulse</Lbl>
          <div className="flex items-center gap-3"><Badge tone="success" dot pulse>실시간</Badge><span className="text-caption text-ink-3">'정상·실시간'에만 사용, prefers-reduced-motion 시 정지</span></div>
        </div>
      </div>
    </div>
  );
}
function CompCards() {
  return (
    <div className={cx('bg-background', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="03 · Components" title="Card · KPI · Table · Note · Progress · Avatar" />
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <Kpi label="오늘 출근" value="42" unit="/48" sub="지각 2 · 미출근 4" tone="success" pulse icon="UserCheck" />
        <Kpi label="만료 예정" value="1" sub="24시간 내 미서명" tone="danger" icon="AlarmClock" />
        <Kpi label="KPI loading" state="loading" />
        <Kpi label="KPI error" icon="Wallet" state="error" />
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <Card className="overflow-hidden">
          <CardHeader title="Table" hint="헤더 11 대문자 · 행 52 / dense 44 · 숫자 우측 tabular" />
          <Table cols={[{ key: 'n', label: '성명' }, { key: 'h', label: '총시간', align: 'right' }, { key: 'v', label: '실지급', align: 'right' }, { key: 's', label: '상태', width: 120 }]}
            rows={[{ n: <span className="font-bold">김지은</span>, h: '27h', v: <b>343,478</b>, s: <Badge tone="brand">지급 예정</Badge> }, { n: <span className="font-bold">박서준</span>, h: '16h', v: <b>208,872</b>, s: <Badge tone="warning" icon="Search">검토 중</Badge> }, { n: <span className="font-bold">이하늘</span>, h: '18h', v: <b>208,872</b>, s: <Badge tone="neutral">미출근 정산</Badge> }]} />
        </Card>
        <div className="space-y-3">
          <Note tone="warning" title="미출근 2명">퍼스트 라운딩 상하차. 대체 인력 매칭 필요</Note>
          <Note tone="info">실내 GPS 오차가 크므로 현장 QR을 1차 인증으로 사용합니다.</Note>
          <Note tone="brand" icon="LockKeyhole" title="무결성 저장">계약 PDF + 서명 해시 + 타임스탬프</Note>
          <Note tone="danger" icon="MapPinOff" title="현장 반경 밖">매니저 QR을 스캔하세요.</Note>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Card className="p-5"><Lbl>Progress (8px)</Lbl><div className="space-y-3"><Progress value={100} tone="success" /><Progress value={50} /><Progress value={66} /></div></Card>
        <Card className="p-5"><Lbl>Avatar</Lbl><div className="flex items-end gap-3"><Avatar initials="김지" size={52} /><Avatar initials="이하" size={52} tone="pop" /><Avatar initials="EM" size={44} tone="info" /><Avatar initials="최민" size={44} tone="danger" /><Avatar initials="김" size={32} tone="dark" round /></div><p className="text-caption text-muted-foreground mt-3">카드 r27%(52→14) · 사이드바 full</p></Card>
        <Card hoverable state="hover" className="p-5"><Lbl>Card hover</Lbl><p className="text-body-sm text-ink-3">클릭 가능한 카드(지원자)만 border-brand-100 + shadow-soft-hover. 정보 카드는 hover 없음.</p></Card>
      </div>
    </div>
  );
}
function CompForms() {
  return (
    <div className={cx('bg-surface', SH.pad)} style={{ width: 1280 }}>
      <SheetTitle no="03 · Components" title="Input · Select · Checkbox · Toast · Drawer" sub="focus = border-brand + ring-[3px] ring-brand/20 (shadcn 기본 ring-offset 대신 인셋 링 — 표 안에서도 레이아웃 흔들림 없음)." />
      <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-x-4 gap-y-4 items-end">
        <StateHead />
        <code className="text-[12px] font-mono text-ink-2 pb-3">Input</code>
        {['default', 'hover', 'focus', 'disabled', 'error'].map((s) => <Input key={s} state={s} icon="Search" value={s === 'disabled' ? '김매니저' : s === 'error' ? '37.52a' : ''} placeholder="이름·연락처 검색" />)}
        <code className="text-[12px] font-mono text-ink-2 pb-3">Select</code>
        {['default', 'hover', 'focus', 'disabled'].map((s) => <Select key={s} state={s} value={s === 'default' ? '' : '운영 스태프'} placeholder="포지션 선택" />)}
        <div className="h-10 flex items-center text-caption text-muted-foreground"><Icon name="LoaderCircle" size={14} className="animate-spin mr-1.5" />옵션 불러오는 중</div>
        <code className="text-[12px] font-mono text-ink-2 pb-1">Checkbox</code>
        {['default', 'hover', 'focus', 'disabled'].map((s, i) => <div key={s} className="flex items-center gap-2 text-body"><Checkbox checked={i !== 0} state={s} />동의</div>)}
        <span />
      </div>
      <div className="grid grid-cols-2 gap-5 mt-6">
        <Field label="GPS 좌표" error="좌표 형식이 올바르지 않아요 (예: 37.5259, 126.9284)"><Input state="error" value="37.52a" /></Field>
        <Field label="인증 반경" hint="실내는 QR 1차 인증을 권장해요"><Select value="100m" /></Field>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-8 mt-8 pt-6 border-t border-line">
        <div><Lbl>Toast (sonner)</Lbl><div className="space-y-2.5"><Toast tone="success" title="계약서 5건을 발송했어요" desc="알림톡 · 10/03 09:12" action="보기" /><Toast tone="warning" title="알림톡 1건 실패 → 이메일로 재발송" /><Toast tone="danger" title="정산서를 발행하지 못했어요" desc="PAY-CALC-422" action="다시 시도" /></div></div>
        <div>
          <Lbl>Drawer (vaul) — 스태프 바텀시트</Lbl>
          <div className="relative w-[390px] h-[300px] rounded-[22px] overflow-hidden border border-line bg-ink/40">
            <div className="absolute inset-x-0 bottom-0 bg-surface rounded-t-[22px] px-5 pt-2.5 pb-7 shadow-overlay">
              <div className="w-10 h-1.5 rounded-full bg-line-2 mx-auto mb-4" />
              <div className="text-h2 text-ink">이의신청</div>
              <div className="text-body-sm text-muted-foreground mt-1 mb-4">근무 로그와 함께 관리자에게 전달돼요.</div>
              <Input value="" placeholder="어떤 항목이 다른가요?" />
              <div className="flex gap-2 mt-4"><Button variant="outline" size="lg" className="flex-1">취소</Button><Button size="lg" className="flex-1">보내기</Button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BrandMarks, BrandPalette, AltPalette, TypeScale, TokenSheet, CodeSheet, CompButtons, CompBadges, CompCards, CompForms, SheetTitle, Lbl });
