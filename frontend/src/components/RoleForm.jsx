import React, { useState } from 'react';
import { ROLE_TYPES } from '../constants/dashboard';

const RoleForm = ({ initialData = {}, onSave }) => {
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || ROLE_TYPES.USER);
  const [permissions, setPermissions] = useState(initialData.permissions || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, type, permissions });
  };

  return (
    <form onSubmit={handleSubmit} className="role-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {Object.values(ROLE_TYPES).map((roleType) => (
            <option key={roleType} value={roleType}>{roleType}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Permissions</label>
        <input type="text" value={permissions} onChange={(e) => setPermissions(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary">Save</button>
    </form>
  );
};

export default RoleForm;
