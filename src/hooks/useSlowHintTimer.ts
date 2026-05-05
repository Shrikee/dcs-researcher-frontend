import { useState, useEffect } from 'react';

// Must stay well under the API heartbeat timeout (30s in src/api.ts) so the
// hint never collides with a connection-timeout error.
const SLOW_HINT_DELAY_MS = 12_000;

/**
 * Returns `true` after `SLOW_HINT_DELAY_MS` of streaming with no new content.
 * The timer resets on every `contentSignal` change (each new token), so the
 * hint only fires during a genuine pause — typically while a tool runs
 * between LLM messages.
 */
export function useSlowHintTimer(
  isStreaming: boolean,
  contentSignal: string,
  hasError: boolean,
): boolean {
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    if (!isStreaming || hasError) {
      setShowSlowHint(false);
      return;
    }
    setShowSlowHint(false);
    const timer = setTimeout(() => setShowSlowHint(true), SLOW_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isStreaming, contentSignal, hasError]);

  return showSlowHint;
}
