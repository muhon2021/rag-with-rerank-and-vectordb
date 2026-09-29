import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoleForm from './RoleForm';
import { createRole } from '../api/client';

const RoleCreate = () => {
  const navigate = useNavigate();

  const handleSave = (data) => {
    createRole(data).then(() => {
      console.log('Role created:', data);
      navigate('/dashboard/roles');
    });
  };

  return (
    <div>
      <h1>Create Role</h1>
      <RoleForm onSave={handleSave} />
    </div>
  );
};

export default RoleCreate;
