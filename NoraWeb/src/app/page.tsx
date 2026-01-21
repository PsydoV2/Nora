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
        <title>nora | Notenverwaltung</title>
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
        <header className="hero container">
          <h1>
            Dein Schnitt, <br />
            <span>deine Kontrolle.</span>
          </h1>
          <p>
            Organisiere deine Klausuren, berechne deinen Schnitt und schütze
            deine Daten mit einer PIN. Alles lokal, alles sicher.
          </p>
          <a href="#" className="btn-primary btn-primary-lg">
            Kostenlos starten
          </a>
        </header>

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

        <section className="safety container">
          <div className="badge">
            <div className="dot"></div>
            <span>Privatsphäre an erster Stelle</span>
          </div>
          <h2>Sicherer als dein Hausaufgabenheft.</h2>
          <div className="button-group">
            <a href="#" className="btn-danger">
              Daten löschen
            </a>
            <a href="#" className="btn-primary">
              PIN Sperre aktiv
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
