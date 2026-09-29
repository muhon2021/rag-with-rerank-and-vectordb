export default function OverviewPage() {
  const cardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1rem',
    background: '#ffffff'
  };
  const gridStyle = {
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
  };

  return (
    <div className="dashboard-page-content">
      <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>Dashboard Overview</h1>
      <p className="page-description" style={{ color: '#4b5563', marginBottom: '1.25rem' }}>
        Welcome to the admin dashboard. Review quick stats and recent activity below.
      </p>

      <section className="dashboard-section" style={{ marginBottom: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Quick Stats</h2>
        <div className="stats-grid" style={gridStyle}>
          <div className="stat-card" style={cardStyle}>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>5</div>
            <div className="stat-label" style={{ color: '#6b7280' }}>Total Roles</div>
          </div>
          <div className="stat-card" style={cardStyle}>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>15</div>
            <div className="stat-label" style={{ color: '#6b7280' }}>Total Members</div>
          </div>
          <div className="stat-card" style={cardStyle}>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>3</div>
            <div className="stat-label" style={{ color: '#6b7280' }}>Active Sessions</div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Recent Activity</h2>
        <ul className="activity-list" style={{ paddingLeft: '1rem', color: '#374151' }}>
          <li>User 'John Doe' created a new role 'Editor'.</li>
          <li>Member 'Jane Smith' profile updated.</li>
          <li>System role 'Admin' permissions modified.</li>
        </ul>
      </section>
    </div>
  );
}
