import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import FleetMatrixView from './components/FleetMatrixView';
import OptimizerView from './components/OptimizerView';
import QueryEngineView from './components/QueryEngineView';
import DataIntegrityView from './components/DataIntegrityView';
import BenchmarkView from './components/BenchmarkView';
import AuthModal from './components/AuthModal';
import { Wind, Shield, CheckCircle2, UserCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'console'
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'optimizer' | 'query' | 'validation' | 'benchmarks'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('Site Manager');
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLaunchConsole = (preferredTab = 'fleet') => {
    setActiveTab(preferredTab);
    setCurrentView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScheduleTurbine = (turbineId) => {
    setActiveTab('optimizer');
    setCurrentView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    setUserRole(userObj.role);
    setCurrentView('console');
    showToast(`Welcome back, ${userObj.name}! Active Role: ${userObj.role}`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('Signed out of ZephyrPulse console.');
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
    showToast(`Switched workspace role to: ${newRole}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1100,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.65rem 1.15rem',
          borderRadius: '8px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideUp 0.2s ease',
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={() => setIsAuthModalOpen(true)}
        userRole={userRole}
        setUserRole={handleRoleChange}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' ? (
          <LandingView 
            onLaunchConsole={() => handleLaunchConsole('fleet')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            userRole={userRole}
          />
        ) : (
          <div>
            {activeTab === 'fleet' && <FleetMatrixView onScheduleTurbine={handleScheduleTurbine} userRole={userRole} />}
            {activeTab === 'optimizer' && <OptimizerView userRole={userRole} />}
            {activeTab === 'query' && <QueryEngineView userRole={userRole} />}
            {activeTab === 'validation' && <DataIntegrityView userRole={userRole} />}
            {activeTab === 'benchmarks' && <BenchmarkView userRole={userRole} />}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer style={{
        backgroundColor: '#fafbfc',
        borderTop: '1px solid var(--border-light)',
        padding: '2.5rem 0 1.75rem 0',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
              }}>
                <Wind size={16} />
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  ZephyrPulse AI
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
                  Wind Fleet Health & Maintenance Window Optimizer
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLaunchConsole('fleet'); }}>Fleet Matrix (25)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLaunchConsole('optimizer'); }}>OR-Tools Optimizer</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLaunchConsole('query'); }}>POST /analyze</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLaunchConsole('validation'); }}>Annex B Validator</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLaunchConsole('benchmarks'); }}>Evaluation Suite</a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            paddingTop: '1.25rem',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
          }}>
            <div>
              HCLTech Future Ready AI Engineer Hackathon • Project ID: SRS-WFHMO-001
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Shield size={13} color="#10b981" />
              <span>Strict Annex A Rule & IEC Class II Power Curve Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Fully Functional Sign In / Sign Up) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentRole={userRole}
        setUserRole={setUserRole}
      />

    </div>
  );
}
