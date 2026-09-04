import { SCREEN_TITLE } from "../lib/nav";
import type { ScreenId } from "../lib/theme";
import { IconSearch, IconBell, IconChevron } from "./icons";

export default function TopBar({
  active,
  onOpenCommand,
}: {
  active: ScreenId;
  onOpenCommand: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[var(--text-muted)]">Acme Robotics</span>
        <IconChevron className="size-3.5 text-[var(--text-muted)]" />
        <span className="font-medium">{SCREEN_TITLE[active]}</span>
      </div>

      <div className="flex-1" />

      {/* Search → command palette */}
      <button
        onClick={onOpenCommand}
        className="group flex w-72 items-center gap-2.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-left text-[13px] text-[var(--text-muted)] transition-colors hover:border-[color-mix(in_srgb,var(--border)_50%,var(--text-secondary))]"
      >
        <IconSearch className="size-4" />
        <span className="flex-1">Search or run a command…</span>
        <kbd className="mono rounded border border-[var(--border)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
          ⌘K
        </kbd>
      </button>

      {/* Date range */}
      <button className="mono flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[color-mix(in_srgb,var(--border)_50%,var(--text-secondary))]">
        <span>Q3 FY26</span>
        <IconChevron className="size-3.5 rotate-90" />
      </button>

      {/* Notifications */}
      <button className="relative grid size-9 place-items-center rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]">
        <IconBell className="size-[18px]" />
        <span
          className="absolute right-1.5 top-1.5 size-1.5 rounded-full"
          style={{ background: "var(--red)" }}
        />
      </button>
    </header>
  );
}
