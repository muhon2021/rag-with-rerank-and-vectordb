import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../../../api/client';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/members/${id}/edit`);
  };

  if (loading) return <div className="loading-message">Loading members...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="list-container">
      <h2>Member Management</h2>
      <button onClick={() => navigate('/dashboard/members/new')} className="create-button">
        Create New Member
      </button>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.roles}</td>
                <td>
                  <button onClick={() => handleEdit(member.id)} className="action-button edit-button">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {members.length === 0 && !loading && !error && (
        <p className="empty-state-message">No members found.</p>
      )}
    </div>
  );
}
