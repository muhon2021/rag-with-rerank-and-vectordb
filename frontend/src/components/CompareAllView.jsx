import { useState } from 'react';
import { Send, LayoutGrid } from 'lucide-react';
import { compareAll } from '../api/client.js';
import { STAGES, SAMPLE_QUESTIONS } from '../constants/stages.js';
import toast from 'react-hot-toast';

export default function CompareAllView({ indexEmpty, isWorkshopFinale = false }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runCompare = async (message) => {
    const trimmed = message?.trim() || input.trim();
    if (!trimmed) return;

    setLoading(true);
    setResults(null);
    setInput(trimmed);

    try {
      const data = await compareAll(trimmed);
      setResults(data.results);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`compare-view ${isWorkshopFinale ? 'compare-view-finale' : ''}`}>
      {!isWorkshopFinale && (
        <header className="top-bar">
          <div className="stage-header">
            <span className="stage-header-icon">
              <LayoutGrid size={15} />
            </span>
            <strong>Compare All Stages</strong>
            <span className="stage-subtitle">
              Same question across Basic → Chunked → Hybrid → Reranked
            </span>
          </div>
        </header>
      )}

      <div className="compare-input-area">
        <form
          className="input-row"
          onSubmit={(e) => {
            e.preventDefault();
            runCompare();
          }}
          style={{ maxWidth: 800 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a question to compare all 4 RAG stages..."
            disabled={loading || indexEmpty}
          />
          <button type="submit" className="send-btn" disabled={loading || indexEmpty || !input.trim()}>
            <Send size={18} /> Compare
          </button>
        </form>

        {!results && !loading && (
          <div className="sample-questions" style={{ marginTop: '1rem' }}>
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="sample-btn"
                onClick={() => runCompare(q)}
                disabled={indexEmpty}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="compare-grid">
        {STAGES.map((stage) => {
          const result = results?.find((r) => r.stage === stage.id);
          return (
            <div key={stage.id} className="compare-card">
              <h3>{stage.title}</h3>
              {loading && (
                <>
                  <div className="skeleton" style={{ width: '100%' }} />
                  <div className="skeleton" style={{ width: '80%' }} />
                  <div className="skeleton" style={{ width: '60%' }} />
                </>
              )}
              {!loading && result?.error && (
                <p style={{ color: 'var(--error)' }}>{result.error}</p>
              )}
              {!loading && result?.answer && (
                <>
                  <p className="answer">{result.answer}</p>
                  <p className="meta">
                    Chunks: {result.debug?.retrievedChunks?.length ?? 0}
                    {result.debug?.similarityScores?.[0] != null &&
                      ` · Top score: ${Number(result.debug.similarityScores[0].score).toFixed(3)}`}
                    {result.debug?.keywordScores?.[0] != null &&
                      ` · Keyword: ${Number(result.debug.keywordScores[0].score).toFixed(3)}`}
                  </p>
                </>
              )}
              {!loading && !result && (
                <p className="meta">Run a query to see results</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
