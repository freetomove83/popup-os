# Popup OS — 디자인 브리프 (Genspark Designer V2 전달용)

> **목적**: Popup OS의 브랜드·시각 디자인을 Genspark Designer V2에 넘기되, 산출물이 우리 실제 스택(Laravel + Vite/React + TypeScript + Tailwind + shadcn/ui)으로 **재작업 없이 이식**되도록 범위·토큰·제약을 고정한다.
>
> **작업 방식(하이브리드)**: Designer = 토큰 + 시각 시안 / 우리 = React·Tailwind 컴포넌트 구현.
>
> **기준 파일**: `C:\Users\freet\GensparkCode\popup-os\prototype\index.html` (현행 프로토타입 — 반드시 먼저 열어볼 것)

---

## 0. 한 줄 정의
> 팝업스토어 대행사의 **구인 → 계약 → 출퇴근 → 정산**을 한 곳에서 처리하는 B2B 운영 OS. 관리자는 데스크톱 콘솔, 스태프는 모바일(PWA·알림톡 진입).

---

## 1. 제품 & 사용자

| 구분 | 관리자 콘솔 (Client) | 스태프 앱 (Worker) |
|---|---|---|
| 기기 | 데스크톱 (1280~1440 기준, 1024 대응) | 모바일 (360~430) |
| 사용자 | 대행사 매니저 | 현장 스태프 (20~30대, 외국인 포함) |
| 상황 | 사무실에서 다수 현장 동시 관리, 빠른 판단 | 현장에서 1분 내 서명·체크인 |
| 톤 | 정보 밀도 높지만 정돈, 신뢰 | 단순·큰 터치 타깃·명확한 다음 행동 |
| 핵심 감정 | "통제하고 있다" | "빠르고 쉽다" |

---

## 2. 브랜드 방향 & 톤

- **키워드**: 신뢰(Trust) · 현장감(Field) · 활기(Pop) · 정돈(Order)
- **인상**: 전문 B2B 도구지만 딱딱하지 않게. "팝업"의 생기를 액센트 컬러와 라운드 형태로 표현.
- **금지 톤**: 과한 그라데이션·네온, 게임/엔터 느낌, 저가형 템플릿 느낌, 과도한 이모지.
- **로고/마크**: 현재는 텍스트 "Popup OS" + "P" 마크. Designer는 **마크 시안 2~3안**을 제안 가능(단, 워드마크는 "Popup OS" 유지).
- **언어**: 한국어 우선, 외국인 스태프 대비 영문 병기 가능. 숫자는 tabular(자릿수 정렬).

---

## 3. 디자인 토큰 (Baseline — 이 값을 기준으로 정제)

현행 프로토타입에서 추출. Designer는 **1개 대안 팔레트**를 제안할 수 있으나, 최종 산출물은 아래 형식의 토큰으로 확정할 것.

### 3.1 컬러
```
/* Brand */
--brand:        #6C5CE7   /* Electric Violet — 주 브랜드/주요 버튼 */
--brand-600:    #5A49D6
--brand-50:     #EEEBFF   /* 브랜드 배경/배지 */
--brand-100:    #DFD9FF   /* 보더/구분 */

/* Accent (CTA·강조) */
--accent:       #FF9F1C   /* Pop Amber */
--accent-50:    #FFF4E3

/* Neutral */
--ink:          #0B0F1A   /* 최상위 텍스트/다크 사이드바 */
--ink-2:        #1A2233
--ink-3:        #3B4658
--muted:        #6B7688   /* 보조 텍스트 */
--muted-2:      #98A2B3   /* 캡션 */
--bg:           #EEF0F7   /* 앱 배경 */
--surface:      #FFFFFF
--surface-2:    #F6F7FB
--surface-3:    #ECEEF6
--line:         #E4E7F1   /* 기본 보더 */
--line-2:       #D3D8E8

/* Semantic */
--green:  #12B76A   --green-50: #E6F8EF   /* 정상/완료/출근 */
--amber:  #F79009   --amber-50: #FEF3E4   /* 지각/대기/주의 */
--red:    #F04438   --red-50:   #FEECEB   /* 미출근/오류/위험 */
--blue:   #2E90FA   --blue-50:  #EAF3FF   /* 정보/외국인/안내 */
```
- 대비: 본문 텍스트는 WCAG **AA(4.5:1)** 이상. `--accent` 위 흰 텍스트 금지(대비 부족) → 어두운 텍스트 사용.
- 상태 컬러는 **색 + 라벨/아이콘**을 함께 사용(색맹 대응). 색만으로 의미 전달 금지.

### 3.2 타이포그래피
- 폰트: **Pretendard** (국문), 폴백 system-ui / Malgun Gothic
- 스케일: `display 38 / h1 28 / h2 20 / h3 15 / body 13.5 / caption 11.5`
- 숫자: `font-variant-numeric: tabular-nums`
- 자간: 제목 `-0.01~-0.02em`, 라벨 대문자 `+0.06em`

### 3.3 형태·간격·그림자
- Radius: 카드 `16px` · 버튼/입력 `10px` · 칩/배지 `7px` · 앱 셸 `22px`
- Spacing: 4px 그리드 (4/8/12/16/24/32)
- Shadow: `0 1px 2px rgba(16,24,40,.05), 0 10px 28px rgba(16,24,40,.06)` (soft, 저대비)
- 보더: 1px, `--line`
- Breakpoint: 1440 / 1280 / 1024 / 620

---

## 4. 컴포넌트 스타일 가이드 (shadcn/ui 매핑)

| 컴포넌트 | 스펙 | shadcn 매핑 |
|---|---|---|
| Button (primary) | brand 배경, 흰 텍스트, r10, 그림자 brand 30% | `Button` |
| Button (dark/ghost/soft/green) | ink 배경 / 보더 / brand-50 / green | `Button` variants |
| Chip / Badge | 11.5px 700, r7, ok/warn/err/info/brand/off 6종 | `Badge` |
| Card | surface, r16, 1px line, soft shadow, 헤더+본문 분리 | `Card` |
| Table | 헤더 11px 대문자 muted, 행 구분 surface-3, 숫자 우측정렬 | `Table` |
| KPI Card | 라벨 12 / 값 26 800 / 서브 11.5, 상태별 컬러 | `Card` |
| Tag | 11px, r6, pos(브랜드)/lang(블루)/일반(회색) | `Badge` |
| Note (callout) | amber/blue/brand 3종, 좌측 아이콘 + 본문 | `Alert` |
| Progress | 8px 트랙, brand/green 채움 | `Progress` |
| Avatar | 32~52px, r14(카드)/full(사이드바), 이니셜 | `Avatar` |
| Input / Select | r10, 1px line, focus ring brand | `Input`/`Select` |
| Drawer/Dialog (스태프) | 모바일 바텀시트 | `Drawer` (vaul) |
| Toast | sonner | `Sonner` |
| 상태점(dot) | 7px, 정상 시 pulse | — |

- 아이콘: **lucide-react** (선 굵기 일관, 이모지 대체)
- 다크 사이드바(관리자) + 라이트 콘텐츠 = 기본 레이아웃. 스태프 앱은 라이트.

---

## 5. 화면 목록 & 핵심 요소

> 각 화면의 실제 내용·카피·데이터는 `prototype/index.html`을 그대로 참조. Designer는 **레이아웃·시각 개선**에 집중하고 정보 구조는 유지.

### 관리자 콘솔 (데스크톱, 좌측 다크 사이드바)
1. **대시보드** — KPI 4종(진행 프로젝트/오늘 출근/서명 대기/정산 예정), 오늘 현장 현황 표, 처리 필요 콜아웃 3종
2. **프로젝트·포지션** — 현장 정보(장소·기간·GPS·인증방식), 모집 포지션 리스트(역할·인원·시급·충원 진행률·상태)
3. **지원자 스크리닝** — 필터 칩, 워커 검카드(노쇼율·완료건수·재고용률 **+ 표본수**, 신규는 "검증 필요" 배지, 외국인 배지), 승인/보류
4. **전자계약** — KPI(발송/완료/대기/만료), 발송 대상 표(발송·서명 시각·상태·재발송), 무결성 안내
5. **출퇴근 현황** — KPI(출근/지각/미출근/퇴근), 근태 로그 표(인증방식 QR+GPS/QR만/GPS 불일치, 상태, 정정요청)
6. **정산·급여** — KPI(대상/총시간/총지급/원천징수), 급여 계산서 표(기본급·가산·주휴·세금·실지급·상태), 일용/단기·지급대행 안내

### 스태프 앱 (모바일 PWA, 3화면)
1. **계약 서명** — 알림톡 카드, 계약 요약(필수 기재사항), 본인확인 완료, 서명 패드, 동의 체크, 확정 버튼
2. **출근 체크인** — 지도(GPS 반경 100m), 인증 상태, QR 스캔 1차 + GPS 보조 + 사진, 출근 버튼
3. **정산 내역** — 근무 요약, 급여 계산 라인(기본급·가산·주휴·원천징수·실지급), 이의신청

### 이연(디자인 대상 아님)
- Phase 1.5: 웨이팅콜, 워크스페이스(채팅), 리뷰·평가 — 사이드바 비활성 표기만 유지

---

## 6. 스택 & 이식 제약 (Must — 위반 금지)

- 프론트: **Vite + React 19 + TypeScript**, 스타일 **Tailwind CSS**, 컴포넌트 **shadcn/ui + Radix**, 아이콘 **lucide-react**, 폼 react-hook-form, 차트 recharts, 알림 sonner. (onoffcheck 프로젝트와 동일)
- 백엔드: **Laravel** (기존 프로젝트 관례)
- **Tailwind 유틸리티/토큰으로 표현 가능한 디자인**이어야 함. 임의 CSS-in-JS, 다른 UI 라이브러리, 새 상태관리 도입 금지.
- 폰트는 Pretendard CDN/self-host 사용.
- 컴포넌트는 **재사용 단위**로 정의(화면별 하드코딩 지양).
- 다크 모드는 **이번 범위 아님**(관리자 사이드바의 다크는 예외).

---

## 7. 산출물 (Deliverables)

Designer는 아래를 순서대로 산출:

1. **브랜드 시트** — 마크 2~3안, 팔레트(대안 1안 포함), 타이포 스케일, 로고 사용 규칙
2. **토큰 확정본** — `tailwind.config.ts`의 `theme.extend`에 바로 넣을 수 있는 컬러/라운드/그림자/폰트 값 + CSS 변수 목록
3. **컴포넌트 시안** — §4의 13개 컴포넌트, 각 상태(default/hover/focus/disabled/loading) 포함
4. **화면 시안** — 관리자 6 + 스태프 3, 1280 / 1024(관리자) · 390(스태프) 폭. 각 화면의 빈 상태(empty)·로딩·에러 상태 1컷씩
5. **핸드오프 노트** — 화면 → 컴포넌트 매핑, 재사용 규칙, 접근성 체크 결과

---

## 8. 하지 말 것 (Out of Scope)

- 정보 구조·플로우·기능 추가/변경 (예: 새 탭, 새 단계)
- 데이터 구조·API 변경 제안
- 스택 이탈(Next.js, Supabase, Material, Bootstrap, styled-components 등)
- 과한 애니메이션/모션 (성능·업무 도구 맥락)
- 이모지 남용, 스톡 일러스트로 화면 채우기
- 다크 모드 전면 적용

---

## 9. 참고 자료

- 현행 프로토타입: `popup-os/prototype/index.html` (탭 4개: MVP 흐름 / 관리자 콘솔 / 스태프 앱 / PRD 개선 포인트)
- PRD 원본: `C:\Users\freet\Downloads\Popup OS System Architecture & Specification.pdf`
- 기존 프로젝트 스타일 관례: `onoffcheck/` (Vite+React+TS+Tailwind+shadcn), `ui-proposal.html`

---

## 10. Designer 첫 프롬프트 (paste-ready)

```
너는 Popup OS(팝업스토어 운영 OS)의 프로덕트 디자이너야.
첨부한 디자인 브리프(popup-os/docs/design-brief.md)와 현행 프로토타입(popup-os/prototype/index.html)을 먼저 읽어줘.

목표: 브리프 §3의 토큰을 기준선으로 삼아 브랜드를 정제하고, §5의 관리자 6화면 + 스태프 3화면을 시각적으로 개선한 시안을 만들어줘.
반드시 지켜야 할 것:
- 스택 제약(§6): Vite+React+TS+Tailwind+shadcn/ui+lucide. Tailwind 토큰으로 표현 가능해야 함.
- 정보 구조·기능은 유지(§8). 화면 추가/변경 금지.
- 상태 컬러는 색+라벨/아이콘 병행, 본문 대비 AA 이상.
산출물은 §7 순서대로: ①브랜드 시트 ②tailwind.config에 바로 넣을 토큰 확정본 ③컴포넌트 시안 ④화면 시안(빈/로딩/에러 포함) ⑤핸드오프 노트.
먼저 브리프를 읽고, 네가 이해한 범위와 진행 계획을 요약해서 보여줘.
```
