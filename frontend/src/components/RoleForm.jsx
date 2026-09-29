import React, { useEffect, useState } from 'react';

export default function RoleForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('user');
  const [permissionsStr, setPermissionsStr] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'user');
      setPermissionsStr(Array.isArray(initialData.permissions) ? initialData.permissions.join(', ') : '');
    }
  }, [initialData]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!type) e.type = 'Type is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const permissions = permissionsStr
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = { name: name.trim(), type, permissions };
    if (onSubmit) onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      <div style={fieldWrap}>
        <label style={label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          required
        />
        {errors.name && <div style={err}>{errors.name}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={label}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={input} required>
          <option value="user">user</option>
          <option value="system">system</option>
        </select>
        {errors.type && <div style={err}>{errors.type}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={label}>Permissions (comma-separated)</label>
        <textarea
          value={permissionsStr}
          onChange={(e) => setPermissionsStr(e.target.value)}
          style={{ ...input, minHeight: 80, resize: 'vertical' }}
          placeholder="manage_users, view_reports"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="submit" style={primaryBtn}>Save</button>
        <button type="button" style={secondaryBtn} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

const fieldWrap = { marginBottom: 12 };
const label = { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 };
const input = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' };
const err = { color: '#b91c1c', fontSize: 12, marginTop: 6 };
const primaryBtn = { padding: '8px 12px', background: '#0ea5e9', color: '#fff', border: '1px solid #0284c7', borderRadius: 8, cursor: 'pointer', marginRight: 8 };
const secondaryBtn = { padding: '8px 12px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer' };
