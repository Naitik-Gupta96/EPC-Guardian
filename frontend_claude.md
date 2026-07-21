# EPC Guardian — Frontend Design Reference

## 1. Project DNA

**Product**: EPC Guardian — AI Intelligence Platform for Data Centre EPC Project Delivery
**Tagline**: *Requirement-to-Commissioning Intelligence*
**Vibe**: Mission-critical infrastructure monitoring meets Palantir Gotham. Data-dense, calm, authoritative. Every pixel earns its place.

**User Persona**: Project Controls Engineer / Quality Manager at a data centre EPC contractor. They are:
- Time-poor, managing 50+ vendor submittals per week
- Risk-averse (a missed deviation = million-dollar rework)
- Data-literate but not developers
- Working in high-pressure environment (commissioning deadlines)

**Core UX Principle**: *Show the deviation, trace the damage, fix it in one flow.*

---

## 2. Design System

### 2.1 Color Palette

```
--bg-primary:       #0a0e17    (deep navy — main canvas)
--bg-secondary:     #111827    (card backgrounds)
--bg-tertiary:      #1e293b    (hover states / subtle panels)
--bg-elevated:      #1e293b    (modals, dropdowns) with border #2d3a50

--text-primary:     #f1f5f9
--text-secondary:   #94a3b8
--text-muted:       #64748b

--accent-blue:      #3b82f6    (primary actions, links, active states)
--accent-cyan:      #06b6d4    (info, processing, AI inference)
--accent-amber:     #f59e0b    (warnings, medium severity)
--accent-orange:    #ea580c    (major severity)
--accent-red:       #ef4444    (critical severity, blockers)
--accent-green:     #22c55e    (compliant, passed, healthy)
--accent-purple:    #a855f7    (benchmarking, ML metrics)

--severity-critical:  #ef4444   + bg #ef444410 + border #ef444440
--severity-major:     #ea580c   + bg #ea580c10 + border #ea580c40
--severity-minor:     #f59e0b   + bg #f59e0b10 + border #f59e0b40
--severity-observation: #3b82f6 + bg #3b82f610 + border #3b82f640
--severity-compliant:  #22c55e  + bg #22c55e10 + border #22c55e40
```

### 2.2 Typography

```css
/* Headings */
--font-display: 'Inter', system-ui, sans-serif;    /* for large headings */
--font-ui:      'Inter', system-ui, sans-serif;     /* for body UI */
--font-mono:    'JetBrains Mono', 'Fira Code', monospace; /* for data, code, deltas */

/* Scale */
--text-xs:   0.75rem  (400)
--text-sm:   0.875rem (400/500)
--text-base: 1rem     (400/500)
--text-lg:   1.125rem (500/600)
--text-xl:   1.25rem  (600)
--text-2xl:  1.5rem   (600/700)
--text-3xl:  1.875rem (700)
```

### 2.3 Spacing & Layout

```
--space-1: 0.25rem
--space-2: 0.5rem
--space-3: 0.75rem
--space-4: 1rem
--space-5: 1.25rem
--space-6: 1.5rem
--space-8: 2rem
--space-10: 2.5rem
--space-12: 3rem

--radius-sm:  0.375rem
--radius-md:  0.5rem
--radius-lg:  0.75rem
--radius-xl:  1rem

--shadow-card:   0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)
--shadow-elevated: 0 10px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)
--shadow-glow-blue: 0 0 15px rgba(59,130,246,0.15)
--shadow-glow-red:  0 0 15px rgba(239,68,68,0.15)
```

### 2.4 Component Patterns

**Cards**: `bg-secondary` background, `border border-gray-800/60` subtle border, `rounded-lg`, `shadow-card`. Padding `p-5`. Hover: `border-accent-blue/30` + `shadow-glow-blue`.

**Data Tables**: No lines between rows. Row hover: `bg-tertiary`. Sortable headers with chevron icons. Sticky header. Monospace for numeric columns.

**Buttons**: Rounded-md, font-medium, px-4 py-2. Primary: `bg-accent-blue hover:bg-blue-700`. Secondary: `bg-tertiary hover:bg-gray-700 border border-gray-700`. Danger: `bg-accent-red hover:bg-red-700`. Ghost: `hover:bg-tertiary`. Icon buttons: `p-2 rounded-md`.

**Badges**: `text-xs font-medium px-2 py-0.5 rounded-md`. Severity badges use severity colors. Status badges: `open` = amber, `approved` = green, `rejected` = red, `draft` = gray.

**Inputs / Selects**: `bg-primary border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none`.

**Tabs**: `flex border-b border-gray-800`. Active tab: `text-accent-blue border-b-2 border-accent-blue`. Inactive: `text-muted hover:text-secondary`.

**Modals**: Centered overlay with `bg-black/60 backdrop-blur-sm`. Modal body: `bg-secondary border border-gray-700 rounded-xl shadow-elevated`. Max width `480px` or `640px`. Close button top-right.

**Toast / Notifications**: Slide-in from top-right. `bg-secondary border border-gray-700 rounded-lg shadow-elevated px-4 py-3`. Icon + message + optional action. Auto-dismiss 5s. Stack vertically.

**Skeleton Loading**: Pulse animation with `bg-tertiary rounded`. Match card dimensions.

---

## 3. Layout Architecture

```
+------------------------------------------------------------------+
| HEADER (56px)                                                     |
| +------------+-----------------------+--------------------------+ |
| | Logo +     | Global Search         | Mode Badge | Avatar      | |
| | Product    | (Cmd+K)               | [Seeded]  | + Dropdown  | |
| +------------+-----------------------+--------------------------+ |
+------------------------------------------------------------------+
| LEFT SIDEBAR (240px)              | MAIN CONTENT AREA             |
| +-------------------------------+ |                               |
| | PROJECT SELECTOR              | |  +-------------------------+ |
| | [DC-TIER3-DEMO-001 ▼]        | |  | Breadcrumb              | |
| +-------------------------------+ |  | Page Title + Actions    | |
| | NAVIGATION                    | |  +-------------------------+ |
| |                              | |  |                         | |
| |  ◎ Dashboard                | |  |   PAGE CONTENT          | |
| |  ◎ Compliance Feed     (12) | |  |   (scrollable)          | |
| |  ◎ Impact Graph              | |  |                         | |
| |  ◎ Scenario Simulator        | |  |                         | |
| |  ◎ Corrective Workflow  (3) | |  |                         | |
| |  ◎ Benchmark Dashboard       | |  |                         | |
| |  ◎ Document Library          | |  +-------------------------+ |
| |  ◎ Audit Trail               | |                               |
| +-------------------------------+ |                               |
| | STATUS BAR                    | |                               |
| | Last synced: 2m ago         | |                               |
| | Deviations: 10               | |                               |
| +-------------------------------+ +-------------------------------+
+------------------------------------------------------------------+
```

### 3.1 Header
- Fixed height 56px. `bg-primary border-b border-gray-800`. Left-to-right:
  - **Logo**: Small icon (lightning bolt or shield) + "EPC Guardian" in `font-semibold text-base`
  - **Global Search**: `Cmd+K` trigger. Modal overlay with full-text search across deviations, requirements, documents. Results grouped by type with keyboard navigation.
  - **Mode Badge**: Pill showing current mode: `Seeded` (gray), `Live` (green), `Offline` (amber). With dot indicator.
  - **Avatar**: User initial in a circle. Dropdown: Profile, Settings, Sign out.

### 3.2 Sidebar
- Fixed width 240px. `bg-secondary border-r border-gray-800`. Scrollable.
- **Project Selector**: Dropdown at top showing current project. Projects listed with status indicator.
- **Navigation**: Items grouped logically. Active item has `bg-tertiary text-accent-blue border-l-2 border-accent-blue`. Left icon for each item. Badge count for items with pending actions (deviations, workflow).
- **Status Bar**: Fixed at bottom of sidebar. Shows last sync time, total deviation count, connection status dot.

### 3.3 Main Content
- Fills remaining width. `bg-primary`. Responsive: sidebar collapses to icons on < 1024px, hidden on < 768px with hamburger toggle.
- **Breadcrumb**: `text-sm text-muted` at top of content area.
- **Page Title + Actions**: Title on left, action buttons on right (e.g., Export, Filter, Add).

---

## 4. Page Specifications

### 4.1 Dashboard (`/`)
**Purpose**: At-a-glance project health. What needs attention RIGHT NOW.

```
+------------------------------------------------------------------+
| KPI ROW (4 cards)                                                |
| +----------+ +----------+ +----------+ +----------+              |
| | Deviations| | Critical  | | Schedule | | Benchmark|             |
| |   12     | |    3     | |   -5d    | |  76%    |              |
| |  open    | | need action| |  delay   | |  F1     |              |
| +----------+ +----------+ +----------+ +----------+              |
+------------------------------------------------------------------+
| TWO-COLUMN LAYOUT                                                |
| +---------------------------+ +-------------------------------+ |
| | Recent Deviations (list)  | | Upcoming Milestones           | |
| | - DEV-UPS-001  CRITICAL  | | - IST:  Aug 15   (12d)       | |
| | - DEV-UPS-B... MAJOR     | | - SAT:  Aug 20   (17d)       | |
| | - DEV-COOL...  MINOR     | | - Handover: Sep 1  (29d)     | |
| |  [View All →]            | |                               | |
| +---------------------------+ +-------------------------------+ |
+------------------------------------------------------------------+
| RECENT ACTIVITY (timeline feed)                                  |
| 10:32 — Deviation DEV-UPS-001 generated (automatic)             |
| 10:30 — Submittal UPS-A-001 ingested (Ingestion Service)        |
| 10:28 — Schedule updated: A-2210 baseline +2d                   |
+------------------------------------------------------------------+
```

**UI Detail**:
- KPI cards use `text-3xl font-bold` for the number. Icon top-right of card. Trend indicator (up/down arrow) if applicable.
- Recent deviations list: severity dot + ID + short description. Click navigates to deviation detail.
- Timeline: icon per event type. Relative timestamps. Auto-scrolls, newest at top.

---

### 4.2 Compliance Feed (`/deviations`)
**Purpose**: Full deviation list with filtering, sorting, search, batch actions. This is the primary workspace.

```
+------------------------------------------------------------------+
| FILTER BAR                                                        |
| [Search...] [Severity ▼] [Status ▼] [Equipment ▼] [Date Range] |
| [+ Filter] [Clear All]                    [Export CSV] [View: ○] |
+------------------------------------------------------------------+
| TABLE / CARD VIEW                                                  |
| +--+------+--------+-------+---------+--------+-----+-----------+ |
| |# | ID   | Req    | Sub   | Delta   | Sev    | Sta | Actions  | |
| |1 | UPS- | REQ-   | SUB-  | -5.0 m  | CRIT   |open | [View]   | |
| |  | 001  | UPS-   | VS-   |         | ◉      |     | [Workfl] | |
| |  |      | 001    | 019   |         |        |     |          | |
| +--+------+--------+-------+---------+--------+-----+-----------+ |
| +--+------+--------+-------+---------+--------+-----+-----------+ |
| |2 | UPS- | REQ-   | SUB-  | -3.0%   | MINOR  |open | [View]   | |
| |  | B... | UPS-   | VS-   |         | ○      |     |          | |
| |  |      | B-eff  | 020   |         |        |     |          | |
| +--+------+--------+-------+---------+--------+-----+-----------+ |
+------------------------------------------------------------------+
| PAGINATION: [<] 1 2 3 … 12 [>]    Showing 10 of 12 deviations   |
+------------------------------------------------------------------+
```

**UI Detail**:
- **Toggle between table/card view**. Table = dense, card = visual with severity bar.
- Columns: selection checkbox, ID, requirement, submittal, delta (with unit), severity, status, confidence, created date, actions.
- Severity column: colored dot + label. CRITICAL = red dot + pill.
- Delta column: negative values in red, positive in green. Monospace font.
- Actions column: icon buttons — View (eye), Workflow (file), Impact (graph nodes), Simulate (calculator).
- **Quick preview on row click**: Slide-in panel (400px) with deviation summary, without leaving the list.
- **Batch select**: Checkbox column header selects all. Batch actions appear in floating bar: "3 selected — [Generate Workflows] [Export]".
- **Column header click**: Sort ascending/descending. Active sort shown with arrow icon.

**Empty State**: "No deviations detected. All submittals comply with specifications." with a green checkmark illustration.

---

### 4.3 Deviation Detail (`/deviations/:id`)
**Purpose**: Complete forensic view of one deviation. See the requirement, the submitted value, the delta, the evidence, and the downstream impact.

```
+------------------------------------------------------+
| Header: DEV-UPS-001 — UPS Battery Autonomy Shortfall |
| [← Back to Feed]  [Generate Workflow]  [Export PDF]  |
+------------------------------------------------------+
| THREE-COLUMN LAYOUT                                   |
| +--------------+ +--------------+ +-----------------+ |
| | REQUIREMENT  | | SUBMITTED   | |  VERDICT        | |
| | (Spec side)  | | (Vendor side)| |                  | |
| |              | |              | |  NOT COMPLIANT   | |
| | REQ-UPS-001  | | SUB-VS-019  | |  ◉ CRITICAL      | |
| | Battery      | | UPS-A       | |                  | |
| | Autonomy     | | Submittal   | |  Delta: -5.0 min | |
| |              | |              | |                  | |
| | >= 15 min    | | 10 min      | |  Confidence: 97% | |
| | @ full load  | | @ full load | |                  | |
| |              | |              | |  Calculation:    | |
| | Source:      | | Source:      | |  10 >= 15 =>     | |
| | Spec p.47    | | Sub p.8     | |  false           | |
| +--------------+ +--------------+ +-----------------+ |
+------------------------------------------------------+
| EVIDENCE VIEWER                                        |
| +--------------------------------------------------+ |
| | Spec Clause (p.47)              | Submittal Row  | |
| | "UPS shall provide... "         | "Autonomy: 10  | |
| | minimum 15 minutes... "          | minutes..."    | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| IMPACT SUMMARY                                        |
| +---------+ +-----------+ +----------+ +----------+ |
| | 4 Equip | | 2 PO      | | 1 Mile   | | 3 Activ  | |
| | affected| | affected  | | delayed  | | at risk  | |
| +---------+ +-----------+ +----------+ +----------+ |
+------------------------------------------------------+
```

**UI Detail**:
- **Three-column comparison**: Side-by-side-by-side. Each column has a header card with source doc reference.
- **Verdict card**: Pulsing red border for CRITICAL. Large status indicator. Calculation shown in monospace.
- **Evidence Viewer**: Split pane showing source documents. Spec clause on left, submittal row on right. Highlighted matching text.
- **Impact Summary**: Clickable stat cards that navigate to impact graph.
- **Sticky actions bar**: "Generate RFI", "Generate NCR", "Add to Risk Register" — appear on scroll.

---

### 4.4 Impact Graph (`/graph/:deviationId`)
**Purpose**: Visualize the blast radius of a deviation through the project dependency graph.

```
+------------------------------------------------------+
| Header: Impact Graph — DEV-UPS-001                    |
| [← Back]  [Zoom Reset]  [Full Screen]  [Export PNG]  |
+------------------------------------------------------+
|                                                       |
|   [REQUIREMENT] → [EQUIPMENT] → [PO] → [MILESTONE]   |
|        (UPS       (UPS-A)    (PO-     (IST           |
|      autonomy)                UPS-A)   Milestone)     |
|         |          |          |         |             |
|         |          |          |         ↓             |
|         |          |          |    [ACTIVITY]          |
|         |          |          |    (A-2210)           |
|         |          |          |         |             |
|         |          |          |         ↓             |
|         |          |          |    [TEST]             |
|         |          |          |    (TEST-IST)         |
|                                                       |
|   Legend: [Req] [Equip] [PO] [Milestone] [Act] [Test] |
|   Colors: 🔴 affected nodes, 🟢 unaffected             |
|   Edges: solid = direct, dashed = transitive           |
+------------------------------------------------------+
```

**UI Detail**:
- **Layout**: Left-to-right staged layout (Requirement → Equipment → Procurement → Schedule → Commissioning). Each stage is a vertical column.
- **Nodes**: Cards with icon, label, status. Affected nodes have red border + pulse animation.
- **Edges**: Curved paths with arrowheads. Hover shows relationship type ("supplies", "schedules", "tests").
- **Interaction**: Pan (click-drag), zoom (scroll / pinch), click node → slide-in panel with details.
- **Minimap**: Bottom-right corner showing full graph with viewport rectangle.
- **Auto-layout**: Dagre or similar. Rerun on window resize.

---

### 4.5 Scenario Simulator (`/simulator/:deviationId`)
**Purpose**: What-if analysis. Slider-driven schedule impact preview.

```
+------------------------------------------------------+
| Header: Scenario Simulator — DEV-UPS-001              |
| [← Back to Deviation]                                 |
+------------------------------------------------------+
| CONTROLS                                              |
| +--------------------------------------------------+ |
| | Extra Delay: [==========●==========] 30 days     | |
| | Option: [Replace Battery Bank ▼]                 | |
| | [Run Simulation]                                  | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| RESULTS (appear after simulation)                     |
| +------------------+ +------------------+           |
| | BASELINE         | | IMPACTED        |           |
| | IST: Aug 15      | | IST: Sep 14     |           |
| | SAT: Aug 20      | | SAT: Sep 19     |           |
| | Handover: Sep 1  | | Handover: Oct 1 |           |
| | Total: 0d delay  | | Total: +30d     |           |
| +------------------+ +------------------+           |
| +--------------------------------------------------+ |
| | TIMELINE CHART (Gantt)                           | |
| | ████████████ Baseline ██████████████████████     | |
| | ████████████████████████████████████████████     | |
| |                                       ↑ delay   | |
| | Critical path: A-2210 → A-2220 → A-2230         | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
```

**UI Detail**:
- **Slider**: Custom styled range input. Tick marks at 0, 7, 14, 30, 60 days. Value shown in tooltip.
- **Presets**: Quick buttons for common scenarios: [+7d], [+14d], [+30d], [+60d].
- **Before/After split**: Two columns showing baseline vs impacted dates. Changed values highlighted.
- **Gantt chart**: Horizontal bar chart. Baseline bars in blue, impacted bars overlaid in amber/red. Delta shown as gap.
- **Critical path highlight**: Activities on critical path have bold border + "CP" badge.
- **Export**: "Export as PNG" and "Copy Summary" buttons.

---

### 4.6 Corrective Workflow (`/workflow/:deviationId`)
**Purpose**: Generate, review, and approve RFI, NCR, and Risk Register entries — all in one place.

```
+------------------------------------------------------+
| Header: Corrective Workflow — DEV-UPS-001             |
| [← Back]  [Regenerate All]                           |
+------------------------------------------------------+
| THREE-COLUMN LAYOUT (one per document type)           |
| +----------+ +----------+ +----------+               |
| | RFI      | | NCR      | | RISK     |               |
| | ◉ Drafted| | ○ Drafted| | ○ Drafted|               |
| |          | |          | |          |               |
| | Request  | | Non-     | | Risk     |               |
| | for      | | Conf-    | | Register |               |
| | Info     | | ormance  | | Entry    |               |
| |          | | Report   | |          |               |
| | [Preview]| | [Preview]| | [Preview]|               |
| | [Approve]| | [Approve]| | [Approve]|               |
| +----------+ +----------+ +----------+               |
+------------------------------------------------------+
| DRAFT PREVIEW (modal / slide-in)                      |
| +--------------------------------------------------+ |
| | RFI-001                                           | |
| | ─────────────────────────────────────────         | |
| | RFI: UPS-A autonomy below specified requirement   | |
| |                                                   | |
| | Requirement: 15.0 minute (>=) per client spec     | |
| | Submitted: 10.0 minute per submittal VS-019       | |
| | Calculation: 10 >= 15 => false                    | |
| | Delta: -5.0 minute                                | |
| |                                                   | |
| | Question: Please confirm whether the submitted    | |
| | UPS-A autonomy of 10.0 minute meets project       | |
| | requirements...                                   | |
| |                                                   | |
| | Generated from: DEV-UPS-001                       | |
| | Timestamp: 2026-07-21T23:15:00Z                   | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
```

**UI Detail**:
- **Three-column layout**: Each column is a document card. Progress indicator: Drafted (amber) → Validated (blue) → Approved (green) → Queued (purple).
- **Column state**: Grayed out until generated. Clicking generate button shows loading state, then transitions to "Drafted" with a preview button.
- **Preview**: Slide-in panel or modal showing full document draft. Rich text formatting (bold labels, monospace values).
- **Approve button**: Disabled until draft is reviewed. On click, confirmation dialog: "Approve DEV-UPS-001 RFI?" with approver name input.
- **After approval**: Button changes to "Approved ✓" with timestamp. Document moves to "Outbox" state.
- **Flow completion**: When all three are approved, a green banner appears: "All corrective actions generated and queued for outbox dispatch."

---

### 4.7 Benchmark Dashboard (`/benchmark`)
**Purpose**: Show the AI's accuracy against the 30-case ground truth.

```
+------------------------------------------------------+
| Header: Benchmark Dashboard                           |
| [Run Benchmark] [Export Report] [Refresh]            |
+------------------------------------------------------+
| KPI ROW (5 cards)                                     |
| +---------+ +---------+ +---------+ +---------+      |
| | Total   | | True    | | False   | | False   |      |
| | Cases   | | Pos     | | Pos     | | Neg     |      |
| |  30     | |  11     | |   0     | |  11     |      |
| +---------+ +---------+ +---------+ +---------+      |
| +---------+ +---------+                               |
| |Precision| | Recall  |                               |
| | 100.00% | |  50.00% |                               |
| +---------+ +---------+                               |
+------------------------------------------------------+
| BREAKDOWN TABLE                                        |
| +------+-------+--------+--------+--------+--------+  |
| | Case | Cat   | Req    | Sub    | Pred   | Actual |  |
| |  1   | Numer |  15min |  10min | DEV    | DEV    |  |
| |  2   | Boole | UL     | Yes    | COMP   | COMP   |  |
| |  3   | Name  | Vendor | ABC    | COMP   | DEV    |  |
| +------+-------+--------+--------+--------+--------+  |
+------------------------------------------------------+
| CATEGORY BREAKDOWN (bar chart)                         |
| Numeric Threshold: ■■■■■■■■■■ 8/8 TP                  |
| Boolean:          ■■■■■■■■■■ 6/6 TP                  |
| Vendor Name:      ■■■■■■■□□□ 2/5 TP (FN analyzed)   |
| Missing Evidence: ■■■■■■■□□□ 1/3 TP                  |
| Exact Match:      ■■■■■■■■■■ 4/4 TP                  |
| Superset:         ■■■■■■■□□□ 0/4 TP                  |
+------------------------------------------------------+
```

**UI Detail**:
- **KPI cards**: Large number, label, colored icon. TP = green, FP = red, FN = orange.
- **Breakdown table**: Fully sortable. Color-coded rows: TP green, FP red, FN amber.
- **Category bar chart**: Horizontal bars with TP/FP/FN segments. Segment hover shows count.
- **Case detail click**: Opens slide-in panel showing the full comparison for that case.
- **Run button**: Triggers benchmark evaluation. Shows progress spinner during computation.

---

### 4.8 Document Library (`/documents`)
**Purpose**: Browse ingested documents (specs, submittals) with status.

```
+------------------------------------------------------+
| Header: Document Library                              |
| [Upload] [Filter by Type ▼] [Search...]              |
+------------------------------------------------------+
| GRID VIEW                                              |
| +------+ +------+ +------+ +------+                  |
| | 📄   | | 📄   | | 📄   | | 📄   |                  |
| | UPS  | | GEN  | | COOL | | UPS  |                  |
| | Spec | | Spec | | Spec | | Sub-A|                  |
| | ✓    | | ✓    | | ✓    | | ✓    |                  |
| +------+ +------+ +------+ +------+                  |
+------------------------------------------------------+
| Status: ● Parsed ● Extracted ● Compared              |
+------------------------------------------------------+
```

**UI Detail**:
- **Grid of document cards**: Thumbnail/file icon, title, type badge, status indicators.
- **Status dots**: Gray = pending, blue = processing, green = done, red = failed.
- **Upload button**: Triggers file picker. Supports PDF, XLSX, CSV. Drag-and-drop zone.
- **Sort by**: Name, date, type, status.

---

### 4.9 Audit Trail (`/audit`)
**Purpose**: Immutable log of every action taken by the system or users.

```
+------------------------------------------------------+
| Header: Audit Trail                                   |
| [Filter by Action ▼] [Date Range] [Export]           |
+------------------------------------------------------+
| TIMELINE                                              |
| +------+-------+--------+--------+----------+       |
| | Time | Actor | Action | Object | Details  |       |
| |10:32 |system |deviation|DEV-   |delta=-5  |       |
| |      |       |.generat|UPS-001|min       |       |
| |10:30 |system |submitta|SUB-VS-|19 params |       |
| |      |       |l.ingest|019    |extracted |       |
| |10:28 |jdoe   |workflow|RFI-   |approved  |       |
| |      |       |.approve|DEV-   |          |       |
| +------+-------+--------+--------+----------+       |
+------------------------------------------------------+
```

---

## 5. State Management (Zustand)

```typescript
interface AppState {
  // Project
  currentProject: Project | null
  projects: Project[]

  // Navigation
  sidebarOpen: boolean
  currentPage: string

  // Deviations
  deviations: Deviation[]
  selectedDeviation: Deviation | null
  deviationFilters: DeviationFilters
  deviationSort: { field: string; dir: 'asc' | 'desc' }

  // Impact Graph
  graphData: GraphData | null

  // Simulation
  simulationParams: { extraDays: number; option: string }
  simulationResult: SimulationResult | null

  // Workflow
  workflowState: Record<string, WorkflowStatus>

  // Benchmark
  benchmarkResult: BenchmarkResult | null

  // Global UI
  toasts: Toast[]
  globalSearchOpen: boolean
  theme: 'dark' | 'light'

  // Actions
  setProject: (id: string) => Promise<void>
  fetchDeviations: () => Promise<void>
  setDeviationFilters: (f: Partial<DeviationFilters>) => void
  runSimulation: (deviationId: string) => Promise<void>
  approveWorkflowItem: (deviationId: string, kind: string) => Promise<void>
  runBenchmark: () => Promise<void>
  addToast: (t: Toast) => void
  dismissToast: (id: string) => void
}
```

---

## 6. API Integration

All calls go through `src/api/client.ts` with `BASE = '/api'`.

```typescript
// Key endpoints
GET  /api/projects/:id
GET  /api/projects/:id/deviations?status=&severity=
GET  /api/deviations/:id
GET  /api/deviations/:id/impact-graph
POST /api/deviations/:id/simulate  { extra_delay_days, option }
POST /api/deviations/:id/workflow
GET  /api/projects/:id/benchmark
GET  /api/projects/:id/documents
GET  /api/projects/:id/audit
```

---

## 7. Interaction & Animation Patterns

| Element | Animation |
|---------|-----------|
| Page transitions | Fade + slide-up (200ms ease-out) |
| Card hover | Scale 1.02, border glow, shadow increase (150ms) |
| Sidebar collapse | Width transition (300ms cubic-bezier) |
| Modal | Backdrop fade-in (200ms), content scale-up (250ms bounce) |
| Toast | Slide-in from right (300ms), auto-fade out (500ms) |
| Severity badge | Subtle pulse for CRITICAL (2s infinite) |
| Table row hover | Background color transition (100ms) |
| Data loading | Skeleton shimmer (1.5s infinite) |
| Graph nodes | Spring animation on add (300ms) |
| Slider | Live tooltip follower |
| Button click | Scale 0.97 on press, release bounce (100ms) |
| Notification dot | Pulse animation (2s infinite) |

---

## 8. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px  | Single column, sidebar as slide-over drawer, sticky bottom nav |
| 640-1023 | Two columns, collapsible sidebar icons, table horizontal scroll |
| 1024-1279 | Full sidebar, multi-column content |
| >= 1280  | Full layout with side panels |

---

## 9. States Every Component Must Handle

| State | Behaviour |
|-------|-----------|
| Loading | Skeleton / spinner matching card dimensions |
| Empty | Illustration + message + CTA button |
| Error | Red banner / toast with retry button |
| Success | Normal data display |
| Offline | Yellow banner "Working offline — changes will sync when connected" |

---

## 10. Accessibility

- All interactive elements keyboard-navigable (Tab, Enter, Escape)
- Focus visible ring (`ring-2 ring-accent-blue`)
- ARIA labels on icon-only buttons
- Color not sole differentiator (severity uses icon + text + color)
- Reduced motion media query suppresses animations
- Contrast ratio >= 4.5:1 for all text

---

## 11. File Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css              (Tailwind directives + custom CSS vars)
├── api/
│   └── client.ts          (typed fetch wrapper)
├── state/
│   └── store.ts           (Zustand store)
├── components/
│   ├── ui/                (design system primitives)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── DataTable.tsx
│   │   └── EmptyState.tsx
│   ├── Layout.tsx         (Header + Sidebar + Main)
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── GlobalSearch.tsx
│   └── KpiCard.tsx
├── features/
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── RecentDeviations.tsx
│   │   ├── UpcomingMilestones.tsx
│   │   └── ActivityFeed.tsx
│   ├── compliance/
│   │   ├── ComplianceFeed.tsx
│   │   ├── DeviationTable.tsx
│   │   ├── DeviationCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── QuickPreview.tsx
│   ├── deviation-detail/
│   │   ├── DeviationDetail.tsx
│   │   ├── ComparisonColumns.tsx
│   │   ├── VerdictCard.tsx
│   │   ├── EvidenceViewer.tsx
│   │   └── ImpactSummary.tsx
│   ├── impact-graph/
│   │   ├── ImpactGraph.tsx
│   │   ├── GraphCanvas.tsx
│   │   ├── NodeCard.tsx
│   │   └── Minimap.tsx
│   ├── simulator/
│   │   ├── Simulator.tsx
│   │   ├── DelaySlider.tsx
│   │   ├── BeforeAfter.tsx
│   │   └── GanttChart.tsx
│   ├── workflow/
│   │   ├── WorkflowPanel.tsx
│   │   ├── DocumentColumn.tsx
│   │   ├── DraftPreview.tsx
│   │   └── ApprovalButton.tsx
│   ├── benchmark/
│   │   ├── BenchmarkDashboard.tsx
│   │   ├── KpiRow.tsx
│   │   ├── BreakdownTable.tsx
│   │   └── CategoryChart.tsx
│   ├── documents/
│   │   ├── DocumentLibrary.tsx
│   │   └── DocumentCard.tsx
│   └── audit/
│       └── AuditTrail.tsx
└── hooks/
    ├── useApi.ts
    ├── useKeyboard.ts
    └── useDebounce.ts
```

---

## 12. Theme Variables (CSS)

```css
@layer base {
  :root {
    --bg-primary: #0a0e17;
    --bg-secondary: #111827;
    --bg-tertiary: #1e293b;
    --bg-elevated: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --accent-blue: #3b82f6;
    --accent-cyan: #06b6d4;
    --accent-amber: #f59e0b;
    --accent-orange: #ea580c;
    --accent-red: #ef4444;
    --accent-green: #22c55e;
    --accent-purple: #a855f7;
    --radius: 0.5rem;
  }
}
```
