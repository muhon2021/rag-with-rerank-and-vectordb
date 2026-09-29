import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberForm from './MemberForm';
import { createMember } from '../api/client';

const MemberCreate = () => {
  const navigate = useNavigate();

  const handleSave = (data) => {
    createMember(data).then(() => {
      console.log('Member created:', data);
      navigate('/dashboard/members');
    });
  };

  return (
    <div>
      <h1>Create Member</h1>
      <MemberForm onSave={handleSave} />
    </div>
  );
};

export default MemberCreate;
