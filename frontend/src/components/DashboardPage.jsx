import React, { useEffect, useState } from 'react';
import { getCounts } from './mockData.js';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ roles: 0, members: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await getCounts();
      if (mounted) {
        setCounts(c);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Overview</h1>
      <p>Welcome to the admin dashboard. Use the sidebar to navigate.</p>

      {loading ? (
        <div>Loading summary…</div>
      ) : (
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, minWidth: 220 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Total Roles</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{counts.roles}</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, minWidth: 220 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Total Members</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{counts.members}</div>
          </div>
        </div>
      )}
    </div>
  );
}
