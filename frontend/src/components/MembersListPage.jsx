import React, { useEffect, useState } from 'react';
import MemberTable from './MemberTable.jsx';
import { getMembers, deleteMember, getRoleNameMap } from './mockData.js';

export default function MembersListPage({ navigate }) {
  const [members, setMembers] = useState([]);
  const [roleNameMap, setRoleNameMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      const [ms, map] = await Promise.all([getMembers(), getRoleNameMap()]);
      setMembers(ms);
      setRoleNameMap(map);
    } catch (e) {
      setError('Failed to load members');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this member?')) return;
    await deleteMember(id);
    console.log('DELETE /api/admin/members/:id', id);
    load();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Member Management</h1>
        <button
          onClick={() => navigate('/dashboard/members/new')}
          style={{ padding: '8px 12px', background: '#22c55e', color: '#fff', border: '1px solid #16a34a', borderRadius: 8, cursor: 'pointer' }}
        >
          + Create Member
        </button>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading members…</div>
      ) : (
        <MemberTable
          members={members}
          roleNameMap={roleNameMap}
          onEdit={(id) => navigate(`/dashboard/members/${id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
