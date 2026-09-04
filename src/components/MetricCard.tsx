import type { ReactNode } from "react";

export default function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaTone = "neutral",
  accent,
  spark,
  footer,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  accent?: string;
  spark?: number[];
  footer?: ReactNode;
}) {
  const toneColor =
    deltaTone === "up"
      ? "var(--green)"
      : deltaTone === "down"
        ? "var(--red)"
        : "var(--text-muted)";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--border)_60%,var(--text-secondary))]">
      {accent && (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: accent }}
        />
      )}
      <div className="flex items-start justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {label}
        </span>
        {delta && (
          <span
            className="mono text-[11px] font-medium tabular-nums"
            style={{ color: toneColor }}
          >
            {deltaTone === "up" ? "▲" : deltaTone === "down" ? "▼" : ""} {delta}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className="mono text-2xl font-semibold tabular-nums leading-none"
          style={{ color: accent ?? "var(--text)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-[var(--text-secondary)]">{unit}</span>
        )}
      </div>
      {spark && <Spark data={spark} color={accent ?? "var(--text-secondary)"} />}
      {footer && <div className="mt-2 text-[11px] text-[var(--text-secondary)]">{footer}</div>}
    </div>
  );
}

function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 120;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className="mt-3 w-full"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      height={h}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
