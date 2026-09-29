import React, { useState, useEffect } from 'react';

export default function MemberForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [roles, setRoles] = useState(initialData.roles || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPassword(initialData.password || '');
      setRoles(initialData.roles || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, roles });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Member Name</label>
        <input
          type="text"
          id="name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!isEdit}
        />
        {isEdit && <p className="form-hint">Leave blank to keep current password.</p>}
      </div>

      <div className="form-group">
        <label htmlFor="roles" className="form-label">Roles (comma-separated)</label>
        <input
          type="text"
          id="roles"
          className="form-input"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
        />
      </div>

      <button type="submit" className="form-button">
        {isEdit ? 'Update Member' : 'Create Member'}
      </button>
    </form>
  );
}
