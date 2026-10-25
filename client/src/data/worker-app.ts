import type { PayType } from "@/data/jobs";
import type { WorkRecord, WorkerStat } from "@/data/workers";

/** 워커 앱 API 응답 타입 — backend/app/Http/Controllers/WorkerController.php 와 짝 */

export interface MyProfile {
  id: number;
  phone: string;
  name: string | null;
  gender: "여" | "남" | null;
  age: number | null;
  area: string | null;
  available: string | null;
  bio: string | null;
  height: number | null;
  weight: number | null;
  instagram: string | null;
  tags: ["default" | "pos" | "lang", string][];
  verified: boolean;
  photoStatus: "none" | "pending" | "approved" | "rejected";
  photoUrl: string | null;
  stats: WorkerStat[];
  records: WorkRecord[];
}

export type AppStage = "지원 완료" | "미선정" | "승인됨" | "계약 완료" | "근무중" | "근무 종료" | "정산 완료";

export interface MyApplication {
  id: number;
  jobId: string;
  brand: string;
  title: string;
  role: string;
  dates: string;
  pay: string;
  status: AppStage;
  action: { label: string; href: string; icon: string } | null;
}

export interface ContractDoc {
  id: number;
  workerName: string;
  brand: string;
  venue: string;
  role: string;
  period: string;
  hours: string;
  pay: number;
  payType: PayType;
  dailyPay: number;
  payday: string;
  state: "pending" | "expiring" | "expired" | "signed";
  signedAt: string | null;
  signature: string | null;
}

export interface Shift {
  venue: string;
  brand: string;
  role: string;
  startTime: string;
  endTime: string;
  day: number;
  days: number;
  checkIn: string | null;
  checkOut: string | null;
  late: boolean;
}

export interface Payslip {
  id: number;
  project: string;
  days: number;
  minutes: number;
  pay: number;
  base: number;
  extra: number;
  tax: number;
  net: number;
  status: "scheduled" | "paid";
  payDate: string;
  dispute: string | null;
}
