import { inr, type Txn } from "../lib/data";
import RiskBadge from "./RiskBadge";
import RiskMeter from "./RiskMeter";

export default function TransactionRow({
  txn,
  onClick,
  active,
}: {
  txn: Txn;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[var(--border-muted)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-elevated)]"
      style={{ background: active ? "var(--surface-elevated)" : "transparent" }}
    >
      <span className="mono text-[11px] text-[var(--text-muted)]">{txn.id}</span>
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium">{txn.vendor}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{txn.category}</div>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right">
          <div className="mono text-[13px] font-medium tabular-nums">{inr(txn.amount)}</div>
          <div className="mono text-[10px] text-[var(--text-muted)]">{txn.time}</div>
        </div>
        <RiskMeter score={txn.score} width="w-16" />
        <div className="w-24 text-right">
          <RiskBadge level={txn.level} />
        </div>
      </div>
    </button>
  );
}
