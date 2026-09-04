import { useState } from "react";
import { Panel, PageHeader } from "../components/Panel";
import TransactionRow from "../components/TransactionRow";
import RiskBadge from "../components/RiskBadge";
import RiskMeter from "../components/RiskMeter";
import { TRANSACTIONS, inrFull, type Txn } from "../lib/data";
import { scoreColor } from "../lib/theme";
import { IconClose } from "../components/icons";

const PIPELINE = [
  { key: "TRANSACTION", desc: "Ingested from ERP", state: "done" },
  { key: "POLICY ENGINE", desc: "17 policies evaluated", state: "done" },
  { key: "RISK ENGINE", desc: "Score 88 / 100", state: "alert" },
  { key: "AI ANALYSIS", desc: "4 anomalies found", state: "alert" },
  { key: "CASH IMPACT", desc: "-₹48.2 L runway hit", state: "done" },
  { key: "DECISION", desc: "Payment blocked", state: "blocked" },
];

const POLICY_CHECKS = [
  { label: "Vendor on approved list", pass: false },
  { label: "Purchase order matched", pass: false },
  { label: "Within department budget", pass: true },
  { label: "Bank account unchanged (30d)", pass: false },
  { label: "Dual approval present", pass: false },
  { label: "Within FX exposure limit", pass: true },
];

function stateColor(s: string) {
  if (s === "blocked") return "var(--red)";
  if (s === "alert") return "var(--amber)";
  return "var(--green)";
}

export default function Firewall() {
  const [selected, setSelected] = useState<Txn | null>(null);

  return (
    <div className="relative mx-auto max-w-[1400px] p-5">
      <PageHeader
        title="Financial Firewall"
        subtitle="Every outbound payment passes six control stages before money moves."
      />

      <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
        {/* Pipeline */}
        <Panel title="Control Pipeline" accent="var(--cyan)">
          <div className="p-4">
            {PIPELINE.map((s, i) => (
              <div key={s.key} className="relative flex gap-3 pb-5 last:pb-0">
                {i < PIPELINE.length - 1 && (
                  <span className="absolute left-[11px] top-6 h-full w-px bg-[var(--border)]" />
                )}
                <span
                  className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2"
                  style={{
                    borderColor: stateColor(s.state),
                    background: "var(--surface)",
                  }}
                >
                  <span
                    className={`size-2 rounded-full ${s.state !== "done" ? "live-dot" : ""}`}
                    style={{ background: stateColor(s.state) }}
                  />
                </span>
                <div>
                  <div className="mono text-[11px] font-medium tracking-wide">{s.key}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Transaction list */}
        <Panel
          title="Outbound Queue"
          accent="var(--amber)"
          action={
            <span className="mono text-[11px] text-[var(--text-muted)]">
              {TRANSACTIONS.length} in review
            </span>
          }
        >
          <div>
            {TRANSACTIONS.map((t) => (
              <TransactionRow
                key={t.id}
                txn={t}
                active={selected?.id === t.id}
                onClick={() => setSelected(t)}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Detail drawer */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{
          pointerEvents: selected ? "auto" : "none",
          opacity: selected ? 1 : 0,
        }}
        onClick={() => setSelected(null)}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
        <div
          className="scroll-thin absolute right-0 top-0 h-full w-[440px] max-w-[92vw] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] transition-transform duration-300"
          style={{ transform: selected ? "translateX(0)" : "translateX(100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {selected && <Drawer txn={selected} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </div>
  );
}

function Drawer({ txn, onClose }: { txn: Txn; onClose: () => void }) {
  const isBlocked = txn.level === "BLOCKED";
  return (
    <div>
      <div
        className="flex items-center justify-between border-b px-5 py-3"
        style={{
          borderColor: "var(--border)",
          background: isBlocked
            ? "color-mix(in srgb, var(--red) 10%, transparent)"
            : "var(--surface-elevated)",
        }}
      >
        <div className="flex items-center gap-2">
          <RiskBadge level={txn.level} />
          <span className="mono text-[11px] text-[var(--text-muted)]">{txn.id}</span>
        </div>
        <button
          onClick={onClose}
          className="grid size-7 place-items-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg)]"
        >
          <IconClose className="size-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="text-[13px] text-[var(--text-secondary)]">{txn.vendor}</div>
        <div className="mono mt-1 text-3xl font-semibold tabular-nums" style={{ color: scoreColor(txn.score) }}>
          {inrFull(txn.amount)}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[12px] text-[var(--text-secondary)]">Risk score</span>
          <RiskMeter score={txn.score} width="w-40" />
        </div>

        {/* Risk factors */}
        <h3 className="mono mt-6 mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Risk Factors
        </h3>
        <ul className="space-y-1.5">
          {txn.factors.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: "var(--amber)" }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Policy checks */}
        <h3 className="mono mt-6 mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Policy Checks
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {POLICY_CHECKS.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-[6px] border border-[var(--border-muted)] bg-[var(--bg)] px-3 py-2 text-[13px]"
            >
              <span>{c.label}</span>
              <span
                className="mono text-[13px]"
                style={{ color: c.pass ? "var(--green)" : "var(--red)" }}
              >
                {c.pass ? "✓" : "✕"}
              </span>
            </div>
          ))}
        </div>

        {/* AI recommendation */}
        <div
          className="mt-6 rounded-[8px] border p-4"
          style={{
            borderColor: "color-mix(in srgb, var(--cyan) 30%, var(--border))",
            background: "color-mix(in srgb, var(--cyan) 6%, transparent)",
          }}
        >
          <div className="mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--cyan)" }}>
            ● AI Recommendation
          </div>
          <p className="mt-2 text-[13px] leading-relaxed">
            Hold this payment and re-verify the vendor's bank details through a second channel. The
            account change combined with the amount anomaly matches a known invoice-redirection
            pattern.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            className="rounded-[6px] py-2.5 text-[13px] font-medium"
            style={{ background: "var(--cyan)", color: "#06202a" }}
          >
            Investigate with AI
          </button>
          <button className="rounded-[6px] border border-[var(--border)] py-2.5 text-[13px] font-medium hover:bg-[var(--surface-elevated)]">
            Request Approval
          </button>
          <button
            className="rounded-[6px] border py-2.5 text-[13px] font-medium"
            style={{
              borderColor: "color-mix(in srgb, var(--red) 40%, transparent)",
              color: "var(--red)",
            }}
          >
            Override & Release
          </button>
        </div>
      </div>
    </div>
  );
}
