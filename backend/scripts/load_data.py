#!/usr/bin/env python3
"""
ZephyrPulse AI - CLI Data Loader (Section 4.7 & Annex B)
Allows judges and operators to ingest arbitrary Annex B CSV files into SQLite.
Usage: python scripts/load_data.py --file path/to/file.csv --table [scada_10min|alarms|forecast|crew_calendar]
"""
import os
import sys
import csv
import argparse
import sqlite3

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.database import get_connection

VALID_TABLES = ["scada_10min", "alarms", "forecast", "crew_calendar"]

def load_csv(file_path: str, table_name: str):
    if table_name not in VALID_TABLES:
        print(f"Error: Invalid table '{table_name}'. Must be one of: {VALID_TABLES}")
        sys.exit(1)
        
    if not os.path.exists(file_path):
        print(f"Error: File not found at '{file_path}'")
        sys.exit(1)

    conn = get_connection()
    cursor = conn.cursor()
    
    rows_loaded = 0
    rows_rejected = 0

    print(f"Ingesting '{file_path}' into table '{table_name}'...")

    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                if table_name == "scada_10min":
                    cursor.execute("""
                        INSERT OR REPLACE INTO scada_10min (
                            turbine_id, ts, wind_ms, wind_dir_deg, power_kw,
                            rotor_rpm, gearbox_temp_c, generator_temp_c, vibration_mm_s, ambient_temp_c
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        row["turbine_id"], row["ts"], float(row.get("wind_ms", 0.0)),
                        float(row.get("wind_dir_deg", 0.0)), float(row.get("power_kw", 0.0)),
                        float(row.get("rotor_rpm", 0.0)), float(row.get("gearbox_temp_c", 0.0)),
                        float(row.get("generator_temp_c", 0.0)), float(row.get("vibration_mm_s", 0.0)),
                        float(row.get("ambient_temp_c", 0.0))
                    ))
                elif table_name == "alarms":
                    cursor.execute("""
                        INSERT INTO alarms (turbine_id, start_time, end_time, code, curtailed)
                        VALUES (?, ?, ?, ?, ?)
                    """, (
                        row["turbine_id"], row["start"], row["end"], row["code"],
                        1 if str(row.get("curtailed", "")).lower() in ["true", "1"] else 0
                    ))
                elif table_name == "forecast":
                    cursor.execute("""
                        INSERT OR REPLACE INTO forecast (ts, wind_ms, price_per_mwh)
                        VALUES (?, ?, ?)
                    """, (row["ts"], float(row["wind_ms"]), float(row["price_per_mwh"])))
                elif table_name == "crew_calendar":
                    cursor.execute("""
                        INSERT OR REPLACE INTO crew_calendar (date, crew, crane, available, service_type, duration_days)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        row["date"], row["crew"], row["crane"],
                        1 if str(row.get("available", "")).lower() in ["true", "1"] else 0,
                        row.get("service_type", "Standard"), float(row.get("duration_days", 1.0))
                    ))
                rows_loaded += 1
            except Exception as e:
                rows_rejected += 1

    conn.commit()
    conn.close()

    print(f"Ingestion Complete: {rows_loaded} rows inserted/updated, {rows_rejected} rows rejected.")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Load Annex B CSV files into ZephyrPulse database.")
    parser.add_argument("--file", required=True, help="Path to CSV file")
    parser.add_argument("--table", required=True, choices=VALID_TABLES, help="Target Annex B table")
    args = parser.parse_args()
    load_csv(args.file, args.table)

if __name__ == "__main__":
    main()
