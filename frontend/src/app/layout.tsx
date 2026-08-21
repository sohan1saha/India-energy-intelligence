import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrjaAegis AI - India Energy Intelligence Command Center',
  description: 'AI-Driven Energy Supply Chain Resilience & Procurement Rerouting Engine for Import-Dependent Economies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
