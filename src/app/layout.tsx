import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stockholm Music Group",
  description: "Stockholm Music Group är en stilren och mångsidig covertrio från Stockholm som specialiserar sig på att tolka klassiker ur pop-, rock-, soul- och jazzrepertoaren. Med två distinkta sångröster – en kvinnlig och en manlig – samt ett dynamiskt samspel mellan piano och gitarr skapar trion stämningar som passar allt från intimaceremonier till större festliga sammanhang.",
};

/**
 * Deliberately bare — the site's global CSS lives in app/(site)/layout.tsx
 * so the embedded Studio at /studio isn't styled by it.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
