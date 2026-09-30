import { useEffect } from 'react';
import { Activity, Database, Server } from 'lucide-react';

export default function StatusBar({ backendOnline, health, totalVectors }) {
  const status = health?.status || 'unknown';

  // Minimal, safe runtime patch: replace a standalone 'Welcome' with 'Hello' on the '/' route only.
  // This avoids layout/styling changes and touches no other UI components.
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR/defensive
    if (window.location && window.location.pathname !== '/') return; // Only on home route
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const targets = [];
      let node = walker.currentNode;
      while (node) {
        const text = node.nodeValue;
        if (text && text.trim() === 'Welcome') {
          targets.push(node);
        }
        node = walker.nextNode();
      }
      targets.forEach((n) => {
        // Replace exact standalone 'Welcome' to 'Hello'
        n.nodeValue = 'Hello';
      });
    } catch (err) {
      // Do not disrupt UI; log for diagnostics only
      console.error('Greeting text replacement failed:', err);
    }
  }, []);

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
