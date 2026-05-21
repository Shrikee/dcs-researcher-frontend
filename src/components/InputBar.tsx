import { useState, useRef, useCallback, useImperativeHandle, forwardRef, type KeyboardEvent, type ChangeEvent, type Ref } from 'react';

interface Props {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}

export const InputBar = forwardRef(function InputBar(
  { onSend, isStreaming, onStop }: Props,
  ref: Ref<HTMLTextAreaElement>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useImperativeHandle(ref, () => textareaRef.current!, []);

  const resize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, []);

  const handleSend = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    ta.value = '';
    ta.style.height = 'auto';
    ta.focus();
  }, [onSend, isStreaming]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (_e: ChangeEvent<HTMLTextAreaElement>) => {
      resize();
    },
    [resize],
  );

  return (
    <div className="input-bar">
      <div className="input-bar__inner">
        <textarea
          ref={textareaRef}
          className={`input-bar__textarea ${isStreaming ? 'input-bar__textarea--streaming' : ''}`}
          placeholder="Ask about DCS aircraft, systems, or procedures…"
          aria-label="Ask the DCS Researcher"
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        {isStreaming ? (
          <button
            className="input-bar__btn input-bar__btn--stop"
            onClick={onStop}
            aria-label="Stop generating"
            title="Stop"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="3" width="10" height="10" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            className="input-bar__btn"
            onClick={handleSend}
            aria-label="Send message"
            title="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>
      <div className="input-bar__hint">
        <span>Enter to send · Shift+Enter for new line</span>
        <button
          className="input-bar__shortcuts-trigger"
          onClick={() => setShowShortcuts((v) => !v)}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts"
          type="button"
        >
          ?
        </button>
      </div>
      {showShortcuts && (
        <div className="input-bar__shortcuts">
          <kbd>⌘ N</kbd> New session
          <kbd>⌘ B</kbd> Toggle sidebar
          <kbd>⌘ K</kbd> Focus input
          <kbd>/</kbd> Focus input
          <kbd>Esc</kbd> Close sidebar
        </div>
      )}
    </div>
  );
});
