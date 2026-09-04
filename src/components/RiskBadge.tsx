import { RISK_META, type RiskLevel } from "../lib/theme";

export default function RiskBadge({
  level,
  size = "sm",
}: {
  level: RiskLevel;
  size?: "sm" | "xs";
}) {
  const meta = RISK_META[level];
  const pad = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 rounded-[4px] font-medium tracking-wide ${pad}`}
      style={{
        color: meta.color,
        background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
