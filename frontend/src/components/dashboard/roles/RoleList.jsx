import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoles } from '../../../api/client';

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/roles/${id}/edit`);
  };

  if (loading) return <div className="loading-message">Loading roles...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="list-container">
      <h2>Role Management</h2>
      <button onClick={() => navigate('/dashboard/roles/new')} className="create-button">
        Create New Role
      </button>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>{role.type}</td>
                <td>{role.permissions}</td>
                <td>
                  <button onClick={() => handleEdit(role.id)} className="action-button edit-button">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {roles.length === 0 && !loading && !error && (
        <p className="empty-state-message">No roles found.</p>
      )}
    </div>
  );
}
