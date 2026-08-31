import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MatchPoster – Kafe İçin Otomatik Maç Afişi Oluşturucu",
  description:
    "Galatasaray, Fenerbahçe ve Beşiktaş maçları için Instagram Story ve Post afişlerini tek tıkla oluşturun ve indirin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${oswald.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#08080f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
