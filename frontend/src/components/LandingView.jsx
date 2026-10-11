import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap, Lock, Gauge, 
  Search, Sliders, Calendar, AlertTriangle, Wind, Cpu, Database, ChevronRight,
  TrendingDown, Check, Play, RefreshCw, BarChart3, FileText, ExternalLink
} from 'lucide-react';
import { SAMPLE_QUERIES, FLEET_TURBINES } from '../data/fleetData';

export default function LandingView({ onLaunchConsole, onOpenAuth, userRole }) {
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const currentQuery = SAMPLE_QUERIES[selectedQueryIndex];
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = (index) => {
    setSelectedQueryIndex(index);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className="bg-grid-pattern" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: '3.25rem',
        paddingBottom: '3.75rem',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.95fr)',
          gap: '3rem',
          alignItems: 'center',
        }}>
          
          {/* Left Column: Value Prop and CTAs */}
          <div>
            {/* Pill Badge */}
            <div className="badge-pill badge-pill-primary" style={{ marginBottom: '1.15rem' }}>
              <Sparkles size={13} /> Enterprise AI Wind Fleet Intelligence
            </div>

            {/* Main Headline — Compact, balanced, readable */}
            <h1 style={{
              fontSize: '2.45rem',
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '1.15rem',
            }}>
              Diagnose fleet health with <span style={{
                color: 'var(--primary)',
                backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>plain English</span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '1.75rem',
              maxWidth: '520px',
            }}>
              ZephyrPulse is an enterprise-grade AI platform that transforms SCADA telemetry and 30-day weather forecasts into precise, loss-minimized maintenance windows — with full transparency, Annex A governance, and zero data leakage.
            </p>

            {/* Primary Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '2rem',
            }}>
              <button 
                className="btn btn-primary"
                onClick={onLaunchConsole}
                style={{ fontWeight: 700, padding: '0.65rem 1.35rem', fontSize: '0.875rem' }}
              >
                Launch Fleet Console <ArrowRight size={16} />
              </button>

              <button 
                className="btn btn-secondary"
                onClick={onOpenAuth}
                style={{ fontWeight: 600, padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
              >
                Sign In to Dashboard
              </button>
            </div>

            {/* Trust and Governance Micro-badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.15rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Annex A Governance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> 100% Audit Trail
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Zero Real PII
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> SOC 2 Ready
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Showcase Card */}
          <div>
            <div className="card" style={{
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              borderColor: '#e0e7ff',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
            }}>
              {/* Window Header */}
              <div className="mac-window-header">
                <div className="mac-dots">
                  <div className="mac-dot mac-dot-red"></div>
                  <div className="mac-dot mac-dot-yellow"></div>
                  <div className="mac-dot mac-dot-green"></div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}>
                  ZEPHYRPULSE QUERY ENGINE
                </div>
                <span className="badge-pill badge-pill-live" style={{ padding: '0.15rem 0.45rem' }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                    marginRight: '2px',
                  }}></span> LIVE
                </span>
              </div>

              {/* Card Inner Content */}
              <div style={{ padding: '1.35rem' }}>
                
                {/* Question Input Box */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.15rem',
                  position: 'relative',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem',
                  }}>
                    <FileText size={12} /> YOUR QUESTION
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    marginBottom: '0.5rem',
                  }}>
                    {currentQuery.question}
                  </div>
                  <span className="badge-pill" style={{
                    backgroundColor: '#eef2ff',
                    color: 'var(--primary)',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    padding: '0.15rem 0.5rem',
                  }}>
                    {currentQuery.label}
                  </span>
                </div>

                {/* Processing Steps Pipeline */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      flexShrink: 0,
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>SCADA Telemetry Normalization & Power Curve</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      flexShrink: 0,
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Aerodynamic Filter (Curtailment / Wake / Icing Ruled Out)</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      flexShrink: 0,
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Thermal & Vibration Anomaly Scoring (Gearbox +3.8σ)</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#eef2ff',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}>
                      <RefreshCw size={11} className={isSimulating ? 'spin-anim' : ''} />
                    </div>
                    <span>OR-Tools MILP Window Optimizer (Calm Forecast Lull)</span>
                  </div>
                </div>

                {/* 3 Metric Mini-Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.65rem',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.75rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#f59e0b',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      marginBottom: '0.15rem',
                    }}>
                      <Zap size={12} /> SPEED
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      &lt;2s
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      AVG. REASONING
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.75rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#10b981',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      marginBottom: '0.15rem',
                    }}>
                      <ShieldCheck size={12} /> AUDIT
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      100%
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      TRACEABLE RUNS
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.75rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--primary)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      marginBottom: '0.15rem',
                    }}>
                      <Gauge size={12} /> SOLVER
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      99.4%
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      OPTIMAL SCHEDULE
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── LIVE QUERY INTERACTIVE SIMULATOR BAR ─────────────────────────── */}
      <section id="demo-engine" style={{ padding: '3.25rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.75rem auto' }}>
            <span className="badge-pill badge-pill-primary" style={{ marginBottom: '0.65rem' }}>
              Interactive Engine Demo
            </span>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
              Ask the Wind Fleet Engine Anything
            </h2>
            <p style={{ fontSize: '0.875rem' }}>
              Select any of the canonical HCLTech evaluation queries to test natural language understanding, root-cause diagnosis, and constraint-based scheduling in real time.
            </p>
          </div>

          {/* Quick Query Selector Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.75rem',
          }}>
            {SAMPLE_QUERIES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleSimulate(idx)}
                className={`btn btn-sm ${selectedQueryIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.75rem',
                }}
              >
                {selectedQueryIndex === idx ? <Play size={11} fill="currentColor" /> : null}
                {q.label}
              </button>
            ))}
          </div>

          {/* Live Simulator Result Card */}
          <div className="card" style={{
            maxWidth: '920px',
            margin: '0 auto',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  POST /analyze Response ({currentQuery.answer_type})
                </span>
                <h3 style={{ fontSize: '1.125rem', marginTop: '0.2rem' }}>
                  {currentQuery.question}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <span className="badge-pill badge-pill-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
                  Trace: {currentQuery.trace_run_id}
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              color: 'var(--text-primary)',
            }}>
              <strong>Plain-Language Finding: </strong> {currentQuery.summary}
            </div>

            {/* Findings Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.25rem',
            }}>
              {currentQuery.turbine_findings.map((f, i) => (
                <div key={i} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{f.turbine_id}</span>
                    <span className="badge-pill" style={{
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.45rem',
                      backgroundColor: f.verdict.includes('fault') ? 'var(--status-fault-bg)' : 'var(--status-healthy-bg)',
                      color: f.verdict.includes('fault') ? 'var(--status-fault-text)' : 'var(--status-healthy-text)',
                    }}>
                      {f.verdict}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    30-Day Risk: <strong>{Math.round((f.downtime_risk_30d || 0) * 100)}%</strong>
                  </div>
                  {f.excluded_causes && f.excluded_causes.length > 0 && (
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Ruled out: {f.excluded_causes.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" onClick={onLaunchConsole} style={{ fontSize: '0.78125rem' }}>
                Inspect Full Telemetry & Traces in Console <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 CORE CAPABILITIES ──────────────────────────────────────────── */}
      <section id="features" style={{ padding: '3.75rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.75rem auto' }}>
            <span className="badge-pill badge-pill-primary" style={{ marginBottom: '0.65rem' }}>
              The 4 Architectural Pillars
            </span>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
              Engineered to Meet Every Requirement
            </h2>
            <p style={{ fontSize: '0.9375rem' }}>
              From distinguishing complex environmental loss factors to constraint-driven MILP scheduling, ZephyrPulse provides the end-to-end intelligence wind farm operators rely upon.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.35rem',
          }}>
            
            {/* Feature 1 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Wind size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                Curtailment vs Fault Filter
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                Never confuse deliberate grid dispatch limits, wake turbulence from upstream turbines, or sub-zero blade icing with mechanical faults. Strict Annex A rule enforcement prevents false dispatches.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
                <CheckCircle2 size={13} /> Meets R2, R3, R4 Requirements
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eef2ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Sliders size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                OR-Tools MILP Optimizer
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                Calculates mathematically optimal maintenance windows respecting crane availability, crew shift limits, and 30-day hourly wind forecast curves — minimizing lost MWh energy production.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                <CheckCircle2 size={13} /> Meets R7, R8, R9 Requirements
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                100% Traceable Reasoning
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                Zero hallucinations. Every diagnosis cites exact SCADA timestamps, sensor standard deviations (+3.8σ), and active alarm codes. Complete audit logs accessible via <code style={{ fontFamily: 'var(--font-mono)' }}>GET /trace/&#123;run_id&#125;</code>.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
                <CheckCircle2 size={13} /> Meets R11, R12 (Annex C Trace)
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <RefreshCw size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                Late Data Drop Re-Planning
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                When weather forecasts change or late files are dropped via <code style={{ fontFamily: 'var(--font-mono)' }}>POST /load</code>, the engine dynamically triggers re-planning and provides a plain-language diff highlighting shifted windows.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#d97706' }}>
                <CheckCircle2 size={13} /> Meets FR-DATA-005, FR-SCHED-005
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── READY TO OPTIMIZE CTA BANNER ─────────────────────────────────── */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            borderRadius: '18px',
            padding: '3rem 2.5rem',
            color: '#ffffff',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.65rem', fontWeight: 800 }}>
              Ready to Explore the Live Wind Fleet Console?
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', maxWidth: '580px', margin: '0 auto 1.75rem auto' }}>
              Experience the 25-turbine interactive fleet matrix, run OR-Tools what-if schedules, validate data integrity, and inspect full AI audit traces.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem' }}>
              <button 
                className="btn btn-primary"
                onClick={onLaunchConsole}
                style={{ fontWeight: 700, backgroundColor: '#6366f1', padding: '0.65rem 1.35rem' }}
              >
                Launch 25-Turbine Console <ArrowRight size={15} />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onOpenAuth}
                style={{ fontWeight: 600, color: '#0f172a', padding: '0.65rem 1.25rem' }}
              >
                Sign In (Demo Logins)
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
