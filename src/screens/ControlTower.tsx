import MetricCard from "../components/MetricCard";
import { Panel, PageHeader } from "../components/Panel";
import { RadarChart, AreaChart } from "../components/Charts";
import TransactionRow from "../components/TransactionRow";
import { TRANSACTIONS } from "../lib/data";
import { IconArrowRight } from "../components/icons";
import type { ScreenId } from "../lib/theme";

const RADAR_AXES = ["Fraud", "Cash Flow", "Budget", "Vendor", "Compliance", "Ops"];
const RADAR_VALUES = [72, 38, 55, 61, 24, 43];

const CASHFLOW = [
  38, 40, 39, 42, 44, 43, 46, 45, 48, 47, 44, 46, 49, 51, 48, 50, 47, 45, 43, 46,
  48, 47, 45, 42,
];

export default function ControlTower({
  onNavigate,
}: {
  onNavigate: (id: ScreenId) => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] p-5">
      <PageHeader
        title="Control Tower"
        subtitle="Real-time posture across cash, risk, and the firewall — updated 4 seconds ago."
        right={
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
            <span className="live-dot size-1.5 rounded-full" style={{ background: "var(--green)" }} />
            <span className="mono text-[11px] text-[var(--text-secondary)]">ALL SYSTEMS LIVE</span>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Financial Health" value="82" unit="/ 100" delta="+3" deltaTone="up" accent="var(--cyan)" spark={[74, 76, 75, 78, 80, 79, 82]} />
        <MetricCard label="Cash Position" value="₹42.8" unit="Cr" delta="1.2%" deltaTone="up" spark={[40, 41, 40, 42, 41, 42, 43]} />
        <MetricCard label="Pending Outflow" value="₹7.2" unit="Cr" delta="6 txns" deltaTone="neutral" />
        <MetricCard label="Runway" value="6.8" unit="months" delta="-0.2" deltaTone="down" />
        <MetricCard label="Active Risks" value="14" delta="+2" deltaTone="down" accent="var(--amber)" />
        <MetricCard label="Blocked Today" value="₹38.4" unit="L" delta="4 stopped" deltaTone="up" accent="var(--red)" />
      </div>

      {/* Middle grid */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Live Firewall"
          accent="var(--green)"
          action={
            <button
              onClick={() => onNavigate("firewall")}
              className="flex items-center gap-1 text-[11px] text-[var(--cyan)] hover:underline"
            >
              Open firewall <IconArrowRight className="size-3.5" />
            </button>
          }
        >
          <div>
            {TRANSACTIONS.map((t) => (
              <TransactionRow key={t.id} txn={t} onClick={() => onNavigate("firewall")} />
            ))}
          </div>
        </Panel>

        <Panel title="Risk Radar" accent="var(--amber)">
          <div className="flex flex-col items-center p-4">
            <RadarChart axes={RADAR_AXES} values={RADAR_VALUES} />
            <p className="mt-2 text-center text-[11px] text-[var(--text-secondary)]">
              Fraud exposure elevated — driven by 3 first-time vendors this week.
            </p>
          </div>
        </Panel>
      </div>

      {/* AI Insight + Cashflow */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.6fr]">
        <div
          className="relative overflow-hidden rounded-[8px] border p-4"
          style={{
            borderColor: "color-mix(in srgb, var(--cyan) 30%, var(--border))",
            background:
              "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--cyan) 8%, transparent), transparent 60%), var(--surface)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--cyan)" }}>
              ● AI Insight
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed">
            A <span style={{ color: "var(--cyan)" }}>₹48.2 L payment to Meridian Cloud Services</span> was
            blocked. The vendor's bank account changed 2 days ago and the amount is 3.4× the
            infrastructure median.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Bank change", "Amount anomaly", "First payment", "Off-hours invoice"].map((t) => (
              <span
                key={t}
                className="mono rounded-[4px] border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--text-secondary)]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate("ai-investigator")}
              className="rounded-[6px] px-3 py-1.5 text-[12px] font-medium"
              style={{ background: "var(--cyan)", color: "#06202a" }}
            >
              Investigate
            </button>
            <button className="rounded-[6px] border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]">
              Dismiss
            </button>
          </div>
        </div>

        <Panel title="Cash Flow — 24h Projection" accent="var(--cyan)">
          <div className="p-4">
            <AreaChart series={CASHFLOW} height={180} />
            <div className="mt-2 flex justify-between text-[10px] text-[var(--text-muted)]">
              <span className="mono">00:00</span>
              <span className="mono">08:00</span>
              <span className="mono">16:00</span>
              <span className="mono">24:00</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
