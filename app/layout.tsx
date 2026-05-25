import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tanuj Kakumani | simplytk",
  description:
    "A-Level & UCAS guidance, Imperial insider tips, health & fitness advice, and spring week strategies — from an Imperial student who's done it all.",
  metadataBase: new URL("https://simplytk.com"),
  openGraph: {
    title: "Tanuj Kakumani | simplytk",
    description:
      "A-Level & UCAS guidance, Imperial insider tips, health & fitness advice, and spring week strategies — from an Imperial student who's done it all.",
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
    title: "Tanuj Kakumani | simplytk",
    description:
      "A-Level & UCAS guidance, Imperial insider tips, health & fitness advice, and spring week strategies.",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
