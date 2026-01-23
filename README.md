# nora 🎓

**nora** ist eine minimalistische, sichere und lokale Notenverwaltung für Schüler und Studenten. Behalte deinen Schnitt im Griff, ohne deine Privatsphäre zu opfern.

---

## 🚀 Features

- **100% Lokal:** Deine Daten gehören dir. nora speichert alles ausschließlich auf deinem Gerät – keine Cloud, kein Tracking.
- **Echtzeit-Schnitt:** Sobald du eine Note einträgst, berechnet nora sofort deinen neuen Durchschnitt.
- **PIN-Sperre:** Schütze deine Noten vor neugierigen Blicken mit einem 6-stelligen Sicherheitscode.
- **Historie:** Verwalte Fächer über verschiedene Schuljahre hinweg (bis zu 15 Jahre rückwirkend).
- **Modernes Design:** Minimalistisches Interface mit individuellen Akzentfarben im "nora-Style".

---

## 📂 Projektstruktur

Das Repository ist in zwei Hauptbereiche unterteilt:

- `/app`: Die mobile App entwickelt mit **React Native (Expo)**.
- `/web`: Die Landingpage entwickelt mit **Next.js 15**, **Framer Motion** und **CSS Modules**.

---

## 🛠️ Installation & Setup

### Voraussetzungen

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/client) auf deinem Smartphone (zum Testen der App)

### 1. Landingpage (Web)

```bash
cd web
npm install
npm run dev
```

````

Die Landingpage ist dann unter `http://localhost:3000` erreichbar.

### 2. Mobile App (Expo)

```bash
cd app
npm install
npx expo start

```

Scanne den QR-Code mit der Expo Go App (Android) oder der Kamera-App (iOS).

---

## 🎨 Design System

nora nutzt ein konsistentes Design-System über Web und Mobile hinweg:

| Variable    | Wert                     | Beschreibung                         |
| ----------- | ------------------------ | ------------------------------------ |
| `primary`   | `#0c3cd4`                | Hauptfarbe (Blau)                    |
| `primary20` | `rgba(12, 60, 212, 0.2)` | Transparente Akzentfarbe für Buttons |
| `bg`        | `#f2f2f2`                | Hintergrundfarbe                     |
| `brLg`      | `16px`                   | Standard Corner Radius               |

---

## 🛡️ Datenschutz (Data Safety)

nora wurde nach dem Prinzip "Privacy by Design" entwickelt:

- Keine externen APIs oder Server-Anbindungen.
- Datenspeicherung via `AsyncStorage` (Mobile) bzw. lokale Verschlüsselung.
- Kein Tracking (Google Analytics o.ä.).

---

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die [LICENSE](https://www.google.com/search?q=LICENSE) Datei für Details.

---

**nora** – Deine Noten, deine Kontrolle.
Erstellt mit Leidenschaft für Privatsphäre im Bildungsbereich.
````
