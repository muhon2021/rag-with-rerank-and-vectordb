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
    return <DashboardPage />;
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

  // Replace the specific "Welcome" greeting on the root route with "Hi There" in the header/top-right area
  // We scope this to the root path and to elements in a header-like region or containers that also show
  // the "RAG Learning Lab" label to avoid unintended replacements elsewhere.
  useEffect(() => {
    if (isDashboard) return; // do not run on /dashboard routes
    if (!(pathname === '/' || pathname === '')) return; // only on root route

    let disconnected = false;

    const tryReplace = () => {
      try {
        const nodes = Array.from(document.querySelectorAll('body *'));
        for (const el of nodes) {
          if (!el) continue;
          // only consider simple text nodes to avoid replacing container text
          if (el.childNodes && el.childNodes.length === 1 && typeof el.textContent === 'string' && el.textContent.trim() === 'Welcome') {
            // header-like containers or any container that also includes the RAG label
            const headerish = el.closest('header, .header, .topbar, .top-bar, .app-header, .workshop-header');
            const container = el.closest('*');
            const hasBrand = container && typeof container.innerText === 'string' && container.innerText.includes('RAG Learning Lab');
            if (headerish || hasBrand) {
              el.textContent = 'Hi There';
              return true;
            }
          }
        }
      } catch (_) {
        // no-op
      }
      return false;
    };

    // Attempt immediately in case the node is already present
    if (tryReplace()) return;

    // Observe DOM mutations to catch async renders
    const mo = new MutationObserver(() => {
      if (tryReplace() && !disconnected) {
        mo.disconnect();
        disconnected = true;
      }
    });

    mo.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      if (!disconnected) mo.disconnect();
    };
  }, [pathname, isDashboard]);

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
