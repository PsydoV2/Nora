"use client";

import { motion } from "framer-motion";

export default function LegalPage() {
  return (
    <main
      className="container"
      style={{ padding: "80px 20px", maxWidth: "800px" }}
    >
      <motion.a
        href="/"
        className="btn-primary"
        style={{ marginBottom: "40px" }}
        whileHover={{ x: -5 }}
      >
        ← Zurück zur Startseite
      </motion.a>

      <h1 style={{ fontWeight: 900, fontSize: "40px", marginBottom: "40px" }}>
        Impressum
      </h1>

      <section
        className="legal-content"
        style={{ lineHeight: "1.6", color: "var(--text)" }}
      >
        <h2 style={{ fontWeight: 800, marginTop: "30px", fontSize: "20px" }}>
          Angaben gemäß § 5 TMG
        </h2>
        <p>
          Sebastian Falter
          <br />
          {/* [Deine Straße Hausnummer] */}
          <br />
          {/* [PLZ] [Dein Wohnort] */}
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px", fontSize: "20px" }}>
          Kontakt
        </h2>
        <p>E-Mail: nora@sfalter.de</p>

        <h2 style={{ fontWeight: 800, marginTop: "30px", fontSize: "20px" }}>
          Redaktionell verantwortlich
        </h2>
        <p>
          Sebastian Falter
          <br />
          {/* [Deine Straße Hausnummer] */}
          <br />
          {/* [PLZ] [Dein Wohnort] */}
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px", fontSize: "20px" }}>
          EU-Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              marginLeft: "5px",
            }}
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px", fontSize: "20px" }}>
          Verbraucherstreitbeilegung/ Universalschlichtungsstelle
        </h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <footer
        style={{
          marginTop: "80px",
          borderTop: "1px solid var(--bg-dark)",
          paddingTop: "20px",
        }}
      >
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          &copy; 2026 nora App
        </p>
      </footer>
    </main>
  );
}
