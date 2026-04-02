import { useMemo, useState, useCallback, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useSidebar } from './hooks/useSidebar';
import { useChatSessions } from './hooks/useChatSessions';
import { useStreaming } from './hooks/useStreaming';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ChatView } from './components/ChatView';
import { Sidebar } from './components/Sidebar';
import { InputBar } from './components/InputBar';
import { EmptyState } from './components/EmptyState';
import { UndoToast } from './components/UndoToast';
import type { ChatSession } from './types';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const sidebar = useSidebar();
  const chat = useChatSessions();
  const [deletedSession, setDeletedSession] = useState<ChatSession | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const streamingDeps = useMemo(
    () => ({
      activeSessionId: chat.activeSessionId,
      createSession: chat.createSession,
      appendMessages: chat.appendMessages,
      promoteSession: chat.promoteSession,
      updateLastAssistantMessage: chat.updateLastAssistantMessage,
      removeLastAssistantMessage: chat.removeLastAssistantMessage,
    }),
    [
      chat.activeSessionId,
      chat.createSession,
      chat.appendMessages,
      chat.promoteSession,
      chat.updateLastAssistantMessage,
      chat.removeLastAssistantMessage,
    ],
  );

  const { isStreaming, send, stop, retry } = useStreaming(streamingDeps);

  const handleNewSession = () => {
    if (isStreaming) stop();
    chat.clearActiveSession();
    sidebar.closeIfMobile();
  };

  const handleSelectSession = (id: string) => {
    chat.setActiveSessionId(id);
    sidebar.closeIfMobile();
  };

  const handleDeleteSession = useCallback(
    (id: string) => {
      const session = chat.sessions.find((s) => s.id === id);
      if (session) {
        setDeletedSession(session);
      }
      chat.deleteSession(id);
    },
    [chat.sessions, chat.deleteSession],
  );

  const handleUndoDelete = useCallback(() => {
    if (deletedSession) {
      chat.restoreSession(deletedSession);
      setDeletedSession(null);
    }
  }, [deletedSession, chat.restoreSession]);

  const handleDismissToast = useCallback(() => {
    setDeletedSession(null);
  }, []);

  useKeyboardShortcuts({
    onNewSession: handleNewSession,
    onToggleSidebar: sidebar.toggle,
    onFocusInput: useCallback(() => inputRef.current?.focus(), []),
    onCloseSidebar: sidebar.close,
    isSidebarOpen: sidebar.open,
  });

  return (
    <div className="app">
      <div
        className={`sidebar-backdrop ${!sidebar.open ? 'sidebar-backdrop--hidden' : ''}`}
        onClick={sidebar.close}
        aria-hidden="true"
      />
      <Sidebar
        sessions={chat.sessions}
        activeSessionId={chat.activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebar.open}
        onToggle={sidebar.close}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <button
        className={`toggle-sidebar ${!sidebar.open ? 'toggle-sidebar--visible' : ''}`}
        onClick={() => sidebar.setOpen(true)}
        aria-label="Open sidebar"
        title="Open sidebar"
      >
        ☰
      </button>

      <main className="main">
        {chat.activeSession ? (
          <ChatView
            messages={chat.activeSession.messages}
            isStreaming={isStreaming}
            onRetry={retry}
          />
        ) : (
          <EmptyState onSuggestionClick={send} />
        )}
        <InputBar ref={inputRef} onSend={send} isStreaming={isStreaming} onStop={stop} />
      </main>

      {deletedSession && (
        <UndoToast
          message="Session deleted"
          onUndo={handleUndoDelete}
          onDismiss={handleDismissToast}
        />
      )}
    </div>
  );
}
