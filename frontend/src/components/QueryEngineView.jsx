import React, { useState } from 'react';
import { 
  Terminal, Play, ArrowRight, CheckCircle2, Copy, Check, FileCode2, 
  Clock, Shield, Cpu, RefreshCw, Layers, CornerDownRight, Sparkles,
  UserCheck, Wrench, Award 
} from 'lucide-react';
import { SAMPLE_QUERIES, SAMPLE_TRACES } from '../data/fleetData';
import { apiService } from '../services/api';

export default function QueryEngineView({ userRole }) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customQuestion, setCustomQuestion] = useState(SAMPLE_QUERIES[0].question);
  const [activeSubTab, setActiveSubTab] = useState('brief'); // 'brief', 'json', 'trace'
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [activeQueryResult, setActiveQueryResult] = useState(SAMPLE_QUERIES[0]);
  const [activeTraceData, setActiveTraceData] = useState(SAMPLE_TRACES['wf-3b91d0']);

  const queryResult = activeQueryResult;
  const traceData = activeTraceData;

  const handleSelectPreset = async (idx) => {
    setSelectedPreset(idx);
    const q = SAMPLE_QUERIES[idx].question;
    setCustomQuestion(q);
    setIsExecuting(true);
    try {
      const res = await apiService.analyze({ question: q });
      if (res && res.run_id) {
        setActiveQueryResult(res);
        const tr = await apiService.getTrace(res.run_id);
        if (tr) setActiveTraceData(tr);
      }
    } catch (e) {
      setActiveQueryResult(SAMPLE_QUERIES[idx]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRunQuery = async () => {
    if (!customQuestion.trim()) return;
    setIsExecuting(true);
    try {
      const res = await apiService.analyze({ question: customQuestion });
      if (res && res.run_id) {
        setActiveQueryResult(res);
        const tr = await apiService.getTrace(res.run_id);
        if (tr) setActiveTraceData(tr);
      }
    } catch (e) {
      console.warn("Analyze fallback:", e);
    } finally {
      setIsExecuting(false);
    }
  };


  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(queryResult, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      {/* ─── ROLE-SPECIFIC CONTEXT BANNER ─────────────────────────────────── */}
      {userRole === 'Site Manager' && (
        <div className="role-banner role-banner-site-manager">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <UserCheck size={18} color="#15803d" />
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Executive Plain-Language Reporting View (R10)</strong>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Automated 2-minute plain-English briefs prepared for Wind Farm Site Operations review.
              </div>
            </div>
          </div>
          <span className="badge-pill" style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.6875rem', fontWeight: 700 }}>
            Executive Persona Active
          </span>
        </div>
      )}

      {userRole === 'Maintenance Lead' && (
        <div className="role-banner role-banner-maintenance-lead">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Wrench size={18} color="#c2410c" />
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Technical Telemetry & Evidence Inspector</strong>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Direct inspection of standard deviation thresholds (+3.8σ temp, +3.2σ vibration) and SCADA data slices.
              </div>
            </div>
          </div>
          <span className="badge-pill" style={{ backgroundColor: '#ffedd5', color: '#9a3412', fontSize: '0.6875rem', fontWeight: 700 }}>
            Diagnostics Mode
          </span>
        </div>
      )}

      {userRole === 'HCLTech Judge' && (
        <div className="role-banner role-banner-hcltech-judge">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Award size={18} color="#7c3aed" />
            <div>
              <strong style={{ fontSize: '0.875rem' }}>API Schema Contract Verification (Section 6.1 & Annex C)</strong>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Inspect raw JSON responses, tool-calling latencies, and deterministic LangGraph trace logs.
              </div>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setActiveSubTab('trace')}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', backgroundColor: '#7c3aed' }}
          >
            Inspect Audit Trace Logs
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge-pill badge-pill-primary" style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem' }}>
            <Terminal size={12} /> FR-API-001..004 & Annex C
          </span>
          <span className="badge-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
            CONTRACT: POST /analyze & GET /trace/&#123;run_id&#125;
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Deterministic AI Query & Audit Trace Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.875rem' }}>
          Ask natural language fleet questions. The LangGraph agent orchestrates deterministic tools, rules, and mathematical solvers — returning transparent evidence references and full execution traces.
        </p>
      </div>

      {/* Query Bar Box */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.71875rem', fontWeight: 700, color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.35rem' }}>
            CANONICAL QUERIES:
          </span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectPreset(idx)}
              className={`btn btn-sm ${selectedPreset === idx ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                fontSize: '0.71875rem',
                fontWeight: 600,
                padding: '0.25rem 0.65rem',
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask anything about fleet health, root causes, or maintenance windows..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleRunQuery}
            disabled={isExecuting}
            style={{ fontWeight: 700, minWidth: '140px', fontSize: '0.8125rem' }}
          >
            {isExecuting ? (
              <>
                <RefreshCw size={13} className="spin-anim" /> Reasoning...
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" /> Run POST /analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Execution Results Surface */}
      <div className="card" style={{ overflow: 'hidden' }}>
        
        {/* Sub-Tabs Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#fafbfc',
          padding: '0 1.25rem',
        }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveSubTab('brief')}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeSubTab === 'brief' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: activeSubTab === 'brief' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'brief' ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.8125rem',
              }}
            >
              Plain-Language Briefing (R10)
            </button>

            <button
              onClick={() => setActiveSubTab('json')}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeSubTab === 'json' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: activeSubTab === 'json' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'json' ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.8125rem',
              }}
            >
              Structured JSON Payload (Section 6.1)
            </button>

            <button
              onClick={() => setActiveSubTab('trace')}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeSubTab === 'trace' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: activeSubTab === 'trace' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'trace' ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.8125rem',
              }}
            >
              Full Audit Trace (GET /trace/{queryResult.trace_run_id})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-muted)' }}>RUN ID:</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{queryResult.trace_run_id}</span>
          </div>
        </div>

        {/* Tab 1: Plain Language Executive Brief */}
        {activeSubTab === 'brief' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '1.15rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.35rem',
              }}>
                <Sparkles size={13} /> Executive Summary for Site Manager
              </div>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--text-primary)', fontWeight: 500 }}>
                {queryResult.summary}
              </p>
            </div>

            {/* Findings breakdown */}
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Turbine Diagnostic Findings & Annex A Classification
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.5rem',
            }}>
              {queryResult.turbine_findings.map((finding, idx) => (
                <div key={idx} style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--font-mono)' }}>
                      {finding.turbine_id}
                    </span>
                    <span className="badge-pill" style={{
                      backgroundColor: finding.verdict.includes('fault') ? '#fee2e2' : '#ecfdf5',
                      color: finding.verdict.includes('fault') ? '#b91c1c' : '#047857',
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                    }}>
                      {finding.verdict}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    30-Day Risk: <strong>{Math.round((finding.downtime_risk_30d || 0) * 100)}%</strong>
                  </div>

                  {finding.evidence_refs && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>
                        EVIDENCE CITATIONS:
                      </span>
                      {finding.evidence_refs.map((ref, rIdx) => (
                        <code key={rIdx} style={{
                          display: 'block',
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--primary)',
                          backgroundColor: '#f1f5f9',
                          padding: '0.12rem 0.3rem',
                          borderRadius: '3px',
                          marginBottom: '0.15rem',
                        }}>
                          {ref}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Assumptions & Limitations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1.25rem',
            }}>
              <div>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Stated Assumptions (Mandatory)
                </h5>
                <ul style={{ paddingLeft: '1.15rem', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {queryResult.assumptions.map((ass, i) => (
                    <li key={i}>{ass}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  System Limitations (Mandatory)
                </h5>
                <ul style={{ paddingLeft: '1.15rem', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {queryResult.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Raw JSON Response */}
        {activeSubTab === 'json' && (
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                application/json • Contract Section 6.1
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleCopyJson} style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}>
                {hasCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                {hasCopied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              overflowX: 'auto',
              maxHeight: '440px',
              lineHeight: 1.45,
            }}>
              {JSON.stringify(queryResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Trace Explorer */}
        {activeSubTab === 'trace' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-light)',
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ORCHESTRATOR & MODEL</div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  {traceData.orchestrator} • {traceData.model_used}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>TOTAL LATENCY</div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {traceData.total_execution_ms} ms
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Deterministic Tool Invocation Pipeline Steps ({traceData.steps.length} Steps)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {traceData.steps.map((st) => (
                <div key={st.step} style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}>
                        {st.step}
                      </span>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {st.tool}()
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {st.duration_ms} ms
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: '#f8fafc',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '0.4rem',
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>INPUT:</span>
                      <code>{JSON.stringify(st.input)}</code>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>OUTPUT:</span>
                      <code>{JSON.stringify(st.output)}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
