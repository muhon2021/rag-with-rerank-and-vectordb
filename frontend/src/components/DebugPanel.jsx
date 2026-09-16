import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function DebugPanel({ debug }) {
  const [open, setOpen] = useState(false);
  if (!debug) return null;

  return (
    <>
      <button type="button" className="debug-toggle" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {open ? 'Hide' : 'Show'} retrieval debug
      </button>
      {open && (
        <div className="debug-panel">
          <h4>Retrieved chunks ({debug.retrievedChunks?.length || 0})</h4>
          {(debug.retrievedChunks || []).map((chunk, i) => {
            const score = debug.similarityScores?.[i]?.score ?? debug.rerankScores?.[i]?.rerankScore;
            return (
              <div key={chunk.id || i} className="chunk-card">
                <div className="chunk-meta">
                  <span className="badge source">{chunk.source}</span>
                  {score != null && (
                    <span className="badge score">score: {Number(score).toFixed(4)}</span>
                  )}
                  {chunk.heading && <span className="badge source">{chunk.heading}</span>}
                </div>
                {chunk.text?.slice(0, 300)}
                {(chunk.text?.length || 0) > 300 ? '…' : ''}
              </div>
            );
          })}

          {debug.keywordScores?.length > 0 && (
            <>
              <h4>Keyword scores</h4>
              <pre className="prompt-block">{JSON.stringify(debug.keywordScores, null, 2)}</pre>
            </>
          )}

          {debug.rerankScores?.length > 0 && (
            <>
              <h4>Rerank scores</h4>
              <pre className="prompt-block">{JSON.stringify(debug.rerankScores, null, 2)}</pre>
            </>
          )}

          <h4>Final context sent to LLM</h4>
          <pre className="prompt-block">
            {debug.finalContext?.length > 1500
              ? `${debug.finalContext.slice(0, 1500)}…`
              : debug.finalContext}
          </pre>

        </div>
      )}
    </>
  );
}
