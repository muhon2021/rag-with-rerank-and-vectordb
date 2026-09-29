const API_BASE = import.meta.env.VITE_API_URL || '';
const TIMEOUT_MS = 60000;

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data.error || res.statusText || 'Request failed',
        data.code || 'API_ERROR',
        res.status
      );
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request took too long. Please try again.', 'TIMEOUT', 504);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      'Cannot reach backend. Is the server running on port 3001?',
      'NETWORK_ERROR',
      0
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchHealth() {
  return request('/api/health');
}

export function sendChat(stage, message) {
  return request(`/api/chat/${stage}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export function compareAll(message) {
  return request('/api/chat/compare-all', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export function getRoles() {
  return Promise.resolve([
    { id: 1, name: 'Admin', type: 'system', permissions: 'read,write' },
    { id: 2, name: 'User', type: 'user', permissions: 'read' },
  ]);
}

export function createRole(data) {
  console.log('Creating role:', data);
  return Promise.resolve();
}

export function getRoleById(id) {
  return Promise.resolve({ id, name: 'Admin', type: 'system', permissions: 'read,write' });
}

export function updateRole(id, data) {
  console.log('Updating role:', id, data);
  return Promise.resolve();
}

export function getMembers() {
  return Promise.resolve([
    { id: 1, name: 'John Doe', email: 'john@example.com', roles: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', roles: 'User' },
  ]);
}

export function createMember(data) {
  console.log('Creating member:', data);
  return Promise.resolve();
}

export function getMemberById(id) {
  return Promise.resolve({ id, name: 'John Doe', email: 'john@example.com', roles: 'Admin' });
}

export function updateMember(id, data) {
  console.log('Updating member:', id, data);
  return Promise.resolve();
}
