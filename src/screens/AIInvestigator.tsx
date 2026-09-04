import { useEffect, useRef, useState } from "react";
import { PageHeader, Panel } from "../components/Panel";

const CHIPS = [
  "Why did our cash runway drop last month?",
  "Which vendors pose the highest fraud risk?",
  "Where are we over budget this quarter?",
  "What would happen if we froze marketing spend?",
  "Show unusual payments in the last 7 days",
  "Which approvals are stuck and why?",
];

const STAGES = [
  "Parsing question intent…",
  "Scanning 12,480 transactions…",
  "Evaluating 17 active policies…",
  "Cross-referencing vendor history…",
  "Synthesizing findings…",
];

const DRIVERS = [
  { label: "Meridian Cloud overpayment", value: 42 },
  { label: "Marketing over-budget", value: 27 },
  { label: "FX loss (unhedged)", value: 19 },
  { label: "Delayed receivables", value: 12 },
];

const EVIDENCE = [
  { label: "Transactions reviewed", value: "12,480" },
  { label: "Anomalies flagged", value: "23" },
  { label: "Runway impact", value: "-0.4 mo" },
  { label: "Confidence", value: "94%" },
];

export default function AIInvestigator() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "report">("idle");
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);

  const run = (q: string) => {
    setQuery(q);
    setPhase("loading");
    setStage(0);
    timers.current.forEach(clearTimeout);
    timers.current = STAGES.map((_, i) =>
      window.setTimeout(() => {
        setStage(i);
        if (i === STAGES.length - 1) {
          timers.current.push(window.setTimeout(() => setPhase("report"), 550));
        }
      }, i * 550),
    );
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className="mx-auto max-w-[1000px] p-5">
      <PageHeader
        title="AI Investigator"
        subtitle="Ask a question about your finances. FIN-SENTINEL runs the full investigation and returns evidence — not a chat reply."
      />

      {/* Prompt */}
      <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-start gap-3">
          <span className="mono mt-2 text-[11px]" style={{ color: "var(--cyan)" }}>
            ▮
          </span>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (query.trim()) run(query);
              }
            }}
            rows={2}
            placeholder="Ask FIN-SENTINEL anything about your finances…"
            className="w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-[var(--text-muted)]"
          />
          <button
            onClick={() => query.trim() && run(query)}
            className="shrink-0 rounded-[6px] px-4 py-2 text-[13px] font-medium"
            style={{ background: "var(--cyan)", color: "#06202a" }}
          >
            Investigate
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--text)]"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading */}
      {phase === "loading" && (
        <Panel title="Investigating" accent="var(--cyan)" className="mt-5">
          <div className="p-5">
            {STAGES.map((s, i) => (
              <div key={s} className="flex items-center gap-3 py-1.5">
                <span
                  className={`grid size-5 place-items-center rounded-full text-[10px] ${i <= stage ? "" : "opacity-40"}`}
                  style={{
                    background:
                      i < stage
                        ? "var(--green)"
                        : i === stage
                          ? "color-mix(in srgb, var(--cyan) 20%, transparent)"
                          : "var(--surface-elevated)",
                    color: i < stage ? "#06210f" : "var(--cyan)",
                  }}
                >
                  {i < stage ? "✓" : i === stage ? "●" : ""}
                </span>
                <span
                  className="mono text-[12px]"
                  style={{ color: i <= stage ? "var(--text)" : "var(--text-muted)" }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Report */}
      {phase === "report" && (
        <div className="fade-up mt-5 space-y-3">
          <Panel title="Finding" accent="var(--cyan)">
            <div className="p-5">
              <div className="mono mb-1 text-[11px] text-[var(--text-muted)]">Q: {query}</div>
              <p className="text-[15px] leading-relaxed">
                Cash runway fell by <span style={{ color: "var(--red)" }}>0.4 months</span> primarily
                because of a <span style={{ color: "var(--cyan)" }}>₹48.2 L overpayment risk to Meridian
                Cloud</span> combined with marketing running 27% above its quarterly ceiling. Both are
                addressable this cycle.
              </p>
            </div>
          </Panel>

          <div className="grid gap-3 md:grid-cols-2">
            <Panel title="Main Drivers" accent="var(--amber)">
              <div className="space-y-3 p-5">
                {DRIVERS.map((d) => (
                  <div key={d.label}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span>{d.label}</span>
                      <span className="mono text-[var(--text-secondary)]">{d.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${d.value}%`, background: "var(--amber)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Evidence" accent="var(--green)">
              <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                {EVIDENCE.map((e) => (
                  <div key={e.label} className="bg-[var(--surface)] p-4">
                    <div className="mono text-lg font-semibold tabular-nums" style={{ color: "var(--cyan)" }}>
                      {e.value}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--text-muted)]">{e.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div
            className="rounded-[8px] border p-4"
            style={{
              borderColor: "color-mix(in srgb, var(--green) 30%, var(--border))",
              background: "color-mix(in srgb, var(--green) 6%, transparent)",
            }}
          >
            <div className="mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--green)" }}>
              ● Recommendation
            </div>
            <p className="mt-2 text-[13px] leading-relaxed">
              Hold the Meridian payment pending bank re-verification and cap marketing at its ceiling
              for the remainder of Q3. Together these recover an estimated{" "}
              <span className="mono" style={{ color: "var(--green)" }}>+0.5 months</span> of runway.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
