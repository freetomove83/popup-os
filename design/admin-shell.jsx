// 관리자 콘솔 셸 — 다크 사이드바 + 라이트 콘텐츠. 1280: 확장 사이드바(240) / 1024: 레일(72)
const NAV = [
  { sec: '운영' },
  { key: 'dashboard', label: '대시보드', icon: 'LayoutDashboard' },
  { key: 'project', label: '프로젝트·포지션', icon: 'FolderKanban' },
  { key: 'screen', label: '지원자 스크리닝', icon: 'UserSearch' },
  { key: 'contract', label: '전자계약', icon: 'FileSignature' },
  { key: 'attend', label: '출퇴근 현황', icon: 'ScanLine' },
  { key: 'settle', label: '정산·급여', icon: 'Wallet' },
  { sec: 'Phase 1.5' },
  { key: 'wait', label: '웨이팅콜', icon: 'Hourglass', soon: true },
  { key: 'ws', label: '워크스페이스', icon: 'MessagesSquare', soon: true },
  { key: 'review', label: '리뷰·평가', icon: 'Star', soon: true },
];

function Sidebar({ active, rail }) {
  return (
    <aside className={cx('bg-sidebar text-sidebar-foreground flex flex-col shrink-0', rail ? 'w-[72px] px-3' : 'w-[240px] px-3.5')} style={{ paddingTop: 18, paddingBottom: 16 }}>
      <div className={cx('flex items-center gap-2.5 pb-[18px] mb-3 border-b border-sidebar-border', rail ? 'justify-center px-0' : 'px-2')}>
        <Mark size={32} ring="ring-sidebar" />
        {!rail && (
          <div className="min-w-0">
            <Wordmark size={15} dark />
            <div className="text-[11px] text-sidebar-muted font-semibold mt-1">더블엠 · 관리자</div>
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-0.5" aria-label="주 메뉴">
        {NAV.map((n, i) =>
          n.sec ? (
            rail ? (
              <div key={i} className="h-px bg-sidebar-border my-3 mx-2" />
            ) : (
              <div key={i} className="text-[10.5px] tracking-[0.14em] uppercase text-sidebar-muted font-bold px-3 pt-4 pb-1.5">{n.sec}</div>
            )
          ) : (
            <a
              key={n.key}
              aria-current={active === n.key ? 'page' : undefined}
              aria-disabled={n.soon || undefined}
              title={rail ? n.label : undefined}
              className={cx(
                'flex items-center gap-2.5 h-10 rounded-lg text-[13.5px] font-semibold transition-colors',
                rail ? 'justify-center' : 'px-3',
                active === n.key ? 'bg-sidebar-primary text-white' : n.soon ? 'text-sidebar-muted cursor-not-allowed' : 'hover:bg-sidebar-accent hover:text-white'
              )}
            >
              <Icon name={n.icon} size={18} strokeWidth={active === n.key ? 2.2 : 1.9} />
              {!rail && <span className="flex-1 truncate">{n.label}</span>}
              {!rail && n.soon && <span className="text-[10px] font-bold px-1.5 h-[18px] inline-flex items-center rounded-[5px] border border-sidebar-border text-sidebar-muted">준비 중</span>}
            </a>
          )
        )}
      </nav>
      <div className={cx('mt-auto pt-4 border-t border-sidebar-border flex items-center gap-2.5', rail ? 'justify-center' : 'px-1.5')}>
        <Avatar initials="김" size={32} tone="dark" round />
        {!rail && (
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-bold text-white">김매니저</div>
            <div className="text-[11px] text-sidebar-muted">대행사 관리자</div>
          </div>
        )}
        {!rail && <Icon name="ChevronsUpDown" size={15} className="text-sidebar-muted" />}
      </div>
    </aside>
  );
}

function PageHeader({ crumb, title, actions, meta }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          {crumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="ChevronRight" size={12} />}
              <span className={i === crumb.length - 1 ? 'text-ink-3' : ''}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-h2 text-ink mt-1 truncate">{title}</h1>
        {meta && <div className="mt-1">{meta}</div>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

function AdminShell({ active, width = 1280, height = 860, children }) {
  const rail = width < 1200;
  return (
    <div className="flex bg-background overflow-hidden" style={{ width, height }}>
      <Sidebar active={active} rail={rail} />
      <main className={cx('flex-1 min-w-0 overflow-hidden', rail ? 'px-6 py-[22px]' : 'px-7 py-6')}>{children}</main>
    </div>
  );
}

Object.assign(window, { AdminShell, PageHeader, Sidebar, NAV });
