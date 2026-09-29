import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberForm from './MemberForm';
import { createMember } from '../../../api/client';

export default function MemberCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createMember(formData);
      alert('Member created successfully (mock)! Check console for data.');
      navigate('/dashboard/members');
    } catch (error) {
      alert(`Error creating member: ${error.message}`);
    }
  };

  return (
    <div className="form-page-container">
      <h2>Create New Member</h2>
      <MemberForm onSubmit={handleSubmit} />
    </div>
  );
}
