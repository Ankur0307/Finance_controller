import { scoreColor } from "../lib/theme";

export default function RiskMeter({
  score,
  showValue = true,
  width = "w-24",
}: {
  score: number;
  showValue?: boolean;
  width?: string;
}) {
  const color = scoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 ${width} overflow-hidden rounded-full bg-[var(--border)]`}>
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.min(100, score)}%`, background: color }}
        />
      </div>
      {showValue && (
        <span className="mono text-[11px] font-medium tabular-nums" style={{ color }}>
          {score}
        </span>
      )}
    </div>
  );
}
