import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquareText } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { STAGES, SAMPLE_QUESTIONS } from '../constants/stages.js';
import { useChat } from '../hooks/useChat.js';

export default function ChatPanel({
  stage,
  indexEmpty,
  compactHeader = false,
  workshopLayout = false,
}) {
  const { messages, loading, sendMessage } = useChat(stage);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const stageInfo = STAGES.find((s) => s.id === stage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleSample = (q) => {
    setInput(q);
  };

  return (
    <>
      {!compactHeader && (
        <header className="top-bar">
          <div className="stage-header">
            <span className="stage-header-icon">
              <MessageSquareText size={15} />
            </span>
            <strong>{stageInfo?.title}</strong>
            <span className="stage-subtitle">{stageInfo?.description}</span>
          </div>
        </header>
      )}

      <div
        className={`chat-container ${
          workshopLayout ? 'chat-container-workshop' : compactHeader ? 'chat-container-embedded' : ''
        }`}
      >
        <div className={`messages ${workshopLayout ? 'messages-workshop' : ''}`}>
          {indexEmpty && messages.length === 0 ? (
            <div className="empty-state">
              <h2>No data indexed yet</h2>
              <p>
                Run ingestion from the project root:
                <br />
                <code>npm run ingest</code>
              </p>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                Then restart the backend and try sample questions below.
              </p>
              <div className="sample-questions">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button key={q} type="button" className="sample-btn" onClick={() => handleSample(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <h2>Ask a question</h2>
              <p>Query the Acme Corp internal knowledge base.</p>
              <div className="sample-questions">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button key={q} type="button" className="sample-btn" onClick={() => handleSample(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                wide={workshopLayout}
              />
            ))
          )}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about leave, security, AWS access..."
              disabled={loading || indexEmpty}
            />
            <button type="submit" className="send-btn" disabled={loading || indexEmpty || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
