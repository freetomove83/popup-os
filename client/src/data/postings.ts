/** 공고 등록 주체 — operator=더블엠 대행 등록, agency=주관사 직접 등록 */
export type PostingOwner = "operator" | "agency";

/**
 * 소유권 상태 — 대행 등록한 공고의 주관사 합류(claim) 진행 상태.
 * unclaimed: 주관사 미합류 → invited: 초대 발송됨 → claimed: 주관사가 소유권 확보
 */
export type ClaimStatus = "unclaimed" | "invited" | "claimed";

export type PostingStatus = "모집중" | "마감임박" | "마감";

export interface Consent {
  agreed: boolean;
  method: "구두" | "이메일" | "서면" | null;
  date: string | null;
}

export interface AdminPosting {
  id: string;
  /** 주관사·브랜드 (노출명) */
  brand: string;
  /** 주관사 법인·단체명 */
  organizer: string;
  /** 담당자 연락처 — 서버에서 마스킹되어 내려온다 */
  contact: string;
  consent: Consent;
  postedBy: PostingOwner;
  claimStatus: ClaimStatus;
  title: string;
  venue: string;
  period: string;
  dday: number;
  status: PostingStatus;
  roles: number;
  headcount: number;
  filled: number;
  applicants: number;
}
