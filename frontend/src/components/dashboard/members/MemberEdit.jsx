import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberForm from './MemberForm';
import { getMemberById, updateMember } from '../../../api/client';

export default function MemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getMemberById(id);
        setMember(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateMember(id, formData);
      alert('Member updated successfully (mock)! Check console for data.');
      navigate('/dashboard/members');
    } catch (error) {
      alert(`Error updating member: ${error.message}`);
    }
  };

  if (loading) return <div className="loading-message">Loading member...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!member) return <div className="not-found-message">Member not found.</div>;

  return (
    <div className="form-page-container">
      <h2>Edit Member: {member.name}</h2>
      <MemberForm initialData={member} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
}
