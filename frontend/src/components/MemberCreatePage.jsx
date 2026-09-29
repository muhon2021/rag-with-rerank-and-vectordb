import React from 'react';
import MemberForm from './MemberForm.jsx';
import { createMember } from './mockData.js';

export default function MemberCreatePage({ navigate }) {
  async function handleSubmit(payload) {
    console.log('POST /api/admin/members', payload);
    await createMember(payload);
    navigate('/dashboard/members');
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Create Member</h1>
      <MemberForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/members')}
      />
    </div>
  );
}
