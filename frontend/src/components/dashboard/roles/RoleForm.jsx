import React, { useState, useEffect } from 'react';
import { ROLE_TYPES } from '../../../constants/dashboard';

export default function RoleForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || ROLE_TYPES.USER);
  const [permissions, setPermissions] = useState(initialData.permissions || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || ROLE_TYPES.USER);
      setPermissions(initialData.permissions || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, type, permissions });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Role Name</label>
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
        <label htmlFor="type" className="form-label">Role Type</label>
        <select
          id="type"
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value={ROLE_TYPES.USER}>User</option>
          <option value={ROLE_TYPES.SYSTEM}>System</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="permissions" className="form-label">Permissions (comma-separated)</label>
        <input
          type="text"
          id="permissions"
          className="form-input"
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
        />
      </div>

      <button type="submit" className="form-button">
        {isEdit ? 'Update Role' : 'Create Role'}
      </button>
    </form>
  );
}
