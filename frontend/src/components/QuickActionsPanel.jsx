import React, { useState } from 'react';
import { fetchHealth, runIngest } from '../api/client.js';

export default function QuickActionsPanel({ navigate }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const onRoles = () => navigate ? navigate('/dashboard/roles') : (window.location.href = '/dashboard/roles');
  const onMembers = () => navigate ? navigate('/dashboard/members') : (window.location.href = '/dashboard/members');

  async function onHealth() {
    setBusy(true);
    setResult(null);
    try {
      const data = await fetchHealth();
      setResult({ ok: true, data });
    } catch (err) {
      setResult({ ok: false, error: err.message || 'Health check failed' });
    } finally {
      setBusy(false);
    }
  }

  async function onReindex() {
    if (!confirm('Trigger re-index/ingest now? This may take a while.')) return;
    setBusy(true);
    setResult(null);
    try {
      const data = await runIngest();
      setResult({ ok: true, data });
      alert('Ingest triggered successfully. Check server logs for progress.');
    } catch (err) {
      setResult({ ok: false, error: err.message || 'Failed to trigger ingest' });
      alert('Failed to trigger ingest: ' + (err.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  }

  const btnBase = {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    cursor: busy ? 'not-allowed' : 'pointer',
    minWidth: 160,
    fontWeight: 600
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button style={btnBase} onClick={onRoles} disabled={busy}>Role Management</button>
        <button style={btnBase} onClick={onMembers} disabled={busy}>Member Management</button>
        <button style={{ ...btnBase, background: '#0b5ed7', color: '#fff', borderColor: '#0b5ed7' }} onClick={onReindex} disabled={busy}>Re-index / Ingest</button>
        <button style={{ ...btnBase, background: '#10b981', color: '#fff', borderColor: '#10b981' }} onClick={onHealth} disabled={busy}>Run Health Checks</button>
      </div>
      {result && (
        <div style={{ marginTop: 12, fontSize: 13, color: result.ok ? '#065f46' : '#991b1b' }}>
          {result.ok ? 'Success' : 'Failed'}
        </div>
      )}
    </div>
  );
}
