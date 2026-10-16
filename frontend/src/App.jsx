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

  // Replace the specific 'Welcome' text with 'Hello' on the root ('/') route only,
  // targeting the header area that includes 'RAG Learning Lab'. This avoids changing
  // other occurrences and keeps styling intact by modifying text nodes in-place.
  useEffect(() => {
    if (isDashboard) return;

    let observer;

    const replaceWelcomeNearRagHeader = () => {
      const all = Array.from(document.querySelectorAll('body *'));
      let changed = false;

      for (const el of all) {
        if (!el || !el.textContent) continue;
        // Look for a container that mentions 'RAG Learning Lab'
        if (el.textContent.includes('RAG Learning Lab')) {
          const container = el.parentElement || el;
          const scanTargets = [container, ...Array.from(container.querySelectorAll('*'))];

          for (const t of scanTargets) {
            if (!t) continue;
            // Prefer exact text-node replacement to preserve styles/structure
            if (t.childNodes && t.childNodes.length) {
              t.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                  const txt = node.textContent;
                  if (txt && /\bWelcome\b/.test(txt)) {
                    node.textContent = txt.replace(/\bWelcome\b/g, 'Hello');
                    changed = true;
                  }
                }
              });
            }
            // Also handle simple leaf elements whose innerText is exactly 'Welcome'
            if (t.children && t.children.length === 0 && typeof t.innerText === 'string') {
              if (t.innerText.trim() === 'Welcome') {
                t.textContent = 'Hello';
                changed = true;
              }
            }
          }

          if (changed) break; // stop after first successful replacement near header
        }
      }

      return changed;
    };

    // Run immediately
    const initialChanged = replaceWelcomeNearRagHeader();

    // Observe for late-rendered updates (disconnect after we succeed)
    observer = new MutationObserver(() => {
      if (replaceWelcomeNearRagHeader()) {
        if (observer) observer.disconnect();
      }
    });

    // Only observe if not already changed, to reduce overhead
    if (!initialChanged) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [isDashboard, pathname]);

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
