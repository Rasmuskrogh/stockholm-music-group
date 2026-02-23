import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Stockholm Music Group",
  description: "Stockholm Music Group är en stilren och mångsidig covertrio från Stockholm som specialiserar sig på att tolka klassiker ur pop-, rock-, soul- och jazzrepertoaren. Med två distinkta sångröster – en kvinnlig och en manlig – samt ett dynamiskt samspel mellan piano och gitarr skapar trion stämningar som passar allt från intimaceremonier till större festliga sammanhang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
