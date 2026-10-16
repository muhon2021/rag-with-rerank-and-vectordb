import { Activity, Database, Server } from 'lucide-react';

export default function StatusBar({ backendOnline, health, totalVectors, isIngestReady }) {
  const status = health?.status || 'unknown';

  // Prefer explicit prop, fall back to fields on health object (snake/camel)
  const ingestReady =
    typeof isIngestReady === 'boolean'
      ? isIngestReady
      : Boolean(health?.is_ingest_ready ?? health?.isIngestReady ?? false);

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

      {/* Ingest readiness badge: clear text + dot, fits dark UI styling used elsewhere */}
      <div className="status-item" aria-live="polite">
        <Activity size={13} className="status-icon" />
        <span className={`status-dot ${ingestReady ? 'ok' : 'warn'}`} />
        {ingestReady ? 'Ingest ready' : 'Ingest not ready'}
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
