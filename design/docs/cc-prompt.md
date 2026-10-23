# Claude Code 구현 지시 (붙여 넣기용)

popup-os 프로젝트에 Designer 시안 v1(확정)을 적용해줘. 결정: 마크 = B 팝 도트, 팔레트 = 기준안 Violet × Amber.

## 참고 파일 (이 패키지)
- `tokens/globals.css`, `tokens/tailwind.config.ts` — 토큰 확정본 (그대로 사용)
- `ui.jsx`, `admin-shell.jsx`, `admin-screens.jsx`, `staff-screens.jsx` — 시안 레퍼런스 구현 (Tailwind 클래스 그대로 옮길 것. `state` prop은 시안용이므로 제거)
- `docs/handoff.md` — 컴포넌트 매핑, 재사용 규칙, 접근성, 마크 스펙
- `Popup OS Design System.html` — 시각 기준 (브라우저에서 열어 비교)

## 작업 순서
1. shadcn/ui 초기화(Vite + React 19 + TS + Tailwind v3, `tailwindcss-animate`) → `globals.css`와 `tailwind.config.ts`를 토큰 확정본으로 교체. Pretendard는 CDN @import 유지.
2. `src/components/ui/`의 shadcn 컴포넌트를 variant 확장:
   - Button: default/dark/outline/secondary(soft)/success/pop/ghost/destructive × sm/default/lg/xl/icon, `loading` prop(LoaderCircle + aria-busy)
   - Badge: tone 6종(success/warning/danger/info/brand/neutral) + 기본 아이콘 맵 + `dot`/`pulse` prop. **아이콘+라벨 필수**
   - Alert(Note) variant warning/info/brand/danger/success, Table 스타일, Card/CardHeader, Progress, Avatar, Input/Select focus·error, Checkbox, Drawer(vaul), Sonner 토스트
3. 공용 컴포넌트 신규: `Brand/Mark`(B 팝 도트), `Wordmark`, `Kpi`, `KV`(dl), `Tag`, `FilterChip`(ToggleGroup), `StatusDot`, `EmptyState`, `ErrorState`, `TableSkeleton`, `AuthBadge`
4. 레이아웃: `AdminShell`(사이드바 240 / 1024~1279에서 72 레일, Phase 1.5 메뉴 aria-disabled + "준비 중"), `PageHeader`, 스태프 `PhoneShell`(하단 고정 CTA)
5. 화면 9개를 prototype/index.html 카피·데이터 그대로 구현(목데이터): 관리자 6(대시보드·프로젝트·포지션·지원자 스크리닝·전자계약·출퇴근 현황·정산·급여), 스태프 3(계약 서명·출근 체크인·정산 내역). 각 화면 empty/loading/error 상태 분기 포함.
6. 파비콘/PWA 아이콘: Mark B를 SVG로 작성(`public/favicon.svg`).

## 제약 (위반 금지)
- 정보 구조·기능·화면 추가 금지. 다크 모드 없음(사이드바 제외). CSS-in-JS·다른 UI 라이브러리 금지.
- 텍스트 컬러는 ink/ink-2/ink-3/muted-foreground/*-700/brand-600만. 500 원색·`subtle`은 비텍스트 전용.
- `bg-pop` 위 흰 텍스트 금지. 임의 hex 클래스 금지(토큰 사용).
- 모션: spin / pulse / dot-pulse만, prefers-reduced-motion 존중.

## 완료 기준
- 시안 HTML과 나란히 놓고 1280/1024/390에서 시각 일치
- 모든 상태 Badge에 아이콘+라벨, 본문 대비 AA, focus-visible ring 확인
