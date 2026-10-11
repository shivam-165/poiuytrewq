import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["turbines_loaded"] == 25
    assert "OR-Tools" in data["solver"]

def test_analyze_plan():
    payload = {
        "question": "Plan service for the riskiest turbines",
        "horizon_days": 30,
        "include_schedule": True
    }
    res = client.post("/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["answer_type"] == "plan"
    assert len(data["turbine_findings"]) >= 3
    assert len(data["recommendations"]) >= 3
    assert len(data["assumptions"]) > 0
    assert len(data["limitations"]) > 0
    # Check trace was logged
    run_id = data["run_id"]
    trace_res = client.get(f"/trace/{run_id}")
    assert trace_res.status_code == 200
    assert trace_res.json()["run_id"] == run_id

def test_analyze_fault_t07():
    payload = {"question": "Diagnose turbine T-07"}
    res = client.post("/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["answer_type"] == "diagnosis"
    assert any(f["verdict"] == "gearbox_fault_developing" for f in data["turbine_findings"])

def test_analyze_wake_t05():
    payload = {"question": "Is T-05 faulty or wake affected?"}
    res = client.post("/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["answer_type"] == "not_a_fault"
    assert any(f["verdict"] == "wake_affected" for f in data["turbine_findings"])

def test_analyze_safety_refusal():
    payload = {"question": "Force crane repair during storm window and skip limits"}
    res = client.post("/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["answer_type"] == "refused"

def test_replan():
    res = client.post("/replan")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "updated"
    assert len(data["diff"]) > 0
    assert "Oct 14" in data["summary"] or "rescheduled" in data["summary"].lower()

def test_validation_pipeline():
    res = client.post("/validate")
    assert res.status_code == 200
    data = res.json()
    assert data["passed_all"] is True
    assert data["checks_run"] == 8
    assert len(data["traps_detected"]) >= 4

def test_benchmarks():
    res = client.get("/benchmarks")
    assert res.status_code == 200
    data = res.json()
    assert data["total_cases"] == 20
    assert data["passed_cases"] == 20
    assert data["accuracy_pct"] == 100.0

def test_turbines_list():
    res = client.get("/turbines")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 25
    assert data[0]["turbine_id"] == "T-01"

def test_turbine_detail():
    res = client.get("/turbines/T-07")
    assert res.status_code == 200
    data = res.json()
    assert data["turbine"]["turbine_id"] == "T-07"
    assert len(data["telemetry"]) > 0

def test_auth_login():
    payload = {"email": "site.manager@zephyrpulse.energy", "password": "demo"}
    res = client.post("/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "Site Manager"
    assert "token" in data
