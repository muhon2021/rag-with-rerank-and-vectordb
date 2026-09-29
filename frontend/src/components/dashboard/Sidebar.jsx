import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { DASHBOARD_NAV_ITEMS } from '../../constants/dashboard';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-header">
        <h1>Admin Dashboard</h1>
      </div>
      <nav className="sidebar-nav">
        {
          DASHBOARD_NAV_ITEMS.map((item, index) => (
            item.header ? (
              <h2 key={index} className="sidebar-nav-header">
                {item.header}
              </h2>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                end={item.path === '/dashboard'}
              >
                {item.label}
              </NavLink>
            )
          ))
        }
      </nav>
    </aside>
  );
}
