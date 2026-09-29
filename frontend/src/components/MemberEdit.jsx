import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberForm from './MemberForm';
import { getMemberById, updateMember } from '../api/client';

const MemberEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    getMemberById(id).then(setMember);
  }, [id]);

  const handleSave = (data) => {
    updateMember(id, data).then(() => {
      console.log('Member updated:', data);
      navigate('/dashboard/members');
    });
  };

  if (!member) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Member</h1>
      <MemberForm initialData={member} onSave={handleSave} />
    </div>
  );
};

export default MemberEdit;
