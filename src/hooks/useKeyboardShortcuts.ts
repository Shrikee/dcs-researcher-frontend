import { useEffect } from 'react';

interface ShortcutActions {
  onNewSession: () => void;
  onToggleSidebar: () => void;
  onFocusInput: () => void;
  onCloseSidebar: () => void;
  isSidebarOpen: boolean;
}

export function useKeyboardShortcuts({
  onNewSession,
  onToggleSidebar,
  onFocusInput,
  onCloseSidebar,
  isSidebarOpen,
}: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable;

      // Cmd/Ctrl+N — new session
      if (mod && e.key === 'n') {
        e.preventDefault();
        onNewSession();
        return;
      }

      // Cmd/Ctrl+B — toggle sidebar
      if (mod && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar();
        return;
      }

      // Cmd/Ctrl+K — focus input
      if (mod && e.key === 'k') {
        e.preventDefault();
        onFocusInput();
        return;
      }

      // "/" — focus input (only when not already typing)
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        onFocusInput();
        return;
      }

      // Escape — close sidebar
      if (e.key === 'Escape' && isSidebarOpen) {
        e.preventDefault();
        onCloseSidebar();
        return;
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onNewSession, onToggleSidebar, onFocusInput, onCloseSidebar, isSidebarOpen]);
}
