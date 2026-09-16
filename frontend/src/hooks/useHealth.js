import { useState, useEffect, useCallback } from 'react';
import { fetchHealth } from '../api/client.js';

export function useHealth(intervalMs = 15000) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
      setBackendOnline(true);
    } catch {
      setHealth(null);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  const totalVectors = health?.namespaces
    ? Object.values(health.namespaces).reduce((a, b) => a + b, 0)
    : 0;

  return { health, loading, backendOnline, totalVectors, refresh };
}
