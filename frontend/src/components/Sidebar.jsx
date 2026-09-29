export default function Sidebar({ currentPath, Link }) {
  const sectionHeaderStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7280',
    margin: '1rem 0 0.5rem'
  };

  const itemStyle = { margin: '0.25rem 0' };
  const linkBase = {
    display: 'block',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    color: '#111827',
    textDecoration: 'none'
  };

  const containerStyle = {
    width: '260px',
    borderRight: '1px solid #e5e7eb',
    padding: '1rem',
    background: '#f9fafb'
  };

  return (
    <aside className="sidebar-container" style={containerStyle}>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="sidebar-item" style={itemStyle}>
            <Link
              to="/dashboard"
              exact
              className="sidebar-link"
              activeClassName="active"
            >
              Overview
            </Link>
          </li>

          <li className="sidebar-section-header" style={sectionHeaderStyle}>Access control</li>
          <li className="sidebar-item" style={itemStyle}>
            <Link to="/dashboard/roles" className="sidebar-link" activeClassName="active">
              Role Management
            </Link>
          </li>
          <li className="sidebar-item" style={itemStyle}>
            <Link to="/dashboard/members" className="sidebar-link" activeClassName="active">
              Member Management
            </Link>
          </li>

          <li className="sidebar-section-header" style={sectionHeaderStyle}>Other</li>
          <li className="sidebar-item" style={itemStyle}>
            <span style={{ ...linkBase, color: '#9ca3af', cursor: 'not-allowed' }} title="Coming soon">Settings (TBD)</span>
          </li>
          <li className="sidebar-item" style={itemStyle}>
            <span style={{ ...linkBase, color: '#9ca3af', cursor: 'not-allowed' }} title="Coming soon">Reports (TBD)</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
