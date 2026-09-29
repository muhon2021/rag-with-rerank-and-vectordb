import React from 'react';

export default function MetricCard({ title, value, suffix, status }) {
  const isStatusCard = typeof status === 'string' && ['ok', 'warning', 'error'].includes(status);

  const color = isStatusCard
    ? status === 'ok'
      ? '#15803d'
      : status === 'warning'
      ? '#b45309'
      : '#b91c1c'
    : '#0b5ed7';

  return (
    <div className="card" style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 16,
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
    }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>
        {value}
        {suffix ? <span style={{ fontSize: 14, marginLeft: 6, color: '#6b7280', fontWeight: 500 }}>{suffix}</span> : null}
      </div>
    </div>
  );
}
