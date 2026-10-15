import React from 'react';

export default function MCQDisplay({ mcq, mcqIndex, selectedAnswer, feedback, onAnswerSelected }) {
  const { question, choices, correctAnswer } = mcq;
  const disabled = Boolean(feedback);

  const baseChoiceStyle = {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const choiceStyle = (choice) => {
    if (!feedback) return baseChoiceStyle;
    if (choice === correctAnswer) {
      return { ...baseChoiceStyle, background: '#e8f7ee', borderColor: '#28a745' };
    }
    if (choice === selectedAnswer && choice !== correctAnswer) {
      return { ...baseChoiceStyle, background: '#fdecea', borderColor: '#dc3545' };
    }
    return baseChoiceStyle;
  };

  const onChange = (e) => {
    if (disabled) return;
    const value = e.target.value;
    onAnswerSelected(mcqIndex, value);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>Q{mcqIndex + 1}. {question}</div>
      <div>
        {choices.map((choice, idx) => (
          <label key={idx} style={choiceStyle(choice)}>
            <input
              type="radio"
              name={`mcq-${mcqIndex}`}
              value={choice}
              checked={selectedAnswer === choice}
              onChange={onChange}
              disabled={disabled}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
      {feedback && (
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: feedback.isCorrect ? '#198754' : '#dc3545' }}>
          {feedback.isCorrect ? 'Correct!' : `Incorrect. Correct answer: ${correctAnswer}`}
        </div>
      )}
    </div>
  );
}
