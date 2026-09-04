import { useMemo, useState } from "react";
import { PageHeader, Panel } from "../components/Panel";
import { IconSearch } from "../components/icons";

type EvtType = "ingest" | "policy" | "ai" | "risk" | "decision" | "notify";

interface Evt {
  id: string;
  time: string;
  type: EvtType;
  label: string;
  meta: string;
  detail: { who: string; what: string; when: string; why: string; evidence: string };
}

const TYPE_META: Record<EvtType, { color: string; tag: string }> = {
  ingest: { color: "var(--cyan)", tag: "INGEST" },
  policy: { color: "#a78bfa", tag: "POLICY" },
  ai: { color: "var(--cyan)", tag: "AI" },
  risk: { color: "var(--amber)", tag: "RISK" },
  decision: { color: "var(--red)", tag: "DECISION" },
  notify: { color: "var(--green)", tag: "NOTIFY" },
};

const EVENTS: Evt[] = [
  { id: "E-9",  time: "12:04:18", type: "ingest",   label: "Payment received from ERP", meta: "TXN-8842 · ₹48.2 L · Meridian Cloud", detail: { who: "SAP Connector", what: "Ingested outbound payment TXN-8842", when: "2026-08-26 12:04:18 IST", why: "Scheduled vendor payment run", evidence: "erp/batch-4471/line-88" } },
  { id: "E-8",  time: "12:04:19", type: "policy",   label: "Policy engine evaluated", meta: "17 policies · 3 failed", detail: { who: "Policy Engine v4", what: "Ran 17 controls; failed vendor-allowlist, PO-match, bank-stability", when: "2026-08-26 12:04:19 IST", why: "Mandatory pre-clearance", evidence: "policy/run-88421" } },
  { id: "E-7",  time: "12:04:20", type: "ai",       label: "AI analysis completed", meta: "4 anomalies · 94% confidence", detail: { who: "FIN-SENTINEL AI", what: "Detected bank change, amount anomaly, first payment, off-hours invoice", when: "2026-08-26 12:04:20 IST", why: "Automatic on policy failure", evidence: "ai/investigation-2041" } },
  { id: "E-6",  time: "12:04:20", type: "risk",     label: "Risk score assigned", meta: "Score 88 / 100 — HIGH", detail: { who: "Risk Engine", what: "Composite score 88 across fraud + vendor axes", when: "2026-08-26 12:04:20 IST", why: "Aggregated policy + AI signals", evidence: "risk/score-8842" } },
  { id: "E-5",  time: "12:04:21", type: "decision", label: "Payment blocked", meta: "Firewall held ₹48.2 L", detail: { who: "Financial Firewall", what: "Blocked TXN-8842 before settlement", when: "2026-08-26 12:04:21 IST", why: "Risk score exceeded auto-block threshold (70)", evidence: "firewall/decision-8842" } },
  { id: "E-4",  time: "12:04:22", type: "notify",   label: "Controller notified", meta: "R. Mehta · Slack + email", detail: { who: "Notification Service", what: "Alerted VP Finance and assigned reviewer", when: "2026-08-26 12:04:22 IST", why: "High-severity block requires human review", evidence: "notify/alert-6620" } },
];

const FILTERS: (EvtType | "all")[] = ["all", "ingest", "policy", "ai", "risk", "decision", "notify"];

export default function AuditVault() {
  const [filter, setFilter] = useState<EvtType | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("E-5");

  const rows = useMemo(() => {
    return EVENTS.filter((e) => filter === "all" || e.type === filter).filter(
      (e) =>
        !q.trim() ||
        e.label.toLowerCase().includes(q.toLowerCase()) ||
        e.meta.toLowerCase().includes(q.toLowerCase()),
    );
  }, [filter, q]);

  return (
    <div className="mx-auto max-w-[1000px] p-5">
      <PageHeader
        title="Audit Vault"
        subtitle="Immutable, timestamped record of every control action — reconstruct any decision end to end."
      />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
          <IconSearch className="size-4 text-[var(--text-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events…"
            className="w-56 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="mono rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide transition-colors"
              style={{
                borderColor: filter === f ? "var(--cyan)" : "var(--border)",
                color: filter === f ? "var(--cyan)" : "var(--text-secondary)",
              }}
            >
              {f === "all" ? "All" : TYPE_META[f].tag}
            </button>
          ))}
        </div>
      </div>

      <Panel>
        <div className="p-5">
          {rows.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[var(--text-muted)]">No events match.</div>
          )}
          {rows.map((e, i) => {
            const m = TYPE_META[e.type];
            const expanded = open === e.id;
            return (
              <div key={e.id} className="relative flex gap-4 pb-2">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <span className="mono text-[10px] text-[var(--text-muted)]">{e.time}</span>
                  <span
                    className="mt-1.5 size-3 rounded-full border-2"
                    style={{ borderColor: m.color, background: "var(--surface)" }}
                  />
                  {i < rows.length - 1 && <span className="w-px flex-1 bg-[var(--border)]" />}
                </div>

                <div className="flex-1 pb-3">
                  <button
                    onClick={() => setOpen(expanded ? null : e.id)}
                    className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left transition-colors hover:bg-[var(--surface-elevated)]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="mono rounded-[3px] px-1.5 py-0.5 text-[9px] tracking-wide"
                          style={{ color: m.color, background: `color-mix(in srgb, ${m.color} 12%, transparent)` }}
                        >
                          {m.tag}
                        </span>
                        <span className="text-[13px] font-medium">{e.label}</span>
                      </div>
                      <div className="mono mt-0.5 text-[11px] text-[var(--text-muted)]">{e.meta}</div>
                    </div>
                    <span className="text-[var(--text-muted)]">{expanded ? "−" : "+"}</span>
                  </button>

                  {expanded && (
                    <div className="fade-up mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-[var(--border)] bg-[var(--border)]">
                      {[
                        ["WHO", e.detail.who],
                        ["WHAT", e.detail.what],
                        ["WHEN", e.detail.when],
                        ["WHY", e.detail.why],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-[var(--surface)] p-3">
                          <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{k}</div>
                          <div className="mt-1 text-[12px]">{v}</div>
                        </div>
                      ))}
                      <div className="col-span-2 bg-[var(--surface)] p-3">
                        <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">EVIDENCE</div>
                        <div className="mono mt-1 text-[12px]" style={{ color: "var(--cyan)" }}>{e.detail.evidence}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
