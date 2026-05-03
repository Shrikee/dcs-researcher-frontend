import { memo, useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';

interface Props {
  message: Message;
  isStreaming: boolean;
  onRetry?: () => void;
}

export const MessageItem = memo(function MessageItem({ message, isStreaming, onRetry }: Props) {
  const isUser = message.role === 'user';
  const isCurrentlyStreaming = isStreaming && !isUser;
  const hasError = !!message.error;
  const wasStreaming = useRef(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    if (isCurrentlyStreaming) {
      wasStreaming.current = true;
    } else if (wasStreaming.current && message.content && !hasError) {
      wasStreaming.current = false;
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isCurrentlyStreaming, message.content, hasError]);

  // Show a friendly hint if the user has been waiting a while with no content yet.
  // Must fire well before the API heartbeat timeout (30s in api.ts) — otherwise
  // the hint appears simultaneously with the connection-timeout error.
  useEffect(() => {
    if (isCurrentlyStreaming && !message.content && !hasError) {
      const timer = setTimeout(() => setShowSlowHint(true), 12_000);
      return () => clearTimeout(timer);
    }
    setShowSlowHint(false);
  }, [isCurrentlyStreaming, message.content, hasError]);

  return (
    <div
      className={`message ${isUser ? 'message--user' : 'message--assistant'} ${
        isCurrentlyStreaming ? 'message--streaming' : ''
      } ${justCompleted ? 'message--completed' : ''} ${hasError ? 'message--error' : ''}`}
    >
      <div className="message__label">
        <span className="message__label-dot" />
        {isUser ? 'You' : 'Researcher'}
      </div>

      {/* Tool indicators (before text content) */}
      {!isUser && message.tools.length > 0 && (
        <div className="message__tools">
          {message.tools.map((tool, i) => (
            <div key={`${tool.name}-${i}`} className="tool-indicator">
              <span
                className={`tool-indicator__dot tool-indicator__dot--${tool.status}`}
              />
              <span className="tool-indicator__name">
                {formatToolName(tool.name)}
                {tool.status === 'running' ? '…' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="message__error">
          <span className="message__error-text">{message.error}</span>
          {onRetry && (
            <button className="message__error-retry" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      {/* Loading indicator: streaming but no content yet */}
      {isCurrentlyStreaming && !message.content && !hasError && (
        <>
          <div className="message__loading" aria-label="Researcher is thinking">
            <span className="message__loading-dot" />
            <span className="message__loading-dot" />
            <span className="message__loading-dot" />
          </div>
          {showSlowHint && (
            <p className="message__slow-hint" role="status">
              Still researching — this one runs on modest local hardware, so
              deeper questions take a little longer. Thanks for hanging in.
            </p>
          )}
        </>
      )}

      <div className="message__body">
        {isUser ? (
          <p>{message.content}</p>
        ) : message.content ? (
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        ) : null}
      </div>
    </div>
  );
});

function formatToolName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
