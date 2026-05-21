import { memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, ToolActivity } from '../types';
import { useJustCompletedAnimation } from '../hooks/useJustCompletedAnimation';
import { useSlowHintTimer } from '../hooks/useSlowHintTimer';
import { useThrottledStreamingContent } from '../hooks/useThrottledStreamingContent';

interface Props {
  message: Message;
  isStreaming: boolean;
  onRetry?: () => void;
}

const SLOW_HINT_TEXT =
  "Still researching — this one runs on modest local hardware, so deeper questions take a little longer. Thanks for hanging in.";

export const MessageItem = memo(function MessageItem({
  message,
  isStreaming,
  onRetry,
}: Props) {
  const isUser = message.role === 'user';
  const isCurrentlyStreaming = isStreaming && !isUser;
  const hasError = !!message.error;
  // Backend may emit leading whitespace tokens before real content. Treat
  // whitespace-only as empty so loading-state and slow-hint stay accurate.
  const hasContent = message.content.trim().length > 0;

  const justCompleted = useJustCompletedAnimation(
    isCurrentlyStreaming,
    hasContent,
    hasError,
  );
  const showSlowHint = useSlowHintTimer(
    isCurrentlyStreaming,
    message.content,
    hasError,
  );

  const renderedContent = useThrottledStreamingContent(
    message.content,
    isCurrentlyStreaming,
  );

  const showLoadingDots = isCurrentlyStreaming && !hasContent && !hasError;
  const showHint = isCurrentlyStreaming && showSlowHint && hasContent && !hasError;

  return (
    <div
      className={buildMessageClassName({
        isUser,
        isCurrentlyStreaming,
        justCompleted,
        hasError,
      })}
    >
      <MessageLabel isUser={isUser} />

      {!isUser && message.tools.length > 0 && <ToolIndicators tools={message.tools} />}

      {hasError && message.error && <MessageError error={message.error} onRetry={onRetry} />}

      {showLoadingDots && <LoadingDots />}

      <MessageBody isUser={isUser} content={renderedContent} hasContent={hasContent} />

      {showHint && <SlowHint text={SLOW_HINT_TEXT} />}
    </div>
  );
});

// ----- sub-components ------------------------------------------------

function MessageLabel({ isUser }: { isUser: boolean }) {
  return (
    <div className="message__label">
      <span className="message__label-dot" />
      {isUser ? 'You' : 'Researcher'}
    </div>
  );
}

function ToolIndicators({ tools }: { tools: ToolActivity[] }) {
  return (
    <div className="message__tools">
      {tools.map((tool, i) => (
        <ToolIndicator key={`${tool.name}-${i}`} tool={tool} />
      ))}
    </div>
  );
}

function ToolIndicator({ tool }: { tool: ToolActivity }) {
  return (
    <div className="tool-indicator">
      <span className={`tool-indicator__dot tool-indicator__dot--${tool.status}`} />
      <span className="tool-indicator__name">
        {formatToolName(tool.name)}
        {tool.status === 'running' ? '…' : ''}
      </span>
    </div>
  );
}

function MessageError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="message__error">
      <span className="message__error-text">{error}</span>
      {onRetry && (
        <button className="message__error-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="message__loading" aria-label="Researcher is thinking">
      <span className="message__loading-dot" />
      <span className="message__loading-dot" />
      <span className="message__loading-dot" />
    </div>
  );
}

function MessageBody({
  isUser,
  content,
  hasContent,
}: {
  isUser: boolean;
  content: string;
  hasContent: boolean;
}) {
  return (
    <div className="message__body">
      {isUser ? (
        <p>{content}</p>
      ) : hasContent ? (
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      ) : null}
    </div>
  );
}

function SlowHint({ text }: { text: string }) {
  return (
    <p className="message__slow-hint" role="status">
      {text}
    </p>
  );
}

// ----- helpers -------------------------------------------------------

function buildMessageClassName({
  isUser,
  isCurrentlyStreaming,
  justCompleted,
  hasError,
}: {
  isUser: boolean;
  isCurrentlyStreaming: boolean;
  justCompleted: boolean;
  hasError: boolean;
}): string {
  return [
    'message',
    isUser ? 'message--user' : 'message--assistant',
    isCurrentlyStreaming && 'message--streaming',
    justCompleted && 'message--completed',
    hasError && 'message--error',
  ]
    .filter(Boolean)
    .join(' ');
}

function formatToolName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
