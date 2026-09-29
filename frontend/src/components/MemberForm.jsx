import React, { useEffect, useState } from 'react';
import { getRoles } from './mockData.js';

export default function MemberForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolesStr, setRolesStr] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const rs = await getRoles();
      if (mounted) setAvailableRoles(rs);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRolesStr(Array.isArray(initialData.roles) ? initialData.roles.join(',') : '');
      // Password left blank when editing; only set when creating or intentionally changing
    }
  }, [initialData]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    // Password is required only when creating (no initialData)
    if (!initialData && !password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const roles = rolesStr
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = { name: name.trim(), email: email.trim(), roles };
    if (password.trim()) payload.password = password.trim();
    if (onSubmit) onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <div style={fieldWrap}>
        <label style={label}>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={input} required />
        {errors.name && <div style={err}>{errors.name}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={label}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} required />
        {errors.email && <div style={err}>{errors.email}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={label}>Password {initialData ? <span style={{ color: '#64748b', fontWeight: 400 }}>(leave blank to keep unchanged)</span> : null}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} placeholder={initialData ? '••••••••' : ''} />
        {errors.password && <div style={err}>{errors.password}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={label}>Roles (comma-separated role IDs)</label>
        <input type="text" value={rolesStr} onChange={(e) => setRolesStr(e.target.value)} style={input} placeholder="r1,r2" />
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          Available roles: {availableRoles.map((r) => `${r.id}:${r.name}`).join(' | ')}
        </div>
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
