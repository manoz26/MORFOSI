"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/consent";

const GA_ID = "G-LQM2YQEMFS";

/**
 * Το Google Analytics φορτώνει ΜΟΝΟ αφού ο χρήστης δώσει ρητή συγκατάθεση.
 * Όσο δεν έχει απαντήσει ή έχει απορρίψει, δεν κατεβαίνει καθόλου το gtag
 * (~50KB) — άρα το site είναι και συμμορφούμενο και ελαφρύτερο.
 */
export default function Analytics() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
