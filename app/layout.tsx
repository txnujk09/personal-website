import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalEmbed } from "@/components/CalEmbed";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tanuj Kakumani | simplytk — Mentoring & Resources",
  description:
    "1:1 mentoring and downloadable playbooks for A-Levels, UCAS, spring weeks, and fitness — from an Imperial student who's landed 6+ spring weeks.",
  metadataBase: new URL("https://simplytk.com"),
  openGraph: {
    title: "Tanuj Kakumani | simplytk — Mentoring & Resources",
    description:
      "1:1 mentoring and downloadable playbooks for A-Levels, UCAS, spring weeks, and fitness — from an Imperial student who's landed 6+ spring weeks.",
    url: "https://simplytk.com",
    siteName: "simplytk",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "simplytk — Tanuj Kakumani",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanuj Kakumani | simplytk — Mentoring & Resources",
    description:
      "1:1 mentoring and downloadable playbooks for A-Levels, UCAS, spring weeks, and fitness.",
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <CalEmbed />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
