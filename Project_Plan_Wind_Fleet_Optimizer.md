# PROJECT PLAN
## Wind Fleet Health and Maintenance Window Optimizer
### HCLTech Future Ready AI Engineer Hackathon

---

| Field | Details |
|---|---|
| **Project Name** | Wind Fleet Health and Maintenance Window Optimizer |
| **Client / Organizer** | HCLTech |
| **Event Type** | 1-Day Hackathon |
| **Document Version** | v1.0 |
| **Date** | October 11, 2026 |
| **Project Manager** | Team Lead |
| **Status** | Active |

---

## 1. Project Overview

### 1.1 Problem Statement

A wind farm operates **25 turbines**, each recording wind speed, power output, rotor speed, gearbox temperature, and generator temperature at **10-minute intervals**. The operator faces two core challenges:

1. **Health Diagnosis** — Distinguishing genuinely unhealthy turbines from those underperforming due to curtailment, icing, or wake effects.
2. **Maintenance Scheduling** — Producing an optimal, executable service plan aligned with calm-weather windows, crew availability, and crane schedules.

### 1.2 Solution Summary

We will build an **AI-powered REST API system** with a supporting dashboard that:
- Ingests and validates multi-source time-series SCADA data
- Applies ML models to detect and classify turbine faults
- Uses an LLM-backed reasoning engine to produce explainable recommendations
- Generates an optimized maintenance schedule with re-planning on late data drops
- Exposes a defined API contract that judges can test live

---

## 2. Objectives and Success Criteria

| ID | Objective | Success Criteria |
|---|---|---|
| OBJ-001 | Accurate turbine health diagnosis | 80%+ accuracy on evaluation set; curtailment/icing/wake correctly classified |
| OBJ-002 | Explainable AI recommendations | Every recommendation includes rationale, evidence_refs, confidence, estimated_impact |
| OBJ-003 | Maintenance schedule optimization | Schedule respects crew calendar, crane availability, and weather window constraints |
| OBJ-004 | Late data drop handling | System re-runs plan within 60 seconds of receiving updated data |
| OBJ-005 | Data validation pipeline | Validation script runs before analysis; all 6 checks pass |
| OBJ-006 | API contract compliance | All mandatory endpoints return correct schema; live judge tests pass |
| OBJ-007 | Evaluation report | 20+ test cases with documented results comparing 2+ configurations |

---

## 3. System Entities

### 3.1 Core Domain Entities

| Entity | Description | Key Attributes |
|---|---|---|
| **Turbine** | A single wind turbine unit | turbine_id, location_x, location_y, rated_power_kw, status |
| **SCADA Record** | 10-minute sensor reading | turbine_id, timestamp, wind_speed_ms, power_kw, rotor_rpm, gearbox_temp_c, generator_temp_c |
| **Alarm** | Fault or alert event | alarm_id, turbine_id, start_time, end_time, alarm_code, severity |
| **Weather Forecast** | 30-day wind and weather prediction | forecast_id, timestamp, wind_speed_ms, temperature_c, is_storm_window |
| **Crew Calendar** | Crew and crane availability | crew_id, date, is_available, crane_available |
| **Fault Assessment** | AI-generated health diagnosis | turbine_id, fault_type, confidence, evidence_refs, severity |
| **Maintenance Window** | Proposed service slot | window_id, turbine_id, planned_date, crew_assigned, estimated_downtime_hrs |
| **Service Plan** | Full optimized schedule | plan_id, created_at, windows[], assumptions[], limitations[] |
| **Trace Record** | LLM reasoning audit trail | run_id, query, steps[], final_answer, model_used |
| **Evaluation Case** | Test case for model evaluation | case_id, input, expected_output, actual_output, score |

### 3.2 System Actors

| Actor | Role |
|---|---|
| **Wind Farm Operator** | Primary user; queries health status and maintenance plans |
| **Maintenance Crew** | Referenced in scheduling; crew availability governs plan |
| **Judge / Evaluator** | Runs live API tests; assesses system capability |
| **Data Admin** | Loads CSV files via loader endpoint or CLI |
| **AI Engine** | Internal actor; generates diagnoses and explanations |

---

## 4. Functional Requirements

### 4.1 Data Ingestion and Validation

| ID | Requirement | Priority |
|---|---|---|
| FR-DATA-001 | System shall provide a CLI script and/or admin endpoint to load CSV files matching the Annex B schema | Must Have |
| FR-DATA-002 | Validation script shall verify: all turbines in SCADA exist in turbine list; no negative power; rotor speed within limits; timestamps regular with gaps reported; alarm end time after start time; crew calendar no double-booking; row counts match data card | Must Have |
| FR-DATA-003 | Validation output shall be displayed in the demo and logged | Must Have |
| FR-DATA-004 | Edge cases shall be detected and flagged: curtailment periods, stuck temperature sensors, icing events, wake effect turbines, communication-outage gaps, forecast changes | Must Have |

### 4.2 Health Diagnosis

| ID | Requirement | Priority |
|---|---|---|
| FR-DIAG-001 | System shall analyze each turbine and classify health as: healthy, degraded, fault_suspected, or curtailed/icing/wake | Must Have |
| FR-DIAG-002 | System shall distinguish real faults from curtailment, icing, and wake-effect underperformance | Must Have |
| FR-DIAG-003 | System shall detect stuck sensors (sensor value never changes across time window) | Must Have |
| FR-DIAG-004 | Each diagnosis shall reference specific evidence rows from the data | Must Have |
| FR-DIAG-005 | Diagnosis shall include a confidence score (0.0-1.0) and requires_approval flag | Must Have |

### 4.3 Maintenance Scheduling

| ID | Requirement | Priority |
|---|---|---|
| FR-SCHED-001 | System shall generate a prioritized maintenance schedule for unhealthy turbines | Must Have |
| FR-SCHED-002 | Schedule shall respect: crew availability, crane availability, calm weather windows | Must Have |
| FR-SCHED-003 | System shall apply the fault and service policy from Annex A | Must Have |
| FR-SCHED-004 | Each window shall include: turbine_id, planned_date, crew_id, crane_required, estimated_duration_hrs, justification | Must Have |
| FR-SCHED-005 | System shall re-run the plan when late data is received and explain the diff | Must Have |

### 4.4 API Contract

| ID | Requirement | Priority |
|---|---|---|
| FR-API-001 | POST /analyze shall accept turbine IDs or "all" and return structured recommendations | Must Have |
| FR-API-002 | Each recommendation shall include: action, rationale, evidence_refs, confidence, estimated_impact, requires_approval | Must Have |
| FR-API-003 | Response shall include top-level assumptions and limitations arrays | Must Have |
| FR-API-004 | GET /trace/{run_id} shall return full LLM reasoning trace | Must Have |
| FR-API-005 | POST /load or CLI loader shall accept CSV files per Annex B schema | Must Have |
| FR-API-006 | GET /health endpoint shall return system status | Should Have |
| FR-API-007 | POST /replan endpoint shall trigger re-planning on late data drop | Must Have |

### 4.5 Evaluation

| ID | Requirement | Priority |
|---|---|---|
| FR-EVAL-001 | System shall include an evaluation set of 20+ test cases with expected results | Must Have |
| FR-EVAL-002 | Evaluation shall cover: 3+ true faults, 3+ healthy-but-suspicious, 2+ stuck-sensor, 2+ planning with changed constraints, 2+ what-if questions | Must Have |
| FR-EVAL-003 | System shall report evaluation results with chosen method | Must Have |
| FR-EVAL-004 | System shall compare 2+ configurations with numbers | Should Have |

### 4.6 UI Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-UI-001 | Dashboard shall display turbine fleet health map/status grid | Must Have |
| FR-UI-002 | Dashboard shall display maintenance schedule calendar view | Must Have |
| FR-UI-003 | Dashboard shall show diagnosis details and evidence for selected turbine | Must Have |
| FR-UI-004 | Dashboard shall support triggering re-plan and displaying diff | Should Have |

---

## 5. Non-Functional Requirements

| ID | Category | Requirement | Target |
|---|---|---|---|
| NFR-PERF-001 | Performance | POST /analyze (all turbines) response time | <= 30 seconds |
| NFR-PERF-002 | Performance | POST /replan (late data drop) response time | <= 60 seconds |
| NFR-PERF-003 | Performance | Data validation script execution time | <= 10 seconds |
| NFR-REL-001 | Reliability | System operational during full 30-min demo | 100% uptime during demo |
| NFR-REL-002 | Reliability | MOCK_LLM=true mode for testing without model | Enabled in config |
| NFR-AVAIL-001 | Availability | All services start via docker compose up | Single command startup |
| NFR-MAINT-001 | Maintainability | Test coverage for key functions | 60%+ unit test coverage |
| NFR-MAINT-002 | Maintainability | Code reviewable in Git; commits every hour | Git history present |
| NFR-SEC-001 | Security | No real wind farm or personal data in system | Verified pre-submission |
| NFR-PORT-001 | Portability | System runs via Docker Compose on any machine | docker compose up works |
| NFR-TRACE-001 | Traceability | Every LLM call produces a traceable record | All runs traced |
| NFR-QUAL-001 | Code Quality | Clean code principles; no debug prints in production | Code review pass |

---

## 6. Team Structure and Roles

### 6.1 Team Composition

| Role | Responsibilities | Count |
|---|---|---|
| **Team Lead / PM** | Architecture decisions, integration, demo coordination, risk management | 1 |
| **AI / ML Engineer** | Fault detection model, anomaly classification, evaluation set, LLM integration | 1-2 |
| **Backend Engineer** | FastAPI endpoints, data loader, validation script, Docker setup, DB | 1-2 |
| **Frontend Engineer** | React dashboard, fleet health view, schedule calendar, API integration | 1 |

### 6.2 RACI Matrix

| Activity | Team Lead | AI/ML Engineer | Backend Engineer | Frontend Engineer |
|---|---|---|---|---|
| Architecture design | A/R | C | C | I |
| Data validation script | I | C | R | I |
| ML fault detection model | C | R | I | I |
| LLM integration and prompting | A | R | C | I |
| API endpoints (FastAPI) | A | C | R | I |
| Docker Compose setup | A | I | R | I |
| Dashboard UI | A | I | I | R |
| Evaluation report | A | R | C | I |
| Git commit discipline | R | R | R | R |
| Final demo | R | R | R | R |

R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 7. High-Level Design (HLD)

### 7.1 System Architecture Layers

```
[EXTERNAL INPUTS]
CSV Files: scada_10min, alarms, forecast, crew_calendar
Late Data Drop: updated forecast + crane changes
        |
        v
[DATA LAYER]
Data Loader (CLI/API) --> Validation Script --> PostgreSQL/SQLite
        |
        v
[AI / ANALYTICS LAYER]
ML Fault Detector (Isolation Forest / Rule Engine)
        |
LLM Reasoning Engine (OpenAI / Ollama / Gemini) + Trace Logger
        |
Maintenance Scheduler (Constraint Solver / Greedy)
        |
        v
[API LAYER - FastAPI]
POST /analyze | GET /trace/{run_id} | POST /load | POST /replan | GET /health
        |
        v
[PRESENTATION LAYER]
React Dashboard: Fleet Health Map | Schedule Calendar | Diagnosis Detail
```

### 7.2 Component Architecture

| Component | Technology | Purpose |
|---|---|---|
| Data Loader | Python CLI + FastAPI endpoint | Ingest CSVs, validate schema |
| Validation Engine | Python (pandas) | Run 6-check validation suite |
| ML Anomaly Detector | scikit-learn (Isolation Forest / Z-score) | Flag abnormal turbine behavior |
| Fault Classifier | Rule engine + ML | Distinguish fault types from environmental causes |
| LLM Reasoning Engine | LangChain + chosen LLM | Generate explainable recommendations |
| Maintenance Scheduler | Python (greedy + constraint) | Produce optimized service calendar |
| Trace Logger | SQLite / in-memory store | Record full reasoning chain per run |
| REST API | FastAPI (Python) | Expose all endpoints per contract |
| Database | PostgreSQL (Docker) | Persist all entities |
| Frontend | React + Recharts | Dashboard UI |
| Infrastructure | Docker Compose | Single-command deployment |

### 7.3 Data Flow

```
CSV Load --> Validation --> DB Persist
                              |
                              v
              POST /analyze request
                              |
                              v
              Feature Engineering (SCADA aggregation)
                              |
                              v
              ML Anomaly Scoring per turbine
                              |
                              v
              Fault Classification (fault vs. curtailment/icing/wake)
                              |
                              v
              LLM Synthesis (rationale + recommendations)
                              |
                              v
              Maintenance Scheduling (constraint-based)
                              |
                              v
              API Response + Trace Record stored
```

---

## 8. Low-Level Design (LLD)

### 8.1 Database Schema

Core Tables:
- turbines (turbine_id PK, location_x, location_y, rated_power_kw, hub_height_m)
- scada_records (id PK, turbine_id FK, timestamp, wind_speed_ms, power_kw, rotor_rpm, gearbox_temp_c, generator_temp_c)
- alarms (alarm_id PK, turbine_id FK, start_time, end_time, alarm_code, severity)
- forecast (forecast_id PK, timestamp, wind_speed_ms, temperature_c, precipitation_mm, is_storm_window, version)
- crew_calendar (entry_id PK, crew_id, date, is_available, crane_available)

AI Output Tables:
- fault_assessments (assessment_id PK, run_id FK, turbine_id FK, fault_type, confidence, severity, evidence_refs JSON, created_at)
- service_plans (plan_id PK, created_at, version, assumptions JSON, limitations JSON)
- maintenance_windows (window_id PK, plan_id FK, turbine_id FK, planned_date, crew_id, crane_required, estimated_duration_hrs, justification)
- trace_records (run_id PK, query, steps JSON, final_answer, model_used, created_at)
- evaluation_cases (case_id PK, input JSON, expected_output JSON, actual_output JSON, score, method, created_at)

### 8.2 API Response Schema (POST /analyze)

```
{
  "run_id": "uuid",
  "recommendations": [
    {
      "turbine_id": "T01",
      "action": "Schedule immediate inspection",
      "rationale": "Gearbox temperature consistently 15C above peers...",
      "evidence_refs": ["scada:T01:2024-03-01T08:00", "alarm:ALM-042"],
      "confidence": 0.87,
      "estimated_impact": "Prevent ~120h unplanned downtime",
      "requires_approval": true,
      "fault_type": "gearbox_degradation"
    }
  ],
  "service_plan": { ... },
  "assumptions": ["Forecast is accurate for 14-day window"],
  "limitations": ["Stuck sensor on T07 -- diagnosis may be incomplete"]
}
```

### 8.3 ML Pipeline Stages

| Stage | Method | Output |
|---|---|---|
| Feature Engineering | Rolling mean/std (1h, 24h), power curve deviation, temp deltas, peer comparison | Feature vector per turbine |
| Anomaly Scoring | Isolation Forest trained on healthy-period data | Anomaly score (0-1) |
| Curtailment Detection | Rule: low power + wind below cut-in speed OR alarm codes | Boolean flag |
| Wake Effect Detection | Spatial neighbor analysis + correlated low-power periods | Boolean flag |
| Icing Detection | Rule: low power + temperature near 0C + no alarm | Boolean flag |
| Stuck Sensor Detection | Zero variance across rolling 6h window | Boolean flag per sensor |
| Fault Classification | Gradient boosted classifier (or LLM-assisted) | fault_type enum |

### 8.4 LLM Integration

```
User Query
    |
LangChain Agent
    |
Tools: get_scada_summary, get_fault_score, get_alarm_history,
       get_weather_forecast, get_crew_availability, compute_schedule
    |
LLM Call (with structured output / Pydantic validation)
    |
Trace Record stored
    |
API Response
```

---

## 9. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Backend | Python + FastAPI | Mandatory; fast API development |
| Containerization | Docker + Docker Compose | Mandatory; single-command deployment |
| LLM | OpenAI GPT-4o-mini / Ollama / Gemini / Claude | Per hackathon options |
| ML / Analytics | scikit-learn, pandas, numpy | Proven, fast for tabular data |
| LLM Orchestration | LangChain | Tool calling, tracing, structured output |
| Database | PostgreSQL (Docker) | Relational + JSON support |
| Frontend | React + Recharts | Fast development, good charts |
| Testing | pytest | Unit + integration tests |
| Version Control | GitHub | Hourly commits |

---

## 10. Agile Sprint Plan (Hackathon Timeline)

Total Duration: 1 Day (~8 hours of active build time)
Methodology: Condensed Agile with 2-hour sprints + standup sync

### Pre-Hackathon Preparation (Day Before)

| Task | Owner | Duration |
|---|---|---|
| Pull/test LLM API key or Ollama model | AI Engineer | 30 min |
| Set up GitHub repo with branch structure | Team Lead | 20 min |
| Review Participant Guide and agree on scope | All | 30 min |
| Set up Docker base images | Backend | 20 min |
| Design DB schema draft | Backend + Team Lead | 20 min |

### Sprint 0 -- Setup and Foundation (Hour 0-1)
Goal: Running skeleton with Docker, DB, and basic API

| Task | Owner | Done When |
|---|---|---|
| Initialize FastAPI project + Docker Compose | Backend | docker compose up starts API |
| Set up PostgreSQL container + run migrations | Backend | Tables created |
| Create data loader (CSV to DB) for all 4 files | Backend | Loader ingests sample data |
| Write validation script (6 checks) | Backend + AI | Script runs, outputs pass/fail |
| Init React project + basic layout | Frontend | Page loads in browser |
| Git commit | All | Commit pushed |

### Sprint 1 -- Core AI Pipeline (Hour 1-3)
Goal: Fault detection and LLM integration working

| Task | Owner | Done When |
|---|---|---|
| Feature engineering from SCADA data | AI Engineer | Feature matrix generated |
| Implement anomaly scoring (Isolation Forest) | AI Engineer | Scores per turbine |
| Implement rule-based classifiers (curtailment, icing, wake, stuck sensor) | AI Engineer | Edge cases flagged |
| Implement LLM tool calls with LangChain | AI Engineer | LLM returns structured JSON |
| Implement Trace Logger | Backend | /trace/{run_id} returns data |
| POST /analyze endpoint fully wired | Backend | Returns valid response schema |
| Git commit | All | Commit pushed |

### Sprint 2 -- Scheduling and Replan (Hour 3-5)
Goal: Maintenance scheduler + late data drop handling

| Task | Owner | Done When |
|---|---|---|
| Implement constraint-based maintenance scheduler | AI/Backend | Valid schedule produced |
| Apply Annex A fault and service policy rules | AI Engineer | Policy constraints honored |
| Implement POST /replan endpoint | Backend | Re-plan triggered, diff shown |
| Build fleet health status grid (UI) | Frontend | 25 turbines shown with status |
| Build maintenance calendar view (UI) | Frontend | Schedule displayed |
| Wire UI to API | Frontend | Real data shown in dashboard |
| Git commit | All | Commit pushed |

### Sprint 3 -- Evaluation and Polish (Hour 5-7)
Goal: Evaluation set, tests, documentation

| Task | Owner | Done When |
|---|---|---|
| Build evaluation set (20+ cases) | AI Engineer | Cases file committed |
| Run evaluation, capture results | AI Engineer | Report generated |
| Compare 2 configurations | AI Engineer | Numbers documented |
| Write unit tests for key functions | Backend | pytest passes |
| Add MOCK_LLM=true mode | Backend | Env var tested |
| Write README (architecture, setup, curl examples, assumptions) | Team Lead | README complete |
| Add 3 sample trace records | Backend | In submission |
| Write AI-usage disclosure + team contribution statement | All | Document in repo |
| Git commit | All | Commit pushed |

### Sprint 4 -- Demo Prep and Final (Hour 7-8)
Goal: Polished, end-to-end demo ready

| Task | Owner | Done When |
|---|---|---|
| Final docker compose up dry run | Backend | Zero errors |
| End-to-end demo run: load, validate, analyze, schedule, replan | Team Lead | Full flow works |
| Prepare demo talking points (each member owns their component) | All | Notes ready |
| Tag Git commit as "final" | Team Lead | Tag pushed |
| Final check: deliverables checklist | Team Lead | All boxes ticked |

---

## 11. Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-001 | LLM API rate limit or timeout during demo | Medium | High | Implement MOCK_LLM=true fallback; cache responses | AI Engineer |
| R-002 | Docker Compose fails on judge machine | Low | High | Test on clean machine pre-demo; pin all image versions | Backend |
| R-003 | ML model poor accuracy on unseen data | Medium | High | Prioritize rule-based classifiers as fallback; validate early | AI Engineer |
| R-004 | Data validation script false-positives | Low | Medium | Test script against all provided data; soft-fail with warnings | Backend |
| R-005 | Time overrun on AI pipeline | Medium | Medium | Timebox to Sprint 1 deadline; ship simpler model if needed | Team Lead |
| R-006 | Frontend not integrated with API | Low | Medium | Integrate real API in Sprint 2, not Sprint 3 | Frontend |
| R-007 | Late data drop breaks scheduler | Low | High | Build replan as idempotent operation; test with mock late data | Backend |
| R-008 | Team member falls behind | Low | Medium | Cross-training during pre-hackathon; pair programming option | Team Lead |

---

## 12. Deliverables Checklist

| # | Deliverable | Owner | Due |
|---|---|---|---|
| D-01 | Git repository, tagged "final", with README | Team Lead | End of day |
| D-02 | docker compose up starts API, UI, and data stores | Backend | Sprint 0 |
| D-03 | Data validation script + output | Backend | Sprint 0 |
| D-04 | CSV loader (CLI + admin endpoint) | Backend | Sprint 0 |
| D-05 | ML fault detection models with tests | AI Engineer | Sprint 1 |
| D-06 | /analyze, /trace, /replan, /load, /health endpoints | Backend | Sprint 2 |
| D-07 | Maintenance schedule (constraint-based) | AI/Backend | Sprint 2 |
| D-08 | React dashboard (fleet health + schedule calendar) | Frontend | Sprint 2 |
| D-09 | Evaluation set (20+ cases) + report | AI Engineer | Sprint 3 |
| D-10 | 3 sample trace records | Backend | Sprint 3 |
| D-11 | Data card for generated data | AI Engineer | Sprint 3 |
| D-12 | AI-usage disclosure | All | Sprint 4 |
| D-13 | Team contribution statement | All | Sprint 4 |
| D-14 | Signed declaration of original work | All | Sprint 4 |

---

## 13. Evaluation Alignment

### HCLTech Scoring Matrix Alignment

| Parameter | Weight | Our Target Actions |
|---|---|---|
| Problem and Relevance | 10% | Clear diagnosis + scheduling problem decomposition |
| Backend (Java / Full-stack) | 20% | FastAPI, edge cases, validation, clean code |
| Frontend and UX | 10% | Fleet health map, calendar, real-time data |
| Cloud Usage and Architecture | 20% | Docker Compose, LLM API, layered architecture |
| Deployment and DevOps | 15% | Single command deploy, health endpoint, hourly commits |
| Code Quality and Maintainability | 10% | pytest, typed Python, no debug prints |
| Functionality and MVP Completeness | 10% | All mandatory endpoints pass live judge tests |
| Innovation and Creativity | 5% | Trace audit, multi-config eval, MOCK_LLM mode |

### HCLTech Individual Evaluation Criteria

| Criterion | Our Approach |
|---|---|
| Problem-solving and design thinking | This project plan + SRS; clear problem framing; trade-off decisions documented |
| Working solution and code quality | End-to-end demo flow; clean Git history; pytest suite; edge case handling |
| Individual ownership | RACI matrix; team contribution statement; each member defends their component |
| AI fluency | LangChain tool-calling; structured output validation; evaluation comparison; MOCK_LLM mode |
| Learning agility and communication | Late data drop re-planning; honest evaluation results; limitations documented |

---

*Document prepared by: Team Lead*
*Version: 1.0 | Date: October 11, 2026*
*HCLTech Future Ready AI Engineer Hackathon*
