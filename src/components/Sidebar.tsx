import type { ChatSession, Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onToggle,
  theme,
  onToggleTheme,
}: Props) {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'sidebar--closed'}`}>
      <div className="sidebar__header">
        <span className="sidebar__brand">DCS Researcher</span>
        <div className="sidebar__header-actions">
          <button className="sidebar__new-btn" onClick={onNewSession}>
            + New
          </button>
          <button
            className="sidebar__close-btn"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="sidebar__sessions">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`sidebar__session ${
              session.id === activeSessionId ? 'sidebar__session--active' : ''
            }`}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSession(session.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectSession(session.id);
              }
            }}
          >
            <span className="sidebar__session-title">{session.title}</span>
            <button
              className="sidebar__session-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              aria-label={`Delete session: ${session.title}`}
            >
              ×
            </button>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="sidebar__empty">
            No research sessions yet.
            <br />
            Click <strong>+ New</strong> to start one.
          </div>
        )}
      </div>

      <div className="sidebar__footer">
        {sessions.length > 0 && (
          <span className="sidebar__count">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </span>
        )}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  );
}
