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
  method: "구두" | "이메일" | "서면";
  date: string;
}

export interface AdminPosting {
  id: string;
  /** 주관사·브랜드 (노출명) */
  brand: string;
  /** 주관사 법인·단체명 */
  organizer: string;
  /** 담당자 연락처 — 표시 시 마스킹 */
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

export const POSTINGS: AdminPosting[] = [
  {
    id: "p-musinsa",
    brand: "무신사 스탠다드",
    organizer: "(주)무신사",
    contact: "010-2288-4471",
    consent: { agreed: true, method: "구두", date: "2026-09-30" },
    postedBy: "operator",
    claimStatus: "unclaimed",
    title: "성수 팝업 판매·응대 스태프",
    venue: "무신사 스탠다드 성수",
    period: "2026.10.10~10.19",
    dday: 7,
    status: "모집중",
    roles: 2,
    headcount: 14,
    filled: 3,
    applicants: 11,
  },
  {
    id: "p-oliveyoung",
    brand: "올리브영",
    organizer: "(주)씨제이올리브영",
    contact: "010-3371-9025",
    consent: { agreed: true, method: "이메일", date: "2026-09-27" },
    postedBy: "operator",
    claimStatus: "invited",
    title: "N차 팝업 뷰티 체험 운영",
    venue: "홍대 N스퀘어",
    period: "2026.10.06~10.09",
    dday: 3,
    status: "마감임박",
    roles: 3,
    headcount: 10,
    filled: 7,
    applicants: 29,
  },
  {
    id: "p-gentle",
    brand: "젠틀몬스터",
    organizer: "(주)젠틀몬스터",
    contact: "010-9042-1180",
    consent: { agreed: true, method: "서면", date: "2026-09-25" },
    postedBy: "operator",
    claimStatus: "unclaimed",
    title: "신제품 아이웨어 팝업 운영",
    venue: "가로수길 플래그십",
    period: "2026.10.12~10.20",
    dday: 9,
    status: "모집중",
    roles: 2,
    headcount: 8,
    filled: 1,
    applicants: 5,
  },
  {
    id: "p-amore",
    brand: "아모레퍼시픽",
    organizer: "(주)아모레퍼시픽",
    contact: "010-5510-7734",
    consent: { agreed: true, method: "이메일", date: "2026-09-20" },
    postedBy: "operator",
    claimStatus: "claimed",
    title: "메이크업 체험 부스 운영",
    venue: "코엑스 마곡",
    period: "2026.09.28~10.01",
    dday: 0,
    status: "마감",
    roles: 2,
    headcount: 6,
    filled: 6,
    applicants: 18,
  },
  {
    id: "p-mood",
    brand: "무드랩",
    organizer: "(주)무드랩",
    contact: "010-3120-8890",
    consent: { agreed: true, method: "이메일", date: "2026-09-22" },
    postedBy: "agency",
    claimStatus: "claimed",
    title: "MOMENT POPUP 팝업 운영 스태프",
    venue: "더현대 서울 5F",
    period: "2026.10.05~10.07",
    dday: 2,
    status: "마감임박",
    roles: 3,
    headcount: 19,
    filled: 16,
    applicants: 38,
  },
  {
    id: "p-tlab",
    brand: "티랩(T-LAB)",
    organizer: "(주)티랩",
    contact: "010-7745-2213",
    consent: { agreed: true, method: "구두", date: "2026-09-28" },
    postedBy: "agency",
    claimStatus: "claimed",
    title: "신제품 체험 부스 운영",
    venue: "코엑스 D홀",
    period: "2026.10.15~10.18",
    dday: 12,
    status: "모집중",
    roles: 2,
    headcount: 14,
    filled: 1,
    applicants: 9,
  },
];
