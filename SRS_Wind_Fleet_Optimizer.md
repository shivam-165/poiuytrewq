# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Wind Fleet Health and Maintenance Window Optimizer

---

| Field | Details |
|---|---|
| **Document ID** | SRS-WFHMO-001 |
| **Project Name** | Wind Fleet Health and Maintenance Window Optimizer |
| **Client / Organizer** | HCLTech |
| **Version** | 1.0 |
| **Status** | Draft for Stakeholder Review |
| **Date** | October 11, 2026 |
| **Prepared By** | Team Lead / Project Manager |
| **Classification** | Internal - Stakeholder Submission |

---

### Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | Oct 11, 2026 | Team Lead | Initial draft |
| 1.0 | Oct 11, 2026 | Team Lead | Complete SRS for stakeholder submission |

---

### Approval Record

| Role | Name | Signature | Date |
|---|---|---|---|
| Project Manager | Team Lead | Pending | Oct 11, 2026 |
| Technical Lead | AI/ML Engineer | Pending | Oct 11, 2026 |
| Stakeholder / Judge | HCLTech Representative | Pending | Oct 11, 2026 |

---

## Table of Contents

1. Introduction
2. Overall System Description
3. Stakeholders and User Roles
4. Scope and Boundaries
5. Assumptions, Constraints, and Dependencies
6. Functional Requirements
7. Non-Functional Requirements
8. Data Requirements
9. External Interface Requirements
10. Security Requirements
11. Architecture Overview
12. Testing and Verification
13. Deployment, Operations, and Support
14. Risks, Issues, and Open Questions
15. Project Delivery and Governance
16. Requirements Traceability Matrix
17. Appendices

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the complete functional and non-functional requirements for the Wind Fleet Health and Maintenance Window Optimizer. It is submitted to HCLTech stakeholders as the contractual requirements baseline for the development team.

### 1.2 Intended Audience

| Audience | Usage |
|---|---|
| HCLTech Judges / Evaluators | Verification of system compliance |
| Development Team | Implementation reference |
| Team Lead / Project Manager | Scope and delivery governance |
| Wind Farm Operator (persona) | Business requirements validation |

### 1.3 Glossary

| Term | Definition |
|---|---|
| SCADA | Supervisory Control and Data Acquisition -- turbine sensor data |
| LLM | Large Language Model -- used for natural language reasoning |
| Curtailment | Deliberate power reduction; not a fault |
| Wake Effect | Reduced wind behind an upstream turbine affecting downstream output |
| Icing | Ice on blades causing reduced power at near-zero temperatures |
| Stuck Sensor | Sensor whose value does not change over time |
| RAG | Retrieval-Augmented Generation |
| NFR | Non-Functional Requirement |
| FR | Functional Requirement |

### 1.4 References

- HCLTech Participant Guide: Wind Fleet Health and Maintenance Window Optimizer
- HCLTech Company Project SRS Guide v1.0
- ISO/IEC/IEEE 29148:2018 -- Requirements Engineering
- HCLTech Hackathon Evaluation Criteria (Scoring Matrix)

---

## 2. Overall System Description

### 2.1 Business Context

A wind farm operator manages 25 wind turbines. Each turbine records five SCADA metrics every 10 minutes: wind speed, power output, rotor speed, gearbox temperature, and generator temperature.

Two operational challenges exist:

**Challenge 1 -- Health Diagnosis:** Some turbines underperform due to curtailment, icing, or wake effects. These must not be confused with genuine faults, which would waste maintenance resources.

**Challenge 2 -- Maintenance Planning:** Service needs a crew and a crane. The best window is a calm day when crew and crane are free. Coordinating these constraints manually is error-prone.

### 2.2 Product Vision

An AI-powered decision-support platform that:
- Accurately diagnoses turbine health separating faults from environmental causes
- Generates an explainable, executable maintenance schedule
- Automatically re-plans when late operational data (storm warnings, crane changes) arrives
- Provides complete audit trails of AI reasoning for every recommendation

### 2.3 System Context

The system is a standalone analytical platform. It receives CSV data files (SCADA, alarms, forecasts, crew calendars), processes them through a multi-layered AI pipeline, and exposes results via REST API and a web dashboard. It does NOT connect to real-time turbine networks.

---

## 3. Stakeholders and User Roles

### 3.1 Stakeholder Register

| Stakeholder | Interest | Influence |
|---|---|---|
| HCLTech Judges | Evaluate technical quality and business relevance | High |
| Wind Farm Operator | Operational decisions; maintenance planning | High |
| Maintenance Crew Manager | Crew scheduling and resource allocation | Medium |
| Data Administrator | Loading and managing input data files | Medium |
| Development Team | Building and testing the system | High |

### 3.2 User Roles

| Role | Description | Primary Actions |
|---|---|---|
| Wind Farm Operator | Reviews turbine health and maintenance plans | View dashboard, call POST /analyze, POST /replan |
| Data Administrator | Loads CSV data files into the system | Run loader CLI, call POST /load |
| Maintenance Crew Manager | Views crew assignments in the schedule | View dashboard calendar |
| Judge / Evaluator | Runs live API tests to verify compliance | Call all endpoints with test data |
| System (AI Engine) | Internal automated actor performing analysis | Executes ML pipeline, calls LLM |

---

## 4. Scope and Boundaries

### 4.1 In Scope

- Ingestion and validation of four CSV data sources (SCADA, alarms, forecast, crew calendar)
- Turbine health diagnosis: real faults, curtailment, icing, wake effects, stuck sensors
- LLM-generated explainable recommendations with evidence references
- Constraint-based maintenance scheduling (crew, crane, weather)
- Late data drop re-planning with change explanation
- REST API exposing all mandatory endpoints per the defined contract
- Web dashboard for fleet health and schedule visualization
- Evaluation framework with 20+ test cases and configuration comparison
- Docker Compose deployment and unit tests

### 4.2 Out of Scope

- Real-time SCADA data streaming or live turbine connectivity
- Financial cost optimization beyond downtime minimization
- Mobile application
- User authentication and authorization
- Multi-farm support (single farm of 25 turbines only)
- Integration with external ERP or CMMS systems

---

## 5. Assumptions, Constraints, and Dependencies

### 5.1 Assumptions

| ID | Assumption | Owner |
|---|---|---|
| A-001 | Input CSV files conform to Annex B schema when loaded by judges | Data Admin |
| A-002 | LLM API is accessible and responsive during demo | AI Engineer |
| A-003 | Weather forecast accuracy is sufficient for 14-day scheduling window | Operator |
| A-004 | Crew calendar data is up-to-date at time of plan generation | Crew Manager |
| A-005 | Docker Compose environment on judge machine has internet access for LLM API | Backend |
| A-006 | Synthetic data contains representative real fault signatures | AI Engineer |

### 5.2 Constraints

| ID | Constraint | Impact |
|---|---|---|
| C-001 | System must be built within 1 hackathon day (8 hours) | Limits feature scope; MVP focus |
| C-002 | Technology stack is partially mandated (Python/FastAPI, Docker, one of 4 LLM options) | No choice of primary backend language |
| C-003 | No real wind farm data may be used anywhere in the system | All data must be synthetic |
| C-004 | All mandatory API endpoints must conform to the defined contract schema | Response schema is fixed |
| C-005 | System must start via single docker compose up command | Deployment complexity constrained |

### 5.3 Dependencies

| ID | Dependency | Type | Risk if Unavailable |
|---|---|---|---|
| D-001 | LLM API (OpenAI / Gemini / Claude / Ollama) | External API | Use MOCK_LLM=true fallback |
| D-002 | Provided synthetic data pack (4 CSV files) | Data | Cannot test real edge cases |
| D-003 | Docker and Docker Compose on judge machine | Infrastructure | System cannot start |
| D-004 | Python 3.10+ runtime | Infrastructure | Build failure |

---

## 6. Functional Requirements

### 6.1 Data Ingestion and Validation

**FR-DATA-001 -- Data Loader** (Must Have)
The system shall provide a CLI script and a POST /load endpoint accepting CSV files matching Annex B schema (scada_10min, alarms, forecast, crew_calendar) and persisting them to the database.

**FR-DATA-002 -- Validation Script** (Must Have)
The validation script shall check: (a) all SCADA turbine_ids exist in turbine master list; (b) no negative power_kw; (c) rotor speed within physical limits; (d) timestamps regular at 10-minute intervals with gaps reported; (e) single time zone; (f) alarm end_time after start_time; (g) no crew double-booking; (h) row counts match data card.

**FR-DATA-003 -- Validation Output** (Must Have)
Validation output shall be displayed in the demo interface and logged to a persistent file.

**FR-DATA-004 -- Edge Case Detection** (Must Have)
The system shall detect and flag: curtailment periods, stuck temperature sensors (zero variance over 6h rolling window), icing events (low power + temp near 0C + no alarm), wake effect turbines, communication outage gaps, and forecast version changes.

**FR-DATA-005 -- Late Data Drop Loader** (Must Have)
The system shall accept an updated forecast or crew calendar at any time via POST /load, triggering automatic re-planning.

### 6.2 Health Diagnosis

**FR-DIAG-001 -- Turbine Health Classification** (Must Have)
The system shall classify each turbine's health as one of: healthy, degraded, fault_suspected, curtailed, icing, wake_affected.

**FR-DIAG-002 -- Fault vs. Environmental Distinction** (Must Have)
The system shall correctly distinguish genuine mechanical faults from curtailment, icing, and wake effects. Turbines classified as curtailed, icing, or wake_affected shall not receive maintenance recommendations.

**FR-DIAG-003 -- Stuck Sensor Detection** (Must Have)
The system shall detect stuck sensors by identifying zero variance across a configurable rolling time window (default 6 hours). Stuck sensor flags shall be cited in evidence_refs.

**FR-DIAG-004 -- Evidence References** (Must Have)
Each diagnosis shall reference specific data rows as evidence_refs formatted as: scada:{turbine_id}:{ISO8601_timestamp} or alarm:{alarm_id}.

**FR-DIAG-005 -- Confidence Score** (Must Have)
Each diagnosis shall include a confidence score (0.0-1.0) and a boolean requires_approval flag. Confidence below 0.6 shall set requires_approval to true.

### 6.3 Maintenance Scheduling

**FR-SCHED-001 -- Schedule Generation** (Must Have)
The system shall generate a prioritized maintenance schedule for all turbines classified as fault_suspected or degraded, ordered by fault severity and estimated revenue impact.

**FR-SCHED-002 -- Constraint Compliance** (Must Have)
The schedule shall satisfy all hard constraints: no crew double-booking, crane available on scheduled date, no service during storm/high-wind periods, unnecessary stops minimized.

**FR-SCHED-003 -- Annex A Policy** (Must Have)
The system shall apply the fault classification and service urgency rules from Annex A. High-severity faults shall be scheduled within 7 days of detection.

**FR-SCHED-004 -- Schedule Output Format** (Must Have)
Each window shall include: turbine_id, planned_date, crew_id, crane_required (boolean), estimated_duration_hrs, justification, priority_rank.

**FR-SCHED-005 -- Re-planning on Late Data** (Must Have)
When updated forecast or crew calendar is loaded, the system shall automatically re-run the scheduler and return a diff explaining changed windows.

### 6.4 API Contract

**FR-API-001 -- POST /analyze** (Must Have)
Shall accept JSON with turbine_ids (array or "all"), include_schedule (bool), mock_llm (bool). Returns recommendation array + service plan.

**FR-API-002 -- Recommendation Schema** (Must Have)
Each recommendation shall include: action, rationale, evidence_refs, confidence, estimated_impact, requires_approval, fault_type, turbine_id.

**FR-API-003 -- Response Metadata** (Must Have)
POST /analyze response shall include top-level assumptions and limitations arrays.

**FR-API-004 -- GET /trace/{run_id}** (Must Have)
Returns full reasoning trace: run_id, query, model_used, steps (tool calls and LLM calls with inputs/outputs), final_answer, created_at.

**FR-API-005 -- POST /load** (Must Have)
Accepts CSV file uploads for any of the four data sources. Returns validation results.

**FR-API-006 -- GET /health** (Should Have)
Returns system status including DB connectivity, LLM availability, last data load timestamp.

**FR-API-007 -- POST /replan** (Must Have)
Triggers re-planning run. Returns updated plan and diff from previous plan.

### 6.5 Evaluation Framework

**FR-EVAL-001 -- Evaluation Set** (Must Have)
At least 20 test cases, each with: input (turbine ID or query), expected output, actual system output, and score.

**FR-EVAL-002 -- Evaluation Coverage** (Must Have)
Evaluation shall include: 3+ true-fault turbines, 3+ healthy-but-suspicious (curtailment/icing/wake), 2+ stuck-sensor cases, 2+ planning with changed constraints, 2+ what-if questions.

**FR-EVAL-003 -- Evaluation Report** (Must Have)
Report shall state: scoring method, overall accuracy, per-case results, identified failure modes.

**FR-EVAL-004 -- Configuration Comparison** (Should Have)
Compare at least two system configurations (e.g., two LLM models) with quantitative results justifying the final choice.

### 6.6 UI Dashboard

**FR-UI-001 -- Fleet Health Overview** (Must Have)
All 25 turbines displayed in a status grid, color-coded by health: green (healthy), amber (degraded), red (fault_suspected), grey (data unavailable), blue (curtailed/environmental).

**FR-UI-002 -- Turbine Detail View** (Must Have)
Selecting a turbine shows: health classification, confidence score, fault type, evidence references, LLM-generated rationale.

**FR-UI-003 -- Maintenance Schedule View** (Must Have)
Active maintenance plan displayed as calendar or Gantt view: turbine ID, planned date, crew assignment, estimated duration.

**FR-UI-004 -- Validation Output Panel** (Should Have)
Dashboard displays validation script output with pass/fail status for each check.

**FR-UI-005 -- Re-plan Trigger and Diff View** (Should Have)
Button to trigger POST /replan. Changed windows highlighted; change explanation displayed.

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID | Requirement | Target | Verification |
|---|---|---|---|
| NFR-PERF-001 | POST /analyze response time (25 turbines) | <= 30 seconds | Performance test |
| NFR-PERF-002 | POST /replan response time | <= 60 seconds | Performance test |
| NFR-PERF-003 | Validation script execution time | <= 10 seconds | Performance test |
| NFR-PERF-004 | Dashboard initial page load | <= 3 seconds | Browser measurement |

### 7.2 Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-REL-001 | System operational during 30-minute judge evaluation | 100% uptime |
| NFR-REL-002 | MOCK_LLM=true mode disables real LLM calls; deterministic responses | Functional |
| NFR-REL-003 | All API endpoints return structured JSON errors for invalid inputs | No unhandled exceptions |

### 7.3 Availability and Deployment

| ID | Requirement | Target |
|---|---|---|
| NFR-AVAIL-001 | docker compose up starts all services with zero manual steps | Single command |
| NFR-AVAIL-002 | GET /health responds within 2 seconds | < 2 seconds |

### 7.4 Maintainability

| ID | Requirement | Target |
|---|---|---|
| NFR-MAINT-001 | PEP 8 style; no debug prints in production; docstrings | Code inspection pass |
| NFR-MAINT-002 | pytest coverage for key functions | >= 60% coverage |
| NFR-MAINT-003 | Hourly Git commits; final submission tagged "final" | Git log verified |
| NFR-MAINT-004 | README with architecture, setup, curl examples, assumptions, limitations | Inspection pass |

### 7.5 Security

| ID | Requirement | Target |
|---|---|---|
| NFR-SEC-001 | No real wind farm or personal data in system | Inspection verified |
| NFR-SEC-002 | LLM API keys in environment variables; not in Git | .gitignore + git history check |
| NFR-SEC-003 | Input validation and sanitization on all endpoints | Test with malformed inputs |
| NFR-SEC-004 | Error responses do not expose internal stack traces | Inspection pass |

### 7.6 Portability

| ID | Requirement | Target |
|---|---|---|
| NFR-PORT-001 | All services run in Docker; image versions pinned | docker compose up on any machine |
| NFR-PORT-002 | LLM provider switch requires only environment variable change | Test with two providers |

---

## 8. Data Requirements

### 8.1 Input Data Sources

| File | Description | Key Columns |
|---|---|---|
| scada_10min.csv | 10-minute sensor readings per turbine | turbine_id, timestamp, wind_speed_ms, power_kw, rotor_rpm, gearbox_temp_c, generator_temp_c |
| alarms.csv | Fault and alert events | alarm_id, turbine_id, start_time, end_time, alarm_code, severity |
| forecast.csv | 30-day weather forecast | timestamp, wind_speed_ms, temperature_c, precipitation_mm, is_storm_window |
| crew_calendar.csv | Crew and crane availability | crew_id, date, is_available, crane_available |

### 8.2 Synthetic Data Requirements

Team-generated data must include: 20+ turbines, 4+ months of SCADA data, 3+ turbines with developing faults, 2+ curtailment turbines, 2+ wake-affected turbines. A data card (Annex D format) must document generation methodology.

### 8.3 Data Constraints

- No negative power_kw values
- Rotor speed within physical limits
- All SCADA timestamps in single time zone
- Alarm end_time after start_time
- No crew double-booking in crew_calendar

---

## 9. External Interface Requirements

### 9.1 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /analyze | POST | Full fleet or targeted turbine analysis |
| /trace/{run_id} | GET | LLM reasoning trace for a run |
| /load | POST | Load CSV data files |
| /replan | POST | Trigger maintenance schedule re-planning |
| /health | GET | System health status |
| /plan | GET | Retrieve current active maintenance plan |

All responses use HTTP status codes: 200 (success), 400 (bad request), 404 (not found), 422 (validation error), 500 (server error).

### 9.2 LLM Interface

| Provider | Model | Embedding Model |
|---|---|---|
| OpenAI | gpt-4o-mini | text-embedding-3-small |
| Google Gemini | gemini-1.5-flash | text-embedding-004 |
| Anthropic Claude | claude-3-haiku | (use OpenAI embeddings) |
| Ollama (local) | mistral / llama3 | nomic-embed-text |

### 9.3 File Interface

CSV loader accepts multipart/form-data file uploads. CLI loader accepts file paths as arguments. Accepted file types: .csv only.

---

## 10. Security Requirements

**SEC-001** -- No real wind farm, personal, or proprietary data shall be present anywhere in the system.

**SEC-002** -- LLM API keys shall be stored in environment variables. The .gitignore file shall exclude .env files. No keys shall be committed to Git history.

**SEC-003** -- File uploads shall be validated for file type and schema before processing. SQL shall use parameterized queries.

**SEC-004** -- Error responses shall not expose internal stack traces, database queries, or system paths.

---

## 11. Architecture Overview

### 11.1 Layered Architecture

**Layer 1 -- Data Layer:** CSV Loader, Validation Engine, PostgreSQL database.

**Layer 2 -- AI / Analytics Layer:** Feature Engineering, ML Anomaly Detector (Isolation Forest), Rule-Based Classifier (curtailment/icing/wake/stuck sensor), LLM Reasoning Engine (LangChain + chosen LLM), Maintenance Scheduler (constraint-based), Trace Logger.

**Layer 3 -- API Layer:** FastAPI application with Pydantic request/response models.

**Layer 4 -- Presentation Layer:** React application with Recharts for data visualization.

### 11.2 Deployment Architecture (Docker Compose Services)

| Service | Description | Port |
|---|---|---|
| api | FastAPI backend | 8000 |
| db | PostgreSQL 15 | 5432 (internal) |
| frontend | React app via nginx | 3000 |
| ollama (optional) | Local LLM server | 11434 |

### 11.3 Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| LLM for reasoning | LangChain + API LLM | Better structured output vs. local latency |
| Anomaly detection | Isolation Forest + rules | Explainable and fast vs. deep learning complexity |
| Scheduler | Greedy constraint-based | Fast for hackathon vs. optimal solver overhead |
| Database | PostgreSQL | Full SQL + JSON support |
| Frontend | React + Recharts | Rich charts and fast development |

---

## 12. Testing and Verification

### 12.1 Testing Strategy

| Type | Scope | Owner |
|---|---|---|
| Unit tests | Validation logic, ML features, scheduler constraints | Backend / AI Engineer |
| Integration tests | API endpoints, DB persistence | Backend |
| End-to-end test | Full flow: load, validate, analyze, schedule, replan | Team Lead |
| Evaluation test | 20+ cases against expected outputs | AI Engineer |
| Performance test | POST /analyze response time under full load | Backend |
| Demo dry run | Full 30-minute judge scenario rehearsal | All |

### 12.2 Acceptance Criteria

The system is accepted when:
- All "Must Have" functional requirements pass verification
- POST /analyze returns valid schema for all 25 turbines
- POST /replan produces updated plan with diff after late data load
- Validation script passes all checks on clean data
- docker compose up starts all services without errors
- 20+ evaluation cases present with documented results
- No unresolved critical errors in API

### 12.3 Requirements Verification Matrix

| Req ID | Summary | Method | Expected Evidence | Status |
|---|---|---|---|---|
| FR-DATA-001 | Data Loader | Test | POST /load returns 200; data in DB | Planned |
| FR-DATA-002 | Validation Script | Test | Script shows pass/fail for all checks | Planned |
| FR-DIAG-001 | Health Classification | Test | Each turbine has valid health_status | Planned |
| FR-DIAG-002 | Fault vs. Environmental | Test | Curtailed turbines not in maintenance plan | Planned |
| FR-DIAG-003 | Stuck Sensor Detection | Test | Stuck sensor flagged in diagnosis | Planned |
| FR-SCHED-001 | Schedule Generation | Test | Schedule JSON with prioritized windows | Planned |
| FR-SCHED-002 | Constraint Compliance | Test | No double-booking; no storm windows | Planned |
| FR-SCHED-005 | Re-planning | Test | POST /replan returns updated plan with diff | Planned |
| FR-API-001 | POST /analyze | Test | 200 response with full recommendation array | Planned |
| FR-API-004 | GET /trace/{run_id} | Test | Trace returned with steps array | Planned |
| FR-EVAL-001 | Evaluation Set | Inspection | eval_cases.json with 20+ cases in repo | Planned |
| NFR-PERF-001 | Analysis response time | Performance test | Response within 30 seconds | Planned |
| NFR-AVAIL-001 | docker compose up | Test | All services healthy after startup | Planned |
| NFR-SEC-002 | API key management | Inspection | No keys in Git history | Planned |

---

## 13. Deployment, Operations, and Support

### 13.1 Deployment

- All services deployed via Docker Compose
- Environment variables managed via .env file (excluded from Git)
- Database migrations run automatically on container startup

### 13.2 CI/CD and Release

For the hackathon context:
- Git commits made at minimum hourly during the build day
- Final release tagged as "final" in Git

### 13.3 Monitoring

- GET /health provides real-time service status
- All errors logged to stdout (captured by Docker logs)
- LLM call failures logged with fallback behavior noted

### 13.4 Maintenance

- README provides complete setup and troubleshooting instructions
- MOCK_LLM=true mode allows demo continuity if LLM API is unavailable
- Docker image versions pinned for reproducibility

---

## 14. Risks, Issues, and Open Questions

### 14.1 Risk Register

| ID | Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|---|
| R-001 | LLM API unavailable during demo | High | Medium | MOCK_LLM=true fallback | AI Engineer |
| R-002 | ML model poor accuracy on judge data | High | Medium | Rule-based fallback; conservative classifications | AI Engineer |
| R-003 | Docker fails on judge machine | High | Low | Pin image versions; test on clean environment | Backend |
| R-004 | Time overrun on AI pipeline | Medium | Medium | Timebox per sprint; simpler model if needed | Team Lead |
| R-005 | Validation script false positives | Medium | Low | Soft-fail mode with warnings; test against all data | Backend |

### 14.2 Open Questions

| ID | Question | Owner | Status |
|---|---|---|---|
| Q-001 | Which LLM provider will be selected for final submission? | AI Engineer | Open |
| Q-002 | What is the physical rotor speed limit for validation? | AI Engineer | Open |
| Q-003 | Will judges supply their own data or use the provided pack? | Team Lead | Open |

---

## 15. Project Delivery and Governance

### 15.1 Deliverables

| # | Deliverable | Owner | Due | Acceptance Criteria |
|---|---|---|---|---|
| D-01 | Git repo tagged "final" with README | Team Lead | End of day | Repo accessible; tagged; README complete |
| D-02 | docker compose up launches all services | Backend | Sprint 0 | No errors; all services healthy |
| D-03 | Validation script with output | Backend | Sprint 0 | All checks implemented and passing |
| D-04 | CSV data loader (CLI + API) | Backend | Sprint 0 | Judges can load test CSV files |
| D-05 | ML fault detection with unit tests | AI Engineer | Sprint 1 | Tests pass; scores generated for all turbines |
| D-06 | All mandatory API endpoints | Backend | Sprint 2 | Endpoints return valid schema |
| D-07 | Constraint-based maintenance schedule | AI/Backend | Sprint 2 | Valid schedule respecting all constraints |
| D-08 | React dashboard | Frontend | Sprint 2 | Fleet health map and calendar functional |
| D-09 | Evaluation set (20+ cases) + report | AI Engineer | Sprint 3 | Cases in repo; report documents accuracy |
| D-10 | 3 sample trace records | Backend | Sprint 3 | Trace records in repo per Annex C format |
| D-11 | Data card for synthetic data | AI Engineer | Sprint 3 | Annex D format; generation scripts disclosed |
| D-12 | AI-usage disclosure | All | Sprint 4 | Document in repo |
| D-13 | Team contribution statement | All | Sprint 4 | Named contributions per member |
| D-14 | Signed declaration of original work | All | Sprint 4 | All members signed |

### 15.2 Milestones

| Phase | Key Output | Exit Condition | Time |
|---|---|---|---|
| Sprint 0 -- Foundation | Docker, DB, loader, validation | docker compose up starts; validation runs | Hour 1 |
| Sprint 1 -- AI Core | ML pipeline, LLM integration, /analyze | /analyze returns valid response | Hour 3 |
| Sprint 2 -- Scheduling + UI | Scheduler, /replan, dashboard | Schedule displayed; UI live | Hour 5 |
| Sprint 3 -- Evaluation + Docs | Eval set, tests, README | 20+ cases evaluated; docs complete | Hour 7 |
| Sprint 4 -- Demo Ready | Final dry run, Git tag | End-to-end demo passes; "final" tagged | Hour 8 |

### 15.3 Roles and Responsibilities

| Role | Requirements Ownership | Technical Decisions | Acceptance |
|---|---|---|---|
| Team Lead | SRS authorship | Architecture | Final sign-off |
| AI/ML Engineer | FR-DIAG, FR-EVAL | LLM choice, ML model | Own components |
| Backend Engineer | FR-DATA, FR-API | DB schema, Docker | Own components |
| Frontend Engineer | FR-UI | UI framework choice | Own components |

---

## 16. Requirements Traceability Matrix

| Requirement ID | Business Objective | Design Reference | Test Case | Status |
|---|---|---|---|---|
| FR-DATA-001 | OBJ-006 (API compliance) | Data Loader module | TC-DATA-001 | Planned |
| FR-DATA-002 | OBJ-005 (Validation pipeline) | Validation Engine | TC-DATA-002 | Planned |
| FR-DIAG-001 | OBJ-001 (Health diagnosis) | ML Pipeline | TC-DIAG-001 | Planned |
| FR-DIAG-002 | OBJ-001 (Health diagnosis) | Rule Classifier | TC-DIAG-002 | Planned |
| FR-DIAG-003 | OBJ-001 (Health diagnosis) | Stuck Sensor Detector | TC-DIAG-003 | Planned |
| FR-SCHED-001 | OBJ-003 (Schedule optimization) | Maintenance Scheduler | TC-SCHED-001 | Planned |
| FR-SCHED-002 | OBJ-003 (Schedule optimization) | Constraint Engine | TC-SCHED-002 | Planned |
| FR-SCHED-005 | OBJ-004 (Late data re-plan) | Re-plan module | TC-SCHED-005 | Planned |
| FR-API-001 | OBJ-006 (API compliance) | FastAPI router | TC-API-001 | Planned |
| FR-API-004 | OBJ-006 (API compliance) | Trace Logger | TC-API-004 | Planned |
| FR-EVAL-001 | OBJ-007 (Evaluation report) | Evaluation Framework | TC-EVAL-001 | Planned |
| NFR-PERF-001 | OBJ-006 (API compliance) | Async FastAPI | TC-PERF-001 | Planned |
| NFR-AVAIL-001 | OBJ-006 (API compliance) | Docker Compose | TC-AVAIL-001 | Planned |
| NFR-SEC-002 | Integrity | .env + .gitignore | TC-SEC-002 | Planned |

---

## 17. Appendices

### Appendix A -- Data Schema Reference

scada_10min.csv: turbine_id (string), timestamp (ISO 8601), wind_speed_ms (float), power_kw (float), rotor_rpm (float), gearbox_temp_c (float), generator_temp_c (float)

alarms.csv: alarm_id (string), turbine_id (string), start_time (ISO 8601), end_time (ISO 8601), alarm_code (string), severity (enum: low/medium/high/critical)

forecast.csv: timestamp (ISO 8601), wind_speed_ms (float), temperature_c (float), precipitation_mm (float), is_storm_window (boolean)

crew_calendar.csv: crew_id (string), date (YYYY-MM-DD), is_available (boolean), crane_available (boolean)

### Appendix B -- API Response Summary

POST /analyze Request: { "turbine_ids": array or "all", "include_schedule": bool, "mock_llm": bool }
POST /analyze Response: { "run_id": uuid, "recommendations": [...], "service_plan": {...}, "assumptions": [...], "limitations": [...] }
GET /trace/{run_id} Response: { "run_id": uuid, "query": string, "model_used": string, "steps": [...], "final_answer": {...}, "created_at": ISO8601 }

### Appendix C -- Evaluation Criteria Mapping

| HCLTech Parameter | Weight | SRS Coverage |
|---|---|---|
| Problem and Relevance | 10% | Sections 2, 6.1-6.3 |
| Backend (Java / Full-stack) | 20% | Sections 6.4, 9.1 |
| Frontend and UX | 10% | Section 6.6 |
| Cloud Usage and Architecture | 20% | Section 11 |
| Deployment and DevOps | 15% | Section 13, NFR-AVAIL-001 |
| Code Quality and Maintainability | 10% | NFR-MAINT-001 to 004 |
| Functionality and MVP Completeness | 10% | Section 15.2 Milestones |
| Innovation and Creativity | 5% | NFR-REL-002, FR-EVAL-004, FR-API-004 |

### Appendix D -- Approval Record

| Role | Name | Status | Date |
|---|---|---|---|
| Project Manager | Team Lead | Pending | Oct 11, 2026 |
| Technical Lead | AI/ML Engineer | Pending | Oct 11, 2026 |
| HCLTech Representative | Judge / Stakeholder | Pending | Oct 11, 2026 |

---

*Document ID: SRS-WFHMO-001 | Version: 1.0 | Date: October 11, 2026*
*HCLTech Future Ready AI Engineer Hackathon*
*Prepared in accordance with HCLTech Company Project SRS Guide and ISO/IEC/IEEE 29148:2018*
