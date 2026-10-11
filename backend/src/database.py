import os
import sqlite3
import csv
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "zephyrpulse.db")
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Turbines master table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS turbines (
            turbine_id TEXT PRIMARY KEY,
            model TEXT NOT NULL,
            rated_power_kw REAL NOT NULL,
            hub_height_m REAL NOT NULL,
            rotor_diameter_m REAL NOT NULL,
            commissioned_date TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            status TEXT NOT NULL,
            downtime_risk_30d REAL NOT NULL,
            primary_issue TEXT
        )
    """)

    # SCADA 10-min table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scada_10min (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            turbine_id TEXT NOT NULL,
            ts TEXT NOT NULL,
            wind_ms REAL NOT NULL,
            wind_dir_deg REAL NOT NULL,
            power_kw REAL NOT NULL,
            rotor_rpm REAL NOT NULL,
            gearbox_temp_c REAL NOT NULL,
            generator_temp_c REAL NOT NULL,
            vibration_mm_s REAL NOT NULL,
            ambient_temp_c REAL NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_scada_tid_ts ON scada_10min (turbine_id, ts)")

    # Alarms table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alarms (
            alarm_id TEXT PRIMARY KEY,
            turbine_id TEXT NOT NULL,
            start TEXT NOT NULL,
            end TEXT NOT NULL,
            code TEXT NOT NULL,
            curtailed INTEGER NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_alarms_tid ON alarms (turbine_id)")

    # Forecast table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS forecast (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT NOT NULL,
            wind_ms REAL NOT NULL,
            price_per_mwh REAL NOT NULL,
            temperature_c REAL NOT NULL,
            is_storm_window INTEGER NOT NULL
        )
    """)

    # Crew Calendar table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crew_calendar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            crew TEXT NOT NULL,
            crane TEXT NOT NULL,
            available INTEGER NOT NULL,
            service_type TEXT NOT NULL,
            duration_days REAL NOT NULL
        )
    """)

    # Maintenance Windows table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS maintenance_windows (
            window_id TEXT PRIMARY KEY,
            turbine_id TEXT NOT NULL,
            planned_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            crew TEXT NOT NULL,
            crane TEXT NOT NULL,
            expected_energy_loss_mwh REAL NOT NULL,
            estimated_impact TEXT NOT NULL,
            rationale TEXT NOT NULL,
            priority_rank INTEGER NOT NULL,
            requires_approval INTEGER NOT NULL,
            approval_status TEXT NOT NULL
        )
    """)

    # Trace Records table (Annex C)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trace_records (
            run_id TEXT PRIMARY KEY,
            question TEXT NOT NULL,
            steps_json TEXT NOT NULL,
            llm_calls INTEGER NOT NULL,
            tokens INTEGER NOT NULL,
            approval_status TEXT NOT NULL,
            model_used TEXT NOT NULL,
            created_at TEXT NOT NULL,
            final_answer_json TEXT NOT NULL
        )
    """)

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()

    # Seed Turbines if empty
    cursor.execute("SELECT COUNT(*) FROM turbines")
    if cursor.fetchone()[0] == 0:
        seed_turbines(cursor)
        conn.commit()

    # Seed Users if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_users(cursor)
        conn.commit()

    # Seed SCADA and other data if empty
    cursor.execute("SELECT COUNT(*) FROM scada_10min")
    if cursor.fetchone()[0] == 0:
        seed_datasets(conn)

    conn.close()

def seed_turbines(cursor):
    turbines_info = [
        ("T-01", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.321, -2.140, "healthy", 0.04, "Nominal operation"),
        ("T-02", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.323, -2.138, "healthy", 0.05, "Nominal operation"),
        ("T-03", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.325, -2.135, "curtailed", 0.02, "DSO Frequency Curtailment (Non-fault)"),
        ("T-04", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.327, -2.132, "healthy", 0.03, "Nominal operation"),
        ("T-05", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.329, -2.130, "wake_affected", 0.03, "Downwind wake behind T-04 (Non-fault)"),
        ("T-06", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.331, -2.128, "healthy", 0.06, "Nominal operation"),
        ("T-07", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.333, -2.125, "fault_suspected", 0.41, "Gearbox Stage-2 Bearing Wear (Developing Fault)"),
        ("T-08", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.335, -2.122, "healthy", 0.05, "Nominal operation"),
        ("T-09", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.337, -2.120, "healthy", 0.04, "Comms telemetry recovered; nominal"),
        ("T-10", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.339, -2.118, "healthy", 0.05, "Nominal operation"),
        ("T-11", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.341, -2.115, "healthy", 0.07, "Pitch calibration within tolerance"),
        ("T-12", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.343, -2.112, "degraded", 0.35, "Generator Bearing Thermal Drift (Developing Wear)"),
        ("T-13", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.345, -2.110, "healthy", 0.04, "Nominal operation"),
        ("T-14", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.347, -2.108, "sensor_stuck", 0.02, "Frozen Gen Temp Sensor at 42.10°C (Sensor fault only)"),
        ("T-15", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.349, -2.105, "healthy", 0.03, "Nominal operation"),
        ("T-16", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.351, -2.102, "healthy", 0.05, "Nominal operation"),
        ("T-17", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.353, -2.100, "healthy", 0.04, "Nominal operation"),
        ("T-18", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.355, -2.098, "curtailed", 0.03, "DSO Active Power Setpoint Clamp (Non-fault)"),
        ("T-19", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.357, -2.095, "degraded", 0.28, "Pitch Hydraulic Actuator Pressure Degradation"),
        ("T-20", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.359, -2.092, "healthy", 0.05, "Nominal operation"),
        ("T-21", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.361, -2.090, "healthy", 0.03, "Nominal operation"),
        ("T-22", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.363, -2.088, "icing", 0.02, "Transient Blade Icing Event at -0.8°C (Non-fault)"),
        ("T-23", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.365, -2.085, "healthy", 0.06, "Nominal operation"),
        ("T-24", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.367, -2.082, "healthy", 0.04, "Nominal operation"),
        ("T-25", "Vestas V110-2.0MW", 2000.0, 95.0, 110.0, "2021-04-12", 54.369, -2.080, "healthy", 0.05, "Nominal operation"),
    ]
    cursor.executemany("""
        INSERT INTO turbines (
            turbine_id, model, rated_power_kw, hub_height_m, rotor_diameter_m,
            commissioned_date, latitude, longitude, status, downtime_risk_30d, primary_issue
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, turbines_info)

def seed_users(cursor):
    users = [
        ("u-01", "site.manager@zephyrpulse.energy", "pbkdf2:demo123", "Elena Rostova", "Site Manager", "2026-10-01T00:00:00Z"),
        ("u-02", "maint.lead@zephyrpulse.energy", "pbkdf2:demo123", "Marcus Vance", "Maintenance Lead", "2026-10-01T00:00:00Z"),
        ("u-03", "judge@hcltech.com", "pbkdf2:demo123", "HCLTech Lead Evaluator", "Judge / Evaluator", "2026-10-01T00:00:00Z")
    ]
    cursor.executemany("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", users)

def seed_datasets(conn):
    cursor = conn.cursor()
    # 1. SCADA
    scada_csv = os.path.join(DATA_DIR, "scada_10min.csv")
    if os.path.exists(scada_csv):
        with open(scada_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = [
                (r["turbine_id"], r["ts"], float(r["wind_ms"]), float(r["wind_dir_deg"]),
                 float(r["power_kw"]), float(r["rotor_rpm"]), float(r["gearbox_temp_c"]),
                 float(r["generator_temp_c"]), float(r["vibration_mm_s"]), float(r["ambient_temp_c"]))
                for r in reader
            ]
            cursor.executemany("""
                INSERT INTO scada_10min (
                    turbine_id, ts, wind_ms, wind_dir_deg, power_kw, rotor_rpm,
                    gearbox_temp_c, generator_temp_c, vibration_mm_s, ambient_temp_c
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, rows)
            conn.commit()
            print(f"Loaded {len(rows)} scada rows into SQLite.")

    # 2. Alarms
    alarms_csv = os.path.join(DATA_DIR, "alarms.csv")
    if os.path.exists(alarms_csv):
        with open(alarms_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = [
                (r["alarm_id"], r["turbine_id"], r["start"], r["end"], r["code"], 1 if r["curtailed"].lower() == "true" else 0)
                for r in reader
            ]
            cursor.executemany("INSERT INTO alarms VALUES (?, ?, ?, ?, ?, ?)", rows)
            conn.commit()

    # 3. Forecast
    forecast_csv = os.path.join(DATA_DIR, "forecast.csv")
    if os.path.exists(forecast_csv):
        with open(forecast_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = [
                (r["ts"], float(r["wind_ms"]), float(r["price_per_mwh"]), float(r["temperature_c"]),
                 1 if r["is_storm_window"].lower() == "true" else 0)
                for r in reader
            ]
            cursor.executemany("""
                INSERT INTO forecast (ts, wind_ms, price_per_mwh, temperature_c, is_storm_window)
                VALUES (?, ?, ?, ?, ?)
            """, rows)
            conn.commit()

    # 4. Crew Calendar
    crew_csv = os.path.join(DATA_DIR, "crew_calendar.csv")
    if os.path.exists(crew_csv):
        with open(crew_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = [
                (r["date"], r["crew"], r["crane"], 1 if r["available"].lower() == "true" else 0,
                 r["service_type"], float(r["duration_days"]))
                for r in reader
            ]
            cursor.executemany("""
                INSERT INTO crew_calendar (date, crew, crane, available, service_type, duration_days)
                VALUES (?, ?, ?, ?, ?, ?)
            """, rows)
            conn.commit()

    # 5. Seed Initial Baseline Maintenance Windows
    initial_windows = [
        ("MW-001", "T-07", "2026-10-14", "2026-10-15", "Crew B", "Crane 1", 38.0,
         "Saves ~162 MWh ($9,400) vs windy day dispatch",
         "Scheduled during calm wind window (3.4 m/s) and low electricity spot price ($32/MWh)",
         1, 1, "approved"),
        ("MW-002", "T-12", "2026-10-18", "2026-10-19", "Crew A", "Crane 1", 42.5,
         "Prevents catastrophic generator bearing seizure (estimated $84,000 damage avoidance)",
         "Scheduled post Crane 1 repositioning during 3.8 m/s atmospheric lull",
         2, 1, "pending"),
        ("MW-003", "T-19", "2026-10-21", "2026-10-21", "Crew C", "none", 12.0,
         "Restores 240 kW pitch rate throttling on high wind ramps",
         "1-day hydraulic seal replacement, no mobile crane required",
         3, 0, "approved")
    ]
    cursor.executemany("""
        INSERT OR REPLACE INTO maintenance_windows VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, initial_windows)
    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized and seeded successfully!")
