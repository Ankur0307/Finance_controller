import { useState } from "react";
import { PageHeader, Panel } from "../components/Panel";
import RiskMeter from "../components/RiskMeter";

type NodeType = "company" | "dept" | "budget" | "vendor" | "invoice" | "payment";

interface GNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  detail: {
    subtitle: string;
    total: string;
    share: string;
    risk: number;
    invoices: number;
    anomaly: string;
  };
}

const TYPE_COLOR: Record<NodeType, string> = {
  company: "var(--text)",
  dept: "var(--cyan)",
  budget: "var(--green)",
  vendor: "var(--amber)",
  invoice: "#a78bfa",
  payment: "var(--red)",
};

const NODES: GNode[] = [
  { id: "acme", label: "Acme Robotics", type: "company", x: 420, y: 60, detail: { subtitle: "Parent entity", total: "₹42.8 Cr", share: "100%", risk: 58, invoices: 214, anomaly: "3 blocked payments today" } },
  { id: "eng", label: "Engineering", type: "dept", x: 200, y: 170, detail: { subtitle: "Department", total: "₹18.4 Cr", share: "43%", risk: 44, invoices: 92, anomaly: "Cloud spend +22% MoM" } },
  { id: "mktg", label: "Marketing", type: "dept", x: 640, y: 170, detail: { subtitle: "Department", total: "₹6.1 Cr", share: "14%", risk: 61, invoices: 58, anomaly: "Over budget by 27%" } },
  { id: "infra", label: "Infra Budget", type: "budget", x: 120, y: 300, detail: { subtitle: "Budget line", total: "₹9.6 Cr", share: "22%", risk: 38, invoices: 34, anomaly: "None" } },
  { id: "camp", label: "Campaign Budget", type: "budget", x: 560, y: 300, detail: { subtitle: "Budget line", total: "₹4.2 Cr", share: "10%", risk: 52, invoices: 27, anomaly: "Pacing ahead of plan" } },
  { id: "meridian", label: "Meridian Cloud", type: "vendor", x: 250, y: 430, detail: { subtitle: "Vendor", total: "₹12.4 Cr", share: "29%", risk: 88, invoices: 41, anomaly: "Bank account changed 2d ago" } },
  { id: "aurora", label: "Aurora Design", type: "vendor", x: 700, y: 430, detail: { subtitle: "Vendor", total: "₹1.8 Cr", share: "4%", risk: 46, invoices: 19, anomaly: "Missing PO on 3 invoices" } },
  { id: "inv88", label: "INV-8842", type: "invoice", x: 130, y: 540, detail: { subtitle: "Invoice", total: "₹48.2 L", share: "—", risk: 88, invoices: 1, anomaly: "3.4× category median" } },
  { id: "pay88", label: "TXN-8842", type: "payment", x: 380, y: 540, detail: { subtitle: "Payment (blocked)", total: "₹48.2 L", share: "—", risk: 88, invoices: 1, anomaly: "Held by firewall" } },
];

const EDGES: [string, string][] = [
  ["acme", "eng"], ["acme", "mktg"],
  ["eng", "infra"], ["mktg", "camp"],
  ["infra", "meridian"], ["camp", "aurora"],
  ["meridian", "inv88"], ["inv88", "pay88"], ["meridian", "pay88"],
];

const POS = Object.fromEntries(NODES.map((n) => [n.id, n]));

export default function ControlGraph() {
  const [selected, setSelected] = useState<GNode | null>(NODES[5]);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1400px] p-5">
      <PageHeader
        title="Control Graph"
        subtitle="Follow the money from entity to payment. Node size and color signal type; ring color signals risk."
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <Panel title="Money Relationship Map" accent="var(--cyan)">
          <div className="p-2">
            <svg viewBox="0 0 820 600" width="100%" className="select-none">
              {EDGES.map(([a, b]) => {
                const na = POS[a];
                const nb = POS[b];
                const on = hover === a || hover === b || selected?.id === a || selected?.id === b;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={on ? "var(--cyan)" : "var(--border)"}
                    strokeWidth={on ? 1.5 : 1}
                    opacity={on ? 0.9 : 0.5}
                  />
                );
              })}
              {NODES.map((n) => {
                const c = TYPE_COLOR[n.type];
                const active = selected?.id === n.id;
                const hl = hover === n.id || active;
                const r = n.type === "company" ? 26 : n.type === "dept" ? 20 : 15;
                const risk = n.detail.risk;
                const ring = risk >= 70 ? "var(--red)" : risk >= 40 ? "var(--amber)" : "var(--green)";
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setSelected(n)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle r={r + 4} fill="none" stroke={ring} strokeWidth={hl ? 2 : 1} opacity={hl ? 1 : 0.5} />
                    <circle
                      r={r}
                      fill="var(--surface)"
                      stroke={c}
                      strokeWidth={1.5}
                    />
                    <circle r={r - 6} fill={c} opacity={hl ? 0.35 : 0.18} />
                    <text
                      y={r + 16}
                      textAnchor="middle"
                      fill={hl ? "var(--text)" : "var(--text-secondary)"}
                      fontSize={11}
                      fontFamily="Inter, sans-serif"
                      fontWeight={active ? 600 : 400}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 border-t border-[var(--border)] px-3 py-2">
              {(Object.keys(TYPE_COLOR) as NodeType[]).map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                  <span className="size-2 rounded-full" style={{ background: TYPE_COLOR[t] }} />
                  <span className="capitalize">{t}</span>
                </span>
              ))}
            </div>
          </div>
        </Panel>

        {/* Detail panel */}
        <Panel title="Node Detail" accent={selected ? TYPE_COLOR[selected.type] : "var(--border)"}>
          {selected ? (
            <div className="p-5">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: TYPE_COLOR[selected.type] }} />
                <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {selected.detail.subtitle}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-semibold">{selected.label}</h3>

              <dl className="mt-4 space-y-3">
                <Row label="Total value" value={selected.detail.total} mono />
                <Row label="Share of parent" value={selected.detail.share} mono />
                <Row label="Active invoices" value={String(selected.detail.invoices)} mono />
                <div>
                  <dt className="text-[12px] text-[var(--text-muted)]">Risk score</dt>
                  <dd className="mt-1.5">
                    <RiskMeter score={selected.detail.risk} width="w-full" />
                  </dd>
                </div>
              </dl>

              <div
                className="mt-4 rounded-[6px] border px-3 py-2.5 text-[12px]"
                style={{
                  borderColor: "color-mix(in srgb, var(--amber) 30%, var(--border))",
                  background: "color-mix(in srgb, var(--amber) 6%, transparent)",
                }}
              >
                <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--amber)]">
                  Recent anomaly
                </span>
                <p className="mt-1 text-[var(--text-secondary)]">{selected.detail.anomaly}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[13px] text-[var(--text-muted)]">
              Select a node to inspect it.
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[12px] text-[var(--text-muted)]">{label}</dt>
      <dd className={`text-[13px] font-medium ${mono ? "mono tabular-nums" : ""}`}>{value}</dd>
    </div>
  );
}
