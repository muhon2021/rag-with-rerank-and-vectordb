import { useEffect, useState } from 'react';
import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';
import StatusBar from './components/StatusBar.jsx';
import BlogPage from './components/BlogPage.jsx';

export default function App() {
  const { health, backendOnline, totalVectors } = useHealth();
  const indexEmpty = totalVectors === 0;

  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const onRoute = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onRoute);
    window.addEventListener('app:navigate', onRoute);
    return () => {
      window.removeEventListener('popstate', onRoute);
      window.removeEventListener('app:navigate', onRoute);
    };
  }, []);

  const navigateTo = (href) => {
    if (window.location.pathname !== href) {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('app:navigate'));
    }
  };

  if (path === '/blog') {
    return (
      <div className="workshop-shell">
        <div className="workshop-top workshop-top-compact">
          <div className="workshop-top-main">
            <div className="workshop-brand-title">RAG Learning Lab</div>
            <div className="workshop-stage-line">
              <div className="workshop-stage-name">Blog</div>
              <div className="workshop-stage-desc">Updates and articles</div>
            </div>
          </div>
          <div className="workshop-top-actions">
            <a
              href="/"
              className="details-toggle"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
            >
              Home
            </a>
          </div>
        </div>
        <div className="workshop-body workshop-body-expanded">
          <div className="workshop-content">
            <BlogPage />
          </div>
        </div>
        <StatusBar backendOnline={backendOnline} health={health} totalVectors={totalVectors} />
      </div>
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
