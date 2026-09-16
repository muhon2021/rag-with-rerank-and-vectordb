import { Activity, Database, Server } from 'lucide-react';

export default function StatusBar({ backendOnline, health, totalVectors }) {
  const status = health?.status || 'unknown';

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
    </footer>
  );
}
