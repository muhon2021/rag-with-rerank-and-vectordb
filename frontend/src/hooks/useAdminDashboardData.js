import { useEffect, useMemo, useState } from 'react';
import { ApiError, fetchAdminActivity, fetchAdminStats } from '../api/client.js';

export function useAdminDashboardData({ activityLimit = 20 } = {}) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [s, a] = await Promise.all([
          fetchAdminStats(),
          fetchAdminActivity(activityLimit),
        ]);
        if (!mounted) return;
        setStats(s);
        setActivity(Array.isArray(a) ? a : []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof ApiError ? err : new ApiError(err?.message || 'Failed to load dashboard', 'UNKNOWN', 0));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [activityLimit]);

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return error.status === 403 ? 'forbidden' : 'error';
    return 'ready';
  }, [loading, error]);

  return { stats, activity, loading, error, status };
}
