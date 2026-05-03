import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export function MaintenancePage() {
  useTheme();

  return (
    <div className="app">
      <Helmet>
        <title>Maintenance — DCS Researcher</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="main">
        <div className="empty-state">
          <div className="radar" aria-hidden="true">
            <div className="radar__grid" />
            <div className="radar__ring radar__ring--1" />
            <div className="radar__ring radar__ring--2" />
            <div className="radar__ring radar__ring--3" />
            <div className="radar__cross radar__cross--h" />
            <div className="radar__cross radar__cross--v" />
            <div className="radar__sweep">
              <div className="radar__trail" />
              <div className="radar__arm" />
            </div>
            <div className="radar__blip radar__blip--1" />
            <div className="radar__blip radar__blip--2" />
            <div className="radar__blip radar__blip--3" />
            <div className="radar__center" />
            <div className="radar__pulse" />
          </div>

          <span className="maintenance-pill">Scheduled maintenance</span>
          <h1 className="empty-state__title">We'll be back shortly</h1>
          <p className="empty-state__subtitle">
            DCS Researcher is offline for a planned update. The chat will return
            as soon as the backend is back online — usually a few minutes.
          </p>
          <p className="maintenance-link">
            <Link to="/about">Read about DCS Researcher while you wait →</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
