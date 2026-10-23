// Popup OS — UI primitives (시안용). 각 컴포넌트는 shadcn/ui 컴포넌트 1:1 매핑을 전제로
// Tailwind 토큰 클래스만 사용한다. `state` prop은 시안에서 hover/focus를 강제로 보여주기 위한 것(구현 시 제거).
const { useState: useStateUI } = React;

const cx = (...a) => a.filter(Boolean).join(' ');
const hv = (s) => s.split(' ').map((c) => 'hover:' + c).join(' ');

function Icon({ name, size = 16, className = '', strokeWidth = 2, ...rest }) {
  const L = window.LucideReact || {};
  const C = L[name] || L[name + 'Icon'] || L.Circle;
  if (!C) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  return <C size={size} strokeWidth={strokeWidth} className={cx('shrink-0', className)} aria-hidden="true" {...rest} />;
}

/* ───────────── Brand ───────────── */
function Mark({ variant = 'b', size = 32, ring = 'ring-white', className = '' }) {
  const r = Math.round(size * 0.3);
  const fs = Math.round(size * 0.54);
  const base = 'relative inline-grid place-items-center bg-brand text-white font-extrabold select-none shrink-0';
  const style = { width: size, height: size, borderRadius: r, fontSize: fs, letterSpacing: '-0.04em', lineHeight: 1 };
  if (variant === 'c') {
    return (
      <span className={cx(base, className)} style={{ ...style, borderBottomLeftRadius: Math.max(2, Math.round(size * 0.06)) }}>
        <span style={{ transform: 'translate(3%, -2%)' }}>P</span>
      </span>
    );
  }
  return (
    <span className={cx(base, className)} style={style}>
      <span style={{ transform: 'translateX(-3%)' }}>P</span>
      {variant === 'b' && (
        <span
          className={cx('absolute rounded-full bg-pop ring-2', ring)}
          style={{ width: size * 0.3, height: size * 0.3, top: -size * 0.07, right: -size * 0.07 }}
        />
      )}
    </span>
  );
}
function Wordmark({ size = 20, dark = false, className = '' }) {
  return (
    <span className={cx('font-extrabold whitespace-nowrap', dark ? 'text-white' : 'text-ink', className)} style={{ fontSize: size, letterSpacing: '-0.02em', lineHeight: 1 }}>
      Popup <span className={dark ? 'text-brand-100' : 'text-brand'}>OS</span>
    </span>
  );
}

/* ───────────── Button (shadcn Button + cva variants) ───────────── */
const BTN_V = {
  primary: { b: 'bg-primary text-primary-foreground shadow-brand', h: 'bg-brand-600' },
  dark: { b: 'bg-ink text-white', h: 'bg-ink-2' },
  outline: { b: 'bg-surface text-ink-2 border border-line-2', h: 'bg-surface-2 border-subtle' },
  soft: { b: 'bg-secondary text-secondary-foreground', h: 'bg-brand-100' },
  success: { b: 'bg-success-700 text-white', h: 'bg-[#055C38]' },
  pop: { b: 'bg-pop text-ink', h: 'bg-[#F59100]' },
  ghost: { b: 'bg-transparent text-ink-3', h: 'bg-surface-3 text-ink' },
  destructive: { b: 'bg-destructive text-destructive-foreground', h: 'bg-[#B42318]' },
};
const BTN_S = {
  sm: 'h-8 px-3 text-[12px] rounded-md gap-1.5',
  md: 'h-10 px-4 text-[13px] rounded-lg gap-2',
  lg: 'h-12 px-5 text-[15px] rounded-lg gap-2',
  xl: 'h-14 px-6 text-[16px] rounded-[14px] gap-2.5',
  icon: 'h-9 w-9 rounded-lg',
};
function Button({ variant = 'primary', size = 'md', state, loading, disabled, icon, iconRight, block, className = '', children, ...rest }) {
  const v = BTN_V[variant];
  const isDis = disabled || state === 'disabled';
  const isLoad = loading || state === 'loading';
  const iconSize = size === 'sm' ? 14 : size === 'xl' || size === 'lg' ? 18 : 16;
  return (
    <button
      type="button"
      disabled={isDis}
      aria-busy={isLoad || undefined}
      className={cx(
        'inline-flex items-center justify-center font-bold whitespace-nowrap transition-colors select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none',
        v.b, state === 'hover' ? v.h : hv(v.h),
        state === 'focus' && 'ring-2 ring-ring ring-offset-2',
        BTN_S[size], block && 'w-full', isLoad && 'cursor-wait', className
      )}
      {...rest}
    >
      {isLoad ? <Icon name="LoaderCircle" size={iconSize} className="animate-spin" /> : icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && !isLoad && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

/* ───────────── Badge / Status (shadcn Badge) — 색 + 아이콘 + 라벨 ───────────── */
const TONE = {
  success: { chip: 'bg-success-50 text-success-700', icon: 'CircleCheck', dot: 'bg-success', text: 'text-success-700', border: 'border-success-200' },
  warning: { chip: 'bg-warning-50 text-warning-700', icon: 'Clock', dot: 'bg-warning', text: 'text-warning-700', border: 'border-warning-200' },
  danger: { chip: 'bg-danger-50 text-danger-700', icon: 'CircleX', dot: 'bg-danger', text: 'text-danger-700', border: 'border-danger-200' },
  info: { chip: 'bg-info-50 text-info-700', icon: 'Info', dot: 'bg-info', text: 'text-info-700', border: 'border-info-200' },
  brand: { chip: 'bg-brand-50 text-brand-700', icon: 'CalendarClock', dot: 'bg-brand', text: 'text-brand-600', border: 'border-brand-100' },
  neutral: { chip: 'bg-surface-3 text-ink-3', icon: 'CircleMinus', dot: 'bg-subtle', text: 'text-ink-3', border: 'border-line-2' },
};
function Badge({ tone = 'neutral', icon, noIcon, dot, pulse, className = '', children }) {
  const t = TONE[tone];
  return (
    <span className={cx('inline-flex items-center gap-1 h-6 px-2 rounded-chip text-caption font-bold whitespace-nowrap', t.chip, className)}>
      {dot ? (
        <span className={cx('w-[7px] h-[7px] rounded-full', t.dot, pulse && 'animate-dot-pulse')} />
      ) : (
        !noIcon && <Icon name={icon || t.icon} size={13} strokeWidth={2.4} />
      )}
      {children}
    </span>
  );
}
function Dot({ tone = 'success', pulse }) {
  return <span className={cx('inline-block w-[7px] h-[7px] rounded-full', TONE[tone].dot, pulse && 'animate-dot-pulse')} />;
}

/* Tag (shadcn Badge variant="tag") */
function Tag({ kind = 'default', children }) {
  const k = { default: 'bg-surface-3 text-ink-3', pos: 'bg-brand-50 text-brand-700', lang: 'bg-info-50 text-info-700' }[kind];
  return (
    <span className={cx('inline-flex items-center gap-1 h-[22px] px-2 rounded-sm text-[11px] font-semibold', k)}>
      {kind === 'lang' && <Icon name="Languages" size={11} strokeWidth={2.4} />}
      {children}
    </span>
  );
}

/* FilterChip (shadcn ToggleGroupItem) */
function FilterChip({ on, state, children }) {
  return (
    <button
      type="button"
      aria-pressed={!!on}
      className={cx(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        on ? 'bg-ink text-white border-ink' : cx('bg-surface text-ink-2 border-line-2', state === 'hover' ? 'bg-surface-2' : 'hover:bg-surface-2'),
        state === 'focus' && 'ring-2 ring-ring ring-offset-2'
      )}
    >
      {on && <Icon name="Check" size={13} strokeWidth={2.6} />}
      {children}
    </button>
  );
}

/* ───────────── Card ───────────── */
function Card({ className = '', children, hoverable, state }) {
  return (
    <div className={cx('bg-card text-card-foreground rounded-card border border-line shadow-soft', hoverable && (state === 'hover' ? 'shadow-soft-hover border-brand-100' : 'transition-shadow hover:shadow-soft-hover hover:border-brand-100'), className)}>
      {children}
    </div>
  );
}
function CardHeader({ title, hint, icon, action, className = '' }) {
  return (
    <div className={cx('flex items-center justify-between gap-3 px-[18px] h-[52px] border-b border-line', className)}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && <Icon name={icon} size={16} className="text-ink-3" />}
        <h3 className="text-h3 text-ink truncate">{title}</h3>
        {hint && <span className="text-caption text-muted-foreground truncate">{hint}</span>}
      </div>
      {action}
    </div>
  );
}
function CardBody({ className = '', children }) {
  return <div className={cx('p-[18px]', className)}>{children}</div>;
}

/* ───────────── KPI ───────────── */
function Kpi({ label, value, unit, sub, tone, icon, pulse, state }) {
  const valCls = { success: 'text-success-700', danger: 'text-danger-700', brand: 'text-brand-600', warning: 'text-warning-700' }[tone] || 'text-ink';
  if (state === 'loading') {
    return (
      <Card className="p-[18px]">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-16 mt-3" />
        <Skeleton className="h-3 w-24 mt-2" />
      </Card>
    );
  }
  return (
    <Card className="p-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          {pulse && <Dot tone="success" pulse />}
          {label}
        </div>
        {icon && (
          <span className={cx('grid place-items-center w-7 h-7 rounded-lg', tone ? TONE[tone === 'brand' ? 'brand' : tone].chip : 'bg-surface-2 text-ink-3')}>
            <Icon name={icon} size={15} />
          </span>
        )}
      </div>
      <div className={cx('text-kpi mt-2 tabular', state === 'error' ? 'text-subtle' : valCls)}>
        {state === 'error' ? '—' : value}
        {unit && state !== 'error' && <span className="text-[15px] font-bold text-muted-foreground ml-0.5">{unit}</span>}
      </div>
      <div className="text-caption text-muted-foreground mt-1">{state === 'error' ? '불러오지 못함' : sub}</div>
    </Card>
  );
}

/* ───────────── Table (shadcn Table) ───────────── */
function Table({ cols, rows, dense }) {
  // cols: [{key,label,align,width,className}]
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c.key} style={{ width: c.width }} className={cx('text-label uppercase text-muted-foreground px-3 h-9 border-b border-line bg-surface-2/60 first:pl-[18px] last:pr-[18px]', c.align === 'right' ? 'text-right' : 'text-left')}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={cx('border-b border-surface-3 last:border-0 hover:bg-surface-2/70', r._hl && 'bg-danger-50/40')}>
            {cols.map((c) => (
              <td key={c.key} className={cx('px-3 text-body text-ink first:pl-[18px] last:pr-[18px] align-middle', dense ? 'h-11' : 'h-[52px]', c.align === 'right' && 'text-right tabular', c.className)}>
                {r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function Cell({ title, sub }) {
  return (
    <div className="min-w-0">
      <div className="font-bold text-ink truncate">{title}</div>
      {sub && <div className="text-caption text-muted-foreground truncate">{sub}</div>}
    </div>
  );
}

/* ───────────── Note (shadcn Alert) ───────────── */
function Note({ tone = 'warning', icon, title, children, className = '', compact }) {
  const map = {
    warning: { bg: 'bg-warning-50 border-warning-200', ic: 'text-warning-700', i: 'TriangleAlert' },
    info: { bg: 'bg-info-50 border-info-200', ic: 'text-info-700', i: 'Info' },
    brand: { bg: 'bg-brand-50 border-brand-100', ic: 'text-brand-700', i: 'ShieldCheck' },
    danger: { bg: 'bg-danger-50 border-danger-200', ic: 'text-danger-700', i: 'CircleAlert' },
    success: { bg: 'bg-success-50 border-success-200', ic: 'text-success-700', i: 'CircleCheck' },
  }[tone];
  return (
    <div role="note" className={cx('flex gap-2.5 border rounded-lg text-body-sm text-ink-2', compact ? 'px-3 py-2.5' : 'px-3.5 py-3', map.bg, className)}>
      <Icon name={icon || map.i} size={16} className={cx('mt-[2px]', map.ic)} />
      <div className="min-w-0">
        {title && <b className={cx('font-bold', map.ic)}>{title}</b>}
        {title && children && <span className="text-ink-2"> — </span>}
        <span>{children}</span>
      </div>
    </div>
  );
}

/* ───────────── Progress ───────────── */
function Progress({ value, tone = 'brand', className = '' }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className={cx('h-2 rounded-full bg-surface-3 overflow-hidden', className)}>
      <div className={cx('h-full rounded-full', tone === 'success' ? 'bg-success' : tone === 'neutral' ? 'bg-subtle' : 'bg-brand')} style={{ width: value + '%' }} />
    </div>
  );
}

/* ───────────── Avatar ───────────── */
function Avatar({ initials, size = 32, tone = 'brand', round, className = '' }) {
  const t = { brand: 'bg-brand-50 text-brand-700', pop: 'bg-pop-50 text-pop-700', info: 'bg-info-50 text-info-700', danger: 'bg-danger-50 text-danger-700', neutral: 'bg-surface-3 text-ink-3', dark: 'bg-[#2A2F47] text-[#C9CFE0]' }[tone];
  return (
    <span className={cx('inline-grid place-items-center font-extrabold shrink-0', t, className)} style={{ width: size, height: size, borderRadius: round ? 999 : Math.round(size * 0.27), fontSize: Math.round(size * 0.34) }}>
      {initials}
    </span>
  );
}

/* ───────────── Input / Select ───────────── */
function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      {label && <span className="block text-[12px] font-semibold text-ink-2 mb-1.5">{label}</span>}
      {children}
      {(error || hint) && (
        <span className={cx('flex items-center gap-1 mt-1.5 text-caption', error ? 'text-danger-700' : 'text-muted-foreground')}>
          {error && <Icon name="CircleAlert" size={12} />}
          {error || hint}
        </span>
      )}
    </label>
  );
}
function Input({ state, value, placeholder, icon, className = '' }) {
  const s = state || 'default';
  return (
    <div
      className={cx(
        'flex items-center gap-2 h-10 px-3 rounded-lg border bg-surface text-body transition-colors',
        s === 'default' && 'border-input hover:border-subtle',
        s === 'hover' && 'border-subtle',
        s === 'focus' && 'border-brand ring-[3px] ring-brand/20',
        s === 'error' && 'border-danger ring-[3px] ring-danger/15',
        s === 'disabled' && 'bg-surface-2 border-line text-subtle cursor-not-allowed',
        className
      )}
    >
      {icon && <Icon name={icon} size={15} className="text-muted-foreground" />}
      <span className={cx('flex-1 truncate', value ? (s === 'disabled' ? 'text-subtle' : 'text-ink') : 'text-muted-foreground')}>{value || placeholder}</span>
      {s === 'focus' && !value && <span className="w-px h-4 bg-ink -ml-1" />}
    </div>
  );
}
function Select({ state, value, placeholder }) {
  const s = state || 'default';
  return (
    <div
      className={cx(
        'flex items-center gap-2 h-10 pl-3 pr-2.5 rounded-lg border bg-surface text-body',
        s === 'default' && 'border-input',
        s === 'hover' && 'border-subtle',
        s === 'focus' && 'border-brand ring-[3px] ring-brand/20',
        s === 'disabled' && 'bg-surface-2 border-line cursor-not-allowed'
      )}
    >
      <span className={cx('flex-1 truncate', value ? (s === 'disabled' ? 'text-subtle' : 'text-ink') : 'text-muted-foreground')}>{value || placeholder}</span>
      <Icon name={s === 'focus' ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
    </div>
  );
}
function Checkbox({ checked, state, size = 18 }) {
  return (
    <span
      className={cx(
        'inline-grid place-items-center rounded-[5px] border shrink-0',
        checked ? 'bg-brand border-brand text-white' : 'bg-surface border-line-2',
        state === 'focus' && 'ring-2 ring-ring ring-offset-2',
        state === 'disabled' && 'opacity-45'
      )}
      style={{ width: size, height: size }}
    >
      {checked && <Icon name="Check" size={size - 6} strokeWidth={3.2} />}
    </span>
  );
}

/* ───────────── Feedback: Skeleton / Empty / Error / Toast ───────────── */
function Skeleton({ className = '' }) {
  return <div className={cx('rounded-md bg-surface-3 animate-pulse', className)} />;
}
function EmptyState({ icon = 'Inbox', title, desc, action, className = '' }) {
  return (
    <div className={cx('flex flex-col items-center text-center py-12 px-6', className)}>
      <span className="grid place-items-center w-12 h-12 rounded-[14px] bg-surface-2 border border-line text-ink-3 mb-3.5">
        <Icon name={icon} size={22} />
      </span>
      <div className="text-h3 text-ink">{title}</div>
      {desc && <div className="text-body-sm text-muted-foreground mt-1 max-w-[340px] text-pretty">{desc}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
function ErrorState({ title = '데이터를 불러오지 못했어요', desc = '네트워크 상태를 확인한 뒤 다시 시도해 주세요.', code, action, className = '' }) {
  return (
    <div role="alert" className={cx('flex flex-col items-center text-center py-12 px-6', className)}>
      <span className="grid place-items-center w-12 h-12 rounded-[14px] bg-danger-50 border border-danger-200 text-danger-700 mb-3.5">
        <Icon name="CloudOff" size={22} />
      </span>
      <div className="text-h3 text-ink">{title}</div>
      <div className="text-body-sm text-muted-foreground mt-1 max-w-[360px] text-pretty">{desc}</div>
      <div className="mt-4 flex gap-2">{action || <Button variant="outline" size="sm" icon="RotateCw">다시 시도</Button>}</div>
      {code && <div className="mt-3 text-caption text-muted-foreground tabular">오류 코드 {code}</div>}
    </div>
  );
}
function Toast({ tone = 'success', title, desc, action }) {
  const t = TONE[tone];
  return (
    <div className="flex items-start gap-3 w-[356px] p-3.5 rounded-lg bg-surface border border-line shadow-overlay">
      <Icon name={t.icon === 'Clock' ? 'TriangleAlert' : t.icon} size={18} className={cx('mt-[1px]', t.text)} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-ink">{title}</div>
        {desc && <div className="text-caption text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      {action && <button className="text-[12px] font-bold text-brand-600 hover:underline shrink-0 mt-[1px]">{action}</button>}
    </div>
  );
}

/* KeyValue list — 현장 정보 / 계약 요약 / 정산 요약 공용 (shadcn 없음 · dl 마크업) */
function KV({ rows, size = 'md', className = '' }) {
  return (
    <dl className={cx('divide-y divide-surface-3', className)}>
      {rows.map(([k, v], i) => (
        <div key={i} className={cx('flex items-start justify-between gap-4', size === 'lg' ? 'py-2.5 text-[14px]' : 'py-2.5 text-body')}>
          <dt className="text-muted-foreground font-medium shrink-0">{k}</dt>
          <dd className="font-bold text-ink text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

Object.assign(window, {
  cx, hv, Icon, Mark, Wordmark, Button, Badge, Dot, Tag, FilterChip, Card, CardHeader, CardBody, Kpi, Table, Cell,
  Note, Progress, Avatar, Field, Input, Select, Checkbox, Skeleton, EmptyState, ErrorState, Toast, KV, TONE, BTN_V,
});
