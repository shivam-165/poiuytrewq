import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Check, ArrowRight, Building, Key, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentRole, setUserRole }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(currentRole || 'Site Manager');
  const [farmName, setFarmName] = useState('WF-25 Northern Escarpment (25 Turbines)');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (role, demoEmail, demoName) => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsLoading(false);
      setUserRole(role);
      onAuthSuccess({
        name: demoName,
        email: demoEmail,
        role: role,
        wind_farm: 'WF-25 Northern Escarpment (25 Turbines)'
      });
      onClose();
    }, 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userName = authMode === 'signup' ? name : (email.split('@')[0] || 'User');
      const role = authMode === 'signup' ? selectedRole : currentRole;
      
      setUserRole(role);
      onAuthSuccess({
        name: userName,
        email: email,
        role: role,
        wind_farm: farmName
      });
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '0', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#fafbfc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div className="badge-pill badge-pill-primary" style={{ marginBottom: '0.25rem', fontSize: '0.625rem', padding: '0.12rem 0.45rem' }}>
              ZEPHYRPULSE SECURITY
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
              {authMode === 'signin' ? 'Sign In to Fleet Console' : 'Create Enterprise Account'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ borderRadius: '50%', padding: '0.35rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
          <button
            onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: authMode === 'signin' ? '#ffffff' : '#f8fafc',
              borderBottom: authMode === 'signin' ? '2.5px solid var(--primary)' : 'none',
              fontWeight: authMode === 'signin' ? 700 : 500,
              color: authMode === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: authMode === 'signup' ? '#ffffff' : '#f8fafc',
              borderBottom: authMode === 'signup' ? '2.5px solid var(--primary)' : 'none',
              fontWeight: authMode === 'signup' ? 700 : 500,
              color: authMode === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
            }}
          >
            Sign Up
          </button>
        </div>

        <div style={{ padding: '1.35rem 1.5rem' }}>
          
          {/* Quick Demo Login Presets */}
          {authMode === 'signin' && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '0.85rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                ONE-CLICK DEMO LOGIN PRESETS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Site Manager', 'manager@zephyrfleet.io', 'Arun Verma')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.71875rem', padding: '0.4rem 0.65rem' }}
                >
                  <span style={{ fontWeight: 600 }}>👔 Site Reliability Manager</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Maintenance Lead', 'crew@zephyrfleet.io', 'Rajesh Kumar')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.71875rem', padding: '0.4rem 0.65rem' }}
                >
                  <span style={{ fontWeight: 600 }}>🔧 Field Maintenance Lead</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('HCLTech Judge', 'judge@hcltech-hackathon.ai', 'HCLTech Evaluator')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.71875rem', padding: '0.4rem 0.65rem', borderColor: '#c7d2fe', backgroundColor: '#eef2ff' }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>⚖️ HCLTech Hackathon Judge</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Login →</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              marginBottom: '1rem',
            }}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {authMode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  FULL NAME
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shivam Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem 0.5rem 1.9rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                WORK EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="engineer@windpower.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem 0.5rem 1.9rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 2.2rem 0.5rem 1.9rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    ACCOUNT ROLE
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="Site Manager">Site Reliability Manager (Commercial & Approvals)</option>
                    <option value="Maintenance Lead">Field Maintenance Lead (Crews & Rigging)</option>
                    <option value="HCLTech Judge">HCLTech Hackathon Judge (Rubric & Audit)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    ASSIGNED WIND FARM
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.65rem 0.5rem 1.9rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.8125rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', fontWeight: 700, marginTop: '0.35rem', fontSize: '0.8125rem' }}
            >
              {isLoading ? 'Authenticating...' : (authMode === 'signin' ? 'Sign In to Console' : 'Create Account & Launch Console')} <ArrowRight size={14} />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
