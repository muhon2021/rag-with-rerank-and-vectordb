import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoleForm from './RoleForm';
import { createRole } from '../../../api/client';

export default function RoleCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createRole(formData);
      alert('Role created successfully (mock)! Check console for data.');
      navigate('/dashboard/roles');
    } catch (error) {
      alert(`Error creating role: ${error.message}`);
    }
  };

  return (
    <div className="form-page-container">
      <h2>Create New Role</h2>
      <RoleForm onSubmit={handleSubmit} />
    </div>
  );
}
