import { useState, useEffect, useRef } from 'react';

const COMPLETED_PULSE_MS = 800;

/**
 * Drives a brief highlight pulse the moment a streaming message finishes.
 * Returns `true` for `COMPLETED_PULSE_MS` after streaming ends with content
 * and no error; `false` otherwise.
 */
export function useJustCompletedAnimation(
  isStreaming: boolean,
  hasContent: boolean,
  hasError: boolean,
): boolean {
  const wasStreaming = useRef(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      wasStreaming.current = true;
      return;
    }
    if (!wasStreaming.current || !hasContent || hasError) return;
    wasStreaming.current = false;
    setJustCompleted(true);
    const timer = setTimeout(() => setJustCompleted(false), COMPLETED_PULSE_MS);
    return () => clearTimeout(timer);
  }, [isStreaming, hasContent, hasError]);

  return justCompleted;
}
