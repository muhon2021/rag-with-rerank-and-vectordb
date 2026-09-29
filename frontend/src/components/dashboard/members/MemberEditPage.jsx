import { useEffect, useState } from 'react';

function validateEmail(v) {
  return /.+@.+\..+/.test(v);
}

export default function MemberEditPage({ id, navigate, Link }) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', roles: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      if (cancelled) return;
      const mock = { id, name: 'Jane Smith', email: 'jane@example.com', roles: ['Admin'] };
      setForm({ name: mock.name, email: mock.email, password: '', roles: mock.roles.join(',') });
      setLoading(false);
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !validateEmail(form.email)) e.email = 'Valid email is required';
    // Password optional for edit; if present, enforce min length
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
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
      email: form.email.trim(),
      password: form.password || undefined,
      roles: form.roles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    };

    console.log('Update member payload', payload);
    alert(`Member ${id} updated successfully (mock).`);
    navigate('/dashboard/members');
  };

  if (loading) return <div className="dashboard-page-content">Loading member details...</div>;

  const groupStyle = { marginBottom: '0.75rem' };
  const labelStyle = { display: 'block', fontWeight: 500, marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' };
  const errorStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: '0.25rem' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Edit Member: {form.name} (ID: {id})</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Update member details and assigned roles.</p>

      <form onSubmit={handleSubmit} className="data-form" noValidate>
        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberName" className="form-label" style={labelStyle}>Name</label>
          <input
            type="text"
            id="memberName"
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
          <label htmlFor="memberEmail" className="form-label" style={labelStyle}>Email</label>
          <input
            type="email"
            id="memberEmail"
            name="email"
            className="form-input"
            style={inputStyle}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberPassword" className="form-label" style={labelStyle}>Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            id="memberPassword"
            name="password"
            className="form-input"
            style={inputStyle}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          {errors.password && <div style={errorStyle}>{errors.password}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberRoles" className="form-label" style={labelStyle}>Roles (comma-separated)</label>
          <input
            type="text"
            id="memberRoles"
            name="roles"
            className="form-input"
            style={inputStyle}
            value={form.roles}
            onChange={(e) => setForm((f) => ({ ...f, roles: e.target.value }))}
          />
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="button primary-button">Update Member</button>
          <Link to="/dashboard/members" className="button secondary-button" activeClassName="">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
