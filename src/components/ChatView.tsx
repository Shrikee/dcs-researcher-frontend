import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageItem } from './MessageItem';

interface Props {
  messages: Message[];
  isStreaming: boolean;
  onRetry?: () => void;
}

export function ChatView({ messages, isStreaming, onRetry }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const rafRef = useRef(0);

  // Track whether the user has scrolled away from the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledUp.current = distFromBottom > 80;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on new content (throttled via rAF)
  const msgCount = messages.length;
  const lastContent = messages[msgCount - 1]?.content.length ?? 0;
  useEffect(() => {
    if (userScrolledUp.current || !anchorRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      anchorRef.current?.scrollIntoView({ block: 'end' });
    });
  }, [msgCount, lastContent]);

  return (
    <div className="chat-view" ref={scrollRef}>
      <div className="chat-view__inner">
        {messages.map((msg, i) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
            onRetry={msg.error && i === messages.length - 1 ? onRetry : undefined}
          />
        ))}
        <div ref={anchorRef} />
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isStreaming ? 'Researcher is responding…' : ''}
      </div>
    </div>
  );
}
