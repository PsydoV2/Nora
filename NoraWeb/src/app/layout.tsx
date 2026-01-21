import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#0c3cd4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "nora | Dein smarter Notenrechner & Klausuren-Planer",
    template: "%s | nora App",
  },
  description:
    "Behalte deine Schulnoten im Griff mit nora. Berechne deinen Schnitt in Echtzeit, schütze deine Daten per PIN und verwalte Klausuren lokal auf deinem Gerät.",

  // Einbindung der Favicons und Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // SEO & Social Media
  keywords: ["Notenrechner", "Noten-App", "Schnitt berechnen", "nora App"],
  authors: [{ name: "nora Team" }],
  openGraph: {
    title: "nora | Dein smarter Notenrechner",
    description:
      "Sicherer Überblick über deinen aktuellen Notenschnitt – 100% lokal.",
    url: "https://nora.sfalter.de",
    siteName: "nora App",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nora | Noten & Schnitt im Griff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
