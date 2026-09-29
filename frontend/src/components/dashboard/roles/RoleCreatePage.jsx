import { useState } from 'react';

export default function RoleCreatePage({ navigate, Link }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [permissions, setPermissions] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Role name is required';
    if (!type) e.type = 'Role type is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const payload = {
      name: name.trim(),
      type,
      permissions: permissions
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    };

    // For now, just log and navigate back to list
    console.log('Create role payload', payload);
    alert('Role created successfully (mock).');
    navigate('/dashboard/roles');
  };

  const groupStyle = { marginBottom: '0.75rem' };
  const labelStyle = { display: 'block', fontWeight: 500, marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' };
  const errorStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: '0.25rem' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Create New Role</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Define a new role with specific permissions.</p>

      <form onSubmit={handleSubmit} className="data-form" noValidate>
        <div className="form-group" style={groupStyle}>
          <label htmlFor="roleName" className="form-label" style={labelStyle}>Role Name</label>
          <input
            type="text"
            id="roleName"
            name="name"
            className="form-input"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Editor"
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
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            placeholder="e.g., read,write,delete"
          />
          <small className="form-hint" style={{ color: '#6b7280' }}>Enter permissions as a comma-separated list.</small>
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="button primary-button">Create Role</button>
          <Link to="/dashboard/roles" className="button secondary-button" activeClassName="">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
