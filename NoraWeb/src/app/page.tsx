"use client";

import Head from "next/head";
import { motion } from "framer-motion";

export default function NoraLanding() {
  const subjects = [
    { name: "Mathematik", color: "#4A90E2", initial: "M", grades: [1, 2, 2] },
    { name: "Physik", color: "#9B59B6", initial: "P", grades: [1, 1] },
    { name: "Englisch", color: "#50C878", initial: "E", grades: [2, 1, 2] },
  ];

  // Animationsvarianten für Stagger-Effekt (Elemente erscheinen nacheinander)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Head>
        <title>nora | Mehr als nur Noten</title>
      </Head>

      <nav className="navbar">
        <div className="container nav-content">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="#"
            className="brand"
          >
            nora
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="btn-primary"
          >
            App öffnen
          </motion.a>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <motion.header
          className="hero container"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>
            Dein Schnitt, <br />
            <span>deine Kontrolle.</span>
          </motion.h1>
          <motion.p variants={itemVariants}>
            Organisiere deine Klausuren, berechne deinen Schnitt und schütze
            deine Daten mit einer PIN. Alles lokal, alles sicher.
          </motion.p>
          <motion.div variants={itemVariants} className="button-group">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="btn-primary btn-primary-lg"
            >
              Kostenlos starten
            </motion.a>
          </motion.div>
        </motion.header>

        {/* APP PREVIEW - Erscheint beim Scrollen */}
        <section className="container">
          <motion.div
            className="app-mockup"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="app-header">
              <span>Noten</span>
              <div className="year-badge">2025/26 ▾</div>
            </div>
            {subjects.map((s, i) => (
              <motion.div
                key={i}
                className="subject-card"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
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
              </motion.div>
            ))}
            <motion.div
              className="fab-simulation"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.div>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section className="container" style={{ marginTop: "60px" }}>
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="stat-card-rich">
              <div>
                <span className="stat-label">Notenschnitt</span>
                <span className="stat-value">1,4</span>
              </div>
              <div className="trending-up">📈 +0.2 Verbesserung</div>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card-rich">
              <div>
                <span className="stat-label">Ziel (1,2)</span>
                <div className="progress-bar-bg">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Noch 3 Klausuren bis zum Ziel
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card-rich">
              <span className="stat-label">Stärkstes Fach</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  className="subject-avatar-mini"
                  style={{ backgroundColor: "#4A90E220", color: "#4A90E2" }}
                >
                  M
                </div>
                <span style={{ fontWeight: "800" }}>Mathematik (1,0)</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section className="features-section">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{
                fontWeight: 900,
                fontSize: "40px",
                marginBottom: "60px",
                textAlign: "center",
              }}
            >
              Warum nora?
            </motion.h2>
            <div className="features-grid">
              {[
                {
                  icon: "🔒",
                  title: "PIN-Sperre",
                  desc: "Niemand sieht deine Noten ohne deine Erlaubnis.",
                },
                {
                  icon: "📊",
                  title: "Echtzeit-Schnitt",
                  desc: "Berechnet sofort deinen neuen Durchschnitt.",
                },
                {
                  icon: "☁️",
                  title: "100% Lokal",
                  desc: "Deine Daten gehören dir. Keine Cloud, kein Tracking.",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className="feature-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY FOOTER */}
        <section className="safety container">
          <motion.div
            className="badge"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="dot"></div>
            <span>Privatsphäre an erster Stelle</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            Bereit für den Überblick?
          </motion.h2>
          <div className="button-group">
            <motion.a whileHover={{ x: -5 }} href="#" className="btn-danger">
              Daten löschen
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="btn-primary"
            >
              Jetzt starten
            </motion.a>
          </div>
        </section>
      </main>

      <footer className="footer-main">
        <div className="container footer-content">
          <div className="footer-links">
            <motion.a
              whileHover={{ y: -2 }}
              href="/privacy"
              className="footer-link"
            >
              Datenschutz
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="mailto:nora@sfalter.de"
              className="footer-link"
            >
              Support
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="/legal"
              className="footer-link"
            >
              Impressum
            </motion.a>
          </div>

          <div className="copyright">
            &copy; {new Date().getFullYear()} nora App. Entwickelt für deine
            Privatsphäre.
          </div>
        </div>
      </footer>
    </>
  );
}
