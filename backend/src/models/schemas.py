from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# ─── SECTION 6.1 SCHEMAS ───────────────────────────────────

class TurbineFinding(BaseModel):
    turbine_id: str
    verdict: str
    excluded_causes: List[str]
    downtime_risk_30d: float
    evidence_refs: List[str]

class ServiceWindow(BaseModel):
    start: str
    end: str

class Recommendation(BaseModel):
    turbine_id: str
    action: str
    window: ServiceWindow
    crew: str
    crane: str
    expected_energy_loss_mwh: float
    estimated_impact: str
    rationale: str
    confidence: str # "high" | "medium" | "low"
    requires_approval: bool

class AnalyzeRequest(BaseModel):
    question: Optional[str] = "Plan service for the riskiest turbines"
    turbine_id: Optional[Union[str, List[str]]] = None
    horizon_days: Optional[int] = 30
    as_of: Optional[str] = None
    include_schedule: Optional[bool] = True
    mock_llm: Optional[bool] = False

class AnalyzeResponse(BaseModel):
    run_id: str
    answer_type: str # "plan" | "diagnosis" | "not_a_fault" | "insufficient_data" | "clarification_needed" | "refused"
    summary: str
    turbine_findings: List[TurbineFinding]
    recommendations: List[Recommendation]
    assumptions: List[str]
    limitations: List[str]

# ─── ANNEX C: TRACE RECORD SCHEMA ─────────────────────────

class TraceStep(BaseModel):
    agent: str
    tool: str
    input: Optional[Dict[str, Any]] = None
    output: Optional[Any] = None

class TraceRecord(BaseModel):
    run_id: str
    question: str
    steps: List[TraceStep]
    llm_calls: int
    tokens: int
    approval_status: str # "pending" | "approved" | "rejected"
    model_used: Optional[str] = "gemini-3.5-flash-lite (deterministic grounded)"
    created_at: Optional[str] = None
    final_answer: Optional[Dict[str, Any]] = None

# ─── DATA INGESTION & VALIDATION SCHEMAS ──────────────────

class CheckResult(BaseModel):
    id: str
    name: str
    category: str
    status: str # "pass" | "warn" | "fail"
    details: str
    metric: str

class ValidationReport(BaseModel):
    passed_all: bool
    checks_run: int
    passed_count: int
    warning_count: int
    failure_count: int
    checks: List[CheckResult]
    traps_detected: List[Dict[str, Any]]
    run_at: str

class IngestResponse(BaseModel):
    status: str # "success" | "error"
    table_name: str
    rows_loaded: int
    rows_rejected: int
    validation_results: Dict[str, Any]
    message: str

# ─── RE-PLANNING SCHEMAS ─────────────────────────────────

class ReplanDiffItem(BaseModel):
    turbine_id: str
    change_type: str # "rescheduled" | "cancelled" | "added"
    old_window: Optional[Dict[str, Any]] = None
    new_window: Optional[Dict[str, Any]] = None
    reason: str

class ReplanResponse(BaseModel):
    plan_id: str
    status: str
    diff: List[ReplanDiffItem]
    updated_plan: List[Dict[str, Any]]
    summary: str
    created_at: str

# ─── HEALTH SCHEMA ────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str # "ok" | "degraded"
    api: str
    db: str
    solver: str
    llm: str
    turbines_loaded: int
    last_load: str
    active_model: str
    vector_store: Optional[str] = "unknown"
    vector_docs: Optional[int] = 0

# ─── FLEET & TURBINE DOMAIN SCHEMAS ───────────────────────

class TurbineSummary(BaseModel):
    turbine_id: str
    model: str
    rated_power_kw: float
    status: str # "healthy" | "degraded" | "fault_suspected" | "curtailed" | "icing" | "wake_affected"
    downtime_risk_30d: float
    primary_issue: str
    current_power_kw: float
    current_wind_ms: float
    gearbox_temp_c: float
    generator_temp_c: float
    vibration_mm_s: float
    efficiency_pct: float

class TurbineTelemetryPoint(BaseModel):
    ts: str
    wind_ms: float
    actual_kw: float
    expected_kw: float
    gearbox_temp_c: float
    generator_temp_c: float
    vibration_mm_s: float

class TurbineDetailResponse(BaseModel):
    turbine: TurbineSummary
    telemetry: List[TurbineTelemetryPoint]
    alarms: List[Dict[str, Any]]
    diagnostics: Dict[str, Any]

# ─── BENCHMARK SCHEMAS ────────────────────────────────────

class BenchmarkCase(BaseModel):
    id: str
    category: str
    input: str
    expected_verdict: str
    actual_verdict: str
    score: float
    status: str # "pass" | "fail"
    latency_ms: float
    explanation: str

class BenchmarkReport(BaseModel):
    total_cases: int
    passed_cases: int
    accuracy_pct: float
    cases: List[BenchmarkCase]
    dual_configuration_comparison: Dict[str, Any]

# ─── AUTH SCHEMAS ─────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "Site Manager"

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

class AuthResponse(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    token: str
