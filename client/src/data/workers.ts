import type { AvatarTone } from "@/components/ui/avatar";

export type StatTone = "success" | "brand" | "warning" | "danger" | null;

export interface WorkerStat {
  label: string;
  value: string;
  tone?: StatTone;
  note?: string;
}

/** 이력 출처 — platform=플랫폼 인증(자동), self=워커 자기기입(타 주관 행사) */
export type WorkSource = "platform" | "self";
/** 이력 공개 범위 */
export type WorkVisibility = "private" | "link" | "public";
export type WorkStatus = "완료" | "노쇼" | "지각";

/**
 * 커리어 이력 — 워커 소유의 포터블 커리어 여권.
 * 플랫폼에서 진행한 행사는 verified=true 로 자동 기록되고,
 * 타 주관 행사는 워커가 자기기입하며 verified=false(미인증)로 표시된다.
 */
export interface WorkRecord {
  id: string;
  organizer: string;
  project: string;
  role: string;
  dates: string;
  source: WorkSource;
  verified: boolean;
  /** platform 이력만 가짐 */
  status?: WorkStatus;
  /** self 이력의 증빙 첨부 여부 */
  evidence?: boolean;
  visibility: WorkVisibility;
}

export interface WorkerFlags {
  verified?: boolean;
  newcomer?: boolean;
  foreign?: boolean;
  caution?: boolean;
}

/** 사진은 등록 즉시 노출되지 않고 관리자 검수를 거친다. */
export type PhotoStatus = "none" | "pending" | "approved" | "rejected";

export interface Worker {
  id: string;
  ini: string;
  tone: AvatarTone;
  name: string;
  gender: string;
  age: number;
  area: string;
  available: string;
  meta: string;
  flags: WorkerFlags;
  sel?: boolean;
  stats: WorkerStat[];
  tags: [("default" | "pos" | "lang"), string][];
  note?: boolean;
  act: "approve" | "trial" | "caution";
  /** 사진 검수 상태 */
  photoStatus: PhotoStatus;
  /** 정확값(비표시) — 검색·구간 표기에만 사용 */
  height: number;
  weight: number;
  bio?: string;
  /** 입력 가능 · 검카드엔 마스킹되어 표시 */
  contact?: { type: "phone" | "instagram"; value: string } | null;
  history: WorkRecord[];
}

export const WORKERS: Worker[] = [
  {
    id: "w-kim",
    ini: "김지",
    tone: "brand",
    name: "김지은",
    gender: "여",
    age: 28,
    area: "서울 마포",
    available: "10/05~10/07 전체",
    meta: "여 · 28세 · 서울 마포 · 가능일 10/05~10/07 전체",
    flags: { verified: true },
    sel: true,
    photoStatus: "approved",
    height: 168,
    weight: 52,
    bio: "향수·뷰티 팝업 프로모터 2년. POS·재고정리 능숙, 일본어 응대 가능.",
    contact: { type: "phone", value: "010-4821-7733" },
    stats: [
      { label: "노쇼율", value: "0%", tone: "success", note: "표본 28건" },
      { label: "완료 건수", value: "31" },
      { label: "재고용률", value: "92%", tone: "brand", note: "실제 재고용 23/25" },
      { label: "지각률", value: "3%", tone: "warning" },
    ],
    tags: [["pos", "#POS숙달"], ["default", "#프로모터 경력 2년"], ["lang", "#일어가능"]],
    act: "approve",
    history: [
      { id: "k1", organizer: "무드랩", project: "MOMENT POPUP 팝업", role: "운영 스태프", dates: "2026.09.12~09.14", source: "platform", verified: true, status: "완료", visibility: "public" },
      { id: "k2", organizer: "뉴욕의 거장들", project: "미술 전시 팝업", role: "안내 스태프", dates: "2026.08.20~08.24", source: "platform", verified: true, status: "완료", visibility: "public" },
      { id: "k3", organizer: "퍼스트 라운딩", project: "성수 팝업 운영", role: "서버", dates: "2026.07.30", source: "platform", verified: true, status: "지각", visibility: "link" },
      { id: "k4", organizer: "무신사", project: "무신사 스탠다드 성수 팝업", role: "판매 스태프", dates: "2026.06.10~06.15", source: "self", verified: false, evidence: true, visibility: "public" },
    ],
  },
  {
    id: "w-lee",
    ini: "이하",
    tone: "pop",
    name: "이하늘",
    gender: "여",
    age: 22,
    area: "인천",
    available: "10/06~10/07",
    meta: "여 · 22세 · 인천 · 가능일 10/06~10/07",
    flags: { newcomer: true },
    photoStatus: "none",
    height: 162,
    weight: 47,
    bio: "첫 팝업 근무입니다. 성실하게 배우겠습니다.",
    contact: null,
    stats: [
      { label: "노쇼율", value: "—", tone: null, note: "표본 0건" },
      { label: "완료 건수", value: "0" },
      { label: "재고용률", value: "—", tone: null, note: "데이터 없음" },
      { label: "지각률", value: "—", tone: null },
    ],
    tags: [["pos", "#POS숙달"], ["default", "#첫 근무"]],
    note: true,
    act: "trial",
    history: [],
  },
  {
    id: "w-emma",
    ini: "EM",
    tone: "info",
    name: "Emma Müller",
    gender: "여",
    age: 25,
    area: "서울 용산",
    available: "10/05~10/07",
    meta: "여 · 25세 · 독일 · 체류자격 확인 완료 · 가능일 10/05~10/07",
    flags: { foreign: true, verified: true },
    sel: true,
    photoStatus: "approved",
    height: 173,
    weight: 58,
    bio: "독일어·영어·기초 한국어. 뷰티/패션 팝업 응대 경험 다수.",
    contact: null,
    stats: [
      { label: "노쇼율", value: "0%", tone: "success", note: "표본 12건" },
      { label: "완료 건수", value: "14" },
      { label: "재고용률", value: "88%", tone: "brand", note: "실제 재고용 8/9" },
      { label: "지각률", value: "8%", tone: "warning" },
    ],
    tags: [["lang", "#영어가능"], ["lang", "#독일어가능"], ["default", "#응대"]],
    act: "approve",
    history: [
      { id: "e1", organizer: "무드랩", project: "MOMENT POPUP 팝업", role: "운영 스태프", dates: "2026.09.12~09.14", source: "platform", verified: true, status: "완료", visibility: "public" },
      { id: "e2", organizer: "티랩(T-LAB)", project: "신제품 체험 부스", role: "부스 운영", dates: "2026.08.01~08.04", source: "platform", verified: true, status: "완료", visibility: "public" },
      { id: "e3", organizer: "Zalando", project: "Berlin Fashion Week Booth", role: "Sales Staff", dates: "2025.09.01~09.05", source: "self", verified: false, evidence: false, visibility: "link" },
    ],
  },
  {
    id: "w-choi",
    ini: "최민",
    tone: "danger",
    name: "최민준",
    gender: "남",
    age: 31,
    area: "서울 강서",
    available: "10/05~10/07",
    meta: "남 · 31세 · 서울 강서 · 가능일 10/05~10/07",
    flags: { caution: true },
    photoStatus: "pending",
    height: 178,
    weight: 74,
    bio: "상하차·체력직 위주로 근무합니다.",
    contact: { type: "instagram", value: "@minjun_31" },
    stats: [
      { label: "노쇼율", value: "12%", tone: "danger", note: "표본 9건" },
      { label: "완료 건수", value: "8" },
      { label: "재고용률", value: "60%", tone: null, note: "실제 재고용 3/5" },
      { label: "지각률", value: "11%", tone: "danger" },
    ],
    tags: [["pos", "#상하차가능"], ["default", "#체력직"]],
    act: "caution",
    history: [
      { id: "c1", organizer: "퍼스트 라운딩", project: "성수 팝업 물류", role: "상하차", dates: "2026.09.02~09.03", source: "platform", verified: true, status: "완료", visibility: "public" },
      { id: "c2", organizer: "뉴욕의 거장들", project: "미술 전시 팝업", role: "상하차", dates: "2026.08.20", source: "platform", verified: true, status: "노쇼", visibility: "public" },
      { id: "c3", organizer: "쿠팡", project: "물류센터 야간 근무", role: "상하차", dates: "2026.05.02~05.30", source: "self", verified: false, evidence: false, visibility: "private" },
    ],
  },
];
