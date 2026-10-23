# Popup OS 랜딩 — 구현 핸드오프

## 파일
| 파일 | 용도 |
|---|---|
| `Popup OS Landing.html` | 시안 캔버스: 히어로(1440/390) · 전체 스크롤 · 키비주얼 A/B/C · 요금제 · 타이포 스케일 · 핸드오프 노트 · 카피 점검 |
| `Landing Full Page.html` | 1440 전체 스크롤 단독 보기 (구현 기준 화면) |
| `lp.css` | §4 확정 토큰(CSS 변수) + 랜딩 타이포 클래스 |
| `lp-base.jsx` | **COPY 객체(전 카피, 줄 배열)**, Icon/Logo/Btn/Chip, ConsoleFrame/Phone/Crop 목업, WorkerCard(검카드) |
| `lp-sections.jsx` | §3.1~§3.11 섹션 컴포넌트 (HeroDesktop … Footer, FullPage) |
| `lp-boards.jsx` | HeroMobile, 키비주얼 배치안, 타이포 스케일, 핸드오프, 카피 점검 |
| `refs/*.png` | 제품 캡처 4장(키비주얼 소스) · `refs/landing-designer-pack.md` 원 브리프 |

`design_canvas.jsx`는 시안 보기용 — 이식 대상 아님.

## 구현 지시
- 스택: 기존 `client/` (Vite + React 19 + TS + Tailwind + shadcn/ui + lucide-react). 새 라우트 `/` (또는 `/landing`) 1페이지.
- 토큰: `lp.css`의 값은 제품 `design/tokens.css` / `tw-config.js`와 동일해야 함 — 새 색 만들지 말고 기존 Tailwind 토큰에 매핑. 랜딩 전용 타이포(`t-display 56 / t-h1 40 / t-h2 30 / t-h3 22 / t-kpi 40 / t-body-lg 19 / t-body 16 / t-eyebrow 14 +0.06em / t-caption 13`, 모바일 display 34 · h1 28)는 Tailwind `fontSize` 확장으로 추가.
- 카피: `lp-base.jsx`의 `COPY` 객체를 `landing/copy.ts`로 그대로 옮기고 줄 배열을 `<br/>`로 렌더(자동 줄바꿈 금지, `word-break: keep-all`). 1280·1024에서 줄바꿈 유지 확인.
- 섹션 → 컴포넌트: Hero(Button primary/secondary, Badge, ProductMockup) · TrustBar(StatRow, LogoStrip 플레이스홀더) · Problem(Card×3) · Features(FeatureRow×4 좌우 교차 + ScreenCrop) · Staff(bg sidebar, PhoneFrame, Button light) · Proxy(StepList, Alert info, ScreenCrop) · Safety(Card×4) · Pricing(PlanCard×3, Pro=2px brand 보더 + "인기") · Inquiry(Form/Input/Select/Textarea/Checkbox, `#inquiry` 앵커) · FAQ(shadcn Accordion, 첫 항목 펼침) · ClosingCTA + Footer(bg sidebar).
- 전환: 네비·히어로·Agency 카드·클로징의 [도입 문의]는 primary, `#inquiry`로 스무스 스크롤. 폼 제출은 UI만(검증 + 성공 상태), 백엔드 연동 없음.
- 키비주얼: A안(콘솔 우측 + 모바일 겹침 + 상태 플로팅 카드) 채택. 크롭 좌표는 시안의 "섹션별 화면 소스" 보드 참조. 이미지 `refs/` → `client/public/landing/`.
- 검카드(구인·매칭, 스태프 섹션)는 원본 캡처 저해상(151px)이라 HTML 재구성(`WorkerCard`) — 컴포넌트로 구현.
- 반응형: 1440 / 1280 / 1024(거터 64) / 620 이하 모바일(1열, 섹션 상하 72px). 모바일 히어로는 `HeroMobile` 참조.
- 모션: 섹션 페이드업 1회(200ms, 16px)만. 패럴랙스·캐러셀 금지.
- 접근성: pop 위 흰 글자 금지, 상태는 색+아이콘+라벨, 본문 AA.

## 플레이스홀더 (확정 전 그대로 유지)
OO 숫자(신뢰 바·검카드 지표), 고객사 로고 6칸, 요금 ₩99,000/₩290,000 + "가격 확정 전" 태그, 연락처(이메일·전화·카카오채널).

## 승인 대기 카피 (브리프 외 신규)
§3.4 제목 "구인부터 정산까지, / 한 흐름으로." 및 기능별 설명 2줄 · §3.7 제목 · §3.8 제목 · §3.9 보조 문구 · 클로징 "팝업은 자주, / 운영은 가볍게."
