export interface JobRole {
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
}

export const JOBS: JobPosting[] = [
  {
    id: "j-mood",
    brand: "무드랩",
    organizer: "(주)무드랩",
    ownerVerified: true,
    title: "MOMENT POPUP 팝업 운영 스태프",
    venue: "더현대 서울 5F 이벤트홀",
    area: "서울 영등포",
    startDate: "2026.10.05",
    endDate: "2026.10.07",
    dday: 2,
    status: "마감임박",
    applicants: 38,
    tags: ["#POS숙달", "#응대", "#외국어우대"],
    desc: "무드랩 팝업스토어 운영 스태프를 모집합니다. 고객 응대·제품 안내·재고 정리 업무입니다.",
    roles: [
      { name: "운영 스태프(프로모터)", pay: 12000, hours: "10:00~19:00 (휴게 1h)", headcount: 12, filled: 12, tags: ["#POS숙달", "#응대"] },
      { name: "서버", pay: 13000, hours: "11:00~20:00 (휴게 1h)", headcount: 4, filled: 2, tags: ["#음료", "#응대"] },
      { name: "상하차", pay: 14000, hours: "08:00~12:00", headcount: 3, filled: 2, tags: ["#체력직"] },
    ],
  },
  {
    id: "j-nyc",
    brand: "뉴욕의 거장들",
    organizer: "(주)뉴욕의거장들",
    ownerVerified: false,
    title: "미술 전시 팝업 안내·운영",
    venue: "롯데백화점 잠실 1F",
    area: "서울 송파",
    startDate: "2026.10.08",
    endDate: "2026.10.12",
    dday: 5,
    status: "모집중",
    applicants: 21,
    tags: ["#전시", "#안내", "#주말가능"],
    desc: "미술 전시 팝업의 관람 안내와 현장 운영을 담당할 스태프를 모집합니다.",
    roles: [
      { name: "안내 스태프", pay: 12500, hours: "10:30~19:30 (휴게 1h)", headcount: 8, filled: 3, tags: ["#안내", "#전시"] },
      { name: "운영 리더", pay: 16000, hours: "09:30~19:30 (휴게 1h)", headcount: 2, filled: 1, tags: ["#리더경험"] },
    ],
  },
  {
    id: "j-first",
    brand: "퍼스트 라운딩",
    organizer: "(주)퍼스트라운딩",
    ownerVerified: false,
    title: "성수 팝업 물류·상하차",
    venue: "성수 팝업존 B동",
    area: "서울 성동",
    startDate: "2026.10.05",
    endDate: "2026.10.06",
    dday: 1,
    status: "마감임박",
    applicants: 12,
    tags: ["#상하차가능", "#조기출근"],
    desc: "팝업 물류 상하차 및 진열 보조. 이른 시간 근무 가능한 분 우대.",
    roles: [
      { name: "상하차", pay: 15000, hours: "07:00~11:00", headcount: 6, filled: 4, tags: ["#체력직", "#조기출근"] },
    ],
  },
  {
    id: "j-tlab",
    brand: "티랩(T-LAB)",
    organizer: "(주)티랩",
    ownerVerified: true,
    title: "신제품 체험 부스 운영",
    venue: "코엑스 D홀",
    area: "서울 강남",
    startDate: "2026.10.15",
    endDate: "2026.10.18",
    dday: 12,
    status: "모집중",
    applicants: 9,
    tags: ["#부스운영", "#외국어가능"],
    desc: "신제품 체험 부스 운영 및 시연. 영어 응대 가능자 우대.",
    roles: [
      { name: "부스 운영", pay: 13000, hours: "10:00~18:00 (휴게 1h)", headcount: 10, filled: 1, tags: ["#부스운영", "#외국어가능"] },
      { name: "시연 진행", pay: 15000, hours: "10:00~18:00 (휴게 1h)", headcount: 4, filled: 0, tags: ["#시연", "#발표"] },
    ],
  },
];
