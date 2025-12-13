export interface Lawyer {
  id: string;
  name: string;
  photo: string;
  avatar: string;
  activeCases: number;
  overdueCases: number;
  status: "active" | "busy" | "vacation";
  age?: number;
  education?: string;
  experience?: number;
  specialization?: string;
  email?: string;
  phone?: string;
  contacts?: {
    phone?: string;
    email?: string;
  };
  // Statistics
  totalCases: number;
  totalRevenue?: number;
  successfulCases?: number;
  winRate?: number;
  avgCaseDuration?: number;
  clientSatisfaction?: number;
}

export interface CaseEntry {
  id: string;
  date: string;
  text: string;
  files?: string[];
}

export type PaymentStatus = "paid" | "unpaid" | "partial";
export type CaseResult = "won" | "lost" | "partial_win" | "settled" | "pending";

export interface Case {
  id: string;
  caseNumber: string;
  lawyerId: string;
  client: string;
  clientName: string;
  title: string;
  category: string;
  orderNumber: string;
  orderDate: string;
  status: "active" | "overdue" | "completed" | "pending";
  paymentStatus: PaymentStatus;
  caseResult: CaseResult;
  amount: number;
  paidAmount: number;
  startDate: string;
  createdAt: Date;
  deadline: string;
  lastUpdate: Date;
  description?: string;
  entries?: CaseEntry[];
  contractFile?: string;
  isSuccessful?: boolean;
  fee?: number;
}
