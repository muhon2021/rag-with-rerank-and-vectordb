import React from 'react';
import MetricCard from './MetricCard.jsx';
import RecentActivityFeed from './RecentActivityFeed.jsx';
import QuickActionsPanel from './QuickActionsPanel.jsx';
import { useAdminDashboardData } from '../hooks/useAdminDashboardData.js';

export default function DashboardOverviewPage({ navigate }) {
  const { stats, activity, loading, error, status } = useAdminDashboardData({ activityLimit: 20 });

  if (status === 'forbidden') {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Overview</h2>
        <div style={{ border: '1px solid #fee2e2', background: '#fef2f2', color: '#991b1b', borderRadius: 8, padding: 16 }}>
          Access denied. Admin-only area.
          <div style={{ marginTop: 8, color: '#7f1d1d' }}>For local development, set <code>MOCK_ADMIN_ENABLED=true</code> in your <code>.env</code> and restart the API server.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Overview</h2>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <MetricCard title="Total members" value={loading ? '…' : stats?.members ?? '—'} />
        <MetricCard title="Total roles" value={loading ? '…' : stats?.roles ?? '—'} />
        <MetricCard title="Total vectors indexed" value={loading ? '…' : stats?.totalVectors ?? '—'} />
        <MetricCard title="Backend status" value={loading ? '…' : (stats?.backendStatus || '—')} status={stats?.backendStatus} />
      </div>

      {/* Last ingest */}
      <div style={{ marginTop: 12, color: '#6b7280' }}>
        {loading ? 'Loading latest ingest time…' : (
          stats?.lastIngestAt ? `Last ingest: ${new Date(stats.lastIngestAt).toLocaleString()}` : 'No recent ingest recorded.'
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 16 }}>
        <QuickActionsPanel navigate={navigate} />
      </div>

      {/* Activity */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent activity</div>
        {status === 'loading' && (
          <div style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: 16 }}>Loading…</div>
        )}
        {status === 'error' && (
          <div style={{ border: '1px solid #fee2e2', background: '#fef2f2', color: '#991b1b', borderRadius: 8, padding: 16 }}>
            Failed to load dashboard data: {error?.message || 'Unknown error'}
          </div>
        )}
        {status === 'ready' && (
          <RecentActivityFeed events={activity} />
        )}
      </div>
    </div>
  );
}
