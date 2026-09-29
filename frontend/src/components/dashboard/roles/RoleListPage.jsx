import { useMemo, useState } from 'react';

export default function RoleListPage({ Link, navigate }) {
  const initial = useMemo(
    () => [
      { id: 'role-1', name: 'Admin', type: 'system', permissions: ['all'] },
      { id: 'role-2', name: 'Editor', type: 'user', permissions: ['read', 'write'] },
      { id: 'role-3', name: 'Viewer', type: 'user', permissions: ['read'] }
    ],
    []
  );
  const [roles, setRoles] = useState(initial);

  const removeRole = (id) => {
    if (!confirm('Delete this role? This action cannot be undone.')) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const thtd = { borderBottom: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Role Management</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Manage user roles and their associated permissions.</p>

      <div className="action-bar" style={{ marginBottom: '0.75rem' }}>
        <Link to="/dashboard/roles/new" className="button primary-button" activeClassName="" >Create New Role</Link>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
        <table className="data-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>ID</th>
              <th style={thtd}>Name</th>
              <th style={thtd}>Type</th>
              <th style={thtd}>Permissions</th>
              <th style={thtd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td style={thtd}>{role.id}</td>
                <td style={thtd}>{role.name}</td>
                <td style={thtd}>{role.type}</td>
                <td style={thtd}>{role.permissions.join(', ')}</td>
                <td style={thtd}>
                  <Link to={`/dashboard/roles/${role.id}/edit`} className="button secondary-button" activeClassName="">Edit</Link>
                  <button
                    type="button"
                    className="button danger-button"
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => removeRole(role.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
