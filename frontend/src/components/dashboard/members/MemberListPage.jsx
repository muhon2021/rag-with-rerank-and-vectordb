import { useMemo, useState } from 'react';

export default function MemberListPage({ Link }) {
  const initial = useMemo(
    () => [
      { id: 'mem-1', name: 'Jane Smith', email: 'jane@example.com', roles: ['Admin'] },
      { id: 'mem-2', name: 'John Doe', email: 'john@example.com', roles: ['Editor'] },
      { id: 'mem-3', name: 'Alex Lee', email: 'alex@example.com', roles: ['Viewer'] }
    ],
    []
  );
  const [members, setMembers] = useState(initial);

  const removeMember = (id) => {
    if (!confirm('Delete this member? This action cannot be undone.')) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const thtd = { borderBottom: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Member Management</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Manage members with assigned roles.</p>

      <div className="action-bar" style={{ marginBottom: '0.75rem' }}>
        <Link to="/dashboard/members/new" className="button primary-button" activeClassName="">Create New Member</Link>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
        <table className="data-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>ID</th>
              <th style={thtd}>Name</th>
              <th style={thtd}>Email</th>
              <th style={thtd}>Roles</th>
              <th style={thtd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td style={thtd}>{m.id}</td>
                <td style={thtd}>{m.name}</td>
                <td style={thtd}>{m.email}</td>
                <td style={thtd}>{m.roles.join(', ')}</td>
                <td style={thtd}>
                  <Link to={`/dashboard/members/${m.id}/edit`} className="button secondary-button" activeClassName="">Edit</Link>
                  <button
                    type="button"
                    className="button danger-button"
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => removeMember(m.id)}
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
