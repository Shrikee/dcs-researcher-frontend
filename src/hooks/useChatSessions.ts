import { useState, useCallback, useEffect } from 'react';
import type { ChatSession, Message } from '../types';

const STORAGE_KEY = 'dcs-sessions';

function generateId() {
  return crypto.randomUUID();
}

function truncateTitle(text: string, max = 48) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // corrupt data — start fresh
  }
  return [];
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // storage full — silently fail
  }
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ?? null;

  // Persist sessions to localStorage on every change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const createSession = useCallback(
    (question: string, userMsg: Message, assistantMsg: Message) => {
      const pendingId = 'pending-' + generateId();
      const session: ChatSession = {
        id: pendingId,
        title: truncateTitle(question),
        messages: [userMsg, assistantMsg],
        createdAt: Date.now(),
      };
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(pendingId);
      return pendingId;
    },
    [],
  );

  const appendMessages = useCallback(
    (sessionId: string, userMsg: Message, assistantMsg: Message) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, userMsg, assistantMsg] }
            : s,
        ),
      );
    },
    [],
  );

  const promoteSession = useCallback(
    (pendingId: string, realId: string) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === pendingId ? { ...s, id: realId } : s)),
      );
      setActiveSessionId(realId);
    },
    [],
  );

  const updateLastAssistantMessage = useCallback(
    (sessionId: string, updater: (msg: Message) => Message) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const msgs = [...s.messages];
          const last = msgs[msgs.length - 1];
          if (last.role === 'assistant') {
            msgs[msgs.length - 1] = updater(last);
          }
          return { ...s, messages: msgs };
        }),
      );
    },
    [],
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setActiveSessionId((curr) => (curr === id ? null : curr));
    },
    [],
  );

  const removeLastAssistantMessage = useCallback(
    (sessionId: string) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const msgs = [...s.messages];
          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
            msgs.pop();
          }
          return { ...s, messages: msgs };
        }),
      );
    },
    [],
  );

  const clearActiveSession = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const restoreSession = useCallback((session: ChatSession) => {
    setSessions((prev) => {
      // Insert back in original position by createdAt
      const next = [...prev, session].sort((a, b) => b.createdAt - a.createdAt);
      return next;
    });
  }, []);

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    appendMessages,
    promoteSession,
    updateLastAssistantMessage,
    removeLastAssistantMessage,
    deleteSession,
    restoreSession,
    clearActiveSession,
  };
}
