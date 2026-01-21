import Head from "next/head";
import "@/styles/globals.css";

export default function NoraLanding() {
  const subjects = [
    { name: "Mathematik", color: "#4A90E2", initial: "M", grades: [1, 2, 2] },
    { name: "Physik", color: "#9B59B6", initial: "P", grades: [1, 1] },
    { name: "Englisch", color: "#50C878", initial: "E", grades: [2, 1, 2] },
  ];

  return (
    <>
      <Head>
        <title>nora | Mehr als nur Noten</title>
      </Head>

      <nav className="navbar">
        <div className="container nav-content">
          <a href="#" className="brand">
            nora
          </a>
          <a href="#" className="btn-primary">
            App öffnen
          </a>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <header className="hero container">
          <h1>
            Dein Schnitt, <br />
            <span>deine Kontrolle.</span>
          </h1>
          <p>
            Organisiere deine Klausuren, berechne deinen Schnitt und schütze
            deine Daten mit einer PIN. Alles lokal, alles sicher.
          </p>
          <div className="button-group">
            <a href="#" className="btn-primary btn-primary-lg">
              Kostenlos starten
            </a>
          </div>
        </header>

        {/* INSIGHTS / STATS SECTION */}
        <section className="container" style={{ marginTop: "60px" }}>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">1.4</span>
              <span className="stat-label">Gesamtschnitt</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">12</span>
              <span className="stat-label">Abgeschlossene Klausuren</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">Bestwert</span>
              <span className="stat-label">In Mathematik & Englisch</span>
            </div>
          </div>
        </section>

        {/* APP PREVIEW */}
        <section className="container">
          <div className="app-mockup">
            <div className="app-header">
              <span>Noten</span>
              <div className="year-badge">2025/26 ▾</div>
            </div>
            {subjects.map((s, i) => (
              <div key={i} className="subject-card">
                <div
                  className="subject-avatar"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >
                  {s.initial}
                </div>
                <div className="subject-info">
                  <div className="subject-name">{s.name}</div>
                  <div className="grades-row">
                    {s.grades.map((g, gi) => (
                      <div key={gi} className="grade-box">
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="fab-simulation">+</div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="container">
            <h2
              style={{
                fontWeight: 900,
                fontSize: "40px",
                marginBottom: "60px",
                textAlign: "center",
              }}
            >
              Warum nora?
            </h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>PIN-Sperre</h3>
                <p>
                  Niemand sieht deine Noten ohne deine Erlaubnis. Schütze die
                  App mit einem 6-stelligen Code.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Echtzeit-Schnitt</h3>
                <p>
                  Sobald du eine Note einträgst, berechnet nora sofort deinen
                  neuen Durchschnitt für jedes Fach.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">☁️</div>
                <h3>100% Lokal</h3>
                <p>
                  Deine Daten gehören dir. Keine Cloud, kein Tracking, keine
                  Server. Alles auf deinem Gerät.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="container faq-section">
          <h2
            style={{ fontWeight: 900, fontSize: "32px", marginBottom: "40px" }}
          >
            Häufig gestellte Fragen
          </h2>
          <div className="faq-item">
            <span className="faq-question">Wie sicher sind meine Daten?</span>
            <p className="faq-answer">
              Da nora keine Server nutzt, verlassen deine Daten niemals dein
              Handy. Die PIN-Sperre schützt dich vor neugierigen Blicken vor
              Ort.
            </p>
          </div>
          <div className="faq-item">
            <span className="faq-question">Kostet nora etwas?</span>
            <p className="faq-answer">
              nora ist komplett kostenlos und werbefrei.
            </p>
          </div>
          <div className="faq-item">
            <span className="faq-question">Kann ich Daten exportieren?</span>
            <p className="faq-answer">
              Wir arbeiten aktuell an einer Export-Funktion, damit du deine
              Noten als PDF sichern kannst.
            </p>
          </div>
        </section>

        {/* SAFETY FOOTER */}
        <section className="safety container">
          <div className="badge">
            <div className="dot"></div>
            <span>Privatsphäre an erster Stelle</span>
          </div>
          <h2>Bereit für den Überblick?</h2>
          <div className="button-group">
            <a href="#" className="btn-danger">
              Daten löschen
            </a>
            <a href="#" className="btn-primary">
              Jetzt starten
            </a>
          </div>
        </section>
      </main>

      <footer
        style={{
          padding: "40px 0",
          textAlign: "center",
          borderTop: "1px solid var(--bg-dark)",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        &copy; 2026 nora App. Alle Rechte vorbehalten.
      </footer>
    </>
  );
}
