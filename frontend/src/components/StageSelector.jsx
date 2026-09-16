import { STAGES } from '../constants/stages.js';
import { Layers3, Sparkles } from 'lucide-react';

const stageIcons = {
  basic: Layers3,
  chunked: Layers3,
  hybrid: Sparkles,
  rerank: Sparkles,
};

export default function StageSelector({ activeStage, onSelect, onCompare }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>
          <Sparkles size={16} />
          RAG Learning Lab
        </h1>
        <p>Compare 4 stages of RAG maturity</p>
      </div>

      <nav className="stage-list">
        {STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={`stage-card ${activeStage === stage.id ? 'active' : ''}`}
            onClick={() => onSelect(stage.id)}
          >
            <span className="stage-badge">
              {(() => {
                const Icon = stageIcons[stage.id] || Layers3;
                return <Icon size={12} />;
              })()}
            </span>
            <h3>{stage.title}</h3>
            <span>{stage.description}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="compare-btn" onClick={onCompare}>
        Run same query in all stages
      </button>
    </aside>
  );
}
