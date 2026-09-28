import { Activity, Database, Server, BookOpen } from 'lucide-react';

export default function StatusBar({ backendOnline, health, totalVectors }) {
  const status = health?.status || 'unknown';

  const onBlogClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const href = '/blog';
    if (window.location.pathname !== href) {
      window.history.pushState({}, '', href);
      // Notify the app to re-render based on the new path
      window.dispatchEvent(new Event('app:navigate'));
    }
  };

  return (
    <footer className="status-bar">
      <div className="status-item">
        <Server size={13} className="status-icon" />
        <span className={`status-dot ${backendOnline ? 'ok' : 'err'}`} />
        Backend {backendOnline ? 'connected' : 'offline'}
      </div>
      <div className="status-item">
        <Database size={13} className="status-icon" />
        <span className={`status-dot ${totalVectors > 0 ? 'ok' : 'warn'}`} />
        Index: {totalVectors > 0 ? `${totalVectors} vectors` : 'empty — run npm run ingest'}
      </div>
      <div className="status-item">
        <Activity size={13} className="status-icon" />
        Status: {status}
      </div>
      {health?.namespaces && (
        <div className="status-item">
          {Object.entries(health.namespaces)
            .map(([k, v]) => `${k}:${v}`)
            .join(' · ')}
        </div>
      )}
      <div className="status-item">
        <BookOpen size={13} className="status-icon" />
        <a href="/blog" className="status-link" onClick={onBlogClick} aria-label="Open Blog">
          Blog
        </a>
      </div>
    </footer>
  );
}
