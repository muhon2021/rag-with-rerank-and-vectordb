import React, { useEffect, useState } from 'react';
import RoleTable from './RoleTable.jsx';
import { getRoles, deleteRole } from './mockData.js';

export default function RolesListPage({ navigate }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (e) {
      setError('Failed to load roles');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this role?')) return;
    await deleteRole(id);
    console.log('DELETE /api/admin/roles/:id', id);
    load();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Role Management</h1>
        <button
          onClick={() => navigate('/dashboard/roles/new')}
          style={{ padding: '8px 12px', background: '#22c55e', color: '#fff', border: '1px solid #16a34a', borderRadius: 8, cursor: 'pointer' }}
        >
          + Create Role
        </button>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading roles…</div>
      ) : (
        <RoleTable
          roles={roles}
          onEdit={(id) => navigate(`/dashboard/roles/${id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
