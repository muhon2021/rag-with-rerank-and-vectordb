import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../api/client';

const MemberList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  return (
    <div className="member-list">
      <h1>Member Management</h1>
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
                <Link to={`/dashboard/members/${member.id}/edit`} className="btn-secondary">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
