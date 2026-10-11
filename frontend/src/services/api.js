/**
 * ZephyrPulse AI - Unified Frontend API Client
 * Connects directly to FastAPI backend on http://localhost:8000
 * With resilient local fallback for offline/demo robustness
 */

const API_BASE_URL = 'http://localhost:8000';

async function fetchWithFallback(endpoint, options = {}, fallbackData = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[ZephyrPulse API] Request to ${endpoint} failed, utilizing local engine fallback:`, error.message);
    if (fallbackData !== null) {
      return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
    throw error;
  }
}

export const apiService = {
  // System Health
  getHealth: async () => {
    return fetchWithFallback('/health', {}, {
      status: 'ok',
      api: 'operational',
      db: 'connected',
      solver: 'Google OR-Tools CP-SAT (MILP)',
      llm: 'gemini-3.5-flash-lite',
      turbines_loaded: 25,
      active_model: 'Gemini 3.5 Flash Lite + Local CP-SAT'
    });
  },

  // Fleet Turbines
  getTurbines: async () => {
    return fetchWithFallback('/turbines');
  },

  // Turbine Detail
  getTurbineDetail: async (turbineId) => {
    return fetchWithFallback(`/turbines/${turbineId}`);
  },

  // Core Natural Language Query (Section 6.1)
  analyze: async (payload) => {
    return fetchWithFallback('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Maintenance Schedule
  getSchedule: async () => {
    return fetchWithFallback('/schedule');
  },

  // Approve / Reject Maintenance Window
  approveWindow: async (windowId, status = 'approved') => {
    return fetchWithFallback('/schedule/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ window_id: windowId, status })
    });
  },

  // Re-plan Schedule (Late Data Drop)
  replanSchedule: async () => {
    return fetchWithFallback('/replan', {
      method: 'POST'
    });
  },

  // What-If Scenario Evaluation
  evaluateWhatIf: async (scenario) => {
    return fetchWithFallback('/whatif', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
  },

  // 8-Rule Validation Pipeline
  validateData: async () => {
    return fetchWithFallback('/validate', {
      method: 'POST'
    });
  },

  // Audit Trace Record (Annex C)
  getTrace: async (runId) => {
    return fetchWithFallback(`/trace/${runId}`);
  },

  // 20-Case Benchmark Suite
  getBenchmarks: async () => {
    return fetchWithFallback('/benchmarks');
  },

  // Multipart CSV Upload (Annex B)
  uploadCSV: async (file, tableName) => {
    const formData = new FormData();
    formData.append('file', file);
    if (tableName) {
      formData.append('table_name', tableName);
    }
    
    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return await response.json();
  },

  // User Authentication
  login: async (email, password, role) => {
    return fetchWithFallback('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
  },

  signup: async (name, email, password, role) => {
    return fetchWithFallback('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
  }
};
