"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot, setConsent } from "@/lib/consent";

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // `null` = δεν έχει απαντήσει ακόμα. Μόνο τότε δείχνουμε το banner.
  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-4 md:px-8 md:pb-8 pt-4 pointer-events-none flex justify-center">
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-shrink-0 hidden md:flex items-center justify-center w-12 h-12 bg-brand-orange border-[3px] border-black">
          <Cookie size={24} className="text-white fill-white" />
        </div>
        
        <div className="flex-grow">
          <h4 className="font-black text-lg uppercase tracking-tight text-gray-900 mb-1">
            Χρησιμοποιούμε Cookies 🍪
          </h4>
          <p className="text-sm font-bold text-gray-600 leading-relaxed md:pr-4">
            Χρησιμοποιούμε cookies στατιστικών (Google Analytics) για να καταλάβουμε πώς
            χρησιμοποιείται ο ιστότοπος. Φορτώνουν <strong>μόνο</strong> αν το αποδεχτείτε.
            Περισσότερα στην{" "}
            <Link href="/privacy" className="text-brand-teal underline font-black hover:text-brand-orange transition-colors">
              Πολιτική Απορρήτου
            </Link>{" "}
            μας.
          </p>
        </div>

        {/* `min-w-0` ώστε τα κουμπιά να συρρικνώνονται αντί να βγαίνουν εκτός οθόνης
            στα 375px — το «ΑΠΟΡΡΙΨΗ» έφτανε ως τα 381px και κοβόταν. */}
        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={() => setConsent("granted")}
            className="flex-1 min-w-0 md:flex-none uppercase tracking-wider md:tracking-widest font-black text-sm bg-brand-teal text-white border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-4 md:px-8 py-3 text-center"
          >
            ΑΠΟΔΟΧΗ
          </button>
          <button
            onClick={() => setConsent("denied")}
            className="flex-1 min-w-0 md:flex-none uppercase tracking-wider md:tracking-widest font-black text-sm bg-white text-gray-900 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-gray-100 transition-all px-4 md:px-8 py-3 text-center"
          >
            ΑΠΟΡΡΙΨΗ
          </button>
        </div>
      </div>
    </div>
  );
}
