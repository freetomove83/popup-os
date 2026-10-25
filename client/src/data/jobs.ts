export type PayType = "hourly" | "daily";

export const PAY_UNIT: Record<PayType, string> = { hourly: "시급", daily: "일급" };
export const PAY_TYPE_OPTIONS = [
  { value: "hourly", label: PAY_UNIT.hourly },
  { value: "daily", label: PAY_UNIT.daily },
];

/** 역할 급여를 유형별 범위로 묶는다 — [{unit:"시급", range:"12,000~15,000원"}, {unit:"일급", ...}] */
export function payRanges(roles: { pay: number; payType: PayType }[]) {
  return (["hourly", "daily"] as const).flatMap(t => {
    const p = roles.filter(r => r.payType === t).map(r => r.pay);
    if (!p.length) return [];
    const [min, max] = [Math.min(...p), Math.max(...p)];
    const fmt = (n: number) => n.toLocaleString("ko-KR");
    return [{ unit: PAY_UNIT[t], range: min === max ? `${fmt(min)}원` : `${fmt(min)}~${fmt(max)}원` }];
  });
}

export interface JobRole {
  id: number;
  name: string;
  pay: number;
  payType: PayType;
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
