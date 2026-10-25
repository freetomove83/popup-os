import type { PayType } from "@/data/jobs";
import type { AdminPosting } from "@/data/postings";
import type { Worker } from "@/data/workers";

/** 관리자 API 응답 타입 — backend/app/Http/Controllers/AdminController.php 와 짝 */

export interface ProjectListItem extends AdminPosting {
  active: boolean;
  ended: boolean;
}

export interface ProjectDetail {
  id: string;
  brand: string;
  organizer: string;
  title: string;
  venue: string;
  area: string;
  startDate: string;
  endDate: string;
  days: number;
  manager: string | null;
  description: string | null;
  status: "진행 중" | "준비 중" | "종료";
  positions: {
    id: number;
    name: string;
    hours: string;
    pay: number;
    payType: PayType;
    headcount: number;
    filled: number;
    applicants: number;
  }[];
}

export type ApplicationStatus = "applied" | "held" | "approved" | "rejected";

export interface Applicant {
  applicationId: number;
  status: ApplicationStatus;
  position: string;
  positionId: number;
  contracted: boolean;
  worker: Worker;
}

export interface Dashboard {
  today: string;
  kpis: {
    activeProjects: number;
    endingThisWeek: number;
    attended: number;
    expected: number;
    late: number;
    absent: number;
    unsigned: number;
    expiring: number;
    payable: number;
    payableCount: number;
  };
  sites: {
    id: number;
    title: string;
    venue: string;
    positions: string;
    attended: number;
    expected: number;
    signed: number;
    contracts: number;
    late: number;
    absent: number;
  }[];
  todo: {
    tone: "warning" | "info" | "brand";
    icon: string;
    title: string;
    desc: string;
    to: "attend" | "contract" | "settle";
    projectId?: number;
  }[];
}

export type ContractState = "unsent" | "pending" | "expiring" | "expired" | "signed";

export interface ContractsView {
  kpis: { sent: number; signed: number; pending: number; expiring: number; expired: number; unsent: number };
  rows: {
    applicationId: number;
    contractId: number | null;
    name: string;
    position: string;
    sentAt: string | null;
    signedAt: string | null;
    state: ContractState;
  }[];
}

export type DayStatus = "정상" | "지각" | "퇴근" | "미출근" | "출근 전";

export interface AttendanceView {
  date: string;
  active: boolean;
  venue: string;
  code: string;
  kpis: { expected: number; in: number; late: number; absent: number; out: number; endTime: string | null };
  rows: {
    applicationId: number;
    name: string;
    position: string;
    checkIn: string | null;
    checkOut: string | null;
    method: "qr" | "qrphoto" | "manager" | null;
    status: DayStatus;
  }[];
}

export interface SettlementView {
  issued: boolean;
  kpis: { count: number; minutes: number; gross: number; tax: number; disputes: number };
  rows: {
    id: number;
    name: string;
    days: number;
    minutes: number;
    base: number;
    extra: number;
    tax: number;
    net: number;
    status: "draft" | "scheduled" | "paid";
    dispute: string | null;
  }[];
}
