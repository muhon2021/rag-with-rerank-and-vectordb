import React from 'react';

export default function Sidebar({ currentPath, navigate }) {
  const linkBase = {
    display: 'block',
    padding: '10px 12px',
    borderRadius: 6,
    color: '#222',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const activeStyle = {
    background: '#eef5ff',
    fontWeight: 600,
    color: '#0b5ed7'
  };

  const Item = ({ to, children }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        if (navigate) navigate(to);
        else window.location.assign(to);
      }}
      style={{
        ...linkBase,
        ...(currentPath === to ? activeStyle : {})
      }}
    >
      {children}
    </a>
  );

  const SectionTitle = ({ children }) => (
    <div style={{
      marginTop: 16,
      marginBottom: 6,
      fontSize: 12,
      textTransform: 'uppercase',
      color: '#666',
      letterSpacing: 0.6
    }}>{children}</div>
  );

  return (
    <aside
      style={{
        width: 240,
        borderRight: '1px solid #e5e7eb',
        padding: 16,
        boxSizing: 'border-box',
        background: '#fafafa',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Admin Dashboard</div>
      <Item to="/dashboard">Overview</Item>

      <SectionTitle>Access control</SectionTitle>
      <Item to="/dashboard/roles">Role Management</Item>
      <Item to="/dashboard/members">Member Management</Item>

      <SectionTitle>Other</SectionTitle>
      <Item to="/dashboard#settings">Settings (placeholder)</Item>
    </aside>
  );
}
