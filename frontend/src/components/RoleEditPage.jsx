import React, { useEffect, useState } from 'react';
import RoleForm from './RoleForm.jsx';
import { getRoleById, updateRole } from './mockData.js';

export default function RoleEditPage({ id, navigate }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getRoleById(id);
      if (mounted) {
        setRole(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!role) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Edit Role</h1>
        <div style={{ color: '#b91c1c', marginBottom: 12 }}>Role not found.</div>
        <button onClick={() => navigate('/dashboard/roles')} style={btn}>Back to Roles</button>
      </div>
    );
  }

  async function handleSubmit(payload) {
    console.log('PUT /api/admin/roles/:id', id, payload);
    await updateRole(id, payload);
    navigate('/dashboard/roles');
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Edit Role</h1>
      <RoleForm
        initialData={role}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/roles')}
      />
    </div>
  );
}

const btn = { padding: '8px 12px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer' };
