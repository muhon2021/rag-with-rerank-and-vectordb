import DebugPanel from './DebugPanel.jsx';

export default function MessageBubble({ message, wide = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <div
        className={`message-bubble ${wide ? 'message-bubble-wide' : ''}`}
        style={message.isError ? { borderColor: 'var(--error)' } : undefined}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        {!isUser && message.debug && (
          <DebugPanel debug={message.debug} />
        )}
      </div>
    </div>
  );
}
