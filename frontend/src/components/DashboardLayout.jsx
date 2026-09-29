import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ children, currentPath, Link }) {
  return (
    <div className="dashboard-layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPath={currentPath} Link={Link} />
      <main className="dashboard-content-area" style={{ flex: 1, padding: '1rem 1.25rem' }}>
        {children}
      </main>
    </div>
  );
}
