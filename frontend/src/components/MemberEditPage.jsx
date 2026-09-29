import React, { useEffect, useState } from 'react';
import MemberForm from './MemberForm.jsx';
import { getMemberById, updateMember } from './mockData.js';

export default function MemberEditPage({ id, navigate }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getMemberById(id);
      if (mounted) {
        setMember(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!member) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Edit Member</h1>
        <div style={{ color: '#b91c1c', marginBottom: 12 }}>Member not found.</div>
        <button onClick={() => navigate('/dashboard/members')} style={btn}>Back to Members</button>
      </div>
    );
  }

  async function handleSubmit(payload) {
    console.log('PUT /api/admin/members/:id', id, payload);
    await updateMember(id, payload);
    navigate('/dashboard/members');
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Edit Member</h1>
      <MemberForm
        initialData={member}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/members')}
      />
    </div>
  );
}

const btn = { padding: '8px 12px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer' };
