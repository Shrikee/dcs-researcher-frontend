interface Props {
  onSuggestionClick: (query: string) => void;
}

const SUGGESTIONS = [
  'F-16 radar modes explained',
  'A-10C HOTAS controls',
  'How to use JDAM in the F/A-18',
  'F-14 RIO radar operation',
];

export function EmptyState({ onSuggestionClick }: Props) {
  return (
    <div className="empty-state">
      <div className="radar" aria-hidden="true">
        {/* Dot-grid background */}
        <div className="radar__grid" />

        {/* Concentric rings */}
        <div className="radar__ring radar__ring--1" />
        <div className="radar__ring radar__ring--2" />
        <div className="radar__ring radar__ring--3" />

        {/* Crosshairs */}
        <div className="radar__cross radar__cross--h" />
        <div className="radar__cross radar__cross--v" />

        {/* Rotating sweep (trail + arm) */}
        <div className="radar__sweep">
          <div className="radar__trail" />
          <div className="radar__arm" />
        </div>

        {/* Blip targets */}
        <div className="radar__blip radar__blip--1" />
        <div className="radar__blip radar__blip--2" />
        <div className="radar__blip radar__blip--3" />

        {/* Center dot */}
        <div className="radar__center" />

        {/* Outer glow ring pulse */}
        <div className="radar__pulse" />
      </div>

      <h1 className="empty-state__title">DCS Researcher</h1>
      <p className="empty-state__subtitle">
        Ask about aircraft systems, weapons, procedures, or avionics.
      </p>

      <div className="empty-state__suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="empty-state__suggestion"
            onClick={() => onSuggestionClick(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
