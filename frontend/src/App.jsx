import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Dashboard layout + pages (client-side routing without external libraries)
import DashboardLayout from './components/DashboardLayout.jsx';
import OverviewPage from './components/dashboard/OverviewPage.jsx';
import RoleListPage from './components/dashboard/roles/RoleListPage.jsx';
import RoleCreatePage from './components/dashboard/roles/RoleCreatePage.jsx';
import RoleEditPage from './components/dashboard/roles/RoleEditPage.jsx';
import MemberListPage from './components/dashboard/members/MemberListPage.jsx';
import MemberCreatePage from './components/dashboard/members/MemberCreatePage.jsx';
import MemberEditPage from './components/dashboard/members/MemberEditPage.jsx';

// Lightweight router utilities implemented here to avoid external dependencies
function usePathname() {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (typeof to !== 'string') return;
    const target = to.startsWith('/') ? to : `/${to}`;
    try {
      if (replace) {
        window.history.replaceState({}, '', target);
      } else {
        window.history.pushState({}, '', target);
      }
      // Manually trigger path update
      setPath(target);
      // Dispatch popstate for any listeners
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      console.error('Navigation error:', e);
    }
  }, []);

  // Link component that prevents full page reloads
  const Link = useMemo(() => {
    return function LinkComponent({ to, children, className = '', activeClassName = 'active', exact = false, onClick }) {
      const href = to;
      const isActive = exact ? path === to : path === to || (path.startsWith(to) && to !== '/');
      const cls = isActive && activeClassName ? `${className} ${activeClassName}`.trim() : className;
      return (
        <a
          href={href}
          className={cls}
          onClick={(e) => {
            if (onClick) onClick(e);
            // Respect new tab/window or modifier keys
            if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate(href);
          }}
        >
          {children}
        </a>
      );
    };
  }, [path, navigate]);

  return { path, navigate, Link };
}

// Simple path matcher helpers for dashboard subroutes
function match(path, pattern) {
  // Convert pattern like /dashboard/roles/:id/edit to regex
  const regexStr = pattern
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    .replace(/\\:([^/]+)/g, '(?<$1>[^/]+)');
  const regex = new RegExp(`^${regexStr}/?$`);
  return path.match(regex);
}

export default function App() {
  const { health, backendOnline, totalVectors } = useHealth();
  const indexEmpty = totalVectors === 0;

  const { path, navigate, Link } = usePathname();

  // Root route: preserve the existing WorkshopFlow as the homepage
  if (path === '/' || path === '') {
    return (
      <WorkshopFlow
        indexEmpty={indexEmpty}
        backendOnline={backendOnline}
        health={health}
        totalVectors={totalVectors}
      />
    );
  }

  // Dashboard routes and nested views
  if (path.startsWith('/dashboard')) {
    let child = null;

    // Overview (index)
    if (match(path, '/dashboard')) {
      child = <OverviewPage />;
    }

    // Roles
    if (!child && match(path, '/dashboard/roles')) {
      child = <RoleListPage Link={Link} navigate={navigate} currentPath={path} />;
    }
    if (!child && match(path, '/dashboard/roles/new')) {
      child = <RoleCreatePage Link={Link} navigate={navigate} currentPath={path} />;
    }
    if (!child) {
      const m = match(path, '/dashboard/roles/:id/edit');
      if (m) {
        child = <RoleEditPage id={m.groups.id} Link={Link} navigate={navigate} currentPath={path} />;
      }
    }

    // Members
    if (!child && match(path, '/dashboard/members')) {
      child = <MemberListPage Link={Link} navigate={navigate} currentPath={path} />;
    }
    if (!child && match(path, '/dashboard/members/new')) {
      child = <MemberCreatePage Link={Link} navigate={navigate} currentPath={path} />;
    }
    if (!child) {
      const m2 = match(path, '/dashboard/members/:id/edit');
      if (m2) {
        child = <MemberEditPage id={m2.groups.id} Link={Link} navigate={navigate} currentPath={path} />;
      }
    }

    // Fallback to overview for unknown dashboard subroutes
    if (!child) {
      child = <OverviewPage />;
    }

    return (
      <DashboardLayout currentPath={path} Link={Link}>
        {child}
      </DashboardLayout>
    );
  }

  // Unknown route: redirect to root
  useEffect(() => {
    if (path !== '/') {
      navigate('/', { replace: true });
    }
  }, [path, navigate]);

  return (
    <WorkshopFlow
      indexEmpty={indexEmpty}
      backendOnline={backendOnline}
      health={health}
      totalVectors={totalVectors}
    />
  );
}
