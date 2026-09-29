import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoleForm from './RoleForm';
import { getRoleById, updateRole } from '../api/client';

const RoleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    getRoleById(id).then(setRole);
  }, [id]);

  const handleSave = (data) => {
    updateRole(id, data).then(() => {
      console.log('Role updated:', data);
      navigate('/dashboard/roles');
    });
  };

  if (!role) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Role</h1>
      <RoleForm initialData={role} onSave={handleSave} />
    </div>
  );
};

export default RoleEdit;
