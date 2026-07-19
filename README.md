# EPC Guardian

**AI Intelligence Platform for Data Centre EPC Project Delivery**

Detect specification deviations in vendor submittals, trace downstream impact through a Requirement → Equipment → Procurement → Schedule → Commissioning graph, simulate schedule consequences, and generate evidence-grounded corrective paperwork (RFI, NCR, risk-register entry).

> ET AI Hackathon 2026 — Problem Statement 4. Fixture-first demo: no live LLM required; preloaded with 30-case ground truth and a flagship UPS battery autonomy deviation (DEV-UPS-001).

## Quick Start

```bash
npm run test        # 38 tests (backend + frontend)
npm run dev:api     # FastAPI on :8000
npm run dev:web     # Vite on :5173
npm run seed-demo   # Seed 29 reqs / 19 submittals / 10 deviations
npm run smoke       # Full smoke test
```

## Architecture

```
Synthetic seed data (JSON/CSV)
         ↓
Requirement normalisation & extraction pipeline
         ↓
Requirement–Asset–Schedule Knowledge Graph (in-memory / Neo4j)
         ↓
Deterministic Compliance Engine (pint-based, 6 comparator types)
         ↓
Critical Path & Change-Impact Engine (networkx CPM)
         ↓
Corrective Workflow (state machine + approval gate + outbox)
         ↓
Evidence-first project control dashboard (React 18 + TypeScript)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Router |
| Backend | Python 3.13, FastAPI, Pydantic v2, pint, networkx |
| Data | PostgreSQL 16, Neo4j 5, Redis 7 (optional — in-memory mode by default) |
| Infrastructure | Docker Compose, GitHub Actions |

## Project Structure

```
epc-guardian/
├── apps/
│   ├── api/             FastAPI application (11 route modules)
│   └── web/             React frontend (6 feature screens)
├── packages/
│   ├── domain/          Pydantic models & enums
│   ├── compliance/      pint-based checker, 6 comparator dispatch, severity rules
│   ├── graph/           In-memory / Neo4j blast-radius repository
│   ├── scheduling/      networkx CPM engine (forward/backward pass, total float)
│   ├── ingestion/       Parser adapters (Fixture/Spreadsheet/ScheduleCsv), chunking
│   ├── workflow/        State machine, RFI/NCR/Risk drafting, approval gate, outbox
│   ├── benchmark/       30-case ground truth evaluator (precision/recall/F1)
│   └── shared/          Config, logging, audit trail
├── data/
│   ├── demo/            Seed fixtures (JSON/CSV), ground truth, cached outputs
│   └── schemas/         Data definitions
├── scripts/
│   ├── seed_demo.py     Idempotent seed loader + compliance runner
│   ├── export_snapshot.py   Portable JSON export
│   └── run_benchmark.py     Benchmark evaluator CLI
├── tests/               38 tests (unit, integration, API)
└── infra/               Docker Compose, CI/CD
```

## Available Commands

| Command | Description |
|---|---|
| `npm run bootstrap` | Install deps (pip + npm + playwright) |
| `npm run infra-up` | Start Docker services (postgres/redis/neo4j) |
| `npm run dev:api` | Start FastAPI dev server on :8000 |
| `npm run dev:web` | Start Vite frontend on :5173 |
| `npm run test` | Run all tests (pytest + vitest) |
| `npm run lint` | Lint Python + TypeScript |
| `npm run seed-demo` | Seed demo data + run compliance |
| `npm run smoke` | Full smoke test (seed → API health → deviations → benchmark) |
| `npm run benchmark` | Run 30-case evaluation |

## Flagship Deviation

| Field | Value |
|---|---|
| ID | `DEV-UPS-001` |
| Rule | UPS battery autonomy ≥ 15 min |
| Submitted | 10 min |
| Delta | -5.0 minute |
| Severity | **CRITICAL** |
| Downstream | 4 equipment, 2 purchase orders, 1 milestone, 3 activities, 1 test |

## Compliance Categories (6/30 benchmark cases)

- Numeric threshold (≥, ≤, >, <)
- Exact match (==, !=)
- Boolean / certificate presence
- Vendor name allowlist (in/not-in)
- Missing / late evidence
- Enumeration subset (superset-of)

## License

ET AI Hackathon 2026 — Project for Problem Statement 4.
