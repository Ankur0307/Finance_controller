import type { RiskLevel } from "./theme";

export interface Txn {
  id: string;
  vendor: string;
  category: string;
  amount: number; // in INR
  time: string;
  score: number;
  level: RiskLevel;
  factors: string[];
}

// INR currency formatter, no decimals
export function inr(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function inrFull(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export const TRANSACTIONS: Txn[] = [
  {
    id: "TXN-8842",
    vendor: "Meridian Cloud Services",
    category: "Infrastructure",
    amount: 4820000,
    time: "12:04:18",
    score: 88,
    level: "BLOCKED",
    factors: [
      "First payment to this vendor",
      "Amount 3.4× vendor category median",
      "Bank account changed 2 days ago",
      "Invoice issued outside business hours",
    ],
  },
  {
    id: "TXN-8841",
    vendor: "Aurora Design Studio",
    category: "Marketing",
    amount: 720000,
    time: "12:01:52",
    score: 46,
    level: "REVIEW",
    factors: ["Above department monthly budget", "No matching PO on file"],
  },
  {
    id: "TXN-8840",
    vendor: "Nimbus Logistics",
    category: "Operations",
    amount: 1340000,
    time: "11:58:09",
    score: 22,
    level: "APPROVED",
    factors: ["Recurring vendor", "Within contract terms"],
  },
  {
    id: "TXN-8839",
    vendor: "Vertex Legal LLP",
    category: "Professional Services",
    amount: 285000,
    time: "11:52:41",
    score: 18,
    level: "APPROVED",
    factors: ["Under approval threshold", "Verified vendor"],
  },
  {
    id: "TXN-8838",
    vendor: "Quanta Semiconductors",
    category: "Hardware",
    amount: 9600000,
    time: "11:47:30",
    score: 61,
    level: "HOLD",
    factors: ["Large capital outlay", "Awaiting CFO co-sign", "FX exposure unhedged"],
  },
];
