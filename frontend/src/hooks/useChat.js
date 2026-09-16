import { useState, useCallback } from 'react';
import { sendChat } from '../api/client.js';
import toast from 'react-hot-toast';

const histories = {
  basic: [],
  chunked: [],
  hybrid: [],
  rerank: [],
};

export function useChat(stage) {
  const [messages, setMessages] = useState(() => histories[stage] || []);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed, id: Date.now() };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      histories[stage] = nextMessages;
      setLoading(true);

      try {
        const result = await sendChat(stage, trimmed);
        const assistantMsg = {
          role: 'assistant',
          content: result.answer,
          debug: result.debug,
          id: Date.now() + 1,
        };
        const updated = [...nextMessages, assistantMsg];
        setMessages(updated);
        histories[stage] = updated;
      } catch (err) {
        toast.error(err.message);
        const errorMsg = {
          role: 'assistant',
          content: `Error: ${err.message}`,
          isError: true,
          id: Date.now() + 1,
        };
        const updated = [...nextMessages, errorMsg];
        setMessages(updated);
        histories[stage] = updated;
      } finally {
        setLoading(false);
      }
    },
    [stage, messages, loading]
  );

  const switchStage = useCallback((newStage) => {
    setMessages(histories[newStage] || []);
  }, []);

  return { messages, loading, sendMessage, switchStage, setMessages };
}
