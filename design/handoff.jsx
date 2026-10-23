// 05 핸드오프 노트 아트보드
function HandoffSheet() {
  const map = [
    ['대시보드', 'AdminShell · PageHeader · Kpi×4 · Card+Table · Badge · Progress · ActionList(Note 계열)', 'empty: KPI 0 + EmptyState(새 프로젝트) · loading: Kpi skeleton + TableSkeleton · error: ErrorState(DASH-503)'],
    ['프로젝트·포지션', 'PageHeader(meta Badge) · Card+KV · Note(info) · PositionRow(grid) · Progress · Badge', 'empty: 포지션 0 → EmptyState + 모집 공고 disabled'],
    ['지원자 스크리닝', 'FilterChip(ToggleGroup) · WorkerCard(Card hoverable · Checkbox · Avatar · StatGrid · Tag · Note) · Button', '표본수 항상 노출 · 신규=warning "검증 필요" · 외국인=info Globe'],
    ['전자계약', 'Kpi×4 · Card+Table · Badge · Button(outline/soft) · Note(brand)', '만료 임박 행 bg-danger-50/40 강조'],
    ['출퇴근 현황', 'Kpi×4 · Table · AuthBadge(QR+GPS/QR만/GPS 불일치/미인증) · Note(warning)', 'error: 실시간 연결 끊김 + 마지막 동기화 시각'],
    ['정산·급여', 'Kpi×4 · Table(숫자 우측 tabular) · Badge · Note(info/brand)×2', 'error: 계산 실패(정산 규칙 / 다시 계산)'],
    ['S1 계약 서명', 'PhoneShell · KakaoCard · DocBox(KV) · VerifiedRow · SignaturePad · CheckRow · Button xl', 'error: 서명 저장 실패 — 국/영 병기'],
    ['S2 출근 체크인', 'PhoneShell · MapBlock(지도 SDK) · StepRow×3 · Note · Button xl(outline/success)', 'error: GPS 반경 밖 → 체크인 disabled, QR 유도'],
    ['S3 정산 내역', 'PhoneShell · DocBox · PayLine · Badge(brand) · Note · Drawer(이의신청)', 'empty: 정산 내역 없음'],
  ];
  const rules = [
    '상태 = Badge 1개. tone은 TONE 맵에서만, 직접 bg-green-* 사용 금지.',
    '텍스트에는 *-700 / ink / ink-3 / muted-foreground만. 500(원색)·subtle은 아이콘·점·바 전용.',
    'Primary 버튼은 화면(또는 카드 헤더)당 1개. 보조는 outline, 행 단위 액션은 soft/outline sm.',
    'pop(Amber)은 강조 1곳 · 흰 텍스트 금지. 브랜드 마크 도트와 동일 의미("열림/지금").',
    '숫자 열은 align right + tabular. 금액은 실지급만 font-extrabold.',
    '빈/로딩/에러는 EmptyState · Skeleton · ErrorState 3종만 사용. 에러에 오류 코드 노출.',
    '스태프 앱: 터치 타깃 ≥ 48px(Button xl 56), 본문 14~15px, 하단 고정 CTA 1개.',
    '모션: animate-spin(로딩)·animate-pulse(skeleton)·dot-pulse(실시간)만. reduced-motion 시 정지.',
  ];
  const a11y = [
    ['본문 대비 ≥ 4.5:1', '전 시맨틱 텍스트 쌍 통과 (최저 muted-fg/bg 4.94)', 1],
    ['색 단독 의미 전달 금지', 'Badge 아이콘+라벨, 진행률 수치 병기, 표 강조행은 Badge와 동반', 1],
    ['포커스 가시성', 'focus-visible:ring-2 ring-ring ring-offset-2 (버튼·칩·링크)', 1],
    ['터치 타깃', '스태프 48px+ / 관리자 sm 버튼 32px(데스크톱 포인터 기준 24px 이상)', 1],
    ['스크린리더', 'nav aria-current · Badge 텍스트 포함 · progressbar aria-value* · aria-busy', 1],
    ['비텍스트 대비 3:1', 'line(#E4E7F1) 보더는 장식용 — 입력 보더는 input(#D3D8E8)+focus ring으로 보완', 0],
  ];
  return (
    <div className="bg-surface p-10" style={{ width: 1280 }}>
      <SheetTitle no="05 · Handoff" title="핸드오프 노트" sub="화면 → 컴포넌트 매핑, 재사용 규칙, 접근성 체크 결과. 상세본은 docs/handoff.md." />
      <Card className="overflow-hidden mb-6">
        <CardHeader title="화면 → 컴포넌트 매핑" icon="Network" />
        <Table dense cols={[{ key: 'a', label: '화면', width: 150 }, { key: 'b', label: '컴포넌트' }, { key: 'c', label: '상태 메모', width: 400 }]}
          rows={map.map(([a, b, c]) => ({ a: <b>{a}</b>, b: <span className="text-body-sm text-ink-2">{b}</span>, c: <span className="text-caption text-ink-3">{c}</span> }))} />
      </Card>
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="재사용 규칙" icon="Repeat2" />
          <ol className="p-[18px] space-y-2.5">{rules.map((r, i) => <li key={i} className="flex gap-3 text-body text-ink-2"><span className="grid place-items-center w-5 h-5 rounded-md bg-brand-50 text-brand-700 text-[11px] font-bold tabular shrink-0 mt-[1px]">{i + 1}</span>{r}</li>)}</ol>
        </Card>
        <Card>
          <CardHeader title="접근성 체크" icon="Accessibility" />
          <ul className="p-2">{a11y.map(([t, d, ok], i) => (
            <li key={i} className="flex items-start gap-3 p-2.5">
              {ok ? <Badge tone="success">통과</Badge> : <Badge tone="warning" icon="TriangleAlert">보완</Badge>}
              <div className="min-w-0"><div className="text-[13px] font-bold text-ink">{t}</div><div className="text-caption text-ink-3">{d}</div></div>
            </li>))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
window.HandoffSheet = HandoffSheet;
