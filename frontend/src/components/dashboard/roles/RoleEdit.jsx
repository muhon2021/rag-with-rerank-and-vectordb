import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoleForm from './RoleForm';
import { getRoleById, updateRole } from '../../../api/client';

export default function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getRoleById(id);
        setRole(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateRole(id, formData);
      alert('Role updated successfully (mock)! Check console for data.');
      navigate('/dashboard/roles');
    } catch (error) {
      alert(`Error updating role: ${error.message}`);
    }
  };

  if (loading) return <div className="loading-message">Loading role...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!role) return <div className="not-found-message">Role not found.</div>;

  return (
    <div className="form-page-container">
      <h2>Edit Role: {role.name}</h2>
      <RoleForm initialData={role} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
}
