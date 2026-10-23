/** 랜딩 카피 — 모든 문구는 줄 배열(명시적 줄바꿈). 자동 줄바꿈 금지(keep-all). */

export type Lines = string[];

export interface Feature {
  k: string;
  t: Lines;
  desc: Lines;
  icon: string;
}

export interface Plan {
  name: string;
  price: string;
  unit: string;
  who: Lines;
  inc: string[];
  cta: string;
  hot?: boolean;
}

export interface Faq {
  q: Lines;
  a: Lines;
}

export interface IconCard {
  t: Lines;
  s?: Lines;
  icon: string;
  k?: string;
}

export const COPY = {
  hero: {
    eyebrow: ["팝업스토어 운영 OS"],
    h1: ["팝업 운영의", "처음과 끝을 하나로."],
    sub: [
      "구인·전자계약·QR 출퇴근·정산을",
      "한 곳에서 관리하는 팝업스토어 운영 OS.",
      "대행사와 브랜드를 위한 올인원 콘솔.",
    ],
    ctaPrimary: ["도입 문의"],
    ctaSecondary: ["무료로 시작하기"],
    aux: ["신용카드 없이 시작 · 14일 무료 체험"],
  },
  trust: {
    lead: ["이미 OO개 대행사가 Popup OS로 운영하고 있어요"],
    stats: [
      ["누적 프로젝트", "OO건"],
      ["등록 스태프", "OO명"],
      ["정산 완료", "OO건"],
    ] as [string, string][],
  },
  problem: {
    h2: ["아직도 엑셀과 카톡으로", "팝업을 운영하시나요?"],
    cards: [
      { k: "구인", t: ["단톡방 공고, 이력은 안 보이고"], icon: "MessagesSquare" },
      { k: "계약", t: ["종이 계약서, 분실에 누락까지"], icon: "FileX" },
      { k: "정산", t: ["수기 근태 집계, 매번 다른 계산"], icon: "Calculator" },
    ] as IconCard[],
  },
  features: [
    { k: "구인·매칭", t: ["검증된 스태프를", "한눈에"], icon: "UserSearch", desc: ["신뢰지표와 커리어 이력으로", "지원자를 바로 비교해요."] },
    { k: "전자계약", t: ["서명부터 보관까지", "자동"], icon: "FilePenLine", desc: ["알림톡으로 계약서를 보내고", "서명 현황을 실시간으로 봐요."] },
    { k: "QR 출퇴근", t: ["현장에서 스캔하면", "끝"], icon: "ScanLine", desc: ["매니저 QR 스캔과 사진 인증으로", "대리출근 없이 기록돼요."] },
    { k: "정산·급여", t: ["근태 그대로", "자동 정산"], icon: "Wallet", desc: ["출퇴근 로그가 그대로", "정산서로 이어져요."] },
  ] as Feature[],
  staff: {
    h2: ["스태프는 검카드 하나로", "일자리를 관리해요"],
    points: [
      { t: ["검카드로 지원하고 바로 계약"], icon: "IdCard" },
      { t: ["근무 이력이 커리어로 쌓여요"], s: ["타 주관 행사도 직접 추가"], icon: "History" },
      { t: ["정산 내역을 한 곳에서 확인"], icon: "Receipt" },
    ] as IconCard[],
    cta: ["스태프로 시작하기"],
  },
  proxy: {
    h2: ["주관사 동의만 받으면", "공고를 대신 등록해 드려요"],
    desc: ["초기 구인 풀을 빠르게 채우도록", "더블엠이 동의 기반으로 공고를 대행 등록해요.", "주관사가 합류하면 소유권이 이전됩니다."],
    note: ["계약·정산 주체는 주관사입니다.", "Popup OS는 도구를 제공합니다."],
  },
  safety: {
    h2: ["개인정보와 신뢰,", "처음부터 안전하게"],
    cards: [
      { t: ["연락처 자동 마스킹"], s: ["외부 직접 연락 차단"], icon: "EyeOff" },
      { t: ["사진 검수 후 노출"], s: ["부적절 사진 반려"], icon: "ImageOff" },
      { t: ["실데이터 신뢰지표"], s: ["계약·근태 로그 기반"], icon: "BadgeCheck" },
      { t: ["전자계약 무결성"], s: ["위·변조 방지 보관"], icon: "FileLock" },
    ] as IconCard[],
  },
  pricing: {
    h2: ["운영 규모에 맞춰", "시작하세요"],
    plans: [
      {
        name: "Lite",
        price: "₩99,000",
        unit: "/월",
        who: ["소규모 대행사·단일 브랜드"],
        inc: ["동시 프로젝트 1개", "스태프 50명", "전자계약", "QR 출퇴근", "기본 정산"],
        cta: "무료로 시작하기",
      },
      {
        name: "Pro",
        price: "₩290,000",
        unit: "/월",
        who: ["성장하는 대행사"],
        hot: true,
        inc: ["동시 프로젝트 5개", "스태프 300명", "정산 자동화", "커리어 타임라인", "대행 등록"],
        cta: "무료로 시작하기",
      },
      {
        name: "Agency",
        price: "별도 문의",
        unit: "",
        who: ["다수 클라이언트 운영"],
        inc: ["무제한 프로젝트", "다중 워크스페이스", "지급 대행", "전담 지원"],
        cta: "도입 문의",
      },
    ] as Plan[],
    foot: ["언제든 해지 · 부가세 별도 · 세금계산서 발행"],
  },
  inquiry: {
    h2: ["도입이 고민되시나요?", "20분이면 충분해요."],
    sub: ["운영 방식을 들려주시면", "맞는 플랜과 세팅 일정을 안내해 드려요."],
    points: [
      ["Video", "20분 데모로 흐름 확인"],
      ["FileSpreadsheet", "기존 엑셀 명단 이관 지원"],
    ] as [string, string][],
    submit: ["도입 문의 보내기"],
    consent: ["개인정보 수집·이용에 동의합니다"],
  },
  faq: [
    { q: ["도입까지 얼마나 걸리나요?"], a: ["보통 1~2일 내 세팅,", "첫 프로젝트까지 함께 도와드려요."] },
    { q: ["기존 엑셀 데이터를 옮길 수 있나요?"], a: ["스태프·프로젝트 명단 이관을 지원합니다."] },
    { q: ["스태프 교육이 필요한가요?"], a: ["알림톡 링크로 바로 서명·체크인,", "별도 교육이 필요 없어요."] },
    { q: ["세금계산서 발행되나요?"], a: ["네, 구독료에 대해 발행됩니다."] },
    { q: ["정산 지급도 대행해 주나요?"], a: ["Agency 플랜에서 지급 대행을 지원합니다."] },
  ] as Faq[],
  closing: ["팝업은 자주,", "운영은 가볍게."],
  nav: ["기능", "스태프", "대행 등록", "요금제", "FAQ"],
  footer: {
    links: ["이용약관", "개인정보처리방침", "도입 문의", "사업자 정보"],
    contacts: [
      ["Mail", "hello@OO.kr"],
      ["Phone", "02-000-0000"],
      ["MessageCircle", "카카오채널 @OO"],
    ] as [string, string][],
  },
};
