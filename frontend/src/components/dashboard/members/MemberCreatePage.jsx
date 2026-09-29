import { useState } from 'react';

function validateEmail(v) {
  // Simple RFC2822-like email check
  return /.+@.+\..+/.test(v);
}

export default function MemberCreatePage({ navigate, Link }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !validateEmail(email)) e.email = 'Valid email is required';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      roles: roles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    };

    console.log('Create member payload', payload);
    alert('Member created successfully (mock).');
    navigate('/dashboard/members');
  };

  const groupStyle = { marginBottom: '0.75rem' };
  const labelStyle = { display: 'block', fontWeight: 500, marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' };
  const errorStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: '0.25rem' };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Create New Member</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '0.75rem' }}>Add a new member and assign optional roles.</p>

      <form onSubmit={handleSubmit} className="data-form" noValidate>
        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberName" className="form-label" style={labelStyle}>Name</label>
          <input
            type="text"
            id="memberName"
            name="name"
            className="form-input"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberPassword" className="form-label" style={labelStyle}>Password</label>
          <input
            type="password"
            id="memberPassword"
            name="password"
            className="form-input"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <div style={errorStyle}>{errors.password}</div>}
        </div>

        <div className="form-group" style={groupStyle}>
          <label htmlFor="memberRoles" className="form-label" style={labelStyle}>Roles (comma-separated, optional)</label>
          <input
            type="text"
            id="memberRoles"
            name="roles"
            className="form-input"
            style={inputStyle}
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            placeholder="e.g., Admin,Editor"
          />
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="button primary-button">Create Member</button>
          <Link to="/dashboard/members" className="button secondary-button" activeClassName="">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
