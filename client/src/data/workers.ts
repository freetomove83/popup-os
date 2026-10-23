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
  status?: WorkStatus | null;
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
  stats: WorkerStat[];
  tags: [("default" | "pos" | "lang"), string][];
  note?: boolean;
  act: "approve" | "trial" | "caution";
  /** 사진 검수 상태 */
  photoStatus: PhotoStatus;
  /** 구간 하한값(5cm/5kg 단위) — 정확값은 서버가 내보내지 않는다 */
  height: number;
  weight: number;
  bio?: string | null;
  /** 서버에서 마스킹된 값 */
  contact?: { type: "phone" | "instagram"; value: string } | null;
  history: WorkRecord[];
  instagram?: string | null;
  /** 승인된 사진만 */
  photoUrl?: string | null;
  /** 관리자 상세 — 검수 대기 사진 미리보기 */
  reviewPhotoUrl?: string | null;
}
