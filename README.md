# EPC Guardian

**AI Intelligence Platform for Data Centre EPC Project Delivery**

Requirement-to-Commissioning Intelligence for Data Centre EPC Projects — ET AI Hackathon 2026, Problem Statement 4.

Detect specification deviations in vendor submittals, trace their downstream impact through a Requirement → Equipment → Procurement → Schedule → Commissioning graph, simulate schedule/cost consequences, and generate evidence-grounded corrective paperwork (RFI, NCR, risk-register entry).

## Architecture

```
Source files (PDF/XLSX/CSV)
         ↓
Layout-aware extraction (Docling)
         ↓
Requirement normalisation (LLM)
         ↓
Requirement–Asset–Schedule Knowledge Graph (Neo4j)
         ↓
Hybrid Compliance Engine (deterministic + semantic)
         ↓
Critical Path & Change-Impact Engine (networkx CPM)
         ↓
Agentic Corrective Workflow (LangGraph)
         ↓
Evidence-first project control dashboard (React)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Flow, Recharts, Zustand |
| Backend | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic |
| AI/LLM | Anthropic Claude (Sonnet/Haiku/Opus), LangGraph |
| Data | PostgreSQL 16 + pgvector, Neo4j 5, Redis 7 |
| Infrastructure | Docker Compose, GitHub Actions |

## Quick Start

```bash
cp .env.example .env
npm run bootstrap
npm run infra-up
npm run migrate
npm run seed-demo
npm run test
npm run dev:api
npm run dev:web
```

## Project Structure

```
epc-guardian/
├── apps/
│   ├── api/          FastAPI application
│   ├── worker/       Background ingestion & extraction jobs
│   └── web/          React frontend
├── packages/
│   ├── domain/       Pydantic models & enums
│   ├── persistence/  Database ORM & repositories
│   ├── ingestion/    Docling wrappers, chunkers, extraction prompts
│   ├── compliance/   pint-based checker, deviation generator
│   ├── graph/        Neo4j driver + Cypher query library
│   ├── scheduling/   networkx CPM engine, what-if simulator
│   ├── workflow/     LangGraph agentic workflow
│   ├── benchmark/    Evaluation harness
│   └── shared/       Config, logging, utilities
├── data/
│   ├── demo/         Synthetic seed data & cached LLM outputs
│   └── schemas/      Data definitions
├── scripts/          Seed, benchmark, smoke-test utilities
├── tests/            Unit, integration, API, frontend, E2E tests
└── infra/            Docker Compose, CI/CD
```

## License

ET AI Hackathon 2026 — Project for Problem Statement 4.
