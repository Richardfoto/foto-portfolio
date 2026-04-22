import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Richard Foto – Professzionális fotózás Budapest",
    template: "%s | Richard Foto",
  },
  description:
    "Professzionális portré, esküvői és családi fotózás Budapesten. Foglalj időpontot még ma!",
  openGraph: {
    title: "Richard Foto",
    description: "Professzionális fotózás Budapesten",
    url: "https://richardfoto.vercel.app",
    siteName: "Richard Foto",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16 flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
