# Popup OS — 디자인 핸드오프 노트 (v1 · 확정)

> **결정 (2026-10-02)**: 마크 = **B · 팝 도트** · 팔레트 = **기준안 Violet × Amber**. 대안 팔레트(Cobalt × Coral)는 미채택.

시안: `Popup OS Design System.html` (01 브랜드 → 02 토큰 → 03 컴포넌트 → 04 화면 → 05 핸드오프)

## 1. 토큰 적용
1. `tokens/globals.css` → `resources/css/globals.css`(또는 `src/index.css`)로 교체. CSS 변수는 shadcn 관례대로 **HSL 채널값**.
2. `tokens/tailwind.config.ts`의 `theme.extend`를 그대로 붙여 넣음. `tailwindcss-animate` 플러그인 필요(shadcn 기본).
3. `components.json`: `"tailwind.cssVariables": true`, baseColor 무관(변수 덮어씀).
4. 폰트: Pretendard Variable dynamic-subset CDN(@import 포함). self-host 시 같은 family 이름 유지.

### §3 기준값 대비 변경 (AA 대응)
| 토큰 | 기존 | 확정 | 이유 |
|---|---|---|---|
| `muted-foreground` | #6B7688 | **#5E6879** | bg(#EEF0F7) 위 4.03 → 4.94 |
| `subtle` (구 muted-2) | #98A2B3 | 유지 · **텍스트 사용 금지** | 2.58:1 — 아이콘/placeholder/disabled 전용 |
| `success-700` | #0B7A49 | **#067647** | 버튼 배경으로도 사용(흰 텍스트 5.69) |
| `warning-700` | #B56A00 | **#B54708** | 3.81 → 4.95 |
| `info-700` | #0B6BCB | **#175CD3** | 4.71 → 5.35 |
| `pop-700` | — | **#93530A** | pop-50 위 텍스트 5.54 |
| `brand-700` | — | **#4638B8** | soft 버튼 텍스트 7.13 |
| `sidebar-muted` | #5B6379 | **#8A93AB** | 섹션 라벨 3.06 → 5.97 |
| `--accent` | Pop Amber | **shadcn 의미로 반환(hover 배경)** · Amber는 `pop-*` | shadcn `accent`는 hover/selected 배경으로 쓰여 충돌 |
| 버튼 green | #12B76A 배경 | **success-700 배경** | 흰 텍스트 2.62 ✗ |

## 2. 컴포넌트 (shadcn 매핑)
| 시안 | shadcn | 비고 |
|---|---|---|
| Button | `button.tsx` cva | variant: default(primary)/dark/outline/secondary(soft)/success/pop/ghost/destructive · size: sm 32 / default 40 / lg 48 / xl 56 / icon |
| Badge | `badge.tsx` | variant=tone 6종(success/warning/danger/info/brand/neutral). **항상 아이콘 + 라벨**. `dot` prop 시 7px 점 |
| Tag | `badge.tsx` variant tag-pos/tag-lang/tag | 11px r6 |
| FilterChip | `toggle-group.tsx` | rounded-full, on=ink + Check |
| Card / CardHeader | `card.tsx` | rounded-card(16) · header h52 border-b |
| Kpi | Card 조합 | 라벨 12 / `text-kpi` / caption · 우상단 tone 아이콘 타일 |
| Table | `table.tsx` | th `text-label uppercase` h36 bg-surface-2/60 · td h52(dense 44) · 숫자 우측 tabular · 위험행 `bg-danger-50/40` |
| Note | `alert.tsx` variant warning/info/brand/danger/success | 좌측 lucide 아이콘 + **제목(700 컬러) — 본문** |
| Progress | `progress.tsx` | h-2, brand / success(100%) |
| Avatar | `avatar.tsx` | 카드 r27%, 사이드바 rounded-full, tone 배경 |
| Input/Select | `input.tsx`/`select.tsx` | h40 r10 border-input · focus `border-brand ring-[3px] ring-brand/20` · error `border-danger` + 메시지 아이콘 |
| Drawer | `drawer.tsx`(vaul) | 스태프 이의신청 · rounded-t-[22px] · 핸들 40×6 |
| Toast | `sonner.tsx` | 아이콘 tone-700, shadow-overlay, 액션 텍스트 버튼 |
| Status dot | — | `animate-dot-pulse`는 '정상/실시간'만 |
| Empty/Loading/Error | `EmptyState` · `Skeleton` · `ErrorState` 신규 공용 | 에러는 오류 코드 + 다시 시도 |

## 3. 화면 → 컴포넌트
- **AdminShell**: 사이드바 240(≥1280) / 72 레일(1024~1279, 아이콘 + title 툴팁). Phase 1.5 메뉴는 `aria-disabled` + "준비 중" 배지.
- **대시보드**: Kpi×4, 현장 Table(출근 = 수치 + 미니 Progress), "처리 필요" = 클릭 가능한 액션 리스트(Note 톤 재사용).
- **프로젝트·포지션**: 헤더 meta에 진행 상태 Badge, 현장 정보 = KV(dl), 포지션 = grid 행(역할/모집/시급/충원 Progress/상태).
- **지원자 스크리닝**: WorkerCard = Checkbox(선택 승인 카운트와 연동) + Avatar + 이름/배지 + 메타 + Tag + StatGrid(4칸, **표본수 하단 고정**) + 승인/보류. 1024에서는 StatGrid·버튼이 본문 아래로.
- **전자계약 / 출퇴근 / 정산**: Kpi×4 + Card+Table + Note. 출퇴근 인증은 `AuthBadge`(QR+GPS=ShieldCheck, QR만=QrCode, GPS 불일치=MapPinOff, 미인증=neutral).
- **스태프 S1~S3**: PhoneShell(헤더 eyebrow + h1 20) + 하단 고정 CTA(Button xl). 지도는 SDK 플레이스홀더.

## 4. 재사용 규칙
1. 상태 표현은 Badge tone만 사용 — `bg-green-*` 등 직접 컬러 금지.
2. 텍스트 컬러: `ink / ink-2 / ink-3 / muted-foreground / *-700 / brand-600`. 500 원색·`subtle`은 비텍스트 전용.
3. Primary는 화면당 1개. 행 액션은 `soft`/`outline` sm.
4. `pop` 버튼 = ink 텍스트, 화면당 최대 1개.
5. 숫자 열 우측 정렬 + `tabular`. 금액은 실지급만 extrabold.
6. 빈/로딩/에러는 공용 3종만.
7. 스태프 터치 타깃 ≥ 48px, 본문 14~15px, CTA 1개 하단 고정.
8. 모션: spin / pulse(skeleton) / dot-pulse만. `prefers-reduced-motion` 시 정지.

## 5. 접근성 체크
- ✅ 본문 대비 AA: 모든 텍스트 쌍 ≥ 4.5 (최저 4.86 primary 버튼, 4.94 muted-fg/bg)
- ✅ 색 단독 의미 금지: Badge 아이콘+라벨, 진행률 수치 병기
- ✅ focus-visible ring 2px + offset 2
- ✅ aria: nav `aria-current`, `aria-pressed`(필터), `role=progressbar`, `aria-busy`(로딩), `role=alert`(에러)
- ⚠️ 비텍스트 대비 3:1: `line` 보더는 장식용. 입력은 `input`(#D3D8E8) + focus ring으로 보완 — 필요 시 input 보더를 `#B9C0D4`로 상향 검토
- ⚠️ 관리자 sm 버튼 32px: 데스크톱 포인터 기준(WCAG 2.5.8 24px) 충족, 터치 기기 대응 시 md 사용

## 6. 범위 외 (지키지 않은 것 없음)
- 화면·탭·단계 추가 없음. 추가된 것은 상태 표현(빈/로딩/에러)과 기존 데이터의 시각화(진행 상태 Badge, 체크인 단계 StepRow — 기존 3개 인증 요소를 목록화)뿐.
- 지원자 카드 Checkbox: 기존 "선택 승인 (2)" 버튼의 선택 수단을 시각화한 것(기능 추가 아님).

## 7. 마크 B 구현 스펙
- 컨테이너: 정사각, `bg-brand`, radius = size × 0.30, 글자 "P" Pretendard 800 · size × 0.54 · letter-spacing -0.04em · translateX(-3%)
- 도트: 지름 size × 0.30, `bg-pop`, 위치 top/right = -size × 0.07, 배경색 링 2px(`ring-2 ring-{배경}`) — 다크 사이드바에선 `ring-sidebar`
- 사이즈: 48 / 32(사이드바) / 24 / 18(스태프 헤더) / 16(파비콘 — 16px에선 도트 링 생략 가능)
- 파비콘·PWA 아이콘은 SVG로 export 필요(엔지니어링 측에서 `<Mark>` 렌더 결과를 SVG로 작성)
