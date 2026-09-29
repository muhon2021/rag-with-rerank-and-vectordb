import React from 'react';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ currentPath, navigate, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar currentPath={currentPath} navigate={navigate} />
      <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
