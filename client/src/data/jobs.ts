export interface JobRole {
  id: number;
  name: string;
  pay: number;
  hours: string;
  headcount: number;
  filled: number;
  tags: string[];
}

export type JobStatus = "모집중" | "마감임박" | "마감";

export interface JobPosting {
  id: string;
  brand: string;
  /** 주관사 법인·단체명 */
  organizer: string;
  /** 주관사가 합류(claim)해 확인된 공고인지 */
  ownerVerified: boolean;
  title: string;
  venue: string;
  area: string;
  startDate: string;
  endDate: string;
  dday: number;
  status: JobStatus;
  roles: JobRole[];
  tags: string[];
  desc: string;
  applicants: number;
  /** 상세 조회 시 로그인 워커의 이 공고 지원 내역 */
  myApplication?: { id: number; status: string; position_id: number } | null;
}
