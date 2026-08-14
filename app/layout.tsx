import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SponsorLoop | Sponsorship & Advertising Marketplace",
  description: "Saudi-first bilingual sponsorship and advertising marketplace with explainable AI matching."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
