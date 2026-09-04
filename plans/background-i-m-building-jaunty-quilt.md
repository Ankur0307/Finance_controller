# FIN-SENTINEL — Build Plan

## Context

The user is building **FIN-SENTINEL**, a dark-first, AI-powered financial control tower for CFOs and enterprise finance teams, from an empty React + Vite + Tailwind CSS v4 scaffold (`src/App.tsx` is currently an empty `<div>`, `src/index.css` only imports Tailwind). A detailed, accepted plan already exists at `plans/i-want-to-implement-linear-dewdrop.md`. This plan restates that scope and is the one to execute. The outcome is a fully navigable 7-screen application with the "Bloomberg Terminal meets modern SaaS" aesthetic: near-black ground, hairline structural borders, meaning-coded accent colors, Inter for UI text, and JetBrains Mono for all financial data.

## Aesthetic & Tokens

Follow the `aesthetic-stance` skill (no Make Kit attached). Ground `#09090b`, surface `#111113`, elevated `#18181b`, hairline borders `#27272a`. Accents (meaning-coded only): cyan `#22d3ee` (AI/active), green `#22c55e` (safe), amber `#f59e0b` (review), red `#ef4444` (blocked/danger). No decorative gradients. Fonts: Inter (400–700) + JetBrains Mono (400–600) via Google Fonts CSS2 `@import` in `src/index.css` — placed **before** `@import 'tailwindcss'`. Tokens defined as CSS custom properties under `:root`.

## Dependencies

- `recharts` — RadarChart / AreaChart / BarChart. Install with `pnpm add recharts` before use.

## File Structure

```
src/
  index.css          — Google Fonts @import (first), Tailwind import, :root tokens, base styles
  App.tsx            — App shell: collapsible sidebar + topbar + screen router + ⌘K state
  components/
    Sidebar.tsx        — Persistent collapsible left nav (inline SVG icons)
    TopBar.tsx         — Breadcrumb, search, date/org selectors, notifications, avatar
    CommandPalette.tsx — ⌘K modal, fuzzy list, keyboard nav → setActiveScreen
    MetricCard.tsx     — Reusable KPI tile
    RiskBadge.tsx      — APPROVED / REVIEW / HOLD / BLOCKED badge
    RiskMeter.tsx      — Horizontal risk score bar
    TransactionRow.tsx — Firewall transaction row with live indicator
  screens/
    ControlTower.tsx   — Dashboard: 6 metrics, live firewall table, risk radar, AI insights, cash flow area chart
    Firewall.tsx       — Vertical pipeline + transaction list + slide-in detail drawer
    RiskCenter.tsx     — Header stats, filter pills, sortable risk table
    AIInvestigator.tsx — Workspace (not chat): textarea, question chips, staged loading, structured report
    TimeMachine.tsx    — Scenario sliders → live before/after metrics + projection area chart
    ControlGraph.tsx   — Custom SVG node/edge graph, hover tooltip, click detail panel
    AuditVault.tsx     — Vertical event timeline, expandable rows, type filter + search
```

## Implementation Steps

1. **`src/index.css`** — Google Fonts `@import` first, then `@import 'tailwindcss'`, then `:root` tokens (colors, `--radius-sm:4px`, `--radius:6px`, font-family vars), `html { font-family: Inter }`, `.mono { font-family: 'JetBrains Mono'; font-variant-numeric: tabular-nums }`, scrollbar hiding. No unlayered `*` reset.
2. **`src/App.tsx`** — `activeScreen` state (default `control-tower`), `commandOpen` state, `useEffect` keydown for ⌘K. Grid `grid-cols-[56px_1fr]` expanding to `[220px_1fr]` on hover/pin. Renders Sidebar + TopBar + active screen.
3. **Shared components** — Sidebar, TopBar, CommandPalette, then presentational MetricCard / RiskBadge / RiskMeter / TransactionRow built with tokens and utility classes.
4. **Seven screens** — as described in the file structure above; mock data modeled as local const arrays. recharts for Control Tower (radar + area) and Time Machine (area).

## Verification

1. All 7 sidebar items switch screens without console errors.
2. ⌘K opens palette; Escape closes; commands navigate.
3. Firewall row click opens drawer; X / outside closes it.
4. Time Machine sliders update projected metrics live.
5. Control Graph nodes clickable → detail panel; hover shows tooltip.
6. AI Investigator chip triggers staged loading → report.
7. recharts renders (radar + area visible) with no errors.
8. Build has no TypeScript errors. Dev server on `$PORT` hot-reloads; confirm via preview.
