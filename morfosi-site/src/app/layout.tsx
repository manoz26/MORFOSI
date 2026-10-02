import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import CookieConsent from "@/components/CookieConsent";
import { client } from "@/sanity/client";
import Analytics from "@/components/Analytics";
import { OrganizationSchema } from "@/components/SchemaOrg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Απόλυτα URLs για og:image / canonical. Βλ. src/lib/site.ts
  metadataBase: new URL(SITE_URL),
  title: "Μόρφωση - Φροντιστήριο Μέσης Εκπαίδευσης",
  description: "Το κορυφαίο φροντιστήριο για την εκπαιδευτική σου επιτυχία.",
  icons: {
    icon: "/favicon.ico",
    // Χωρίς αυτό, το «Πρόσθεση στην αρχική οθόνη» στο iOS έδειχνε screenshot
    // της σελίδας αντί για λογότυπο.
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  // Χρωματίζει τη γραμμή διευθύνσεων σε Android Chrome και Safari iOS.
  themeColor: "#095f77",
};



import LayoutWrapper from "@/components/LayoutWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ contactPhone }`);
  const phone = settings?.contactPhone || "210 506 3610";
  return (
    <html
      lang="el"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-0 w-full max-w-[100vw]">
        <OrganizationSchema phone={phone} />
        <Analytics />
        <LayoutWrapper
          header={<Header contactPhone={phone} />}
          footer={<Footer />}
          mobileBar={<MobileStickyBar contactPhone={phone} />}
        >
          {children}
        </LayoutWrapper>
        <CookieConsent />
        <SpeedInsights />
      </body>
    </html>
  );
}
