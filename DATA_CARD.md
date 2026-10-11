# Annex D — Synthetic Data Card

## 1. Name and Version
- **Dataset Name**: ZephyrPulse AI Synthetic Wind Fleet Benchmark Pack
- **Version**: 1.0-release
- **Date**: October 11, 2026
- **Prepared By**: AI/ML Engineer Track

---

## 2. How It Was Made
- **Generator Script**: `backend/scripts/generate_data_pack.py`
- **Methodology**: Physical mathematical modeling based on IEC 61400-12-1 Class II power curves, thermodynamic equilibrium equations for wind turbine drivetrains, and stochastic atmospheric wind time-series.
- **Random Seed**: `random.seed(42)` pinned for 100% deterministic reproducibility.
- **Models Used**: Deterministic differential equations + Isolation Forest training baseline.

---

## 3. What It Contains

| Table | File | Format | Row Count | Granularity | Scope / Date Range |
|---|---|---|---|---|---|
| **SCADA** | `scada_10min.csv` | CSV (Annex B) | 143,963 | 10-minute intervals | 25 turbines (`T-01`..`T-25`) from Sept 1, 2026 to Oct 10, 2026 |
| **Alarms** | `alarms.csv` | CSV (Annex B) | 2,000 | Event-based | Grid curtailment, mechanical vibration, thermal drift |
| **Forecast** | `forecast.csv` | CSV (Annex B) | 744 | Hourly | 30-day forecast (wind speed, price/MWh, storm window flags) |
| **Crew Calendar** | `crew_calendar.csv` | CSV (Annex B) | 93 | Daily per crew | 3 maintenance crews (A, B, C) and mobile Crane 1 |
| **Late Forecast** | `forecast_late_drop.csv`| CSV (Annex B) | 744 | Hourly | Injects storm front on Oct 14-16 (wind 17.5 m/s) |
| **Late Crew** | `crew_calendar_late_drop.csv`| CSV (Annex B) | 93 | Daily | Injects Crane 1 hydraulic downtime on Oct 14-16 |

---

## 4. Traps and Edge Cases Added on Purpose

| Asset | Edge Case / Trap | Specific Signature | Required Handling |
|---|---|---|---|
| **T-07** | **True Developing Gearbox Fault** | +7.2°C excess gearbox temperature, vibration 4.8 mm/s, continuous 9.1% power deficit in all wind directions. | Annex A: Classify as `gearbox_fault_developing`. Schedule Gearbox Inspection within 7 days using Crew B and Crane 1. |
| **T-12** | **True Generator Bearing Degradation** | +8.5°C generator drive-end temperature, vibration 4.2 mm/s. | Annex A: Classify as `generator_bearing_wear`. Schedule Overhaul using Crew A and Crane 1. |
| **T-19** | **Pitch Hydraulic Actuator Leak** | Sluggish blade pitch response, 12% power deficit in moderate transitional winds. | Classify as `pitch_actuator_fault`. Schedule Crew C (no crane required). |
| **T-05** | **Aerodynamic Wake Effect** | Power deficit (12-15%) occurs **exclusively** when wind direction is from the west (250° to 290°), directly downwind of upstream neighbour `T-04`. | Annex A Rule 2: Classify as `wake_affected` (`not_a_fault`). Do NOT schedule maintenance. |
| **T-03, T-18** | **Grid Operator Curtailment** | Active power clamped to 400 kW during high wind periods; accompanied by DSO frequency curtailment alarms (`ALM-101`). | Annex A Rule 1: Classify as `curtailed` (`not_a_fault`). Exclude from machine health penalization. |
| **T-22** | **Atmospheric Blade Icing** | Sub-zero ambient temperature (-0.8°C), 35% power loss, zero hardware alarms. | Annex A Rule 3: Classify as `icing` (`not_a_fault`). De-icing protocol triggered; no overhaul scheduled. |
| **T-14** | **Stuck Sensor Flatline** | Generator temperature constant at 42.10°C with zero rolling variance across 48 hours. | Classify as `sensor_stuck`. Flag sensor failure in evidence citations; machine is healthy. |
| **T-09** | **Communication Outage** | 6-hour missing SCADA window on Oct 2, 2026 (08:00 to 14:00 UTC). | Reported as data gap; missing window excluded from degradation calculations. |

---

## 5. Checks Run and Results

The dataset was passed through the 8-rule validation script (`backend/src/validator.py`):
1. **Master Turbine Existence**: 100% PASS (25/25 valid IDs).
2. **Non-Negative Power Bounds**: 100% PASS (0 negative power values).
3. **Rotor Speed Physics**: 100% PASS (All values within 0.0 to 25.0 RPM).
4. **Timestamp Cadence**: 100% PASS (Regular 10-min steps, T-09 gap reported).
5. **Timezone Uniformity**: 100% PASS (100% ISO 8601 UTC `'Z'`).
6. **Alarm Chronology**: 100% PASS (All end times > start times).
7. **Crew Conflict Check**: 100% PASS (Zero double-bookings).
8. **Row Count Alignment**: 100% PASS (Matches data card manifest).

---

## 6. Known Limits
- The dataset does not model complex high-frequency sub-second electrical grid harmonics.
- Wind direction variations use hourly turbulent shifts rather than micro-second gust vectors.
- Assumes standard onshore wind farm terrain topography.

---

## 7. Privacy and Ethical Declarations
- **Zero Real Company Data**: 100% of telemetry, alarms, forecast figures, and personnel names were synthetically generated using physical equations and randomized distributions.
- **Zero Personally Identifiable Information (PII)**: All operator and crew names are synthetic personas.
