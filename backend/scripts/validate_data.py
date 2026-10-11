#!/usr/bin/env python3
"""
ZephyrPulse AI - CLI Data Validation Runner (Section 4.5 & 8)
Usage: python scripts/validate_data.py [--data-dir path/to/data]
"""
import os
import sys
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.validator import run_validation_pipeline

def main():
    parser = argparse.ArgumentParser(description="Validate Wind Fleet SCADA, Alarms, Forecast, and Crew data.")
    parser.add_argument("--data-dir", default=os.path.join(os.path.dirname(__file__), "..", "data"), help="Path to data directory")
    args = parser.parse_args()

    print("=" * 70)
    print("ZephyrPulse AI — 8-Rule Data Integrity & Validation Pipeline (Section 4.5)")
    print("=" * 70)
    
    report = run_validation_pipeline()
    status_str = "ALL PASSED" if report["passed_all"] else "FAILED"
    print(f"Overall Status: {status_str} (Passed: {report['passed_count']}/{report['checks_run']})\n")

    for c in report["checks"]:
        badge = f"[{c['status'].upper()}]"
        print(f" {badge:<8} {c['name']:<35} | {c['metric']} | {c['details']}")

    print("\n" + "=" * 70)
    print("Detected Environmental & Sensor Edge Cases (Annex A / Section 4.4):")
    print("=" * 70)
    for t in report.get("traps_detected", []):
        print(f" • {t.get('trap_type', 'Edge Case')} ({t.get('turbine_id', '')}): {t.get('remediation', '')}")
    print("=" * 70)

    if report["passed_all"]:
        print(">> ALL VALIDATION CHECKS PASSED. Ready for analysis & optimization.")
        sys.exit(0)
    else:
        print(">> VALIDATION WARNINGS/ERRORS DETECTED.")
        sys.exit(1)

if __name__ == "__main__":
    main()
