import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DASHBOARD_NAV_ITEMS } from '../constants/dashboard';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <ul>
        {DASHBOARD_NAV_ITEMS.map((item, index) => (
          item.header ? (
            <li key={index} className="sidebar-nav-header">{item.header}</li>
          ) : (
            <li key={index} className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          )
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
