# ZephyrPulse AI — Wind Fleet Health & Maintenance Window Optimizer
### HCLTech Hackathon: Future Ready AI Engineer

![Status](https://img.shields.io/badge/Status-Complete-emerald)
![Architecture](https://img.shields.io/badge/Architecture-FastAPI%20%7C%20OR--Tools%20%7C%20React-indigo)
![Evaluation](https://img.shields.io/badge/Evaluation-20%2F20%20Cases%20(100%25)-purple)
![Compliance](https://img.shields.io/badge/Policy-Annex%20A%20Compliant-blue)

An enterprise-grade AI operations platform designed for 25-turbine wind farms. Differentiates genuine mechanical degradation from environmental factors (curtailment, wake loss, blade icing) and schedules constraint-optimized maintenance windows using **Google OR-Tools Mixed-Integer Linear Programming (MILP)** to minimize lost energy production.

---

## 🚀 Key Features

* **Fleet Health Telemetry Matrix (FR-UI-001)**: Live status grid across all 25 turbines (`T-01`..`T-25`), color-coded by health status.
* **Explainable Root-Cause Diagnosis (FR-UI-002, FR-DIAG-001..004)**: Differentiates faults from false alarms with IEC Class II power curve correlation and exact evidence citations (`scada_10min:T-07:gearbox_temp_c=84.6C(+3.8σ)`).
* **OR-Tools Maintenance Optimizer (FR-UI-003, FR-SCHED-001..005)**: Schedules service into forecast calm wind lulls (<4.5 m/s) respecting crew availability and heavy crane logistics.
* **Interactive What-If Sandbox**: Real-time constraint disruption solver (Crane 1 port delay, storm warnings, crew quarantine).
* **Late Data Drop Re-Planning (`POST /replan`, FR-UI-005)**: Automatically adapts schedules when late forecasts are dropped and highlights shifted window diffs.
* **Deterministic Trace Engine (FR-API-001..004, Annex C)**: Audit logging of every tool call, latency, and reasoning step (`GET /trace/{run_id}`).
* **Annex B Data Integrity Checker (FR-DATA-001..005)**: 8-rule validation script testing foreign keys, power limits, rotor physics, and sensor zero-variance flatlines.
* **20-Case Benchmark Suite (FR-EVAL-001..004)**: Comprehensive evaluation set and quantitative comparison between Local Ollama and Cloud Gemini/Claude + OR-Tools.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **User Interface** | **React 19 + Vite** | High-performance enterprise console with responsive filters and SVG power curves |
| **API Layer** | **FastAPI + Uvicorn** | High-throughput asynchronous REST endpoints implementing Section 6 contract |
| **Optimization** | **Google OR-Tools (MILP)** | Mathematical constraint solver for service window planning |
| **Reasoning** | **LangGraph + Gemini / Claude** | Deterministic tool orchestration with fallback to offline `MOCK_LLM=true` |
| **Data Stores** | **SQLite + Parquet** | Relational schemas for audit traces and columnar storage for 10-min SCADA time-series |

---

## 📁 Repository Structure

```
.
├── frontend/                  # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/        # UI components (Navbar, Matrix, Optimizer, etc.)
│   │   ├── data/              # Annex B datasets, rules, traces, and benchmark cases
│   │   └── App.jsx            # Main app shell & role switcher
│   └── package.json
├── diagrams/                  # D2 Architecture & ER Diagrams
│   ├── 01_ER_Diagram.d2       # 10-table entity-relationship diagram
│   ├── 02_API_Endpoint_Map.d2 # REST API endpoint map
│   ├── 03_DFD.d2              # Data flow diagram
│   ├── 04_HLD.d2              # High-level system architecture
│   └── 05_Timeline.d2         # Sprint delivery timeline
├── SRS_Wind_Fleet_Optimizer.md # Full Software Requirements Specification (ISO 29148)
├── Project_Plan_Wind_Fleet_Optimizer.md # Detailed Agile Project Plan
├── judge_demo_script_and_component_guide.md # 10-minute judge demonstration script
└── .gitignore
```

---

## ⚡ Quick Start

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## ⚖️ Evaluation & Compliance

* **Annex A Policy**: High-severity mechanical faults scheduled within 7 days.
* **Annex B Schemas**: Strict schema compliance for `scada_10min.csv`, `alarms.csv`, `forecast.csv`, and `crew_calendar.csv`.
* **Annex C Traces**: Audit records accessible via `GET /trace/{run_id}`.
* **NFR Reliability**: 100% deterministic fallback mode (`MOCK_LLM=true`) for internet-isolated environments.
