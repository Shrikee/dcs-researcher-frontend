import { Link } from 'react-router-dom';
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
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <div
              key={session.id}
              className={`sidebar__session-row ${
                isActive ? 'sidebar__session-row--active' : ''
              }`}
            >
              <button
                type="button"
                className="sidebar__session"
                onClick={() => onSelectSession(session.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="sidebar__session-title">{session.title}</span>
              </button>
              <button
                type="button"
                className="sidebar__session-delete"
                onClick={() => onDeleteSession(session.id)}
                aria-label={`Delete session: ${session.title}`}
              >
                ×
              </button>
            </div>
          );
        })}

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
        <div className="sidebar__footer-actions">
          <Link to="/about" className="sidebar__about-link">About</Link>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </aside>
  );
}
