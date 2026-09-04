import type { ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className = "",
  accent,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--surface)] ${className}`}
    >
      {title && (
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            {accent && (
              <span className="size-1.5 rounded-full" style={{ background: accent }} />
            )}
            <h2 className="mono text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              {title}
            </h2>
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}
