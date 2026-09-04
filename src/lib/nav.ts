import {
  IconTower,
  IconFirewall,
  IconRisk,
  IconAI,
  IconTime,
  IconGraph,
  IconVault,
} from "../components/icons";
import type { ScreenId } from "./theme";

export interface NavItem {
  id: ScreenId;
  label: string;
  short: string;
  icon: typeof IconTower;
}

export const NAV: NavItem[] = [
  { id: "control-tower", label: "Control Tower", short: "Overview & live signals", icon: IconTower },
  { id: "firewall", label: "Financial Firewall", short: "Transaction pipeline", icon: IconFirewall },
  { id: "risk-center", label: "Risk Center", short: "Risk register & triage", icon: IconRisk },
  { id: "ai-investigator", label: "AI Investigator", short: "Ask FIN-SENTINEL", icon: IconAI },
  { id: "time-machine", label: "Time Machine", short: "Scenario simulation", icon: IconTime },
  { id: "control-graph", label: "Control Graph", short: "Money relationship map", icon: IconGraph },
  { id: "audit-vault", label: "Audit Vault", short: "Immutable event log", icon: IconVault },
];

export const SCREEN_TITLE: Record<ScreenId, string> = Object.fromEntries(
  NAV.map((n) => [n.id, n.label]),
) as Record<ScreenId, string>;
