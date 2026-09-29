import React from 'react';

export default function RoleTable({ roles, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Type</th>
            <th style={th}>Permissions</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td style={td}>{r.id}</td>
              <td style={td}>{r.name}</td>
              <td style={td}>{r.type}</td>
              <td style={td}>{Array.isArray(r.permissions) ? r.permissions.join(', ') : ''}</td>
              <td style={td}>
                <button style={btn} onClick={() => onEdit && onEdit(r.id)}>Edit</button>
                <button style={{ ...btn, background: '#fee2e2', color: '#b91c1c' }} onClick={() => onDelete && onDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: 'left',
  padding: '10px 8px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: 12,
  color: '#555',
  textTransform: 'uppercase'
};

const td = {
  padding: '10px 8px',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'top'
};

const btn = {
  marginRight: 8,
  padding: '6px 10px',
  background: '#eef2ff',
  color: '#3730a3',
  border: '1px solid #c7d2fe',
  borderRadius: 6,
  cursor: 'pointer'
};
