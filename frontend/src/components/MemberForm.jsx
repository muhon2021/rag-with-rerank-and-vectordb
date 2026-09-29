import React, { useState } from 'react';

const MemberForm = ({ initialData = {}, onSave }) => {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [roles, setRoles] = useState(initialData.roles || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, password, roles });
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Roles</label>
        <input type="text" value={roles} onChange={(e) => setRoles(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary">Save</button>
    </form>
  );
};

export default MemberForm;
