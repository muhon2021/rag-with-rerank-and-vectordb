import React from 'react';

function ActivityItem({ evt }) {
  const ts = new Date(evt.timestamp);
  const time = isNaN(ts.getTime()) ? evt.timestamp : ts.toLocaleString();
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ fontSize: 13, color: '#6b7280' }}>{time} — <span style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>{evt.type}</span></div>
      <div style={{ fontWeight: 600, marginTop: 4 }}>{evt.message}</div>
      <div style={{ fontSize: 13, color: '#64748b' }}>by {evt.actor || 'system'}</div>
      {evt.details ? <pre style={{ background: '#f8fafc', padding: 8, borderRadius: 6, marginTop: 6, overflowX: 'auto' }}>{JSON.stringify(evt.details, null, 2)}</pre> : null}
    </div>
  );
}

export default function RecentActivityFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div style={{ border: '1px dashed #e5e7eb', borderRadius: 8, padding: 16, color: '#6b7280', background: '#fff' }}>
        No recent activity.
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      {events.map((evt) => (
        <ActivityItem key={evt.id} evt={evt} />
      ))}
    </div>
  );
}
