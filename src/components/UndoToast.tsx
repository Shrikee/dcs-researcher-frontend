import { useEffect, useRef } from 'react';

interface Props {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, duration);
    return () => clearTimeout(timerRef.current);
  }, [onDismiss, duration]);

  return (
    <div className="undo-toast" role="alert">
      <span className="undo-toast__message">{message}</span>
      <button className="undo-toast__btn" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
