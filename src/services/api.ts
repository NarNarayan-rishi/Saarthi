/**
 * API Service Layer
 * All frontend <-> backend communication goes through this file.
 * Change BACKEND_URL to your deployed server URL when going live.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  try { return localStorage.getItem('saarthi_jwt_token'); } catch { return null; }
}

function setToken(token: string) {
  try { localStorage.setItem('saarthi_jwt_token', token); } catch {}
}

function clearToken() {
  try { localStorage.removeItem('saarthi_jwt_token'); } catch {}
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(role: string, email?: string) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role, email: email || `demo_${role}@saarthi.app` }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function apiRegister(name: string, email: string, password: string, role: string) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export function apiLogout() {
  clearToken();
}

export async function apiGetMe() {
  return apiFetch('/api/auth/me');
}

export async function apiUnlinkAccount(platform: 'linkedin' | 'naukri') {
  return apiFetch('/api/auth/unlink', {
    method: 'POST',
    body: JSON.stringify({ platform }),
  });
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function apiGetJobs() {
  return apiFetch('/api/jobs');
}

export async function apiCreateJob(jobData: object) {
  return apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(jobData) });
}

export async function apiUpdatePipeline(jobId: string, pipeline: object[]) {
  return apiFetch(`/api/jobs/${jobId}/pipeline`, {
    method: 'PUT',
    body: JSON.stringify({ pipeline }),
  });
}

export async function apiPublishPipeline(jobId: string) {
  return apiFetch(`/api/jobs/${jobId}/publish`, { method: 'PUT' });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function apiGetApplications() {
  return apiFetch('/api/applications');
}

export async function apiApplyToJob(applicationData: object) {
  return apiFetch('/api/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function apiGetMessages() {
  return apiFetch('/api/messages');
}

export async function apiSendMessage(messageData: object) {
  return apiFetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

export async function apiReplyToMessage(threadId: string, message: object) {
  return apiFetch(`/api/messages/${threadId}/reply`, {
    method: 'PUT',
    body: JSON.stringify(message),
  });
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function apiHealthCheck() {
  try {
    const data = await apiFetch('/api/health');
    return { online: true, message: data.message };
  } catch {
    return { online: false, message: 'Backend offline - running in offline mode' };
  }
}
