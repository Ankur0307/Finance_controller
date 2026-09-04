import { useMemo, useState } from "react";
import { Panel, PageHeader } from "../components/Panel";
import RiskMeter from "../components/RiskMeter";
import { inr } from "../lib/data";

type Status = "OPEN" | "REVIEW" | "RESOLVED";
interface Risk {
  id: string;
  title: string;
  entity: string;
  amount: number;
  category: string;
  detected: string;
  score: number;
  status: Status;
  owner: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  Fraud: "var(--red)",
  Budget: "var(--amber)",
  Vendor: "var(--cyan)",
  Compliance: "#a78bfa",
  Operations: "var(--green)",
};

const RISKS: Risk[] = [
  { id: "R-2041", title: "Vendor bank account redirected", entity: "Meridian Cloud", amount: 4820000, category: "Fraud", detected: "12 min ago", score: 88, status: "OPEN", owner: "R. Mehta" },
  { id: "R-2039", title: "Marketing spend over budget", entity: "Aurora Design", amount: 720000, category: "Budget", detected: "1 hr ago", score: 46, status: "REVIEW", owner: "S. Kapoor" },
  { id: "R-2036", title: "Unhedged FX exposure", entity: "Quanta Semi", amount: 9600000, category: "Compliance", detected: "3 hr ago", score: 61, status: "OPEN", owner: "A. Nair" },
  { id: "R-2033", title: "Duplicate invoice detected", entity: "Nimbus Logistics", amount: 1340000, category: "Vendor", detected: "6 hr ago", score: 34, status: "REVIEW", owner: "S. Kapoor" },
  { id: "R-2028", title: "Approval chain bypassed", entity: "Vertex Legal", amount: 285000, category: "Compliance", detected: "Yesterday", score: 52, status: "OPEN", owner: "R. Mehta" },
  { id: "R-2021", title: "Payment run delay risk", entity: "Payroll Q3", amount: 8200000, category: "Operations", detected: "Yesterday", score: 28, status: "RESOLVED", owner: "A. Nair" },
  { id: "R-2015", title: "Concentration on single vendor", entity: "Meridian Cloud", amount: 12400000, category: "Vendor", detected: "2 days ago", score: 44, status: "REVIEW", owner: "R. Mehta" },
];

const FILTERS = ["All", "Fraud", "Budget", "Vendor", "Compliance", "Operations"];

function statusColor(s: Status) {
  return s === "OPEN" ? "var(--red)" : s === "REVIEW" ? "var(--amber)" : "var(--green)";
}

export default function RiskCenter() {
  const [filter, setFilter] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    let r = filter === "All" ? RISKS : RISKS.filter((x) => x.category === filter);
    return [...r].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));
  }, [filter, sortDesc]);

  const open = RISKS.filter((r) => r.status === "OPEN").length;
  const critical = RISKS.filter((r) => r.score >= 70).length;
  const resolved = RISKS.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="mx-auto max-w-[1400px] p-5">
      <PageHeader title="Risk Center" subtitle="Every detected risk, triaged and owned — sorted by severity." />

      {/* Stat row */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Composite Risk" value="58" tone="var(--amber)" sub="▲ 4 pts this week" />
        <Stat label="Open" value={String(open)} tone="var(--red)" sub="Needs action" />
        <Stat label="Critical" value={String(critical)} tone="var(--red)" sub="Score ≥ 70" />
        <Stat label="Resolved (7d)" value={String(resolved + 11)} tone="var(--green)" sub="▼ avg 4.2h to close" />
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full border px-3 py-1 text-[12px] transition-colors"
            style={{
              borderColor: filter === f ? "var(--cyan)" : "var(--border)",
              color: filter === f ? "var(--cyan)" : "var(--text-secondary)",
              background: filter === f ? "color-mix(in srgb, var(--cyan) 10%, transparent)" : "transparent",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <Panel>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
              {["Risk", "Entity", "Amount", "Category", "Detected", "Score", "Status", "Owner"].map(
                (h) => (
                  <th
                    key={h}
                    onClick={() => h === "Score" && setSortDesc((v) => !v)}
                    className={`mono px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] ${h === "Score" ? "cursor-pointer select-none" : ""}`}
                  >
                    {h}
                    {h === "Score" && <span className="ml-1">{sortDesc ? "▼" : "▲"}</span>}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[var(--border-muted)] transition-colors last:border-0 hover:bg-[var(--surface-elevated)]"
              >
                <td className="px-4 py-3">
                  <div className="text-[13px] font-medium">{r.title}</div>
                  <div className="mono text-[10px] text-[var(--text-muted)]">{r.id}</div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">{r.entity}</td>
                <td className="mono px-4 py-3 text-[13px] tabular-nums">{inr(r.amount)}</td>
                <td className="px-4 py-3">
                  <span
                    className="mono rounded-[4px] px-2 py-0.5 text-[11px]"
                    style={{
                      color: CATEGORY_COLOR[r.category],
                      background: `color-mix(in srgb, ${CATEGORY_COLOR[r.category]} 12%, transparent)`,
                    }}
                  >
                    {r.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">{r.detected}</td>
                <td className="px-4 py-3">
                  <RiskMeter score={r.score} width="w-16" />
                </td>
                <td className="px-4 py-3">
                  <span
                    className="mono inline-flex items-center gap-1.5 text-[11px]"
                    style={{ color: statusColor(r.status) }}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: statusColor(r.status) }} />
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function Stat({ label, value, tone, sub }: { label: string; value: string; tone: string; sub: string }) {
  return (
    <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
      <div className="mono mt-2 text-2xl font-semibold tabular-nums" style={{ color: tone }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-[var(--text-secondary)]">{sub}</div>
    </div>
  );
}
