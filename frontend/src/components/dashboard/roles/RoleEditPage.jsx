import { useEffect, useState } from 'react';

export default function RoleEditPage({ id, navigate, Link }) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: 'user', permissions: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Simulate fetching role data
    const t = setTimeout(() => {
      if (cancelled) return;
      const mock = { id, name: `Role ${id} Name`, type: 'user', permissions: ['read', 'write', 'update'] };
      setForm({ name: mock.name, type: mock.type, permissions: mock.permissions.join(',') });
      setLoading(false);
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Role name is required';
    if (!form.type) e.type = 'Role type is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const payload = {
      id,
      name: form.name.trim(),
      type: form.type,
      permissions: form.permissions
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    };
    console.log('Update role payload', payload);
    alert(`Role ${id} updated successfully (mock).`);
    navigate('/dashboard/roles');
  };

  if (loading) return <div className="dashboard-page-content">Loading role details...</div>;

  const groupStyle = { marginBottom: '0.75rem' };
  const labelStyle = { display: 'block', fontWeight: 500, marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' };
  const errorStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: '0.25rem' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Edit Role: {form.name} (ID: {id})</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Update the details and permissions for this role.</p>

      <form onSubmit={handleSubmit} className="data-form" noValidate>
        <div className="form-group" style={groupStyle}>
          <label htmlFor="roleName" className="form-label" style={labelStyle}>Role Name</label>
          <input
            type="text"
            id="roleName"
            name="name"
            className="form-input"
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="roleType" className="form-label" style={labelStyle}>Role Type</label>
          <select
            id="roleType"
            name="type"
            className="form-select"
            style={inputStyle}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            required
          >
            <option value="">Select Type</option>
            <option value="user">User</option>
            <option value="system">System</option>
          </select>
          {errors.type && <div style={errorStyle}>{errors.type}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="rolePermissions" className="form-label" style={labelStyle}>Permissions (comma-separated)</label>
          <input
            type="text"
            id="rolePermissions"
            name="permissions"
            className="form-input"
            style={inputStyle}
            value={form.permissions}
            onChange={(e) => setForm((f) => ({ ...f, permissions: e.target.value }))}
          />
          <small className="form-hint" style={{ color: '#6b7280' }}>Enter permissions as a comma-separated list.</small>
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="button primary-button">Update Role</button>
          <Link to="/dashboard/roles" className="button secondary-button" activeClassName="">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
