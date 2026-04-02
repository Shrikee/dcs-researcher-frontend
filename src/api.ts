const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const HEARTBEAT_TIMEOUT_MS = 30_000;

export interface StreamCallbacks {
  onSession: (sessionId: string) => void;
  onToken: (content: string) => void;
  onToolStart: (name: string) => void;
  onToolEnd: (name: string, output: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function streamResearch(
  question: string,
  sessionId: string | null,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
) {
  const url = sessionId
    ? `${API_BASE}/research/${encodeURIComponent(sessionId)}/stream`
    : `${API_BASE}/research/stream`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Accept-Encoding': 'identity',
      'Cache-Control': 'no-cache',
      ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
    },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Request failed (${response.status})`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  let heartbeatTimer: ReturnType<typeof setTimeout> | undefined;

  const resetHeartbeat = () => {
    clearTimeout(heartbeatTimer);
    heartbeatTimer = setTimeout(() => {
      reader.cancel();
      callbacks.onError('Connection timed out (no data received for 30s)');
    }, HEARTBEAT_TIMEOUT_MS);
  };

  resetHeartbeat();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      resetHeartbeat();

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop()!;

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '') {
          currentEvent = '';
          continue;
        }

        if (trimmed.startsWith(':')) continue; // heartbeat / comment

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.slice(6).trim();
        } else if (trimmed.startsWith('data:')) {
          const dataStr = trimmed.slice(5).trim();
          try {
            const data = JSON.parse(dataStr);
            switch (currentEvent) {
              case 'session':
                callbacks.onSession(data.sessionId);
                break;
              case 'token':
                callbacks.onToken(data.content);
                break;
              case 'tool_start':
                callbacks.onToolStart(data.toolName);
                break;
              case 'tool_end':
                callbacks.onToolEnd(data.toolName, data.output ?? '');
                break;
              case 'done':
                callbacks.onDone();
                break;
              case 'error':
                callbacks.onError(data.message || 'Unknown error');
                break;
            }
          } catch {
            // non-JSON data, ignore
          }
        }
      }
    }
  } finally {
    clearTimeout(heartbeatTimer);
  }
}
