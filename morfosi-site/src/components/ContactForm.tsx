"use client";
import { CONTACT_EMAIL } from "@/lib/site";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useFormGuard } from "@/lib/useFormGuard";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactForm({ contactEmail }: { contactEmail?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const { guardPayload, honeypotField } = useFormGuard();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...guardPayload() }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Κάτι πήγε στραβά");
        setState("error");
        return;
      }

      setState("success");
    } catch {
      alert("Πρόβλημα σύνδεσης με τον διακομιστή");
      setState("error");
    }
  }


  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center border-[4px] border-brand-green bg-brand-green/5 shadow-[8px_8px_0px_#00a651]">
        <CheckCircle size={64} className="text-brand-green" strokeWidth={1.5} />
        <div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
            Το μήνυμά σας εστάλη!
          </h3>
          <p className="text-gray-600 font-bold">
            Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
          </p>
          {contactEmail && (
            <p className="text-brand-teal font-black text-sm mt-3">{contactEmail}</p>
          )}
        </div>
        <button
          onClick={() => { setState("idle"); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          className="border-4 border-black bg-white px-8 py-3 font-black text-sm uppercase tracking-widest hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all shadow-[4px_4px_0px_#000]"
        >
          Νέο Μήνυμα
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-0 border-[4px] border-black shadow-[12px_12px_0px_#000]">
      {honeypotField}
      {/* Form header */}
      <div className="bg-brand-teal px-8 py-5 flex items-center gap-3">
        <Send size={20} className="text-white" strokeWidth={2.5} />
        <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Φόρμα Επικοινωνίας</span>
      </div>

      <div className="bg-white p-8 flex flex-col gap-6">
        {/* Name + Phone row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="font-black text-xs uppercase tracking-widest text-gray-600">
              Ονοματεπώνυμο <span className="text-brand-red">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="π.χ. Γιώργος Παππάς"
              className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors" autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-phone" className="font-black text-xs uppercase tracking-widest text-gray-600">
              Τηλέφωνο
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="π.χ. 210 123 4567"
              className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors" autoComplete="tel" inputMode="tel"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="font-black text-xs uppercase tracking-widest text-gray-600">
            Email <span className="text-brand-red">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@example.com"
            className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors" autoComplete="email" inputMode="email"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-subject" className="font-black text-xs uppercase tracking-widest text-gray-600">
            Θέμα <span className="text-brand-red">*</span>
          </label>
          <select
            id="contact-subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm focus:outline-none focus:border-brand-teal transition-colors bg-white appearance-none cursor-pointer"
          >
            <option value="">— Επιλέξτε θέμα —</option>
            <option value="info">Γενικές Πληροφορίες</option>
            <option value="enrollment">Εγγραφή Μαθητή</option>
            <option value="programs">Προγράμματα Σπουδών</option>
            <option value="books">Βιβλία & Εκδόσεις</option>
            <option value="exams">Διαγωνίσματα & Θέματα</option>
            <option value="other">Άλλο</option>
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="font-black text-xs uppercase tracking-widest text-gray-600">
            Μήνυμα <span className="text-brand-red">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Γράψτε το μήνυμά σας εδώ..."
            className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors resize-none"
          />
        </div>

        {state === "error" && (
          <div className="flex items-center gap-3 bg-brand-red/10 border-[3px] border-brand-red p-4">
            <AlertCircle size={20} className="text-brand-red flex-shrink-0" />
            <p className="text-brand-red font-bold text-sm">Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-brand-teal text-white font-black uppercase tracking-widest py-5 px-8 border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
        >
          {state === "sending" ? (
            <><Loader2 size={18} className="animate-spin" /> Αποστολή...</>
          ) : (
            <><Send size={18} strokeWidth={3} /> ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ</>
          )}
        </button>

        <p className="text-gray-400 font-bold text-xs text-center">
          Απαντάμε συνήθως εντός 24 ωρών · {contactEmail || CONTACT_EMAIL}
        </p>
      </div>
    </form>
  );
}
