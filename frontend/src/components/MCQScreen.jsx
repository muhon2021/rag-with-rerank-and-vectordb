import React, { useMemo, useState } from 'react';
import { generateMcqs } from '../api/client.js';
import MCQDisplay from './MCQDisplay.jsx';

const RAG_STAGES = ['basic', 'chunked', 'hybrid', 'rerank'];

export default function MCQScreen() {
  const [selectedStage, setSelectedStage] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({}); // mcqIndex -> selected choice
  const [feedback, setFeedback] = useState({}); // mcqIndex -> { isCorrect }

  const canGenerate = useMemo(() => !!selectedStage && !loading, [selectedStage, loading]);

  async function handleGenerate() {
    setLoading(true);
    setError('');
    setMcqs([]);
    setAnswers({});
    setFeedback({});
    try {
      const { mcqs: generated } = await generateMcqs(selectedStage);
      setMcqs(generated);
    } catch (e) {
      setError(e?.message || 'Failed to generate MCQs');
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelected(mcqIndex, choice) {
    setAnswers((prev) => ({ ...prev, [mcqIndex]: choice }));
    const correct = mcqs?.[mcqIndex]?.correctAnswer;
    const isCorrect = String(choice) === String(correct);
    setFeedback((prev) => ({ ...prev, [mcqIndex]: { isCorrect } }));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ margin: 0, marginBottom: 8 }}>MCQ Quiz</h1>
      <p style={{ color: '#555', marginTop: 0 }}>
        Generate 3 multiple-choice questions from the selected RAG stage's corpus. Select an answer to see instant feedback.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label htmlFor="stage" style={{ fontWeight: 600 }}>RAG stage</label>
        <select
          id="stage"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}
        >
          <option value="">Select a stage…</option>
          {RAG_STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid #0b5ed7',
            background: canGenerate ? '#0b5ed7' : '#9ec5fe',
            color: '#fff',
            cursor: canGenerate ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Generating…' : 'Generate MCQs'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fdecea', color: '#b02a37', border: '1px solid #f5c2c7', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && mcqs.length === 0 && !error && (
        <div style={{ color: '#666', fontStyle: 'italic', marginTop: 8 }}>
          Select a stage and click "Generate MCQs" to begin.
        </div>
      )}

      {mcqs.map((q, i) => (
        <MCQDisplay
          key={i}
          mcq={q}
          mcqIndex={i}
          selectedAnswer={answers[i]}
          feedback={feedback[i]}
          onAnswerSelected={handleAnswerSelected}
        />
      ))}
    </div>
  );
}
