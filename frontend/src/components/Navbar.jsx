import React, { useState, useEffect } from 'react';
import { Wind, Shield, User, ArrowRight, Activity, Calendar, Terminal, CheckCircle2, Award, LogIn, LogOut, Check, Wifi, Server } from 'lucide-react';
import { apiService } from '../services/api';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentView, 
  setCurrentView, 
  openAuthModal, 
  userRole, 
  setUserRole,
  currentUser,
  onSignOut
}) {
  const [backendStatus, setBackendStatus] = useState({ online: true, solver: 'OR-Tools' });

  useEffect(() => {
    apiService.getHealth()
      .then(res => setBackendStatus({ online: res.status === 'ok', solver: 'OR-Tools CP-SAT' }))
      .catch(() => setBackendStatus({ online: false, solver: 'Offline Mock' }));
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.2s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '62px',
      }}>
        {/* Logo and Brand */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }} 
          onClick={() => setCurrentView('landing')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary-gradient)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-primary)',
          }}>
            <Wind size={18} strokeWidth={2.3} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
            }}>
              ZephyrPulse
            </span>
            <span className="badge-pill badge-pill-primary" style={{
              fontSize: '0.625rem',
              padding: '0.12rem 0.45rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 700,
            }}>
              ENTERPRISE
            </span>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.65625rem',
              fontWeight: 650,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: backendStatus.online ? '#ecfdf5' : '#fff1f2',
              border: backendStatus.online ? '1px solid #a7f3d0' : '1px solid #fecdd3',
              color: backendStatus.online ? '#065f46' : '#be123c',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendStatus.online ? '#10b981' : '#f43f5e',
                boxShadow: backendStatus.online ? '0 0 6px #10b981' : 'none',
              }} />
              <span>API :8000 {backendStatus.online ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links — Strict single line & unclustered */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          padding: '0 0.5rem',
        }}>
          {currentView === 'landing' ? (
            <>
              <a href="#features" className="btn btn-ghost btn-sm" style={{ fontWeight: 500, fontSize: '0.8125rem' }}>Features</a>
              <a href="#demo-engine" className="btn btn-ghost btn-sm" style={{ fontWeight: 500, fontSize: '0.8125rem' }}>Engine Demo</a>
              <a href="#architecture" className="btn btn-ghost btn-sm" style={{ fontWeight: 500, fontSize: '0.8125rem' }}>Architecture</a>
              <a href="#evaluation" className="btn btn-ghost btn-sm" style={{ fontWeight: 500, fontSize: '0.8125rem' }}>Evaluation</a>
              <a href="#how-it-works" className="btn btn-ghost btn-sm" style={{ fontWeight: 500, fontSize: '0.8125rem' }}>How It Works</a>
            </>
          ) : (
            <>
              <button 
                className={`btn btn-sm ${activeTab === 'fleet' ? 'btn-secondary' : 'btn-ghost'}`}
                style={activeTab === 'fleet' ? { borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 650, backgroundColor: '#f5f3ff' } : {}}
                onClick={() => setActiveTab('fleet')}
              >
                <Activity size={13} /> Fleet Matrix (25)
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'optimizer' ? 'btn-secondary' : 'btn-ghost'}`}
                style={activeTab === 'optimizer' ? { borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 650, backgroundColor: '#f5f3ff' } : {}}
                onClick={() => setActiveTab('optimizer')}
              >
                <Calendar size={13} /> OR-Tools Optimizer
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'query' ? 'btn-secondary' : 'btn-ghost'}`}
                style={activeTab === 'query' ? { borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 650, backgroundColor: '#f5f3ff' } : {}}
                onClick={() => setActiveTab('query')}
              >
                <Terminal size={13} /> POST /analyze
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'validation' ? 'btn-secondary' : 'btn-ghost'}`}
                style={activeTab === 'validation' ? { borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 650, backgroundColor: '#f5f3ff' } : {}}
                onClick={() => setActiveTab('validation')}
              >
                <CheckCircle2 size={13} /> Data Validator
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'benchmarks' ? 'btn-secondary' : 'btn-ghost'}`}
                style={activeTab === 'benchmarks' ? { borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 650, backgroundColor: '#f5f3ff' } : {}}
                onClick={() => setActiveTab('benchmarks')}
              >
                <Award size={13} /> Benchmarks
              </button>
            </>
          )}
        </nav>

        {/* User Role & Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          
          {/* Active Role Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: userRole === 'Site Manager' ? '#f0fdf4' : userRole === 'Maintenance Lead' ? '#fff7ed' : '#f5f3ff',
            border: userRole === 'Site Manager' ? '1px solid #bbf7d0' : userRole === 'Maintenance Lead' ? '1px solid #fed7aa' : '1px solid #ddd6fe',
            fontSize: '0.75rem',
          }}>
            <User size={12} color={userRole === 'Site Manager' ? '#15803d' : userRole === 'Maintenance Lead' ? '#c2410c' : '#7c3aed'} />
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.75rem',
                fontWeight: 650,
                color: userRole === 'Site Manager' ? '#15803d' : userRole === 'Maintenance Lead' ? '#c2410c' : '#7c3aed',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Site Manager">Role: Site Manager</option>
              <option value="Maintenance Lead">Role: Maintenance Lead</option>
              <option value="HCLTech Judge">Role: HCLTech Judge</option>
            </select>
          </div>

          {/* User Profile or Sign In */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="badge-pill" style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}>
                👤 {currentUser.name.split(' ')[0]}
              </span>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={onSignOut}
                title="Sign Out"
                style={{ padding: '0.3rem 0.5rem', color: 'var(--text-muted)' }}
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={openAuthModal}
              style={{ fontWeight: 600, fontSize: '0.78125rem' }}
            >
              <LogIn size={13} /> Sign In
            </button>
          )}

          {/* Console / Landing Mode Switcher */}
          {currentView === 'landing' ? (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setCurrentView('console')}
              style={{ fontWeight: 650, fontSize: '0.78125rem', paddingRight: '0.85rem' }}
            >
              Launch Console <ArrowRight size={13} />
            </button>
          ) : (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentView('landing')}
              style={{ fontWeight: 600, fontSize: '0.78125rem' }}
            >
              Landing Page
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
