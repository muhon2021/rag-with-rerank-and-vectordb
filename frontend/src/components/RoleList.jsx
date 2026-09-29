import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRoles } from '../api/client';

const RoleList = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  return (
    <div className="role-list">
      <h1>Role Management</h1>
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
                <Link to={`/dashboard/roles/${role.id}/edit`} className="btn-secondary">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
