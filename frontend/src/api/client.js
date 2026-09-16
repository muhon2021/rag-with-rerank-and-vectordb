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
