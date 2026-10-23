// 관리자 6화면. 모든 화면은 { w, state } 를 받는다. state: 'default' | 'empty' | 'loading' | 'error'
// 카피·데이터는 prototype/index.html 그대로.

function KpiRow({ items, state }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-4">
      {items.map((k, i) => (
        <Kpi key={i} {...k} state={state === 'loading' ? 'loading' : state === 'error' ? 'error' : undefined} />
      ))}
    </div>
  );
}
function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="px-[18px] py-2" aria-busy="true" aria-label="불러오는 중">
      <div className="flex gap-6 h-9 items-center border-b border-line">
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className="h-2.5 flex-1 max-w-[70px]" />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-6 h-[52px] items-center border-b border-surface-3 last:border-0">
          {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className={cx('h-3 flex-1', i === 0 ? 'max-w-[150px]' : 'max-w-[80px]')} />)}
        </div>
      ))}
    </div>
  );
}
const zeroKpis = (items) => items.map((k) => ({ ...k, value: k.zero ?? '0', sub: k.zeroSub ?? k.sub, tone: undefined, pulse: false }));

/* ───────── 1. 대시보드 ───────── */
function ScreenDashboard({ w = 1280, state = 'default' }) {
  const narrow = w < 1200;
  const kpis = [
    { label: '진행 중 프로젝트', value: '3', sub: '이번 주 종료 1', tone: 'brand', icon: 'FolderKanban' },
    { label: '오늘 출근', value: '42', unit: '/48', sub: '지각 2 · 미출근 4', tone: 'success', pulse: true, icon: 'UserCheck', zeroSub: '오늘 예정 인원 없음' },
    { label: '서명 대기 계약', value: '7', sub: '재발송 필요 2', icon: 'FileSignature', zeroSub: '대기 중인 계약 없음' },
    { label: '이번 주 정산 예정', value: '₩6.24M', sub: '대상 48명', icon: 'Wallet', zero: '₩0', zeroSub: '대상 0명' },
  ];
  const rows = [
    { site: <Cell title="무드랩 MOMENT POPUP" sub="더현대 서울 5F" />, pos: '운영 12', att: <AttendCell n={11} of={12} />, con: <span className="tabular font-semibold">12/12</span>, st: <Badge tone="success">정상</Badge> },
    { site: <Cell title="뉴욕의 거장들" sub="롯데백화점 잠실" />, pos: '서버 8', att: <AttendCell n={7} of={8} />, con: <span className="tabular font-semibold">8/8</span>, st: <Badge tone="warning">지각 1</Badge> },
    { site: <Cell title="퍼스트 라운딩" sub="성수 팝업존" />, pos: '상하차 6', att: <AttendCell n={4} of={6} warn />, con: <span className="tabular font-semibold text-warning-700 inline-flex items-center gap-1"><Icon name="Clock" size={13} />5/6</span>, st: <Badge tone="danger" icon="UserX">미출근 2</Badge>, _hl: true },
  ];
  const todo = [
    { tone: 'warning', icon: 'UserX', title: '미출근 2명', desc: '퍼스트 라운딩 상하차. 대체 인력 매칭 필요' },
    { tone: 'info', icon: 'FileSignature', title: '서명 미완료 7건', desc: '알림톡 재발송 가능' },
    { tone: 'brand', icon: 'Wallet', title: '정산 마감 임박', desc: '무드랩 10/07 종료, 정산서 발행 대기' },
  ];
  const body =
    state === 'loading' ? <TableSkeleton rows={3} /> :
    state === 'error' ? <ErrorState code="DASH-503" /> :
    state === 'empty' ? <EmptyState icon="CalendarX2" title="오늘 운영 중인 현장이 없어요" desc="새 프로젝트를 만들고 포지션을 등록하면 이곳에서 현장별 출근·계약 현황을 실시간으로 볼 수 있어요." action={<Button size="sm" icon="Plus">새 프로젝트</Button>} /> :
    <Table cols={[{ key: 'site', label: '현장' }, { key: 'pos', label: '포지션', width: 90 }, { key: 'att', label: '출근', width: narrow ? 120 : 150 }, { key: 'con', label: '계약', width: 80 }, { key: 'st', label: '상태', width: 110 }]} rows={rows} />;

  return (
    <AdminShell active="dashboard" width={w} height={state === 'default' ? 720 : 680}>
      <PageHeader crumb={['운영', '대시보드']} title="대시보드" actions={<><Button variant="outline" size="sm" icon="CalendarDays">오늘 · 10/05 (일)</Button><Button icon="Plus">새 프로젝트</Button></>} />
      <KpiRow items={state === 'empty' ? zeroKpis(kpis) : kpis} state={state} />
      <div className={cx('grid gap-4', narrow ? 'grid-cols-[1fr_300px]' : 'grid-cols-[1.6fr_1fr]')}>
        <Card className="overflow-hidden">
          <CardHeader title="오늘 현장 현황" action={state === 'default' && <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-success-700"><Dot pulse /> 실시간</span>} />
          {body}
        </Card>
        <Card>
          <CardHeader title="처리 필요" hint={state === 'default' ? '3건' : undefined} />
          {state === 'loading' ? (
            <div className="p-[18px] space-y-3">{[0, 1, 2].map((i) => <div key={i} className="flex gap-3"><Skeleton className="w-9 h-9 rounded-lg" /><div className="flex-1 space-y-2 pt-1"><Skeleton className="h-3 w-24" /><Skeleton className="h-2.5 w-40" /></div></div>)}</div>
          ) : state === 'error' ? (
            <ErrorState title="불러오지 못했어요" desc="잠시 후 다시 시도해 주세요." className="py-9" />
          ) : state === 'empty' ? (
            <EmptyState icon="CircleCheckBig" title="처리할 항목이 없어요" desc="미출근·서명 대기·정산 마감 알림이 생기면 여기에 모아 보여드려요." className="py-9" />
          ) : (
            <ul className="p-2">
              {todo.map((t, i) => (
                <li key={i}>
                  <a className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-2 cursor-pointer group">
                    <span className={cx('grid place-items-center w-9 h-9 rounded-lg shrink-0', TONE[t.tone].chip)}><Icon name={t.icon} size={17} /></span>
                    <span className="flex-1 min-w-0 pt-0.5">
                      <span className={cx('block text-[13px] font-bold', TONE[t.tone].text)}>{t.title}</span>
                      <span className="block text-caption text-ink-3 mt-0.5 text-pretty">{t.desc}</span>
                    </span>
                    <Icon name="ChevronRight" size={16} className="text-subtle mt-2.5 group-hover:text-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
function AttendCell({ n, of, warn }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cx('tabular font-bold w-[38px]', warn ? 'text-danger-700' : 'text-ink')}>{n}/{of}</span>
      <Progress value={(n / of) * 100} tone={n === of ? 'success' : 'brand'} className="flex-1 max-w-[80px] h-1.5" />
    </div>
  );
}

/* ───────── 2. 프로젝트·포지션 ───────── */
function ScreenProject({ w = 1280, state = 'default' }) {
  const narrow = w < 1200;
  const positions = [
    { t: '운영 스태프', s: '프로모터 · 10:00~19:00', n: 12, pay: '12,000', f: 12, st: <Badge tone="success">모집 완료</Badge> },
    { t: '서버', s: '음료·응대 · 11:00~20:00', n: 4, pay: '13,000', f: 2, st: <Badge tone="warning" icon="Hourglass">모집 중</Badge> },
    { t: '상하차', s: '08:00~12:00', n: 3, pay: '14,000', f: 2, st: <Badge tone="warning" icon="Hourglass">모집 중</Badge> },
  ];
  const posBody =
    state === 'loading' ? <div className="p-[18px] space-y-2.5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[62px] rounded-lg" />)}</div> :
    state === 'error' ? <ErrorState code="POS-500" /> :
    state === 'empty' ? <EmptyState icon="Users" title="등록된 포지션이 없어요" desc="역할·인원·시급·근무시간을 등록하면 모집 공고를 열 수 있어요." action={<Button variant="soft" size="sm" icon="Plus">포지션 추가</Button>} /> :
    (
      <div>
        <div className={cx('grid gap-3 px-[18px] h-9 items-center border-b border-line bg-surface-2/60 text-label uppercase text-muted-foreground', narrow ? 'grid-cols-[1fr_56px_84px_110px_96px]' : 'grid-cols-[1fr_70px_100px_150px_104px]')}>
          <span>역할</span><span className="text-right">모집</span><span className="text-right">시급</span><span>충원</span><span>상태</span>
        </div>
        {positions.map((p, i) => (
          <div key={i} className={cx('grid gap-3 px-[18px] h-[64px] items-center border-b border-surface-3 last:border-0 hover:bg-surface-2/70', narrow ? 'grid-cols-[1fr_56px_84px_110px_96px]' : 'grid-cols-[1fr_70px_100px_150px_104px]')}>
            <div className="min-w-0"><div className="text-[14px] font-bold text-ink">{p.t}</div><div className="text-caption text-muted-foreground truncate">{p.s}</div></div>
            <div className="text-right tabular"><b className="text-[14px]">{p.n}</b><span className="text-caption text-muted-foreground">명</span></div>
            <div className="text-right tabular"><span className="text-caption text-muted-foreground">₩</span><b className="text-[14px]">{p.pay}</b></div>
            <div>
              <Progress value={(p.f / p.n) * 100} tone={p.f === p.n ? 'success' : 'brand'} />
              <div className="text-caption text-muted-foreground mt-1 tabular"><b className="text-ink-2">{p.f}/{p.n}</b> 충원</div>
            </div>
            <div>{p.st}</div>
          </div>
        ))}
      </div>
    );
  const info = [
    ['장소', '더현대 서울 5F 이벤트홀'],
    ['기간', '2026.10.05 ~ 10.07 (3일)'],
    ['GPS 좌표', <span className="tabular">37.5259, 126.9284</span>],
    ['인증 반경', '100m · QR 1차 / GPS 보조'],
    ['담당', '김매니저'],
  ];
  return (
    <AdminShell active="project" width={w} height={600}>
      <PageHeader
        crumb={['운영', '프로젝트·포지션']}
        title="무드랩 MOMENT POPUP 팝업"
        meta={state !== 'loading' && <div className="flex items-center gap-2"><Badge tone="success" dot pulse>진행 중</Badge><span className="text-caption text-muted-foreground">더현대 서울 · 10.05 ~ 10.07</span></div>}
        actions={<><Button variant="outline" size="sm" icon="Pencil">수정</Button><Button size="sm" icon="Megaphone" disabled={state === 'empty'}>모집 공고 열기</Button></>}
      />
      <div className={cx('grid gap-4', narrow ? 'grid-cols-[300px_1fr]' : 'grid-cols-[1fr_1.45fr]')}>
        <Card>
          <CardHeader title="현장 정보" icon="MapPin" />
          <CardBody className="pt-2">
            {state === 'loading' ? <div className="space-y-4 pt-2">{info.map((_, i) => <div key={i} className="flex justify-between"><Skeleton className="h-3 w-14" /><Skeleton className="h-3 w-32" /></div>)}</div> : <KV rows={narrow ? info.map(([k, v]) => [k, v]) : info} />}
            <Note tone="info" className="mt-3" compact>실내 특성상 GPS 오차가 크므로 현장 QR을 1차 인증으로 사용합니다.</Note>
          </CardBody>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader title="모집 포지션" hint="Positions" action={state !== 'empty' && <Button variant="soft" size="sm" icon="Plus">포지션 추가</Button>} />
          {posBody}
        </Card>
      </div>
    </AdminShell>
  );
}

/* ───────── 3. 지원자 스크리닝 ───────── */
const WORKERS = [
  { ini: '김지', tone: 'brand', name: '김지은', badges: [<Badge key="v" tone="success" icon="BadgeCheck">검증 완료</Badge>], meta: '여 · 28세 · 서울 마포 · 가능일 10/05~10/07 전체', sel: true,
    stats: [['노쇼율', '0%', 'success', '표본 28건'], ['완료 건수', '31'], ['재고용률', '92%', 'brand', '실제 재고용 23/25'], ['지각률', '3%', 'warning']],
    tags: [['pos', '#POS숙달'], ['default', '#프로모터 경력 2년'], ['lang', '#일어가능']], act: 'approve' },
  { ini: '이하', tone: 'pop', name: '이하늘', badges: [<Badge key="n" tone="warning" icon="Sparkles">신규 · 검증 필요</Badge>], meta: '여 · 22세 · 인천 · 가능일 10/06~10/07',
    stats: [['노쇼율', '—', null, '표본 0건'], ['완료 건수', '0'], ['재고용률', '—', null, '데이터 없음'], ['지각률', '—']],
    tags: [['pos', '#POS숙달'], ['default', '#첫 근무']], note: true, act: 'trial' },
  { ini: 'EM', tone: 'info', name: 'Emma Müller', badges: [<Badge key="f" tone="info" icon="Globe">외국인</Badge>, <Badge key="v" tone="success" icon="BadgeCheck">검증 완료</Badge>], meta: '여 · 25세 · 독일 · 체류자격 확인 완료 · 가능일 10/05~10/07', sel: true,
    stats: [['노쇼율', '0%', 'success', '표본 12건'], ['완료 건수', '14'], ['재고용률', '88%', 'brand', '실제 재고용 8/9'], ['지각률', '8%', 'warning']],
    tags: [['lang', '#영어가능'], ['lang', '#독일어가능'], ['default', '#응대']], act: 'approve' },
  { ini: '최민', tone: 'danger', name: '최민준', badges: [<Badge key="c" tone="danger" icon="TriangleAlert">주의</Badge>], meta: '남 · 31세 · 서울 강서 · 가능일 10/05~10/07',
    stats: [['노쇼율', '12%', 'danger', '표본 9건'], ['완료 건수', '8'], ['재고용률', '60%', null, '실제 재고용 3/5'], ['지각률', '11%', 'danger']],
    tags: [['pos', '#상하차가능'], ['default', '#체력직']], act: 'caution' },
];
function WorkerCard({ wk, narrow, state }) {
  const valCls = (t) => ({ success: 'text-success-700', brand: 'text-brand-600', warning: 'text-warning-700', danger: 'text-danger-700' }[t] || 'text-ink');
  return (
    <Card hoverable state={state} className={cx('p-4 grid gap-4 items-start', narrow ? 'grid-cols-[auto_44px_1fr]' : 'grid-cols-[auto_52px_1fr_auto_auto]', wk.sel && 'border-brand-100 bg-brand-50/25')}>
      <span className="pt-4"><Checkbox checked={wk.sel} /></span>
      <Avatar initials={wk.ini} size={narrow ? 44 : 52} tone={wk.tone} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-extrabold text-ink">{wk.name}</span>
          {wk.badges}
        </div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{wk.meta}</div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">{wk.tags.map(([k, t], i) => <Tag key={i} kind={k}>{t}</Tag>)}</div>
        {wk.note && <Note tone="warning" compact className="mt-2.5 max-w-[520px]">이력 데이터가 없습니다. <b className="text-warning-700">시범 채용</b> 또는 현장 매니저 확인을 권장합니다.</Note>}
        {narrow && <div className="mt-3"><StatGrid wk={wk} valCls={valCls} /></div>}
        {narrow && <div className="flex gap-2 mt-3"><WorkerActions wk={wk} row /></div>}
      </div>
      {!narrow && <StatGrid wk={wk} valCls={valCls} />}
      {!narrow && <div className="flex flex-col gap-1.5 w-[92px]"><WorkerActions wk={wk} /></div>}
    </Card>
  );
}
function StatGrid({ wk, valCls }) {
  return (
    <div className="grid grid-cols-4 rounded-lg border border-line bg-surface-2/60 divide-x divide-line">
      {wk.stats.map(([l, v, t, n], i) => (
        <div key={i} className="px-3 py-2 min-w-[86px]">
          <div className="text-[11px] font-semibold text-muted-foreground">{l}</div>
          <div className={cx('text-[17px] font-extrabold tabular leading-tight mt-0.5', v === '—' ? 'text-subtle' : valCls(t))}>{v}</div>
          <div className="text-[10.5px] font-semibold text-muted-foreground tabular h-[15px]">{n || ''}</div>
        </div>
      ))}
    </div>
  );
}
function WorkerActions({ wk, row }) {
  const p = wk.act === 'approve' ? <Button size="sm" icon="Check" block={!row}>승인</Button>
    : wk.act === 'trial' ? <Button variant="soft" size="sm" icon="FlaskConical" block={!row}>시범 채용</Button>
    : <Button variant="outline" size="sm" icon="Check" block={!row}>승인</Button>;
  return <>{p}<Button variant="outline" size="sm" icon="Pause" block={!row}>보류</Button></>;
}
function ScreenScreening({ w = 1280, state = 'default' }) {
  const narrow = w < 1200;
  const filters = ['전체', '#POS숙달', '#외국어가능', '#상하차가능', '신규만', '노쇼 0%'];
  const body =
    state === 'loading' ? <div className="space-y-2.5">{[0, 1, 2].map((i) => <Card key={i} className="p-4 flex gap-4"><Skeleton className="w-[52px] h-[52px] rounded-[14px]" /><div className="flex-1 space-y-2.5 pt-1"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-72" /><Skeleton className="h-5 w-56" /></div><Skeleton className="w-[340px] h-[60px] rounded-lg" /></Card>)}</div> :
    state === 'error' ? <Card><ErrorState code="APP-502" /></Card> :
    state === 'empty' ? <Card><EmptyState icon="UserSearch" title="아직 지원자가 없어요" desc="모집 공고를 열면 지원자가 이곳에 표시돼요. 필터를 적용했다면 조건을 줄여 보세요." action={<div className="flex gap-2"><Button variant="outline" size="sm" icon="FilterX">필터 초기화</Button><Button size="sm" icon="Megaphone">모집 공고 열기</Button></div>} /></Card> :
    <div className="space-y-2.5">{WORKERS.map((wk, i) => <WorkerCard key={i} wk={wk} narrow={narrow} state={i === 0 ? 'hover' : undefined} />)}</div>;
  return (
    <AdminShell active="screen" width={w} height={state === 'default' ? (narrow ? 1200 : 900) : 600}>
      <PageHeader
        crumb={['운영', '지원자 스크리닝']}
        title={<>운영 스태프 지원자 <span className="text-muted-foreground tabular">({state === 'empty' ? 0 : 24})</span></>}
        actions={<Button icon="CheckCheck" disabled={state !== 'default'}>선택 승인 ({state === 'default' ? 2 : 0})</Button>}
      />
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="지원자 필터">{filters.map((f, i) => <FilterChip key={f} on={i === 0}>{f}</FilterChip>)}</div>
        {!narrow && <span className="text-caption text-muted-foreground flex items-center gap-1"><Icon name="Info" size={13} />신뢰 지표는 표본 수와 함께 표시</span>}
      </div>
      {body}
    </AdminShell>
  );
}

/* ───────── 4. 전자계약 ───────── */
function ScreenContract({ w = 1280, state = 'default' }) {
  const kpis = [
    { label: '발송', value: '48', sub: '표준근로계약서', icon: 'Send' },
    { label: '서명 완료', value: '41', sub: '85.4%', tone: 'success', icon: 'FileCheck2', zeroSub: '0%' },
    { label: '서명 대기', value: '7', sub: '재발송 대상 2', icon: 'Clock', zeroSub: '대기 없음' },
    { label: '만료 예정', value: '1', sub: '24시간 내 미서명', tone: 'danger', icon: 'AlarmClock', zeroSub: '만료 예정 없음' },
  ];
  const view = <Button variant="outline" size="sm" icon="FileText">계약서 보기</Button>;
  const resend = <Button variant="soft" size="sm" icon="RotateCw">재발송</Button>;
  const rows = [
    { n: '김지은', p: '운영', s: '10/03 09:12', g: '10/03 09:14', st: <Badge tone="success">계약 확정</Badge>, a: view },
    { n: 'Emma Müller', p: '운영', s: '10/03 09:12', g: '10/03 10:02', st: <Badge tone="success">계약 확정</Badge>, a: view },
    { n: '박서준', p: '서버', s: '10/03 09:12', g: '—', st: <Badge tone="warning">서명 대기</Badge>, a: resend },
    { n: '이하늘', p: '운영', s: '10/03 09:12', g: '—', st: <Badge tone="warning">서명 대기</Badge>, a: resend },
    { n: '최민준', p: '상하차', s: '10/03 09:12', g: '—', st: <Badge tone="danger" icon="AlarmClock">만료 임박</Badge>, a: resend, _hl: true },
  ].map((r) => ({ ...r, n: <span className="font-bold">{r.n}</span>, s: <span className="tabular text-ink-3">{r.s}</span>, g: <span className={cx('tabular', r.g === '—' ? 'text-subtle' : 'text-ink-3')}>{r.g}</span> }));
  const body =
    state === 'loading' ? <TableSkeleton cols={6} /> :
    state === 'error' ? <ErrorState title="발송 내역을 불러오지 못했어요" code="CTR-504" /> :
    state === 'empty' ? <EmptyState icon="FileSignature" title="발송한 계약서가 없어요" desc="지원자를 승인하면 표준근로계약서를 알림톡으로 일괄 발송할 수 있어요." action={<Button size="sm" variant="outline" icon="UserSearch">지원자 스크리닝으로</Button>} /> :
    <Table cols={[{ key: 'n', label: '성명' }, { key: 'p', label: '포지션', width: 90 }, { key: 's', label: '발송', width: 120 }, { key: 'g', label: '서명', width: 120 }, { key: 'st', label: '상태', width: 120 }, { key: 'a', label: '', width: 120, align: 'right' }]} rows={rows} />;
  return (
    <AdminShell active="contract" width={w} height={state === 'default' ? 740 : 710}>
      <PageHeader crumb={['운영', '전자계약']} title="계약 발송·서명 현황" actions={<Button icon="SendHorizontal" disabled={state === 'empty' || state === 'loading'}>승인자 전원 일괄 발송</Button>} />
      <KpiRow items={state === 'empty' ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="발송 대상" hint="알림톡(알리고) · 실패 시 이메일 폴백" />
        {body}
      </Card>
      <Note tone="brand" icon="LockKeyhole" title="무결성 저장" className="mt-3.5">서명 완료 시 계약 PDF + 서명 해시 + 타임스탬프 + 본인확인 결과를 함께 보관합니다. 계약서에는 근로기준법 제17조 필수 기재사항(장소·업무·소정근로시간·임금·휴일)이 포함됩니다.</Note>
    </AdminShell>
  );
}

/* ───────── 5. 출퇴근 현황 ───────── */
function AuthBadge({ kind }) {
  if (kind === 'qrgps') return <Badge tone="success" icon="ShieldCheck">QR+GPS</Badge>;
  if (kind === 'qr') return <Badge tone="warning" icon="QrCode">QR만</Badge>;
  if (kind === 'mismatch') return <Badge tone="danger" icon="MapPinOff">GPS 불일치</Badge>;
  return <Badge tone="neutral">미인증</Badge>;
}
function ScreenAttend({ w = 1280, state = 'default' }) {
  const kpis = [
    { label: '출근', value: '42', sub: '/48 예정', tone: 'success', pulse: true, icon: 'UserCheck', zeroSub: '/0 예정' },
    { label: '지각', value: '2', sub: '10분 초과', tone: 'warning', icon: 'Clock' },
    { label: '미출근', value: '4', sub: '대체 매칭 필요', tone: 'danger', icon: 'UserX', zeroSub: '—' },
    { label: '퇴근 완료', value: '0', sub: '퇴근 예정 19:00', icon: 'LogOut' },
  ];
  const rows = [
    { n: '김지은', s: '더현대 5F', t: '09:52', a: <AuthBadge kind="qrgps" />, st: <Badge tone="success">정상</Badge>, x: <span className="text-subtle">—</span> },
    { n: 'Emma Müller', s: '더현대 5F', t: '09:58', a: <AuthBadge kind="qrgps" />, st: <Badge tone="success">정상</Badge>, x: <span className="text-subtle">—</span> },
    { n: '박서준', s: '롯데 잠실', t: '10:14', a: <AuthBadge kind="qr" />, st: <Badge tone="warning">지각</Badge>, x: <span className="text-caption text-ink-3 inline-flex items-center gap-1"><Icon name="MapPinOff" size={12} />GPS 반경 밖</span> },
    { n: '이하늘', s: '성수 팝업존', t: '—', a: <AuthBadge />, st: <Badge tone="danger" icon="UserX">미출근</Badge>, x: <Button variant="soft" size="sm" icon="UserPlus">대체 매칭</Button>, _hl: true },
    { n: '최민준', s: '성수 팝업존', t: '09:47', a: <AuthBadge kind="mismatch" />, st: <Badge tone="warning" icon="FilePen">정정요청</Badge>, x: <Button variant="outline" size="sm" icon="Eye">검토</Button> },
  ].map((r) => ({ ...r, n: <span className="font-bold">{r.n}</span>, s: <span className="text-ink-3">{r.s}</span>, t: <span className={cx('tabular font-semibold', r.t === '—' && 'text-subtle')}>{r.t}</span> }));
  const body =
    state === 'loading' ? <TableSkeleton cols={6} /> :
    state === 'error' ? <ErrorState title="근태 로그를 불러오지 못했어요" desc="실시간 연결이 끊겼어요. 마지막 동기화 09:58" code="ATT-RT-01" action={<Button variant="outline" size="sm" icon="RotateCw">다시 연결</Button>} /> :
    state === 'empty' ? <EmptyState icon="ScanLine" title="아직 체크인 기록이 없어요" desc="스태프가 매니저 QR을 스캔하면 출근 기록이 실시간으로 쌓여요." action={<Button size="sm" icon="QrCode">QR 표시</Button>} /> :
    <Table cols={[{ key: 'n', label: '성명' }, { key: 's', label: '현장', width: 120 }, { key: 't', label: '출근', width: 72 }, { key: 'a', label: '인증', width: 120 }, { key: 'st', label: '상태', width: 110 }, { key: 'x', label: '', width: 130, align: 'right' }]} rows={rows} />;
  return (
    <AdminShell active="attend" width={w} height={state === 'default' ? 760 : 680}>
      <PageHeader
        crumb={['운영', '출퇴근 현황']}
        title="실시간 출퇴근 · 10/05"
        actions={<><Button variant="outline" size="sm" icon="FilePen">정정요청 <span className="ml-0.5 inline-grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-warning-50 text-warning-700 text-[11px] tabular">{state === 'default' ? 3 : 0}</span></Button><Button size="sm" icon="QrCode">QR 표시</Button></>}
      />
      <KpiRow items={state === 'empty' ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="근태 로그" hint="인증방식: QR(주) + GPS(보조) + 사진" action={state === 'default' && <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-success-700"><Dot pulse /> 실시간</span>} />
        {body}
      </Card>
      <Note tone="warning" icon="ShieldAlert" title="위치조작(mock location) 대비" className="mt-3.5">GPS 단독 인증은 신뢰하지 않고 QR·사진·매니저 확인을 우선합니다. GPS 불일치 건은 자동 정상 처리하지 않고 검토 큐로 보냅니다.</Note>
    </AdminShell>
  );
}

/* ───────── 6. 정산·급여 ───────── */
function ScreenSettle({ w = 1280, state = 'default' }) {
  const narrow = w < 1200;
  const kpis = [
    { label: '정산 대상', value: '19', unit: '명', sub: '무드랩 3일', icon: 'Users' },
    { label: '총 근로시간', value: '513', unit: 'h', sub: '휴게 제외', icon: 'Timer' },
    { label: '총 지급액', value: '₩6.24M', sub: '세전', tone: 'brand', icon: 'Wallet', zero: '₩0' },
    { label: '원천징수', value: '₩206K', sub: '3.3% / 일용 구분', icon: 'Landmark', zero: '₩0' },
  ];
  const num = (v, cls = '') => <span className={cx('tabular', cls)}>{v}</span>;
  const rows = [
    ['김지은', '3일', '27h', '324,000', '31,200', '-11,722', '343,478', <Badge tone="brand">지급 예정</Badge>],
    ['Emma Müller', '3일', '27h', '324,000', '31,200', '-11,722', '343,478', <Badge tone="brand">지급 예정</Badge>],
    ['박서준', '2일', '16h', '208,000', '8,000', '-7,128', '208,872', <Badge tone="warning" icon="Search">검토 중</Badge>],
    ['이하늘', '2일', '18h', '216,000', '0', '-7,128', '208,872', <Badge tone="neutral" icon="UserX">미출근 정산</Badge>],
  ].map(([n, d, h, b, x, tx, net, st]) => ({ n: <span className="font-bold">{n}</span>, d: num(d), h: num(h), b: num(b), x: num(x), tx: num(tx, 'text-danger-700'), net: num(net, 'font-extrabold'), st }));
  const body =
    state === 'loading' ? <TableSkeleton rows={4} cols={8} /> :
    state === 'error' ? <ErrorState title="급여를 계산하지 못했어요" desc="근무 로그 동기화 중 오류가 발생했어요. 정산 규칙을 확인하거나 다시 시도해 주세요." code="PAY-CALC-422" action={<><Button variant="outline" size="sm" icon="Settings2">정산 규칙</Button><Button variant="outline" size="sm" icon="RotateCw">다시 계산</Button></>} /> :
    state === 'empty' ? <EmptyState icon="Receipt" title="정산할 근무 기록이 없어요" desc="프로젝트 기간이 끝나면 출퇴근 로그를 기반으로 급여가 자동 계산돼요." /> :
    <Table dense={narrow} cols={[{ key: 'n', label: '성명' }, { key: 'd', label: '근무일', align: 'right' }, { key: 'h', label: '총시간', align: 'right' }, { key: 'b', label: '기본급', align: 'right' }, { key: 'x', label: '가산·주휴', align: 'right' }, { key: 'tx', label: '원천징수', align: 'right' }, { key: 'net', label: '실지급', align: 'right' }, { key: 'st', label: '상태', width: narrow ? 112 : 124 }]} rows={rows} />;
  return (
    <AdminShell active="settle" width={w} height={state === 'default' ? 720 : 710}>
      <PageHeader
        crumb={['운영', '정산·급여']}
        title="정산 마감 · 무드랩 (10/05~10/07)"
        actions={<><Button variant="outline" size="sm" icon="Settings2">정산 규칙</Button><Button size="sm" icon="FileOutput" disabled={state !== 'default'}>정산서 발행</Button></>}
      />
      <KpiRow items={state === 'empty' ? zeroKpis(kpis) : kpis} state={state} />
      <Card className="overflow-hidden">
        <CardHeader title="급여 계산서" hint="근무 로그 자동 산출 · 이의신청 0" />
        {body}
      </Card>
      <div className="grid grid-cols-2 gap-3.5 mt-3.5">
        <Note tone="info" icon="Scale" title="일용/단기 구분">1개월 미만 단기 근로는 일용근로소득(소득세 6%·지방소득세 0.6%) 또는 3.3% 사업소득 중 계약 형태에 따라 선택. 정산 규칙 테이블로 관리합니다.</Note>
        <Note tone="brand" icon="Banknote" title="지급 대행(선택)">토스페이먼츠/포트원 연동 시 정산서 발행 → 지급 실행 → 상태 추적까지 자동화. Phase 1.5 후보.</Note>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { ScreenDashboard, ScreenProject, ScreenScreening, ScreenContract, ScreenAttend, ScreenSettle });
