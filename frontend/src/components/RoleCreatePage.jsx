import React from 'react';
import RoleForm from './RoleForm.jsx';
import { createRole } from './mockData.js';

export default function RoleCreatePage({ navigate }) {
  async function handleSubmit(payload) {
    console.log('POST /api/admin/roles', payload);
    await createRole(payload);
    navigate('/dashboard/roles');
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Create Role</h1>
      <RoleForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/roles')}
      />
    </div>
  );
}
