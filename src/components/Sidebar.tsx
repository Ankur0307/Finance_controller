import { NAV } from "../lib/nav";
import type { ScreenId } from "../lib/theme";
import { IconSettings } from "./icons";

export default function Sidebar({
  active,
  onNavigate,
  expanded,
  onHoverChange,
}: {
  active: ScreenId;
  onNavigate: (id: ScreenId) => void;
  expanded: boolean;
  onHoverChange: (v: boolean) => void;
}) {
  return (
    <aside
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="flex h-full flex-col border-r border-[var(--border)] bg-[var(--surface)]"
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[var(--border)] px-3">
        <div
          className="grid size-8 shrink-0 place-items-center rounded-[6px] font-semibold"
          style={{
            background: "color-mix(in srgb, var(--cyan) 14%, transparent)",
            border: "1px solid color-mix(in srgb, var(--cyan) 35%, transparent)",
            color: "var(--cyan)",
          }}
        >
          <span className="mono text-sm">FS</span>
        </div>
        {expanded && (
          <div className="overflow-hidden whitespace-nowrap">
            <div className="mono text-[13px] font-semibold tracking-tight">
              FIN-SENTINEL
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Financial Control Tower
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {NAV.map((item) => {
          const on = item.id === active;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className="group relative flex items-center gap-3 rounded-[6px] px-2.5 py-2 text-left transition-colors"
              style={{
                background: on ? "var(--surface-elevated)" : "transparent",
                color: on ? "var(--text)" : "var(--text-secondary)",
              }}
            >
              {on && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                  style={{ background: "var(--cyan)" }}
                />
              )}
              <span
                className="shrink-0 transition-colors"
                style={{ color: on ? "var(--cyan)" : "inherit" }}
              >
                <Icon />
              </span>
              {expanded && (
                <span className="overflow-hidden whitespace-nowrap text-[13px] font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-2">
        <button
          className="flex w-full items-center gap-3 rounded-[6px] px-2.5 py-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)]"
          title="Settings"
        >
          <IconSettings />
          {expanded && <span className="text-[13px] font-medium">Settings</span>}
        </button>
        <div className="mt-1 flex items-center gap-2.5 rounded-[6px] px-2.5 py-2">
          <div
            className="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
            style={{ background: "var(--surface-elevated)", color: "var(--cyan)" }}
          >
            <span className="mono">RM</span>
          </div>
          {expanded && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[12px] font-medium leading-tight">Rhea Mehta</div>
              <div className="text-[10px] text-[var(--text-muted)]">VP Finance</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
