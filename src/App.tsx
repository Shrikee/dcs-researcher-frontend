import { useMemo, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { Analytics } from '@vercel/analytics/react';
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
      <Helmet>
        <title>DCS Researcher — AI Assistant for Digital Combat Simulator (DCS World)</title>
        <meta name="description" content="DCS Researcher is an AI-powered research assistant for Digital Combat Simulator (DCS World) by Eagle Dynamics. Get instant answers about aircraft systems, weapons employment, startup procedures, and mission planning for the F-16C, F/A-18C, A-10C, and all DCS modules." />
        <link rel="canonical" href="https://dcs-researcher.dev/" />
        <meta property="og:title" content="DCS Researcher — AI Assistant for Digital Combat Simulator" />
        <meta property="og:description" content="AI-powered research assistant for DCS World by Eagle Dynamics. Instant answers about aircraft systems, weapons, avionics, and mission planning for every DCS module." />
        <meta property="og:url" content="https://dcs-researcher.dev/" />
        <meta name="twitter:title" content="DCS Researcher — AI Assistant for Digital Combat Simulator" />
        <meta name="twitter:description" content="AI-powered research assistant for DCS World. Get instant answers about aircraft systems, weapons, and procedures for every DCS module by Eagle Dynamics." />
      </Helmet>
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
      <Analytics />
    </div>
  );
}
