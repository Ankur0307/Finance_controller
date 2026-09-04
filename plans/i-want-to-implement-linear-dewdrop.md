# FIN-SENTINEL Implementation Plan

## Context

Build a premium, dark-first AI financial control tower called FIN-SENTINEL from an empty React + Vite + Tailwind CSS v4 scaffold. The product vision is a "financial firewall that protects a company's money before it moves" — positioned between Bloomberg Terminal and modern SaaS. The current App.tsx is an empty shell.

## Aesthetic Stance

**Data-dense Bloomberg Terminal + modern SaaS.** Full commitment.

- **Ground**: Near-black `#09090b` background, `#111113` surface, `#18181b` elevated surface
- **Borders**: `#27272a` hairlines — structural, never decorative
- **Typography**: Inter (UI text) + JetBrains Mono (all financial numbers, risk scores, labels)
- **Accent colors** (meaning-coded only):
  - Cyan `#22d3ee` — AI, active state, intelligence
  - Green `#22c55e` — Approved, safe, healthy
  - Amber `#f59e0b` — Review, warning
  - Red `#ef4444` — Blocked, high risk, danger
- **No gradients** except subtle radial on the active sidebar item

---

## File Structure

```
src/
  index.css          — Google Fonts @import, Tailwind, CSS tokens
  App.tsx            — App shell: sidebar + topbar + screen router
  components/
    Sidebar.tsx       — Persistent left nav, collapsible
    TopBar.tsx        — Search, date range, org selector, notifications
    CommandPalette.tsx — ⌘K global command palette
    MetricCard.tsx    — Reusable KPI tile
    RiskBadge.tsx     — APPROVED / REVIEW / HOLD / BLOCKED badge
    RiskMeter.tsx     — Horizontal risk score bar
    TransactionRow.tsx — Firewall transaction row with live indicator
  screens/
    ControlTower.tsx  — Screen 1: primary dashboard
    Firewall.tsx      — Screen 2: financial firewall pipeline + detail drawer
    RiskCenter.tsx    — Screen 3: risk management table
    AIInvestigator.tsx — Screen 4: AI investigation workspace
    TimeMachine.tsx   — Screen 5: scenario simulation
    ControlGraph.tsx  — Screen 6: SVG node relationship graph
    AuditVault.tsx    — Screen 7: audit timeline
```

---

## Implementation Steps

### 1. Fonts + CSS tokens (`src/index.css`)
- `@import` Inter (400,500,600,700) and JetBrains Mono (400,500,600) from Google Fonts — placed **before** `@import 'tailwindcss'`
- Define CSS custom properties for all color tokens, radius, and font families under `:root`
- Set `font-family: 'Inter', sans-serif` on `html`, `font-variant-numeric: tabular-nums` on `.mono`
- Hide scrollbars by default with `scrollbar-width: none`

### 2. App shell (`src/App.tsx`)
- `activeScreen` state (string, default `'control-tower'`)
- Grid layout: `grid-cols-[56px_1fr]` (collapsed sidebar) expanding to `grid-cols-[220px_1fr]` on hover/pin
- Sidebar + TopBar always visible; screen component swapped by `activeScreen`
- `commandOpen` state for ⌘K palette
- `useEffect` for `keydown` to open command palette

### 3. Sidebar (`src/components/Sidebar.tsx`)
- Logo: "FS" monogram in cyan + "FIN-SENTINEL" text (hidden when collapsed)
- Nav items with icons (inline SVGs) + labels: Control Tower, Financial Firewall, Risk Center, AI Investigator, Time Machine, Control Graph, Audit Vault
- Active item: subtle cyan left-border accent + `bg-zinc-800`
- Bottom: Notifications (with red dot badge), Settings, User avatar

### 4. TopBar (`src/components/TopBar.tsx`)
- Left: breadcrumb of current screen name
- Center: search input (opens command palette on focus)
- Right: date range selector (static label), org selector, notification bell, user avatar

### 5. CommandPalette (`src/components/CommandPalette.tsx`)
- Modal overlay, dark glass panel, fuzzy-filtered command list
- Commands map to `setActiveScreen` calls + descriptive labels
- Keyboard: Arrow navigation, Enter to select, Escape to close

### 6. Screen 1 — Control Tower (`src/screens/ControlTower.tsx`)
- 6 MetricCards in a 3+3 grid: Financial Health (82/100), Cash Position (₹42.8 Cr), Pending (₹7.2 Cr), Runway (6.8 mo), Active Risks (14), Blocked Today (₹38.4 L)
- Live Firewall section: table of 4 transactions with pulsing "LIVE" dot, RiskBadge per row, mini risk score bar
- Risk Radar: recharts RadarChart with 6 axes (Fraud, Cash Flow, Budget, Vendor, Compliance, Operations)
- AI Insights card: cyan-accented panel with finding, evidence tags, Investigate / Dismiss buttons
- Cash flow area chart (recharts AreaChart) at bottom spanning full width

### 7. Screen 2 — Financial Firewall (`src/screens/Firewall.tsx`)
- Left column: vertical pipeline diagram (TRANSACTION → POLICY ENGINE → RISK ENGINE → AI ANALYSIS → CASH IMPACT → DECISION) with animated step indicators
- Right column: transaction list; clicking a row opens right drawer
- Detail drawer (absolute positioned, slides in): PAYMENT BLOCKED header in red, amount in JetBrains Mono, Risk Factors list, Policy Checks (✓/✕), AI Recommendation, three action buttons (Investigate primary, Request Approval secondary, Override ghost-danger)
- Drawer animation via CSS transition on `translateX`

### 8. Screen 3 — Risk Center (`src/screens/RiskCenter.tsx`)
- Header stats row: overall score, trend arrow, open/critical/resolved counts
- Sortable table with columns: Risk, Entity, Amount, Category, Detected, Status, Owner
- Category color-coded badges; status badges (OPEN/REVIEW/RESOLVED)
- Filter pills: All / Fraud / Budget / Vendor / Compliance / Operations

### 9. Screen 4 — AI Investigator (`src/screens/AIInvestigator.tsx`)
- Not a chat UI — an investigation workspace
- Input area: prominent textarea with "Ask FIN-SENTINEL anything about your finances…"
- Suggested question chips (6 questions from brief)
- When a question is selected/submitted: show structured investigation report with Finding, Main Drivers (horizontal bar viz), Evidence panel (4 stat tiles), Recommendation
- Loading states: animated stage-by-stage progress ("Analyzing transactions…", "Checking policies…", etc.) with `setTimeout` simulation

### 10. Screen 5 — Time Machine (`src/screens/TimeMachine.tsx`)
- Left panel: 3 scenario sliders (Marketing spending, Hiring, Vendor payments) using `<input type="range">` with styled track
- Right panel: before/after comparison — two columns of metrics with arrow indicators
- recharts AreaChart showing projected cash runway curve
- Apply Scenario + Reset buttons

### 11. Screen 6 — Control Graph (`src/screens/ControlGraph.tsx`)
- Custom SVG node graph (no external library): nodes positioned with static coordinates, edges as `<line>` elements
- Node types: Company, Departments, Budgets, Vendors, Invoices, Payments — color-coded by type
- Hover: node highlights, tooltip appears
- Click: right side panel shows node details (vendor name, total payments, share, risk, active invoices, recent anomaly)
- Node data modeled as JSON array; edges as from/to pairs

### 12. Screen 7 — Audit Vault (`src/screens/AuditVault.tsx`)
- Vertical timeline: each event is a row with time, icon, label, metadata
- Events: Payment received → Policy engine → AI analysis → Risk score → Blocked → Controller notified
- Each row expandable to show WHO / WHAT / WHEN / WHY / EVIDENCE
- Filter by event type; search input

### 13. Dependencies to install
- `recharts` — for RadarChart, AreaChart, BarChart (already likely not installed — needs `pnpm add recharts`)

---

## Design Tokens (CSS custom properties)

```css
--bg: #09090b;
--surface: #111113;
--surface-elevated: #18181b;
--border: #27272a;
--border-muted: #1f1f22;
--text: #fafafa;
--text-secondary: #a1a1aa;
--text-muted: #52525b;
--cyan: #22d3ee;
--green: #22c55e;
--amber: #f59e0b;
--red: #ef4444;
--radius-sm: 4px;
--radius: 6px;
```

---

## Verification

1. All 7 sidebar nav items switch screens without errors
2. ⌘K opens command palette; Escape closes it; commands navigate screens
3. Clicking a Firewall transaction opens the detail drawer; clicking outside or X closes it
4. Time Machine sliders update the projected metrics in real time
5. Control Graph nodes are clickable and show the side panel
6. AI Investigator question chips trigger the loading stages then show the investigation report
7. recharts renders without console errors (RadarChart, AreaChart visible on Control Tower)
8. No TypeScript errors that break the build
