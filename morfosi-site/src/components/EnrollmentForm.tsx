"use client";

import { useState } from "react";
import { UserPlus, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormGuard } from "@/lib/useFormGuard";

type EnrollStep = 1 | 2 | 3;
type FormState = "idle" | "sending" | "success";

const CLASSES = [
  "Α΄ Γυμνασίου", "Β΄ Γυμνασίου", "Γ΄ Γυμνασίου",
  "Α΄ Λυκείου", "Β΄ Λυκείου", "Γ΄ Λυκείου",
];

const PROGRAMS = [
  "Γενική Παιδεία",
  "Ανθρωπιστικές Σπουδές",
  "Θετικές Σπουδές",
  "Σπουδές Υγείας",
  "Σπουδές Οικονομίας & Πληροφορικής",
  "Ξεχωριστό Μάθημα",
];

export default function EnrollmentForm() {
  const { guardPayload, honeypotField } = useFormGuard();
  const [step, setStep] = useState<EnrollStep>(1);
  const [formState, setFormState] = useState<FormState>("idle");
  const [data, setData] = useState({
    // Step 1 - Student info
    studentName: "",
    studentClass: "",
    dateOfBirth: "",
    school: "",
    // Step 2 - Parent info
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentRelation: "Γονέας",
    // Step 3 - Program & extras
    program: "",
    previousGrade: "",
    howFound: "",
    notes: "",
    agreeTerms: false,
  });

  function set(field: string, value: string | boolean) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function canAdvanceStep1() {
    return data.studentName.trim() !== "" && data.studentClass !== "";
  }
  function canAdvanceStep2() {
    return data.parentName.trim() !== "" && data.parentPhone.trim() !== "" && data.parentEmail.trim() !== "";
  }
  function canSubmit() {
    return data.program !== "" && data.agreeTerms;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setFormState("sending");
    
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...guardPayload() }),
      });

      const resData = await res.json();

      if (!res.ok) {
        alert(resData.error || "Κάτι πήγε στραβά");
        setFormState("idle");
        return;
      }

      setFormState("success");
    } catch {
      alert("Πρόβλημα σύνδεσης με τον διακομιστή");
      setFormState("idle");
    }
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-20 px-8 text-center bg-[#031516] border-[6px] border-brand-green shadow-[12px_12px_0px_#00a651]">
        <CheckCircle size={80} className="text-brand-green" strokeWidth={1} />
        <div>
          <div className="text-brand-green font-black text-xs uppercase tracking-[0.3em] mb-4">Εγγραφή Ολοκληρώθηκε</div>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Καλώς ήρθατε<br />
            <span className="text-brand-green">στη Μόρφωση!</span>
          </h3>
          <p className="text-gray-300 font-bold text-lg max-w-md mx-auto leading-relaxed">
            Λάβαμε την αίτηση εγγραφής για τον/την <span className="text-white font-black">{data.studentName}</span>.
            Θα επικοινωνήσουμε μαζί σας σύντομα για να ολοκληρώσουμε τη διαδικασία.
          </p>
        </div>
        <div className="text-brand-teal font-black text-sm uppercase tracking-widest">
          ✓ Θα λάβετε επιβεβαίωση εντός 24 ωρών
        </div>
      </div>
    );
  }

  const stepConfig = [
    { num: 1, label: "Στοιχεία Μαθητή", color: "bg-brand-teal" },
    { num: 2, label: "Στοιχεία Γονέα", color: "bg-brand-orange" },
    { num: 3, label: "Πρόγραμμα", color: "bg-brand-green" },
  ];

  return (
    <form onSubmit={handleSubmit} className="relative border-[4px] border-black shadow-[12px_12px_0px_#031516]">
      {honeypotField}
      {/* Progress Steps Header */}
      <div className="grid grid-cols-3 gap-0 border-b-[4px] border-black">
        {stepConfig.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => {
              if (s.num < step) setStep(s.num as EnrollStep);
              if (s.num === 2 && step === 1 && canAdvanceStep1()) setStep(2);
              if (s.num === 3 && step <= 2 && canAdvanceStep1() && canAdvanceStep2()) setStep(3);
            }}
            className={`py-4 px-3 flex flex-col items-center gap-1 border-r-[4px] last:border-r-0 border-black transition-colors ${
              step === s.num ? `${s.color} text-white` :
              step > s.num ? "bg-gray-900 text-white" :
              "bg-gray-100 text-gray-400"
            }`}
          >
            <span className="font-black text-lg leading-none">{s.num < step ? "✓" : `0${s.num}`}</span>
            <span className="font-black text-[9px] uppercase tracking-widest hidden sm:block">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Student Info */}
      {step === 1 && (
        <div className="bg-white p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-[3px] border-brand-teal pb-4 mb-2">
            <div className="bg-brand-teal text-white font-black text-xl w-10 h-10 flex items-center justify-center border-2 border-black">1</div>
            <div>
              <div className="font-black text-xs text-gray-400 uppercase tracking-widest">Βήμα 1 από 3</div>
              <div className="font-black text-xl text-gray-900 uppercase tracking-tight">Στοιχεία Μαθητή/τριας</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="studentName" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Ονοματεπώνυμο Μαθητή/τριας <span className="text-brand-red">*</span>
              </label>
              <input
                id="studentName"
                type="text" required
                value={data.studentName}
                onChange={e => set("studentName", e.target.value)}
                placeholder="π.χ. Μαρία Παπαδοπούλου"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors" autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="studentClass" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Τάξη <span className="text-brand-red">*</span>
              </label>
              <select
                id="studentClass"
                required
                value={data.studentClass}
                onChange={e => set("studentClass", e.target.value)}
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm focus:outline-none focus:border-brand-teal bg-white appearance-none cursor-pointer"
              >
                <option value="">— Επιλέξτε τάξη —</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Ημερομηνία Γέννησης
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={e => set("dateOfBirth", e.target.value)}
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm focus:outline-none focus:border-brand-teal transition-colors" autoComplete="bday"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="school" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Σχολείο που φοιτά
              </label>
              <input
                id="school"
                type="text"
                value={data.school}
                onChange={e => set("school", e.target.value)}
                placeholder="π.χ. 3ο ΓΕΛ Αγίου Δημητρίου"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-teal transition-colors" autoComplete="off"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => canAdvanceStep1() && setStep(2)}
            disabled={!canAdvanceStep1()}
            className="bg-brand-teal text-white font-black uppercase tracking-widest py-5 border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            ΕΠΟΜΕΝΟ ΒΗΜΑ →
          </button>
        </div>
      )}

      {/* Step 2: Parent Info */}
      {step === 2 && (
        <div className="bg-white p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-[3px] border-brand-orange pb-4 mb-2">
            <div className="bg-brand-orange text-white font-black text-xl w-10 h-10 flex items-center justify-center border-2 border-black">2</div>
            <div>
              <div className="font-black text-xs text-gray-400 uppercase tracking-widest">Βήμα 2 από 3</div>
              <div className="font-black text-xl text-gray-900 uppercase tracking-tight">Στοιχεία Κηδεμόνα</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="parentName" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Ονοματεπώνυμο Κηδεμόνα <span className="text-brand-red">*</span>
              </label>
              <input
                id="parentName"
                type="text" required
                value={data.parentName}
                onChange={e => set("parentName", e.target.value)}
                placeholder="π.χ. Γιώργος Παπαδόπουλος"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-orange transition-colors" autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="parentPhone" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Τηλέφωνο <span className="text-brand-red">*</span>
              </label>
              <input
                id="parentPhone"
                type="tel" required
                value={data.parentPhone}
                onChange={e => set("parentPhone", e.target.value)}
                placeholder="69XXXXXXXX"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-orange transition-colors" autoComplete="tel" inputMode="tel"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="parentRelation" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Σχέση με μαθητή
              </label>
              <select
                id="parentRelation"
                value={data.parentRelation}
                onChange={e => set("parentRelation", e.target.value)}
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm focus:outline-none focus:border-brand-orange bg-white appearance-none cursor-pointer"
              >
                <option>Γονέας</option>
                <option>Επίτροπος</option>
                <option>Άλλο</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="parentEmail" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Email Κηδεμόνα <span className="text-brand-red">*</span>
              </label>
              <input
                id="parentEmail"
                type="email" required
                value={data.parentEmail}
                onChange={e => set("parentEmail", e.target.value)}
                placeholder="parent@example.com"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-orange transition-colors" autoComplete="email" inputMode="email"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border-4 border-black bg-white px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_#000]"
            >
              ← ΠΙΣΩ
            </button>
            <button
              type="button"
              onClick={() => canAdvanceStep2() && setStep(3)}
              disabled={!canAdvanceStep2()}
              className="flex-1 bg-brand-orange text-white font-black uppercase tracking-widest py-4 border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              ΕΠΟΜΕΝΟ ΒΗΜΑ →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Program */}
      {step === 3 && (
        <div className="bg-white p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-[3px] border-brand-green pb-4 mb-2">
            <div className="bg-brand-green text-white font-black text-xl w-10 h-10 flex items-center justify-center border-2 border-black">3</div>
            <div>
              <div className="font-black text-xs text-gray-400 uppercase tracking-widest">Βήμα 3 από 3</div>
              <div className="font-black text-xl text-gray-900 uppercase tracking-tight">Επιλογή Προγράμματος</div>
            </div>
          </div>

          {/* Program cards */}
          <div className="grid grid-cols-1 gap-3">
            {PROGRAMS.map(prog => (
              <label
                key={prog}
                className={`flex items-center gap-4 p-4 border-[3px] cursor-pointer transition-all ${
                  data.program === prog
                    ? "border-brand-green bg-brand-green/5 shadow-[4px_4px_0px_#00a651]"
                    : "border-gray-200 hover:border-brand-green"
                }`}
              >
                <div className={`w-5 h-5 border-[3px] flex items-center justify-center flex-shrink-0 transition-colors ${
                  data.program === prog ? "border-brand-green bg-brand-green" : "border-gray-400"
                }`}>
                  {data.program === prog && <CheckCircle size={12} className="text-white fill-white" />}
                </div>
                <input
                  type="radio"
                  name="program"
                  value={prog}
                  checked={data.program === prog}
                  onChange={e => set("program", e.target.value)}
                  className="sr-only"
                />
                <span className="font-bold text-sm text-gray-900">{prog}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="previousGrade" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Μέσος Όρος Περσινών Βαθμών
              </label>
              <input
                id="previousGrade"
                type="number" min="1" max="20" step="0.5"
                value={data.previousGrade}
                onChange={e => set("previousGrade", e.target.value)}
                placeholder="π.χ. 15.5"
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-green transition-colors" inputMode="decimal"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="howFound" className="font-black text-xs uppercase tracking-widest text-gray-600">
                Πώς μάθατε για εμάς;
              </label>
              <select
                id="howFound"
                value={data.howFound}
                onChange={e => set("howFound", e.target.value)}
                className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm focus:outline-none focus:border-brand-green bg-white appearance-none cursor-pointer"
              >
                <option value="">— Επιλέξτε —</option>
                <option>Φίλος / Γνωστός</option>
                <option>Google</option>
                <option>Facebook / Instagram</option>
                <option>Παλαιός Μαθητής</option>
                <option>Αφίσα / Φυλλάδιο</option>
                <option>Άλλο</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="font-black text-xs uppercase tracking-widest text-gray-600">
              Σχόλια / Ιδιαίτερες Ανάγκες
            </label>
            <textarea
              id="notes"
              rows={3}
              value={data.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="π.χ. Ζούσε στο εξωτερικό. Δυσκολία συγκεκριμένα στα Μαθηματικά..."
              className="border-[3px] border-black px-4 py-3 font-bold text-base md:text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-green transition-colors resize-none"
            />
          </div>

          {/* Terms checkbox — πραγματικό <input type="checkbox">, κρυμμένο οπτικά.
              Ήταν <div onClick>: δεν έπαιρνε focus με Tab και δεν άλλαζε με Space,
              οπότε όποιος πλοηγείται με πληκτρολόγιο δεν μπορούσε να υποβάλει
              καθόλου την αίτηση. Το `peer` κρατάει το ίδιο οπτικό αποτέλεσμα. */}
          <label className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.agreeTerms}
              onChange={(e) => set("agreeTerms", e.target.checked)}
              className="peer sr-only"
            />
            <div
              aria-hidden="true"
              className={`w-6 h-6 border-[3px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-brand-teal/50 ${
                data.agreeTerms ? "border-brand-green bg-brand-green" : "border-gray-400 group-hover:border-brand-green"
              }`}
            >
              {data.agreeTerms && <span className="text-white font-black text-sm">✓</span>}
            </div>
            <span className="font-bold text-sm text-gray-700 leading-relaxed">
              Συμφωνώ με τους{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline font-black">Όρους Χρήσης</Link>{" "}
              και την{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline font-black">Πολιτική Απορρήτου</Link>{" "}
              του Φροντιστηρίου Μόρφωση. <span className="text-brand-red">*</span>
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border-4 border-black bg-white px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_#000]"
            >
              ← ΠΙΣΩ
            </button>
            <button
              type="submit"
              disabled={!canSubmit() || formState === "sending"}
              className="flex-1 bg-brand-green text-white font-black uppercase tracking-widest py-4 border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {formState === "sending" ? (
                <><Loader2 size={18} className="animate-spin" /> Υποβολή...</>
              ) : (
                <><UserPlus size={18} strokeWidth={2.5} /> ΥΠΟΒΟΛΗ ΕΓΓΡΑΦΗΣ</>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
