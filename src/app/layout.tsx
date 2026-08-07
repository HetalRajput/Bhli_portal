import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import EnquiryWidget from "@/components/EnquiryWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SecurityGuards from "@/components/SecurityGuards";
import SiteLoader from "@/components/SiteLoader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Booking Hospitality - Hospitality Beyond Borders",
  description: "Complete travel management, hospitality and defence reservation assistance across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent/30">
        <SiteLoader />
        <SecurityGuards />
        <ScrollReveal />
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <EnquiryWidget />
        <SpeedInsights />
      </body>
    </html>
  );
}







