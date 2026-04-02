import { useState, useCallback, useRef } from 'react';
import { streamResearch } from '../api';
import type { Message } from '../types';

function generateId() {
  return crypto.randomUUID();
}

interface StreamingDeps {
  activeSessionId: string | null;
  createSession: (question: string, userMsg: Message, assistantMsg: Message) => string;
  appendMessages: (sessionId: string, userMsg: Message, assistantMsg: Message) => void;
  promoteSession: (pendingId: string, realId: string) => void;
  updateLastAssistantMessage: (sessionId: string, updater: (msg: Message) => Message) => void;
  removeLastAssistantMessage: (sessionId: string) => void;
}

export function useStreaming(deps: StreamingDeps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const streamSessionRef = useRef<string | null>(null);
  const lastQuestionRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    abortRef.current = null;
  }, []);

  const send = useCallback(
    async (question: string) => {
      if (isStreaming) return;

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: question,
        tools: [],
        timestamp: Date.now(),
      };

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        tools: [],
        timestamp: Date.now(),
      };

      lastQuestionRef.current = question;
      let backendSessionId = deps.activeSessionId;

      if (!backendSessionId) {
        const pendingId = deps.createSession(question, userMsg, assistantMsg);
        streamSessionRef.current = pendingId;
        backendSessionId = null;
      } else {
        streamSessionRef.current = backendSessionId;
        deps.appendMessages(backendSessionId, userMsg, assistantMsg);
      }

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      const updateLast = (updater: (msg: Message) => Message) => {
        const sid = streamSessionRef.current;
        if (sid) deps.updateLastAssistantMessage(sid, updater);
      };

      try {
        await streamResearch(
          question,
          backendSessionId,
          {
            onSession: (realId) => {
              const oldId = streamSessionRef.current;
              if (oldId?.startsWith('pending-')) {
                deps.promoteSession(oldId, realId);
                streamSessionRef.current = realId;
              }
            },
            onToken: (content) => {
              updateLast((msg) => ({
                ...msg,
                content: msg.content + content,
              }));
            },
            onToolStart: (name) => {
              updateLast((msg) => ({
                ...msg,
                tools: [...msg.tools, { name, status: 'running' }],
              }));
            },
            onToolEnd: (name, output) => {
              updateLast((msg) => ({
                ...msg,
                tools: msg.tools.map((t) =>
                  t.name === name && t.status === 'running'
                    ? { ...t, status: 'complete', output }
                    : t,
                ),
              }));
            },
            onDone: () => {
              setIsStreaming(false);
            },
            onError: (error) => {
              updateLast((msg) => ({
                ...msg,
                error,
              }));
              setIsStreaming(false);
            },
          },
          controller.signal,
        );
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // user cancelled
        } else {
          const message =
            err instanceof Error ? err.message : 'Connection failed';
          updateLast((msg) => ({
            ...msg,
            error: message,
          }));
        }
        setIsStreaming(false);
      }

      abortRef.current = null;
    },
    [deps, isStreaming],
  );

  const retry = useCallback(() => {
    const q = lastQuestionRef.current;
    if (!q || isStreaming) return;

    // Remove the failed assistant message before re-sending
    const sid = streamSessionRef.current;
    if (sid) {
      deps.removeLastAssistantMessage(sid);
    }
    send(q);
  }, [deps, isStreaming, send]);

  return { isStreaming, send, stop, retry };
}
