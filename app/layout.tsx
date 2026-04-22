import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Richard Foto",
  description: "Professzionalis fotozas Budapest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
