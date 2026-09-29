import { config } from '../config.js';

/**
 * Admin-only authentication middleware.
 *
 * This learning lab does not ship a full auth system. For local development,
 * enable admin access by setting MOCK_ADMIN_ENABLED=true in your .env file.
 *
 * In production, replace this logic with real session/JWT/role checks.
 */
export function adminAuth(req, res, next) {
  try {
    // Prefer explicit env flag for local development
    const envEnabled = process.env.MOCK_ADMIN_ENABLED === 'true';
    // Fallback to config if exposed there
    const cfgEnabled = typeof config?.mockAdminEnabled !== 'undefined' && String(config.mockAdminEnabled) === 'true';

    if (envEnabled || cfgEnabled) {
      return next();
    }

    // Optionally allow a dev header override when MOCK_ADMIN_HEADER=true
    const headerBypassAllowed = process.env.MOCK_ADMIN_HEADER === 'true';
    if (headerBypassAllowed && (req.headers['x-admin'] === 'true' || req.headers['x-admin-token'] === process.env.MOCK_ADMIN_TOKEN)) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden', code: 'ADMIN_REQUIRED', message: 'Admin access required. Set MOCK_ADMIN_ENABLED=true for local development.' });
  } catch (err) {
    return res.status(500).json({ error: 'Auth middleware failed', code: 'ADMIN_AUTH_ERROR', message: err?.message || 'Unknown error' });
  }
}
