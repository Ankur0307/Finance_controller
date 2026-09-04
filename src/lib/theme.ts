// Central design tokens + risk semantics shared across FIN-SENTINEL screens.

export const C = {
  bg: "#09090b",
  surface: "#111113",
  elevated: "#18181b",
  border: "#27272a",
  borderMuted: "#1f1f22",
  text: "#fafafa",
  textSecondary: "#a1a1aa",
  textMuted: "#52525b",
  cyan: "#22d3ee",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
} as const;

export type RiskLevel = "APPROVED" | "REVIEW" | "HOLD" | "BLOCKED";

export const RISK_META: Record<
  RiskLevel,
  { color: string; label: string }
> = {
  APPROVED: { color: C.green, label: "APPROVED" },
  REVIEW: { color: C.amber, label: "REVIEW" },
  HOLD: { color: C.amber, label: "HOLD" },
  BLOCKED: { color: C.red, label: "BLOCKED" },
};

// Score 0-100 → color band
export function scoreColor(score: number): string {
  if (score >= 70) return C.red;
  if (score >= 40) return C.amber;
  return C.green;
}

export type ScreenId =
  | "control-tower"
  | "firewall"
  | "risk-center"
  | "ai-investigator"
  | "time-machine"
  | "control-graph"
  | "audit-vault";
