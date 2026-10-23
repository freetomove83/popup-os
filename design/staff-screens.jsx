// 스태프 앱 3화면 (390 폭, PWA). 큰 터치 타깃(≥48px), 한 화면 = 하나의 다음 행동.
function PhoneShell({ eyebrow, title, children, footer, height = 844 }) {
  return (
    <div className="bg-surface flex flex-col overflow-hidden" style={{ width: 390, height }}>
      <div className="flex justify-between items-center px-6 h-[44px] text-[13px] font-bold text-ink-2 tabular shrink-0">
        <span>9:41</span>
        <span className="flex items-center gap-1.5 text-ink-2"><Icon name="Signal" size={15} /><Icon name="Wifi" size={15} /><Icon name="BatteryFull" size={18} /></span>
      </div>
      <header className="px-5 pt-1 pb-3.5 border-b border-line shrink-0">
        <div className="flex items-center gap-1.5">
          <Mark size={18} variant="b" />
          <span className="text-[11.5px] font-bold text-muted-foreground tracking-[0.04em]">{eyebrow}</span>
        </div>
        <h1 className="text-[20px] font-extrabold tracking-[-0.015em] text-ink mt-1.5">{title}</h1>
      </header>
      <div className="flex-1 overflow-hidden px-5 py-4">{children}</div>
      {footer && <footer className="px-5 pt-3 pb-7 border-t border-line bg-surface shrink-0">{footer}</footer>}
    </div>
  );
}
function SectionLabel({ children }) {
  return <div className="text-[12px] font-bold text-muted-foreground tracking-[0.04em] mb-2">{children}</div>;
}
function DocBox({ title, rows }) {
  return (
    <div className="rounded-[14px] border border-line overflow-hidden">
      {title && <div className="px-4 h-10 flex items-center bg-surface-2 border-b border-line text-[12.5px] font-bold text-ink-2">{title}</div>}
      <div className="px-4"><KV rows={rows} size="lg" /></div>
    </div>
  );
}
function CheckRow({ children, checked = true }) {
  return (
    <label className="flex items-start gap-3 py-3 min-h-[48px] cursor-pointer">
      <Checkbox checked={checked} size={22} />
      <span className="text-[14px] text-ink-2 leading-snug pt-[1px]">{children}</span>
    </label>
  );
}
function StaffSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-[64px] rounded-[14px]" />
      <div className="rounded-[14px] border border-line p-4 space-y-4">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex justify-between"><Skeleton className="h-3.5 w-16" /><Skeleton className="h-3.5 w-36" /></div>)}</div>
      <Skeleton className="h-[110px] rounded-[14px]" />
    </div>
  );
}

/* ───────── S1. 계약 서명 ───────── */
function StaffContract({ state = 'default' }) {
  const rows = [
    ['근로장소', '더현대 서울 5F 이벤트홀'],
    ['업무내용', '운영 스태프(프로모터)'],
    ['소정근로일', '2026.10.05 ~ 10.07 (3일)'],
    ['근로시간', '10:00~19:00 (휴게 1h)'],
    ['임금', <span className="tabular">시급 12,000원 · 일급 96,000원</span>],
    ['임금 지급일', '근로종료 후 7일 이내'],
  ];
  if (state === 'loading') return <PhoneShell eyebrow="POPUP OS · 전자계약" title="표준근로계약서 서명" footer={<Button size="xl" block loading>계약서 불러오는 중</Button>}><StaffSkeleton /></PhoneShell>;
  if (state === 'error') return <PhoneShell eyebrow="POPUP OS · 전자계약" title="표준근로계약서 서명" footer={<Button size="xl" block variant="outline" icon="RotateCw">다시 시도</Button>}><ErrorState title="서명을 저장하지 못했어요" desc="서명은 기기에 임시 보관돼 있어요. 연결이 복구되면 다시 시도해 주세요. (Signature not saved — please retry.)" code="SIGN-409" action={<span />} className="pt-20" /></PhoneShell>;
  if (state === 'empty') return <PhoneShell eyebrow="POPUP OS · 전자계약" title="표준근로계약서 서명"><EmptyState icon="FileCheck2" title="서명할 계약서가 없어요" desc="새 계약서가 도착하면 카카오 알림톡으로 알려드려요. (No contracts to sign.)" className="pt-24" /></PhoneShell>;
  return (
    <PhoneShell eyebrow="POPUP OS · 전자계약" title="표준근로계약서 서명" footer={<Button size="xl" block icon="PenLine">서명 완료하고 계약 확정</Button>}>
      <div className="space-y-3">
        <div className="flex gap-3 items-start rounded-[14px] p-3.5" style={{ background: '#FEE500', color: '#3C1E1E' }}>
          <span className="grid place-items-center w-7 h-7 rounded-lg shrink-0" style={{ background: '#3C1E1E', color: '#FEE500' }}><Icon name="MessageCircle" size={15} strokeWidth={2.6} /></span>
          <div className="text-[13px] font-bold leading-snug">김지은님, 10/05 더현대 팝업 근로계약서가 도착했어요. 1분 내 서명해 주세요.</div>
        </div>
        <DocBox title="근로계약 요약 (필수 기재사항)" rows={rows} />
        <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-lg bg-success-50 border border-success-200">
          <Icon name="BadgeCheck" size={18} className="text-success-700" />
          <span className="text-[13px] font-bold text-success-700">본인확인 완료</span>
          <span className="text-[12.5px] text-ink-3">PASS · 1996년생 김지은</span>
        </div>
        <div className="relative h-[92px] rounded-[14px] border-[1.5px] border-dashed border-brand-100 bg-brand-50/50 grid place-items-center">
          <span className="text-[28px] text-brand-700" style={{ fontFamily: '"Segoe Script","Brush Script MT",cursive', transform: 'rotate(-6deg)' }}>Kim Jieun</span>
          <span className="absolute bottom-2 right-3 text-[11.5px] font-semibold text-muted-foreground">여기에 서명</span>
          <button className="absolute top-2 right-2 h-8 px-2.5 rounded-md text-[12px] font-bold text-ink-3 hover:bg-surface-3 inline-flex items-center gap-1"><Icon name="Eraser" size={13} />지우기</button>
        </div>
        <div className="-my-2"><CheckRow>계약 내용을 확인했으며 이에 동의합니다.</CheckRow></div>
      </div>
    </PhoneShell>
  );
}

/* ───────── S2. 출근 체크인 ───────── */
function MapBlock({ ok = true }) {
  return (
    <div className="relative h-[200px] rounded-[16px] border border-line overflow-hidden bg-surface-2"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, hsl(var(--line)) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, hsl(var(--line)) 0 1px, transparent 1px 28px)' }}>
      <span className="absolute left-3 bottom-3 font-mono text-[10px] text-muted-foreground bg-surface/80 px-1.5 rounded">지도 SDK 영역 (Kakao/Naver Map)</span>
      <div className={cx('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full border-2', ok ? 'border-brand bg-brand/10' : 'border-danger bg-danger/10 border-dashed')} />
      <div className="absolute left-[62%] top-[34%] text-ink"><Icon name="MapPin" size={24} className="text-ink" strokeWidth={2.2} /></div>
      <div className={cx('absolute w-4 h-4 rounded-full border-[3px] border-white', ok ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand shadow-[0_0_0_3px_hsl(var(--brand)/.3)]' : 'left-[86%] top-[80%] bg-danger shadow-[0_0_0_3px_hsl(var(--danger)/.3)]')} />
      <span className={cx('absolute left-3 top-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-surface shadow-soft text-[12px] font-bold', ok ? 'text-success-700' : 'text-danger-700')}>
        <Icon name={ok ? 'LocateFixed' : 'LocateOff'} size={14} />{ok ? 'GPS 인증 정상 · 반경 100m' : 'GPS 반경 밖 · 약 240m'}
      </span>
    </div>
  );
}
function StepRow({ n, icon, title, sub, st }) {
  const done = st === 'done';
  return (
    <div className="flex items-center gap-3 h-[56px]">
      <span className={cx('grid place-items-center w-9 h-9 rounded-[11px] shrink-0', done ? 'bg-success-50 text-success-700' : st === 'fail' ? 'bg-danger-50 text-danger-700' : 'bg-surface-3 text-ink-3')}><Icon name={icon} size={18} /></span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-ink">{title}</div>
        <div className="text-[12px] text-muted-foreground">{sub}</div>
      </div>
      {done ? <Badge tone="success">완료</Badge> : st === 'fail' ? <Badge tone="danger">불일치</Badge> : <Badge tone="neutral" icon="Circle">대기</Badge>}
    </div>
  );
}
function StaffCheckin({ state = 'default' }) {
  const foot = <div className="flex justify-between text-[12.5px] text-muted-foreground font-medium tabular"><span>퇴근 예정 19:00</span><span>근무 3일 중 1일차</span></div>;
  const eb = 'POPUP OS · 출퇴근', tt = '더현대 서울 5F · 1일차';
  if (state === 'loading') return <PhoneShell eyebrow={eb} title={tt} footer={foot}><div className="space-y-4"><div className="relative h-[200px] rounded-[16px] bg-surface-3 animate-pulse grid place-items-center"><span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink-3"><Icon name="LoaderCircle" size={16} className="animate-spin" />현재 위치 확인 중…</span></div><Skeleton className="h-[170px] rounded-[14px]" /><Skeleton className="h-14 rounded-[14px]" /></div></PhoneShell>;
  if (state === 'empty') return <PhoneShell eyebrow={eb} title="오늘 근무 일정 없음"><EmptyState icon="CalendarX2" title="오늘 예정된 근무가 없어요" desc="계약이 확정된 근무일에만 체크인할 수 있어요. (No shift scheduled today.)" className="pt-24" /></PhoneShell>;
  const err = state === 'error';
  return (
    <PhoneShell eyebrow={eb} title={tt} footer={foot}>
      <div className="space-y-3.5">
        <MapBlock ok={!err} />
        <div className="rounded-[14px] border border-line px-3.5 divide-y divide-surface-3">
          <StepRow icon="QrCode" title="매니저 QR 스캔" sub="1차 인증 · 필수" st={err ? 'wait' : 'done'} />
          <StepRow icon="LocateFixed" title="GPS 위치 확인" sub="보조 · 반경 100m" st={err ? 'fail' : 'done'} />
          <StepRow icon="Camera" title="사진 인증" sub="현장 셀피" st="done" />
        </div>
        {err ? (
          <Note tone="danger" icon="MapPinOff" title="현장 반경 밖이에요">매니저 QR을 스캔하면 체크인할 수 있어요. GPS 불일치는 관리자 검토로 넘어가요.</Note>
        ) : (
          <Note tone="info">실내 GPS 오차·위치조작 대비 <b className="text-info-700">QR 스캔</b>을 1차 인증으로 사용합니다. GPS는 보조 확인입니다.</Note>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="xl" icon="ScanQrCode" className={err ? 'flex-1' : 'w-[120px]'}>{err ? '매니저 QR 스캔' : 'QR'}</Button>
          <Button variant="success" size="xl" icon="LogIn" className="flex-1" disabled={err}>출근 체크인 <span className="tabular font-semibold opacity-90">09:52</span></Button>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ───────── S3. 정산 내역 ───────── */
function PayLine({ k, v, neg, total }) {
  return (
    <div className={cx('flex justify-between items-baseline py-3', !total && 'border-b border-dashed border-line')}>
      <span className={cx(total ? 'text-[15px] font-bold text-ink' : 'text-[14px] text-muted-foreground font-medium')}>{k}</span>
      <span className={cx('tabular', total ? 'text-[22px] font-extrabold text-brand-600 tracking-[-0.02em]' : 'text-[15px] font-bold', neg ? 'text-danger-700' : !total && 'text-ink')}>{v}</span>
    </div>
  );
}
function StaffSettle({ state = 'default' }) {
  const eb = 'POPUP OS · 내 정산', tt = '10월 정산 내역';
  if (state === 'loading') return <PhoneShell eyebrow={eb} title={tt} footer={<Button size="xl" variant="outline" block disabled>이의신청</Button>}><StaffSkeleton /></PhoneShell>;
  if (state === 'error') return <PhoneShell eyebrow={eb} title={tt}><ErrorState title="정산 내역을 불러오지 못했어요" desc="잠시 후 다시 시도해 주세요. (Couldn’t load your payslip.)" code="PAY-W-503" action={<Button size="lg" variant="outline" icon="RotateCw">다시 시도</Button>} className="pt-24" /></PhoneShell>;
  if (state === 'empty') return <PhoneShell eyebrow={eb} title={tt}><EmptyState icon="Receipt" title="아직 정산 내역이 없어요" desc="근무가 끝나면 급여 계산 결과를 여기에서 확인할 수 있어요. (No payslips yet.)" className="pt-24" /></PhoneShell>;
  return (
    <PhoneShell eyebrow={eb} title={tt} footer={<Button size="xl" variant="outline" block icon="MessageSquareWarning">이의신청</Button>}>
      <div className="space-y-4">
        <DocBox rows={[
          ['근무 프로젝트', '무드랩 팝업 (3일)'],
          ['총 근로시간', <span className="tabular">27시간 (휴게 제외)</span>],
          ['지급 상태', <Badge tone="brand">지급 예정 (10/14)</Badge>],
        ]} />
        <div>
          <SectionLabel>급여 계산</SectionLabel>
          <PayLine k="기본급 (27h × 12,000)" v="324,000" />
          <PayLine k="연장·야간 가산" v="12,000" />
          <PayLine k="주휴수당" v="19,200" />
          <PayLine k="원천징수 (3.3%)" v="-11,722" neg />
          <div className="mt-1 rounded-[14px] bg-brand-50 px-4"><PayLine k="실지급액" v="343,478원" total /></div>
        </div>
        <Note tone="warning">계산 결과가 다르면 <b className="text-warning-700">이의신청</b>을 눌러 근무 로그와 함께 관리자 검토를 요청할 수 있습니다.</Note>
      </div>
    </PhoneShell>
  );
}

Object.assign(window, { StaffContract, StaffCheckin, StaffSettle, PhoneShell });
