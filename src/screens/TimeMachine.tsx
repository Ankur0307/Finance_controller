import { useMemo, useState } from "react";
import { PageHeader, Panel } from "../components/Panel";
import { AreaChart } from "../components/Charts";

interface Slider {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  base: number;
}

const SLIDERS: Slider[] = [
  { key: "marketing", label: "Marketing Spend", unit: "%", min: -50, max: 50, base: 0 },
  { key: "hiring", label: "New Hires", unit: " heads", min: 0, max: 40, base: 12 },
  { key: "vendor", label: "Vendor Payment Delay", unit: " days", min: 0, max: 60, base: 0 },
];

const BASE_RUNWAY = 6.8;
const BASE_BURN = 620; // ₹ L / month
const BASE_CASH = 4280; // ₹ L

export default function TimeMachine() {
  const [vals, setVals] = useState<Record<string, number>>({
    marketing: 0,
    hiring: 12,
    vendor: 0,
  });

  const model = useMemo(() => {
    const mktDelta = (vals.marketing / 100) * 180; // ₹L/mo
    const hireDelta = (vals.hiring - 12) * 14; // ₹L/mo per head
    const delayBenefit = vals.vendor * 2.1; // one-time ₹L freed, softens burn
    const burn = BASE_BURN + mktDelta + hireDelta;
    const runway = (BASE_CASH + delayBenefit) / burn;
    return {
      burn: Math.round(burn),
      runway: Math.max(0, runway),
      cash: Math.round(BASE_CASH + delayBenefit),
    };
  }, [vals]);

  const baseSeries = useMemo(() => proj(BASE_CASH, BASE_BURN), []);
  const projSeries = useMemo(() => proj(model.cash, model.burn), [model]);

  const changed = vals.marketing !== 0 || vals.hiring !== 12 || vals.vendor !== 0;

  return (
    <div className="mx-auto max-w-[1400px] p-5">
      <PageHeader
        title="Time Machine"
        subtitle="Move the levers to simulate how decisions reshape burn and runway before you commit."
        right={
          <button
            onClick={() => setVals({ marketing: 0, hiring: 12, vendor: 0 })}
            className="rounded-[6px] border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
          >
            Reset
          </button>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[380px_1fr]">
        {/* Sliders */}
        <Panel title="Scenario Levers" accent="var(--cyan)">
          <div className="space-y-6 p-5">
            {SLIDERS.map((s) => (
              <div key={s.key}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] font-medium">{s.label}</label>
                  <span className="mono text-[13px] tabular-nums" style={{ color: "var(--cyan)" }}>
                    {vals[s.key] > 0 && s.key === "marketing" ? "+" : ""}
                    {vals[s.key]}
                    {s.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={vals[s.key]}
                  onChange={(e) =>
                    setVals((v) => ({ ...v, [s.key]: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[var(--text-muted)]">
                  <span className="mono">{s.min}{s.unit}</span>
                  <span className="mono">{s.max}{s.unit}</span>
                </div>
              </div>
            ))}

            <button
              className="w-full rounded-[6px] py-2.5 text-[13px] font-medium"
              style={{ background: "var(--cyan)", color: "#06202a" }}
            >
              Apply Scenario
            </button>
          </div>
        </Panel>

        {/* Comparison + chart */}
        <div className="space-y-3">
          <Panel title="Before → After" accent="var(--amber)">
            <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
              <Compare label="Monthly Burn" base={`₹${BASE_BURN} L`} now={`₹${model.burn} L`} up={model.burn > BASE_BURN} unit />
              <Compare
                label="Cash Runway"
                base={`${BASE_RUNWAY} mo`}
                now={`${model.runway.toFixed(1)} mo`}
                up={model.runway > BASE_RUNWAY}
                good={model.runway > BASE_RUNWAY}
              />
              <Compare
                label="Cash Freed"
                base="₹0"
                now={`₹${model.cash - BASE_CASH} L`}
                up={model.cash > BASE_CASH}
                good={model.cash > BASE_CASH}
              />
            </div>
          </Panel>

          <Panel title="Projected Cash Runway" accent="var(--cyan)">
            <div className="p-4">
              <AreaChart
                series={projSeries}
                compareSeries={changed ? baseSeries : undefined}
                height={220}
                color={model.runway >= BASE_RUNWAY ? "var(--green)" : "var(--red)"}
              />
              <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span className="mono">Now</span>
                {changed && (
                  <span className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-px w-4" style={{ background: "var(--text-muted)", borderTop: "1px dashed" }} />
                      Baseline
                    </span>
                  </span>
                )}
                <span className="mono">+12 mo</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function proj(cash: number, burn: number): number[] {
  const out: number[] = [];
  let c = cash;
  for (let i = 0; i <= 12; i++) {
    out.push(Math.max(0, c));
    c -= burn;
  }
  return out;
}

function Compare({
  label,
  base,
  now,
  up,
  good,
  unit,
}: {
  label: string;
  base: string;
  now: string;
  up: boolean;
  good?: boolean;
  unit?: boolean;
}) {
  const tone = good == null ? "var(--text)" : good ? "var(--green)" : "var(--red)";
  return (
    <div className="bg-[var(--surface)] p-4">
      <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
      <div className="mono mt-2 text-xl font-semibold tabular-nums" style={{ color: tone }}>
        {now}
      </div>
      <div className="mono mt-1 text-[11px] text-[var(--text-muted)]">
        {up ? "▲" : "▼"} from {base}
      </div>
    </div>
  );
}
