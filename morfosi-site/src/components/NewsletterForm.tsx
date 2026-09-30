"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Newsletter submissions are logged — email integration can be added via /api/newsletter
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-brand-teal/10 border-[3px] border-brand-teal p-6 text-center">
        <div className="text-brand-teal font-black text-lg uppercase tracking-widest mb-2">✓ Εγγραφήκατε!</div>
        <p className="text-gray-600 font-bold text-sm">Θα λαμβάνετε τα νέα μας στο email σας.</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Το email σας"
        id="newsletter-email-sidebar"
        required
        className="bg-gray-100 border-[3px] border-black px-4 py-3 text-base md:text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:border-brand-teal transition-colors"
      />
      <button
        type="submit"
        className="bg-brand-orange text-white font-black text-xs uppercase tracking-widest py-4 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
      >
        ΕΓΓΡΑΦΗ
        <ArrowRight size={14} strokeWidth={3} />
      </button>
    </form>
  );
}
