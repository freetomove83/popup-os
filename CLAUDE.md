# Popup OS — Claude Code 핸드오프

팝업스토어 대행사·브랜드를 위한 **B2B 운영 OS**(구인 → 전자계약 → QR 출퇴근 → 정산).
프론트(관리자·워커·스태프 화면) + **Laravel 13 API(SQLite)** 로 핵심 흐름이 로컬에서 실제 동작한다. 마케팅 랜딩은 정적.

- 운영주체: 더블엠 / 브랜드: Popup OS
- 상태: 핵심 흐름(공고→지원→승인→계약 서명→QR 출퇴근→정산 발행→커리어 인증) 로컬 동작. 외부 연동(SMS/알림톡·지급)·배포 미착수
- 비즈니스 모델·전략: **`docs/bm.md`** (포지셔닝·수익모델·채널갈등·벤치마크)
- 랜딩 브리프: `docs/landing-brief.md` / 제품 디자인 브리프: `docs/design-brief.md`

---

## 1. 실행 / 검증

```bash
cd popup-os
npm install                 # (필요 시 --legacy-peer-deps)
npm run dev                 # Vite 5173 (백그라운드로 띄워두면 편함)
npm run check               # tsc --noEmit (필수 통과)
npm run build:spa           # vite build → backend/public/build

cd backend                  # PHP 8.4 (Herd) · composer
composer install            # 새 PC에서만
cp .env.example .env && php artisan key:generate   # 새 PC에서만
php artisan migrate:fresh --seed   # SQLite 초기화 + 데모 데이터(날짜는 실행일 기준)
php artisan storage:link           # 사진 업로드용(최초 1회)
php artisan serve --port=8000      # Vite가 /api·/storage 를 8000으로 프록시
```

- 로컬 테스트 계정: `backend/database/seeders/DatabaseSeeder.php` 상단 주석. 워커 OTP는 local 환경에서 화면 토스트로 표시(SMS 미연동).
- Windows Git Bash에서는 Herd의 `php`가 안 잡힐 수 있다 → PowerShell에서 실행.

- 로컬: `http://localhost:5173/landing`
- ⚠ dev 서버가 세션 정리로 자주 꺼진다. `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/landing` 이 000이면 `npm run dev`를 백그라운드로 재기동.
- ⚠ `npm run format`(prettier)은 **요청 없이 실행 금지** — 대량 포맷 diff가 생긴다.

## 2. 기술 스택 / 구조

- **프론트**: Vite 7 + React 19 + TypeScript + **Tailwind v4(CSS-first)** + shadcn/ui(new-york) + wouter + React Query + lucide-react + sonner
- **백엔드**: Laravel 13 + Sanctum 토큰(관리자 `abilities:admin` / 워커 `abilities:worker`) + SQLite.
  - 스키마: `backend/database/migrations/2026_10_23_100000_create_popup_os_tables.php` (projects=공고, positions, workers, work_records, applications, contracts, attendance_logs, settlements)
  - API: `routes/api.php` → `AuthController`, `AdminController`, `WorkerController`
  - 응답 모양: `app/Support/Present.php` (프론트 `client/src/data/*.ts` 타입과 짝, 신체 정확값·연락처 원문은 여기서 차단) / 급여: `app/Support/Payroll.php`
- 프론트 API: `client/src/lib/api.ts` (`api()`, `useApi()`, `useAction()`), 화면 상태는 `useScreenState(query, isEmpty)` — `?state=` 강제도 유지.
- Vite root = `client/`, alias `@` → `client/src`, publicDir = `client/public`
- build outDir = `backend/public/build`, **base = `/build/`** (운영 시 Laravel이 동일 출처 서빙 전제)
- `index.html`은 `client/index.html`, 진입점 `client/src/main.tsx` → `App.tsx`

```
popup-os/
  client/
    index.html
    public/
      brand/favicon.svg
      landing/           # 랜딩 목업 이미지(더미 데이터로 재촬영)
    src/
      App.tsx            # 라우팅
      index.css          # 디자인 토큰(@theme inline + :root) + 랜딩 타이포(.t-*)
      components/        # ui/(shadcn), layout/, brand, icon, kpi, kv, auth-badge ...
      data/              # jobs.ts, postings.ts, workers.ts (목데이터)
      hooks/
      lib/               # utils(cn), body(구간), mask(마스킹)
      pages/
        Home.tsx         # 데모 진입 링크 모음
        admin/           # 관리자 콘솔
        worker/          # 스태프(구직자) 마켓 앱
        staff/           # 현장 스태프 3화면
        landing/         # 마케팅 랜딩(/landing) ← copy/primitives/sections/Landing
  backend/public/build/  # vite 산출물 (Laravel 앱은 아직 없음)
  design/                # 제품 디자인 산출물(Designer) — 참고용, 앱 아님
  design-landing/        # 랜딩 디자인 산출물(Designer) — 참고용, 앱 아님
  prototype/             # 초기 단일 HTML 프로토타입 — 참고용
  docs/                  # bm.md, design-brief.md, landing-brief.md, ...
  .shots/                # 검증 스크린샷
```

## 3. 라우트

| 경로 | 화면 |
|---|---|
| `/` | 데모 진입(Home) |
| `/landing` | 마케팅 랜딩 |
| `/admin` | 관리자 콘솔 (`?screen=` 로 탭 전환) |
| `/worker` | 공고 탐색 |
| `/worker/login` · `/worker/job/:id` · `/worker/applications` · `/worker/profile` · `/worker/settle` · `/worker/contract` · `/worker/checkin` | 워커 마켓 앱 |
| `/staff` | 스태프 3화면 데모(레퍼런스) |

**관리자 `?screen=` 값**: `dashboard` · `project` · `postings` · `screen` · `contract` · `attend` · `settle` · `wait`/`ws`/`review`(Phase 1.5 placeholder)

## 4. 구현된 화면 (목데이터)

**관리자** — 대시보드 / 프로젝트·포지션 / **공고 등록(대행 등록)** / 지원자 스크리닝 / 지원자 상세(사진 검수·마스킹·커리어 이력) / 전자계약 / 출퇴근(QR, 이수시간) / 정산
**워커 앱** — 로그인(OTP UI) / 공고 탐색 / 공고 상세(지원) / 지원 현황 / 검카드(프로필 + **커리어 타임라인**) / 정산
**스태프** — 계약 서명 / QR 출근 체크인 / 정산 내역
**랜딩** — Hero · Trust · Problem · Features · Staff · Proxy · Safety · Pricing · Inquiry · FAQ · Footer (반응형 1440/1024/390)

## 5. 도메인 규칙 (중요)

- **출퇴근 = QR 전용** (스태프 GPS 제거). 현장 매니저 QR 스캔 + 사진 인증.
- **연락처 마스킹**: 워커는 입력 가능, 검카드/목록에는 `lib/mask.ts`로 자동 마스킹.
- **사진 검수**: `photoStatus` none/pending/approved/rejected, 승인 후 노출.
- **신체조건**: 정확값 비공개, `lib/body.ts`로 5cm/5kg **구간**만 표시·검색.
- **커리어 타임라인**: `WorkRecord`(source `platform|self`, verified, organizer, project, role, dates, status, evidence, visibility `private|link|public`). platform=자동·인증, self=자기기입·미인증.
- **대행 등록**: `AdminPosting`(postedBy `operator|agency`, consent{agreed,method,date}, claimStatus `unclaimed→invited→claimed`). 주관사 동의 기반, 합류 시 소유권 이전.
- **문구 규칙**: 명시적 줄바꿈(줄 배열 → `<br/>`), 한 줄 ≤30자·카드 ≤22자, `word-break: keep-all`.
- **목데이터에 실제 브랜드/행사명 금지**. 현재 더미 = 브랜드 `무드랩` / 행사 `MOMENT POPUP`(과거 실제 행사명이던 FUTURE MEMORIES/바이레도에서 교체됨).

## 6. 디자인 시스템

- 토큰 원본: `client/src/index.css` — `@theme inline`(유틸 노출) + `:root`(hex 원본).
- 브랜드 **Violet `#6C5CE7`** × **Amber `#FF9F1C`**. 관리자 사이드바만 다크.
- 시맨틱: `ink/ink-2/ink-3/subtle`, `surface/surface-2/surface-3`, `line/line-2`, `success/warning/danger/info`, `sidebar-*`.
- 랜딩 타이포: `.t-display/.t-h1/.t-h2/.t-h3/.t-kpi/.t-price/.t-body-lg/.t-body/.t-eyebrow/.t-caption` (모바일 → 1024 확대), `.lp-ph/.lp-ph-tag/.lp-keep/.lp-fade`.
- shadcn 프리미티브: `client/src/components/ui/*`. 공용: `brand`, `icon`, `kpi`, `kv`, `auth-badge`, `worker-badges`, `feedback`, `table-skeleton`.

## 7. 랜딩 (`/landing`) 이식 메모

- 소스(Designer): `design-landing/` — `lp-base.jsx`(COPY/프리미티브/목업), `lp-sections.jsx`(섹션), `lp.css`(토큰+타이포), `refs/`(제품 캡처).
- 이식: `pages/landing/copy.ts`(COPY 줄배열), `primitives.tsx`(Logo/Btn/Chip/Lines + 반응형 목업 ConsoleFrame/Phone/Crop/FloatCard/WorkerCard/ProfileScreen/Reveal), `sections.tsx`(11섹션), `Landing.tsx`(`#inquiry` 스무스 스크롤).
- 이미지: `design-landing/refs/*` → `client/public/landing/*` (`asset()` = `import.meta.env.BASE_URL + "landing/..."`).
- **플레이스홀더 유지**: OO 숫자·로고 6칸·요금(₩99,000 / ₩290,000 / 별도)·연락처.
- 승인 대기 카피: §3.4 제목, §3.7/§3.8 제목, §3.9 보조, 클로징 "팝업은 자주, 운영은 가볍게."
- ⚠ 랜딩 호스팅(제품 SPA `/` vs 별도 정적/Blade)은 **미정**. 단독 정적 배포 시 `vite base`를 `/`로 바꾸고 SPA fallback 필요.

## 8. 비즈니스 모델 요약 (상세는 `docs/bm.md`)

- 수익 = **SaaS 월 구독**(Lite/Pro/Agency) + **지급 대행**. **알선 수수료 없음**(도구 제공자 포지션).
- GTM = **supply-first 시딩**: 더블엠이 동의 기반 **대행 등록**으로 공고를 먼저 채움 + 내부 dogfooding + 커리어 타임라인 B2B 유입 루프.
- **핵심 리스크 = 채널 갈등/디스인터미디에이션** (운영주체가 대행사). 권고 = **"대행사를 위한 enabler"**, 수요측(브랜드) 직접 소유 금지, 법인/브랜드 분리·데이터 방화벽·BYO-brand.

## 9. 다음 작업 (권장 순서)

완료: DB 스키마·Laravel API·관리자/워커 인증·전 화면 API 연동(2026-10-23).
남은 `shortcut:` 주석(코드에서 grep) = 아래 항목의 자리표시:
1. **외부 발송 연동** — SMS OTP, 알림톡 계약 발송·주관사 초대(현재 상태만 변경).
2. **QR 카메라 스캔** — 현재 매니저 화면 6자리 코드를 워커가 입력. 같은 `/api/worker/attendance` 로 code 전송하면 됨.
3. **정산 규칙** — 가산·주휴수당 0, 원천징수 3.3% 고정. 일용근로소득 선택·규칙 테이블.
4. 이의신청 관리자 처리 화면, 주관사 claim(합류) 흐름, 공개 프로필 링크.
5. 랜딩 도입문의 수신 API + SEO/OG, 배포 파이프라인(호스팅 확정 후).

## 10. 함정 / 주의

- `npm run format` 금지(요청 시만). `npm run check`·`build:spa`는 항상 통과시킬 것.
- 로고/이미지 URL에 `import.meta.env.BASE_URL` 필수(운영 base `/build/`).
- 스크린샷: 헤드리스 Chrome. 전체 페이지는 큰 `--window-size`로 캡처 후 PIL로 슬라이스. `--headless=new` 동작함(컨퍼런스 프로젝트는 구형 `--headless` 사용 — 혼동 주의).
- 실제 브랜드/행사명을 목데이터·랜딩에 넣지 말 것.
- 운영 배포 시 Laravel이 SPA(`/build/`)를 서빙하는 web 라우트는 아직 없다(호스팅 미정).
- 시드는 실행일 기준 상대 날짜 — 며칠 지나 화면이 비면 `php artisan migrate:fresh --seed` 다시 실행.

## 11. 참고 문서 / 에셋

- `docs/bm.md` — BM·전략·벤치마크
- `docs/landing-brief.md` — 랜딩 카피/구조/SEO
- `docs/design-brief.md` — 제품 UI 브리프
- `design/tokens/`, `design/tokens.css` — 확정 토큰
- `design-landing/` — 랜딩 시안 원본(참고)
- `.shots/` — 검증 스크린샷
