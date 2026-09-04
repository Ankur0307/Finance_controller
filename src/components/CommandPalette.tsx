import { useEffect, useMemo, useRef, useState } from "react";
import { NAV } from "../lib/nav";
import type { ScreenId } from "../lib/theme";
import { IconArrowRight } from "./icons";

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: ScreenId) => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.filter(
      (n) =>
        n.label.toLowerCase().includes(q) || n.short.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  if (!open) return null;

  const select = (id: ScreenId) => {
    onNavigate(id);
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter" && results[cursor]) {
      select(results[cursor].id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      />
      <div
        className="fade-up relative w-[560px] max-w-[92vw] overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to a screen or run a command…"
          className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3.5 text-[14px] outline-none placeholder:text-[var(--text-muted)]"
        />
        <div className="max-h-80 overflow-y-auto p-2">
          <div className="mono px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Navigate
          </div>
          {results.length === 0 && (
            <div className="px-3 py-6 text-center text-[13px] text-[var(--text-muted)]">
              No matches
            </div>
          )}
          {results.map((n, i) => {
            const Icon = n.icon;
            const on = i === cursor;
            return (
              <button
                key={n.id}
                onMouseEnter={() => setCursor(i)}
                onClick={() => select(n.id)}
                className="flex w-full items-center gap-3 rounded-[6px] px-2.5 py-2 text-left transition-colors"
                style={{ background: on ? "var(--surface-elevated)" : "transparent" }}
              >
                <span style={{ color: on ? "var(--cyan)" : "var(--text-secondary)" }}>
                  <Icon />
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{n.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{n.short}</div>
                </div>
                {on && <IconArrowRight className="size-4 text-[var(--cyan)]" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 border-t border-[var(--border)] px-4 py-2 text-[10px] text-[var(--text-muted)]">
          <span className="mono">↑↓ navigate</span>
          <span className="mono">↵ select</span>
          <span className="mono">esc close</span>
        </div>
      </div>
    </div>
  );
}
