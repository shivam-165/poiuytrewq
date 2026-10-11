from typing import List, Dict, Any

ANNEX_A_POLICY_KNOWLEDGE_BASE = [
    {
        "id": "ANNEX-A-R1",
        "title": "Curtailment First Policy",
        "rule": "Periods marked as curtailed are removed before judging turbine health.",
        "rationale": "Prevents false fault alerts caused by deliberate grid operator DSO setpoint throttling.",
        "keywords": ["curtailment", "curtailed", "dso", "setpoint", "grid", "clamp", "power loss"]
    },
    {
        "id": "ANNEX-A-R2",
        "title": "Aerodynamic Wake Verification",
        "rule": "A turbine whose power loss appears only in certain wind directions is checked for wake before it is called faulty.",
        "rationale": "Avoids needless service dispatches for turbines standing downwind of upstream neighbours (e.g., T-05 downwind of T-04 at 250°-290°).",
        "keywords": ["wake", "direction", "sector", "neighbour", "upstream", "downwind", "t-05", "t-04"]
    },
    {
        "id": "ANNEX-A-R3",
        "title": "Blade Icing Protocol",
        "rule": "Low power near freezing (ambient temp <= 0.5°C) with high humidity is treated as possible aerodynamic icing rather than mechanical defect.",
        "rationale": "Avoids misclassifying aerofoil stalling caused by rime ice accretion as bearing or gearbox breakdown.",
        "keywords": ["icing", "ice", "freezing", "sub-zero", "temperature", "ambient", "t-22"]
    },
    {
        "id": "ANNEX-A-R4",
        "title": "Weather Limit & Safety Protocol",
        "rule": "No maintenance service when forecast wind speed exceeds crew safety limit (4.5 m/s for crane lifts; 10.0 m/s for nacelle climb). Zero service during storm windows.",
        "rationale": "Strict occupational safety protocol to prevent crane boom instability during gusts.",
        "keywords": ["weather", "wind limit", "safety", "storm", "crane", "gust", "4.5"]
    },
    {
        "id": "ANNEX-A-R5",
        "title": "Crew & Crane Resource Exclusivity",
        "rule": "A maintenance window requires both assigned crew and mobile crane (Crane 1) to be continuously available for the entire duration.",
        "rationale": "Ensures scheduled work is physically executable without multi-site crane conflicts.",
        "keywords": ["crew", "crane", "calendar", "availability", "double-booking", "resource"]
    },
    {
        "id": "ANNEX-A-R6",
        "title": "Site Manager Governance & Approval",
        "rule": "The AI service plan is a prioritized commercial proposal. The Site Manager reviews and formally approves major overhauls.",
        "rationale": "Maintains human-in-the-loop accountability for high-capex maintenance interventions.",
        "keywords": ["approval", "site manager", "proposal", "accountability", "human-in-the-loop"]
    },
    {
        "id": "ANNEX-A-R7",
        "title": "High-Severity Urgency Rule",
        "rule": "High-severity developing faults (gearbox bearing, generator wear) must be scheduled within 7 days of detection.",
        "rationale": "Mitigates catastrophic asset loss and avoids multi-week unpowered outages.",
        "keywords": ["high-severity", "urgency", "7 days", "gearbox", "generator", "t-07", "t-12"]
    }
]

def search_policy_guidelines(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """
    Retrieves grounded policy clauses matching query semantics and fault categories.
    """
    q_tokens = set(query.lower().split())
    scored = []
    for item in ANNEX_A_POLICY_KNOWLEDGE_BASE:
        overlap = sum(1 for kw in item["keywords"] if any(kw in token or token in kw for token in q_tokens))
        scored.append((overlap, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in scored[:top_k]]
