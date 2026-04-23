import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kapcsolat | Contact",
  description: "Vedd fel velem a kapcsolatot – Get in touch with me",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
