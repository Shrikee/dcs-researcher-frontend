import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../hooks/useTheme';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is DCS World?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Digital Combat Simulator (DCS) World is a free-to-play combat flight simulator developed by Eagle Dynamics. Known for its unparalleled fidelity, DCS World recreates modern and Cold War-era military aircraft with study-level accuracy — from fully clickable cockpits and realistic avionics to authentic flight models and weapons systems."
      }
    },
    {
      "@type": "Question",
      "name": "What is DCS Researcher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DCS Researcher is an AI-powered assistant purpose-built for DCS World pilots. Ask about startup procedures, radar modes, countermeasure programs, navigation waypoints, or any aircraft system — and get clear, accurate answers in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "What DCS modules and aircraft are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DCS Researcher covers the full range of DCS World modules including the F-16C Viper, F/A-18C Hornet, F-15E Strike Eagle, F-14 Tomcat, A-10C II Warthog, Mirage F1, Mirage 2000C, JF-17 Thunder, Eurofighter Typhoon, Su-27 Flanker, Ka-50 Black Shark, AH-64D Apache, P-51D Mustang, and all major maps including Caucasus, Persian Gulf, Syria, and Sinai."
      }
    },
    {
      "@type": "Question",
      "name": "What questions can I ask DCS Researcher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can ask about cold start procedures, weapons employment like AGM-65 Mavericks, radar modes (RWS vs TWS), TACAN and ILS approaches, countermeasure programming, Mission Editor scripting, HOTAS bindings, multiplayer server setup, SRS configuration, and any other DCS World topic."
      }
    }
  ]
};

export function About() {
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div className="about-page" data-theme={theme}>
      <Helmet>
        <title>About DCS World — DCS Researcher AI Assistant for Flight Simulator Pilots</title>
        <meta name="description" content="Learn about DCS World by Eagle Dynamics — the premier combat flight simulator — and how DCS Researcher helps pilots master aircraft systems, weapons employment, and mission planning with AI-powered instant answers." />
        <link rel="canonical" href="https://dcs-researcher.dev/about" />
        <meta property="og:title" content="About DCS World — DCS Researcher AI Assistant" />
        <meta property="og:description" content="Learn about DCS World by Eagle Dynamics and how DCS Researcher helps flight simulator pilots master aircraft systems, weapons, and mission planning." />
        <meta property="og:url" content="https://dcs-researcher.dev/about" />
        <meta name="twitter:title" content="About DCS World — DCS Researcher AI Assistant" />
        <meta name="twitter:description" content="Learn about DCS World by Eagle Dynamics and how DCS Researcher helps flight simulator pilots master aircraft systems, weapons, and mission planning." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <header className="about-header">
        <div className="about-header__inner">
          <Link to="/" className="about-header__brand">
            DCS Researcher
          </Link>
          <nav className="about-header__nav">
            <Link to="/" className="about-header__link">
              Chat
            </Link>
            <button className="about-header__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </nav>
        </div>
      </header>

      <main className="about-content">
        <section className="about-hero">
          <h1>Your AI Research Assistant for Digital Combat Simulator</h1>
          <p className="about-hero__subtitle">
            Instant answers to your DCS World questions — aircraft systems, weapons employment,
            mission planning, and more.
          </p>
        </section>

        <section className="about-section">
          <h2>What is DCS World?</h2>
          <p>
            Digital Combat Simulator (DCS) World is a free-to-play, combat flight simulator
            developed by Eagle Dynamics. Known for its unparalleled fidelity, DCS World
            recreates modern and Cold War-era military aircraft with study-level accuracy —
            from fully clickable cockpits and realistic avionics to authentic flight models
            and weapons systems. Whether you fly the F-16C Viper, F/A-18C Hornet, A-10C
            Warthog, or the Ka-50 Black Shark, every switch, sensor, and procedure mirrors
            its real-world counterpart.
          </p>
        </section>

        <section className="about-section">
          <h2>Why DCS Researcher?</h2>
          <p>
            Learning DCS can be overwhelming. Between Chuck's Guides, Wags tutorials, and
            hundreds of forum threads, finding the right answer quickly is a challenge.
            DCS Researcher is an AI-powered assistant purpose-built for DCS World pilots.
            Ask about startup procedures, radar modes, countermeasure programs, navigation
            waypoints, or any aircraft system — and get clear, accurate answers in seconds.
          </p>
        </section>

        <section className="about-section">
          <h2>Supported Modules and Aircraft</h2>
          <p>
            DCS Researcher covers the full range of DCS World modules, including high-fidelity
            aircraft and combined arms units:
          </p>
          <ul className="about-list">
            <li><strong>U.S. Jets:</strong> F-16C Viper, F/A-18C Hornet, F-15E Strike Eagle, F-14 Tomcat, A-10C II Warthog</li>
            <li><strong>European Aircraft:</strong> Mirage F1, Mirage 2000C, JF-17 Thunder, Eurofighter Typhoon</li>
            <li><strong>Russian Aircraft:</strong> Su-27 Flanker, Su-33, MiG-29, Ka-50 Black Shark, Mi-24P Hind</li>
            <li><strong>Warbirds & Classics:</strong> P-51D Mustang, Fw 190 D-9, Spitfire LF Mk. IX, F-86F Sabre, MiG-15bis</li>
            <li><strong>Helicopters:</strong> UH-1H Huey, Mi-8MTV2, SA342 Gazelle, AH-64D Apache</li>
            <li><strong>Maps:</strong> Caucasus, Persian Gulf, Syria, Sinai, South Atlantic, Nevada NTTR, Kola Peninsula</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>What You Can Ask</h2>
          <ul className="about-list">
            <li>How to cold start the F/A-18C Hornet</li>
            <li>AGM-65 Maverick employment in the A-10C</li>
            <li>RWS vs TWS radar modes in the F-16C</li>
            <li>TACAN and ILS approach procedures</li>
            <li>Countermeasure programming and chaff/flare dispensing</li>
            <li>Mission Editor scripting and trigger zones</li>
            <li>HOTAS bindings and recommended control setups</li>
            <li>Multiplayer server setup and SRS configuration</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Built for the DCS Community</h2>
          <p>
            DCS Researcher is built by DCS enthusiasts, for DCS enthusiasts. The knowledge
            base draws from official Eagle Dynamics documentation, community-created guides,
            real-world aviation references, and thousands of hours of collective flight time.
            Whether you are a beginner learning to taxi for the first time or a veteran pilot
            perfecting your BVR engagements, DCS Researcher helps you spend less time
            searching and more time flying.
          </p>
        </section>

        <section className="about-section about-cta">
          <h2>Start Researching</h2>
          <p>
            Have a question about DCS World? Jump into a chat session and get answers instantly.
          </p>
          <Link to="/" className="about-cta__button">
            Open DCS Researcher
          </Link>
        </section>
      </main>

      <footer className="about-footer">
        <p>
          DCS Researcher — AI-powered research assistant for Digital Combat Simulator.
          Not affiliated with Eagle Dynamics.
        </p>
      </footer>
    </div>
  );
}
