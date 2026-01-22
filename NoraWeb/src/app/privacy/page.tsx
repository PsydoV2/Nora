"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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

      <h1 style={{ fontWeight: 900, fontSize: "40px", marginBottom: "20px" }}>
        Datenschutzerklärung
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>
        Stand: 22. Januar 2026
      </p>

      <section className="privacy-content" style={{ lineHeight: "1.6" }}>
        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>1. Grundsatz</h2>
        <p>
          Die App <strong>nora</strong> wurde mit dem Fokus auf maximale
          Privatsphäre entwickelt. Wir glauben, dass deine Noten niemanden etwas
          angehen außer dich selbst. Daher sammelt, speichert oder überträgt
          nora keine personenbezogenen Daten an externe Server.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>
          2. Datenspeicherung
        </h2>
        <p>
          Alle Daten, die du in der App eingibst (Fächer, Noten, Schuljahre,
          PIN-Code), werden ausschließlich{" "}
          <strong>lokal auf deinem Endgerät</strong> gespeichert. Wir haben
          keinen Zugriff auf diese Daten und können diese nicht einsehen oder
          wiederherstellen, solltest du dein Gerät verlieren oder die App
          löschen.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>
          3. Berechtigungen
        </h2>
        <p>
          nora benötigt keine kritischen Berechtigungen wie Zugriff auf
          Kontakte, Standort oder Kamera. Sollten zukünftige Funktionen
          Berechtigungen erfordern (z.B. für einen PDF-Export), wirst du
          explizit innerhalb der App um Erlaubnis gefragt.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>
          4. Dienste von Drittanbietern
        </h2>
        <p>
          Innerhalb der App werden keine Analyse-Tools (wie Google Analytics)
          oder Werbenetzwerke eingesetzt. Es findet kein Tracking deines
          Nutzungsverhaltens statt.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>5. Deine Rechte</h2>
        <p>
          Da wir keine Daten von dir speichern, gibt es bei uns keine Daten, die
          du abfragen oder löschen lassen könntest. Du hast die volle Kontrolle:
          Durch das Löschen der App oder die Funktion „Daten löschen“ innerhalb
          der Einstellungen werden alle gespeicherten Informationen
          unwiderruflich von deinem Gerät entfernt.
        </p>

        <h2 style={{ fontWeight: 800, marginTop: "30px" }}>6. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz erreichst du uns unter:
          <br />
          <strong>nora@sfalter.de</strong>
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
          nora App - Lokal. Sicher. Einfach.
        </p>
      </footer>
    </main>
  );
}
