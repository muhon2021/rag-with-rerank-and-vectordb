import React from 'react';

export default function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <p>Welcome to the admin dashboard. Use the sidebar to navigate through different management sections.</p>
      <div className="overview-stats">
        <div className="stat-card">
          <h3>Total Roles</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Total Members</h3>
          <p>12</p>
        </div>
      </div>
    </div>
  );
}
