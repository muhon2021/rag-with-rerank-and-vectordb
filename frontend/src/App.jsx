import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';

export default function App() {
  const { health, backendOnline, totalVectors, isIngestReady } = useHealth();
  const indexEmpty = totalVectors === 0;

  return (
    <WorkshopFlow
      indexEmpty={indexEmpty}
      backendOnline={backendOnline}
      health={health}
      totalVectors={totalVectors}
      ingestReady={isIngestReady}
    />
  );
}
