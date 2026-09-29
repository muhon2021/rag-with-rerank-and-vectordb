import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';
import React, { useEffect, useMemo, useState } from 'react';

// Dashboard components (client-side routing without external libs)
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import RolesListPage from './components/RolesListPage.jsx';
import RoleCreatePage from './components/RoleCreatePage.jsx';
import RoleEditPage from './components/RoleEditPage.jsx';
import MembersListPage from './components/MembersListPage.jsx';
import MemberCreatePage from './components/MemberCreatePage.jsx';
import MemberEditPage from './components/MemberEditPage.jsx';
import DashboardOverviewPage from './components/DashboardOverviewPage.jsx';

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

function navigate(to) {
  if (to === window.location.pathname) return;
  window.history.pushState({}, '', to);
  // fire popstate so usePathname updates without a real history back/forward action
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function renderDashboardRoute(pathname, nav) {
  // Routing logic for /dashboard and its children
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return <DashboardOverviewPage navigate={nav} />;
  }

  if (pathname === '/dashboard/roles') {
    return <RolesListPage navigate={nav} />;
  }
  if (pathname === '/dashboard/roles/new') {
    return <RoleCreatePage navigate={nav} />;
  }
  // /dashboard/roles/:id/edit
  const roleEditMatch = pathname.match(/^\/dashboard\/roles\/([^/]+)\/edit\/?$/);
  if (roleEditMatch) {
    const id = roleEditMatch[1];
    return <RoleEditPage id={id} navigate={nav} />;
    }

  if (pathname === '/dashboard/members') {
    return <MembersListPage navigate={nav} />;
  }
  if (pathname === '/dashboard/members/new') {
    return <MemberCreatePage navigate={nav} />;
  }
  // /dashboard/members/:id/edit
  const memberEditMatch = pathname.match(/^\/dashboard\/members\/([^/]+)\/edit\/?$/);
  if (memberEditMatch) {
    const id = memberEditMatch[1];
    return <MemberEditPage id={id} navigate={nav} />;
  }

  // Fallback inside dashboard
  return <DashboardPage />;
}

export default function App() {
  const { health, backendOnline, totalVectors } = useHealth();
  const indexEmpty = totalVectors === 0;
  const pathname = usePathname();

  const isDashboard = useMemo(() => pathname.startsWith('/dashboard'), [pathname]);

  if (isDashboard) {
    return (
      <DashboardLayout currentPath={pathname} navigate={navigate}>
        {renderDashboardRoute(pathname, navigate)}
      </DashboardLayout>
    );
  }

  return (
    <WorkshopFlow
      indexEmpty={indexEmpty}
      backendOnline={backendOnline}
      health={health}
      totalVectors={totalVectors}
    />
  );
}
