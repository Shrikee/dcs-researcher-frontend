import { useEffect, useRef, useState } from 'react';

const DEFAULT_INTERVAL_MS = 100;

/**
 * While `isStreaming` is true, emit `content` at most once per `intervalMs`.
 * Flushes immediately on the trailing edge and when streaming ends, so the
 * final visible state always matches the latest content.
 *
 * Used to throttle expensive react-markdown re-parses during token streaming
 * without losing the live-update feel.
 */
export function useThrottledStreamingContent(
  content: string,
  isStreaming: boolean,
  intervalMs: number = DEFAULT_INTERVAL_MS,
): string {
  const [throttled, setThrottled] = useState(content);
  const latestRef = useRef(content);
  const lastEmittedRef = useRef(0);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latestRef.current = content;

    if (!isStreaming) {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      setThrottled(content);
      lastEmittedRef.current = performance.now();
      return;
    }

    const now = performance.now();
    const elapsed = now - lastEmittedRef.current;

    if (elapsed >= intervalMs) {
      setThrottled(content);
      lastEmittedRef.current = now;
      return;
    }

    if (pendingTimerRef.current) return;

    const delay = intervalMs - elapsed;
    pendingTimerRef.current = setTimeout(() => {
      pendingTimerRef.current = null;
      setThrottled(latestRef.current);
      lastEmittedRef.current = performance.now();
    }, delay);
  }, [content, isStreaming, intervalMs]);

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, []);

  return throttled;
}
