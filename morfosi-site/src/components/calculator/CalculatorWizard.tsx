"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Award, BookOpen, Calculator, BarChart3, TrendingUp,
  TrendingDown, CheckCircle2, RotateCcw, Search, MapPin, Building2,
  X, Info, HelpCircle, AlertTriangle, Loader2, Download
} from "lucide-react";
import {
  BASES_YEAR,
  SPECIAL_INPUT_GROUPS,
  evaluateFaculty,
  parseGradeInput,
  gradeAverage,
  type Faculty,
  type FacultyEvaluation,
  type SpecialGrades,
} from "@/lib/calculator";

// --- Πεδία: η σειρά των μαθημάτων ΤΑΥΤΙΖΕΤΑΙ με τη σειρά των συντελεστών
// στο ΦΕΚ (coeffs[0..3]) — μην την αλλάξεις.
type FieldId = 1 | 2 | 3 | 4 | null;

interface Subject { id: number; name: string; color: string }
interface FieldSettings {
  id: FieldId; name: string; description: string;
  icon: React.ElementType; color: string; subjects: Subject[];
}

const FIELDS: FieldSettings[] = [
  {
    id: 1, name: "1ο Πεδίο (Ανθρωπιστικών)",
    description: "Νομική, Ψυχολογία, Φιλολογία, Παιδαγωγικά κ.ά.",
    icon: BookOpen, color: "bg-amber-400",
    subjects: [
      { id: 0, name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: 1, name: "Αρχαία Ελληνικά", color: "text-amber-700" },
      { id: 2, name: "Ιστορία", color: "text-red-600" },
      { id: 3, name: "Λατινικά", color: "text-emerald-700" },
    ],
  },
  {
    id: 2, name: "2ο Πεδίο (Θετικών/Τεχνολογικών)",
    description: "Πολυτεχνείο, Φυσικό, Μαθηματικό, Χημικό κ.ά.",
    icon: Calculator, color: "bg-blue-400",
    subjects: [
      { id: 0, name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: 1, name: "Φυσική", color: "text-indigo-700" },
      { id: 2, name: "Χημεία", color: "text-pink-600" },
      { id: 3, name: "Μαθηματικά", color: "text-cyan-700" },
    ],
  },
  {
    id: 3, name: "3ο Πεδίο (Υγείας & Ζωής)",
    description: "Ιατρική, Οδοντιατρική, Φαρμακευτική, Νοσηλευτική κ.ά.",
    icon: Award, color: "bg-emerald-400",
    subjects: [
      { id: 0, name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: 1, name: "Φυσική", color: "text-indigo-700" },
      { id: 2, name: "Χημεία", color: "text-pink-600" },
      { id: 3, name: "Βιολογία", color: "text-emerald-600" },
    ],
  },
  {
    id: 4, name: "4ο Πεδίο (Οικονομίας/Πληρ.)",
    description: "Οικονομικά, Πληροφορική, Στρατιωτικές σχολές κ.ά.",
    icon: BarChart3, color: "bg-brand-orange",
    subjects: [
      { id: 0, name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: 1, name: "Μαθηματικά", color: "text-cyan-700" },
      { id: 2, name: "Πληροφορική", color: "text-slate-800" },
      { id: 3, name: "Α.Ο.Θ.", color: "text-yellow-700" },
    ],
  },
];

// --- Καταστάσεις σχολής στο UI ---
const STATUS_UI: Record<
  FacultyEvaluation["status"],
  { color: string; badge: string; text: (e: FacultyEvaluation) => string }
> = {
  pass: {
    color: "bg-emerald-400",
    badge: "bg-emerald-400 text-black",
    text: () => "ΕΠΙΤΥΧΙΑ! ΜΠΑΙΝΕΙΣ.",
  },
  "below-base": {
    color: "bg-red-500",
    badge: "bg-red-500 text-white",
    text: () => "ΚΑΤΩ ΑΠΟ ΤΗ ΒΑΣΗ",
  },
  "ebe-fail": {
    color: "bg-yellow-400",
    badge: "bg-yellow-400 text-black",
    text: () => "ΑΠΟΚΛΕΙΣΜΟΣ: ΚΑΤΩ ΑΠΟ ΤΗΝ ΕΒΕ",
  },
  "special-ebe-fail": {
    color: "bg-yellow-400",
    badge: "bg-yellow-400 text-black",
    text: () => "ΑΠΟΚΛΕΙΣΜΟΣ: ΕΒΕ ΕΙΔΙΚΟΥ ΜΑΘΗΜΑΤΟΣ",
  },
  "missing-special": {
    color: "bg-indigo-500",
    badge: "bg-indigo-500 text-white",
    text: (e) => `ΑΠΑΙΤΕΙ: ${e.missingSpecials.join(", ")}`,
  },
  "no-base": {
    color: "bg-gray-300",
    badge: "bg-gray-300 text-black",
    text: () => `ΧΩΡΙΣ ΒΑΣΗ ${BASES_YEAR}`,
  },
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmt = (n: number) => n.toLocaleString("el-GR");

// EBE badge
const EbeBadge = ({ grade, ebe, label }: { grade: number; ebe: number; label: string }) => {
  const ok = grade >= ebe - 1e-9;
  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-1.5 border-[2px] border-gray-900 text-xs font-black uppercase ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
      <span className="truncate">{label}</span>
      <span className="whitespace-nowrap">{ok ? `✓ ${grade.toFixed(2)} ≥ ${ebe}` : `✗ ${grade.toFixed(2)} < ${ebe}`}</span>
    </div>
  );
};

// --- Main Component ---
export default function CalculatorWizard({ contactPhone = "210 506 3610" }: { contactPhone?: string }) {
  const [step, setStep] = useState(1);
  const [field, setField] = useState<FieldId>(null);
  const [gradeInputs, setGradeInputs] = useState<Record<number, string>>({});
  const [specialInputs, setSpecialInputs] = useState<Record<string, string>>({});
  const [activeSpecials, setActiveSpecials] = useState<Record<string, boolean>>({});
  const [showGradeErrors, setShowGradeErrors] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPass, setShowOnlyPass] = useState(false);
  const [cityFilter, setCityFilter] = useState("all");
  const [openCoeffs, setOpenCoeffs] = useState<string | null>(null);

  // Δεδομένα σχολών
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const [totalSchools, setTotalSchools] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/bases-manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => { if (m?.total) setTotalSchools(m.total); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!field) {
      setFaculties([]);
      return;
    }
    const ctrl = new AbortController();
    const load = async () => {
      setLoading(true);
      setLoadError(false);
      setFaculties([]);
      try {
        const r = await fetch(`/data/bases-${BASES_YEAR}-field-${field}.json`, { signal: ctrl.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: Faculty[] = await r.json();
        setFaculties(data);
        setLoading(false);
      } catch {
        if (ctrl.signal.aborted) return;
        setLoadError(true);
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, [field, fetchAttempt]);

  const handleFieldSelect = (id: FieldId) => {
    setField(id);
    setGradeInputs({});
    setSpecialInputs({});
    setActiveSpecials({});
    setShowGradeErrors(false);
    setTimeout(() => setStep(2), 200);
  };

  const clampInput = (raw: string) => {
    const n = parseFloat(raw.replace(/,/g, "."));
    return !isNaN(n) && n > 20 ? "20" : raw;
  };

  const handleGradeChange = (id: number, raw: string) =>
    setGradeInputs((p) => ({ ...p, [id]: clampInput(raw) }));

  const handleSpecialToggle = (key: string) => {
    setActiveSpecials((p) => {
      const next = { ...p, [key]: !p[key] };
      if (!next[key]) setSpecialInputs((x) => ({ ...x, [key]: "" }));
      return next;
    });
  };

  const handleSpecialChange = (key: string, raw: string) =>
    setSpecialInputs((p) => ({ ...p, [key]: clampInput(raw) }));

  // Βαθμοί 4 πανελλαδικών με τη σειρά των συντελεστών
  const grades = useMemo<[number, number, number, number] | null>(() => {
    const g = [0, 1, 2, 3].map((i) => parseGradeInput(gradeInputs[i] ?? ""));
    if (g.some((x) => x === null)) return null;
    return g as [number, number, number, number];
  }, [gradeInputs]);

  // Βαθμοί ειδικών: μόνο τα ενεργά ΚΑΙ συμπληρωμένα
  const specialGrades = useMemo<SpecialGrades>(() => {
    const out: SpecialGrades = {};
    for (const group of SPECIAL_INPUT_GROUPS) {
      for (const key of group.keys) {
        if (!activeSpecials[key]) continue;
        const v = parseGradeInput(specialInputs[key] ?? "");
        if (v !== null) out[key] = v;
      }
    }
    return out;
  }, [activeSpecials, specialInputs]);

  const nextStep = () => {
    if (step === 2 && !grades) {
      setShowGradeErrors(true);
      return;
    }
    setShowGradeErrors(false);
    setStep((p) => p + 1);
  };

  const currentField = FIELDS.find((f) => f.id === field);
  const safeGrades = useMemo<[number, number, number, number]>(
    () => grades ?? [0, 0, 0, 0],
    [grades]
  );
  const avgGrade = gradeAverage(safeGrades);

  // Αξιολόγηση όλων των σχολών του πεδίου
  const evaluations = useMemo<FacultyEvaluation[]>(() => {
    if (!field || faculties.length === 0) return [];
    return faculties.map((f) => evaluateFaculty(safeGrades, specialGrades, f));
  }, [field, faculties, safeGrades, specialGrades]);

  const passing = useMemo(() => evaluations.filter((e) => e.passesBase), [evaluations]);
  const passCount = passing.length;
  const bestPass = useMemo(
    () => [...passing].sort((a, b) => (b.faculty.base ?? 0) - (a.faculty.base ?? 0))[0],
    [passing]
  );
  const closestSuccess = useMemo(
    () =>
      passing
        .filter((e) => e.diff !== null && e.diff >= 0)
        .sort((a, b) => (a.diff ?? 0) - (b.diff ?? 0))[0],
    [passing]
  );
  const pointsRange = useMemo(() => {
    const pts = evaluations.filter((e) => e.points !== null).map((e) => e.points as number);
    if (pts.length === 0) return null;
    return { min: Math.min(...pts), max: Math.max(...pts) };
  }, [evaluations]);

  const cities = useMemo(() => {
    const set = new Set(
      evaluations.map((e) => e.faculty.city).filter((c): c is string => !!c)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "el"));
  }, [evaluations]);

  const filtered = useMemo(() => {
    let list = [...evaluations];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.faculty.name.toLowerCase().includes(q) ||
          e.faculty.institution.toLowerCase().includes(q) ||
          e.faculty.institutionFull.toLowerCase().includes(q) ||
          (e.faculty.city ?? "").toLowerCase().includes(q)
      );
    }
    if (showOnlyPass) list = list.filter((e) => e.passesBase);
    if (cityFilter !== "all") list = list.filter((e) => e.faculty.city === cityFilter);
    return list.sort((a, b) => (b.faculty.base ?? -1) - (a.faculty.base ?? -1));
  }, [evaluations, searchQuery, showOnlyPass, cityFilter]);

  const resetAll = useCallback(() => {
    setStep(1); setField(null); setGradeInputs({}); setSpecialInputs({});
    setActiveSpecials({}); setShowGradeErrors(false); setSearchQuery("");
    setShowOnlyPass(false); setCityFilter("all"); setOpenCoeffs(null);
    setFaculties([]);
  }, []);

  const generatePDF = () => {
    const fieldName = currentField?.name || "";
    const list = [...passing].sort((a, b) => (b.faculty.base ?? 0) - (a.faculty.base ?? 0));

    const schoolRows = list
      .map((e) => {
        const diffStr = e.diff === null ? "—" : e.diff >= 0 ? `+${fmt(e.diff)}` : fmt(e.diff);
        return `
        <tr>
          <td>${escapeHtml(e.faculty.name)}</td>
          <td>${escapeHtml(e.faculty.institution)}</td>
          <td class="num">${e.faculty.base === null ? "—" : fmt(e.faculty.base)}</td>
          <td class="num bold green">${e.points === null ? "—" : fmt(e.points)}</td>
          <td class="num diff">${diffStr}</td>
          <td><span class="badge">✓ ΠΕΡΝΑΩ</span></td>
        </tr>`;
      })
      .join("");

    const gradeRows = (currentField?.subjects || [])
      .map(
        (sub) => `
          <div class="grade-row">
            <span class="grade-name">${escapeHtml(sub.name)}</span>
            <span class="grade-val">${(safeGrades[sub.id] ?? 0).toLocaleString("el-GR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
          </div>`
      )
      .join("");

    const specialRows = Object.entries(specialGrades)
      .map(
        ([k, v]) => `
          <div class="grade-row">
            <span class="grade-name">${escapeHtml(k)} (ειδικό)</span>
            <span class="grade-val">${(v ?? 0).toLocaleString("el-GR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
          </div>`
      )
      .join("");

    const phone = escapeHtml(contactPhone);

    const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>ΜΟΡΦΩΣΗ – Αποτελέσματα Μορίων</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; position: relative; }
    body::before {
      content: 'ΜΟΡΦΩΣΗ'; position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 120px; font-weight: 900; color: rgba(249,115,22,0.07);
      pointer-events: none; white-space: nowrap; z-index: 0; letter-spacing: -4px;
    }
    .header { background: #f97316; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .header-left h1 { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; }
    .header-left p { font-size: 10px; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 600; }
    .header-badge { background: #fff; padding: 10px 16px; text-align: center; border-left: 4px solid #000; }
    .header-badge .badge-title { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #666; }
    .header-badge .badge-sub { font-size: 12px; font-weight: 900; color: #111; }
    .black-bar { background: #000; height: 4px; }
    .info-block { display: flex; gap: 0; margin: 16px 20px; border: 2px solid #111; position: relative; z-index: 1; }
    .info-left { flex: 1; padding: 14px 18px; border-right: 2px solid #111; }
    .info-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
    .info-value { font-size: 12px; font-weight: 700; color: #111; margin-bottom: 10px; }
    .grades-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
    .grade-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 3px 0; }
    .grade-name { font-size: 9px; color: #555; }
    .grade-val { font-size: 13px; font-weight: 900; color: #111; }
    .info-right { background: #f97316; padding: 14px 20px; min-width: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .total-label { font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .total-value { font-size: 26px; font-weight: 900; color: #fff; line-height: 1.1; }
    .total-pass { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 6px; }
    .section-title { margin: 16px 20px 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #888; border-bottom: 2px solid #f97316; padding-bottom: 4px; position: relative; z-index: 1; }
    table { width: calc(100% - 40px); margin: 0 20px; border-collapse: collapse; font-size: 9.5px; position: relative; z-index: 1; }
    thead tr { background: #111; color: #fff; }
    thead th { padding: 6px 8px; text-align: left; font-weight: 900; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #e5e7eb; background: #f0fdf4; }
    tbody tr:nth-child(even) { background: #dcfce7; }
    td { padding: 5px 8px; vertical-align: middle; word-break: break-word; }
    .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .bold { font-weight: 900; }
    .green { color: #166534; }
    .diff { font-weight: 700; color: #166534; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 8px; font-weight: 900; border-radius: 2px; background: #15803d; color: #fff; }
    .disclaimer { margin: 14px 20px; font-size: 8px; color: #777; position: relative; z-index: 1; }
    .footer { margin-top: 20px; background: #111; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .footer-left h2 { font-size: 18px; font-weight: 900; color: #f97316; }
    .footer-left p { font-size: 9px; color: #aaa; margin-top: 2px; }
    .footer-right { font-size: 9px; color: #aaa; text-align: right; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { margin: 8mm; size: A4; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <h1>ΜΟΡΦΩΣΗ</h1>
      <p>ΦΡΟΝΤΙΣΤΗΡΙΟ &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; morfosi.edu.gr</p>
    </div>
    <div class="header-badge">
      <div class="badge-title">Αποτελέσματα — Επιτυχόντες</div>
      <div class="badge-sub">Υπολογιστής Μορίων ${BASES_YEAR}</div>
    </div>
  </div>
  <div class="black-bar"></div>

  <div class="info-block">
    <div class="info-left">
      <div class="info-label">Επιστημονικό Πεδίο</div>
      <div class="info-value">${escapeHtml(fieldName)}</div>
      <div class="info-label">Βαθμολογίες</div>
      <div class="grades-grid">${gradeRows}${specialRows}</div>
    </div>
    <div class="info-right">
      <div class="total-label">Μόρια (ανά σχολή)</div>
      <div class="total-value">${pointsRange ? `${fmt(pointsRange.min)}<br>–<br>${fmt(pointsRange.max)}` : "—"}</div>
      <div class="total-pass">${passCount} σχολές — ΕΠΙΤΥΧΙΑ ✓</div>
    </div>
  </div>

  <div class="section-title">Σχολές που ΠΕΡΝΑΩ — Βάσεις ${BASES_YEAR} (${list.length} σχολές)</div>

  <table>
    <thead>
      <tr>
        <th style="width:36%">Σχολή</th>
        <th style="width:20%">Ίδρυμα</th>
        <th style="width:8%;text-align:right">Βάση ${BASES_YEAR}</th>
        <th style="width:10%;text-align:right">Τα Μόριά σου</th>
        <th style="width:8%;text-align:right">+Διαφορά</th>
        <th style="width:10%">Αποτέλεσμα</th>
      </tr>
    </thead>
    <tbody>${schoolRows}</tbody>
  </table>

  <div class="disclaimer">
    Τα μόρια υπολογίζονται με τους συντελεστές βαρύτητας κάθε τμήματος (ΥΑ Φ.253.1/168266/Α5/24-12-2025).
    Βάσεις &amp; ΕΒΕ ${BASES_YEAR}: ΓΕΛ 90%, ημερήσια, γενική σειρά. Ενδεικτικός υπολογισμός — δεν αποτελεί επίσημη πηγή.
  </div>

  <div class="footer">
    <div class="footer-left">
      <h2>ΜΟΡΦΩΣΗ</h2>
      <p>Θέλεις να βελτιώσεις τα μόριά σου; Κάλεσέ μας!</p>
    </div>
    <div class="footer-right">
      ${phone}<br>morfosi.edu.gr<br>Εκπαιδευτικός Οργανισμός
    </div>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div className="w-full min-h-[90svh] bg-brand-teal relative overflow-hidden font-sans pb-24">
      {/* Grid bg */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)", backgroundSize: "60px 60px" }} />

      {/* Progress Header */}
      {/* Στα 375px η μπάρα χρειαζόταν 434px: ο τίτλος δεν συρρικνωνόταν και το
          βήμα «5» κατέληγε εκτός οθόνης. Μικρότερα βήματα + τίτλος που σπάει. */}
      <div className="w-full bg-white border-b-[4px] border-gray-900 sticky top-0 z-40 shadow-[0_4px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3 px-4 md:px-12 py-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 bg-black flex items-center justify-center text-white font-black text-lg">M</div>
          <h2 className="text-gray-900 font-black tracking-tighter text-base sm:text-xl md:text-2xl uppercase min-w-0">
            ΥΠΟΛΟΓΙΣΤΗΣ <span className="text-brand-orange bg-black px-2 mt-1 inline-block">ΜΟΡΙΩΝ</span>
          </h2>
        </div>
        <div className="flex gap-1.5 md:gap-2 shrink-0" role="list" aria-label={`Βήμα ${step} από 5`}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} role="listitem" className={`w-7 h-7 md:w-10 md:h-10 flex items-center justify-center font-black text-xs md:text-sm border-[3px] border-gray-900 transition-colors ${s === step ? "bg-brand-orange text-white" : s < step ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"}`}>
              {s < step ? <CheckCircle2 size={14} strokeWidth={4} /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <AnimatePresence mode="wait">

          {/* STEP 1: SELECT FIELD */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="flex flex-col lg:flex-row gap-12 items-start justify-center">
              <div className="w-full lg:w-1/3 bg-white border-[4px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] transform lg:-rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-6 bg-brand-orange p-3 border-[3px] border-gray-900 w-fit">
                  <HelpCircle className="text-gray-900" size={28} strokeWidth={3} />
                  <div className="font-black text-xl text-gray-900 uppercase">ΟΔΗΓΙΕΣ ΧΡΗΣΗΣ</div>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase leading-[0.9] tracking-tighter mb-8">ΠΟΣΑ ΜΟΡΙΑ <br /><span className="text-brand-teal">ΕΒΓΑΛΕΣ;</span></h1>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">1. Επίλεξε το επιστημονικό σου πεδίο.</p>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">2. Καταχώρησε τους βαθμούς σου (και τα ειδικά μαθήματα, αν έδωσες).</p>
                <p className="font-extrabold text-gray-600 text-lg border-l-[4px] border-brand-orange pl-4">3. Σύγκρινε με τις βάσεις {BASES_YEAR}, με τους συντελεστές και τις ΕΒΕ κάθε σχολής!</p>
                <div className="mt-8 bg-emerald-500 text-white p-4 border-[3px] border-gray-900 font-black uppercase text-sm flex items-center justify-center gap-3 w-fit mx-auto lg:w-full">
                  <CheckCircle2 size={20} /> Βάσεις {BASES_YEAR}{totalSchools ? ` — ${totalSchools} Σχολές` : ""}
                </div>
              </div>
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {FIELDS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button key={f.id} type="button" onClick={() => handleFieldSelect(f.id)}
                      className="cursor-pointer text-left bg-white border-[4px] border-gray-900 p-6 flex flex-col justify-between transition-all duration-200 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-16 h-16 border-[3px] border-gray-900 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] ${f.color}`}>
                          <Icon size={32} className="text-gray-900" strokeWidth={3} />
                        </div>
                        <div className="text-gray-900 font-black text-5xl opacity-20">0{f.id}</div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tight mb-4">{f.name}</h2>
                        <p className="text-gray-600 font-bold text-sm h-10 line-clamp-2">{f.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: GRADES INPUT */}
          {step === 2 && currentField && (
            <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="w-full max-w-5xl mx-auto">
              <div className="bg-white border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b-[4px] border-gray-900 pb-8">
                  <div>
                    <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest block w-fit mb-4">ΒΗΜΑ 2</span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                      ΒΑΘΜΟΛΟΓΙΕΣ <br /><span className="text-brand-orange bg-black px-2 mt-2 inline-block">{currentField.name.split(" ")[0]}</span>
                    </h2>
                  </div>
                  <button onClick={() => setStep(1)} className="bg-gray-200 border-[3px] border-gray-900 text-gray-900 p-4 font-black uppercase hover:bg-brand-orange hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <RotateCcw size={24} strokeWidth={3} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8">
                  {currentField.subjects.map((sub, i) => {
                    const missing = showGradeErrors && parseGradeInput(gradeInputs[sub.id] ?? "") === null;
                    return (
                      <div key={sub.id} className={`relative bg-gray-50 border-[3px] p-6 flex flex-col justify-between group focus-within:bg-white transition-colors ${missing ? "border-red-500" : "border-gray-900 focus-within:border-brand-orange"}`}>
                        <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-black text-xl flex items-center justify-center border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(249,115,22,1)] z-10">{i + 1}</div>
                        <h3 className={`text-2xl font-black uppercase tracking-tight mb-6 ${sub.color}`}>{sub.name}</h3>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black tracking-widest uppercase text-gray-500">Εισαγωγή 0-20</label>
                          <input type="text" inputMode="decimal" placeholder="π.χ. 18,5"
                            value={gradeInputs[sub.id] || ""}
                            onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                            className="w-full text-5xl font-black bg-white border-[4px] border-gray-900 py-4 px-4 text-gray-900 focus:outline-none focus:border-brand-orange transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
                          {missing && <span className="text-red-600 font-black text-xs uppercase">Συμπλήρωσε βαθμό 0-20</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {showGradeErrors && !grades && (
                  <div className="mb-8 bg-red-100 border-[3px] border-red-500 p-4 font-black uppercase text-red-700 flex items-center gap-3">
                    <AlertTriangle size={22} /> Συμπλήρωσε και τα 4 μαθήματα (το 0 είναι αποδεκτός βαθμός).
                  </div>
                )}
                <button onClick={nextStep} className="w-full bg-brand-orange border-[4px] border-gray-900 text-gray-900 py-6 font-black text-2xl uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-4 hover:bg-yellow-400 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                  ΣΥΝΕΧΕΙΑ <ChevronRight strokeWidth={4} size={32} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SPECIAL SUBJECTS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="w-full max-w-5xl mx-auto">
              <div className="bg-white border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center flex flex-col items-center">
                <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest block w-fit mb-6">ΒΗΜΑ 3 - ΠΡΟΑΙΡΕΤΙΚΟ</span>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-6">
                  ΕΙΔΙΚΑ <span className="text-brand-orange bg-black px-3 mt-2 inline-block">ΜΑΘΗΜΑΤΑ</span>
                </h2>
                <p className="text-gray-600 font-extrabold mb-12 text-xl max-w-2xl border-[4px] border-gray-900 p-6 bg-yellow-100 shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1">
                  Μετράνε ΜΟΝΟ στις σχολές που τα απαιτούν. Αν εξετάστηκες σε κάποιο, πάτησέ το και βάλε τον βαθμό σου. Αλλιώς, πάτα κατευθείαν &quot;Υπολογισμός&quot;.
                </p>
                <div className="w-full flex flex-col gap-10 mb-16 text-left">
                  {SPECIAL_INPUT_GROUPS.map((group) => (
                    <div key={group.id}>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                        <h3 className="font-black text-2xl uppercase tracking-tighter bg-black text-brand-orange px-3 py-1 w-fit">{group.title}</h3>
                        <p className="text-gray-500 font-bold text-sm">{group.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {group.keys.map((key) => {
                          const isActive = activeSpecials[key];
                          return (
                            <div key={key} className={`p-4 border-[4px] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] ${isActive ? "border-gray-900 bg-brand-orange" : "border-gray-900 bg-gray-50"}`}>
                              <div className="flex justify-between items-center bg-white p-2 border-[3px] border-gray-900 gap-2">
                                <h4 className="font-black text-sm uppercase tracking-tighter pl-1 leading-tight">{key}</h4>
                                <button type="button" aria-pressed={!!isActive} aria-label={`${key}: ${isActive ? "απενεργοποίηση" : "ενεργοποίηση"}`} onClick={() => handleSpecialToggle(key)} className={`w-10 h-10 shrink-0 flex items-center justify-center border-[3px] border-gray-900 cursor-pointer transition-colors ${isActive ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                                  {isActive ? <CheckCircle2 strokeWidth={4} size={20} /> : <div className="w-3 h-3 bg-gray-400" />}
                                </button>
                              </div>
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
                                    <label className="text-xs font-black tracking-widest uppercase block mb-2">Βαθμός (0-20)</label>
                                    <input type="text" inputMode="decimal" placeholder="16,5"
                                      value={specialInputs[key] || ""}
                                      onChange={(e) => handleSpecialChange(key, e.target.value)}
                                      className="w-full text-3xl font-black bg-white border-[4px] border-gray-900 py-2 px-3 text-gray-900 focus:outline-none" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row w-full gap-6">
                  <button onClick={() => setStep(2)} className="bg-white border-[4px] border-gray-900 text-gray-900 py-6 px-8 font-black uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 lg:w-1/3">
                    <RotateCcw strokeWidth={3} /> ΠΙΣΩ
                  </button>
                  <button onClick={nextStep} className="bg-black text-brand-orange border-[4px] border-gray-900 py-6 px-8 font-black uppercase text-2xl shadow-[8px_8px_0px_rgba(249,115,22,1)] hover:text-yellow-400 transition-all flex items-center justify-center gap-4 lg:w-2/3">
                    ΥΠΟΛΟΓΙΣΜΟΣ <TrendingUp strokeWidth={4} size={32} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DASHBOARD */}
          {step === 4 && currentField && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">

              {loading && (
                <div className="w-full bg-white border-[4px] border-gray-900 p-16 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6">
                  <Loader2 size={64} className="animate-spin text-brand-orange" strokeWidth={3} />
                  <p className="font-black text-2xl uppercase">Φορτώνουμε τις σχολές...</p>
                </div>
              )}

              {!loading && loadError && (
                <div className="w-full bg-red-100 border-[4px] border-red-500 p-10 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 mb-10">
                  <AlertTriangle size={48} className="text-red-500" />
                  <p className="font-black text-xl uppercase text-red-700">Σφάλμα φόρτωσης δεδομένων σχολών</p>
                  <button onClick={() => setFetchAttempt((n) => n + 1)} className="bg-white border-[3px] border-gray-900 px-6 py-3 font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100">
                    ΔΟΚΙΜΑΣΕ ΞΑΝΑ
                  </button>
                </div>
              )}

              {!loading && !loadError && (
                <>
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">Μ.Ο. 4 ΜΑΘΗΜΑΤΩΝ</p>
                      <p className="font-black text-4xl leading-none text-gray-900">{avgGrade.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">συγκρίνεται με την ΕΒΕ κάθε σχολής</p>
                    </div>
                    <div className="bg-emerald-400 border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">ΣΧΟΛΕΣ ΠΟΥ ΠΕΡΝΑΣ</p>
                      <p className="font-black text-4xl leading-none text-gray-900">{passCount}</p>
                      <p className="text-[10px] text-gray-900 opacity-60 font-bold mt-1 uppercase">από {evaluations.length} του πεδίου</p>
                    </div>
                    <div className="bg-brand-orange border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] col-span-2 lg:col-span-1">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">ΚΑΛΥΤΕΡΗ ΣΧΟΛΗ</p>
                      <p className="font-black text-sm leading-tight text-gray-900 break-words">{bestPass ? `${bestPass.faculty.name} (${bestPass.faculty.institution})` : "—"}</p>
                    </div>
                    <div className="bg-black border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-white opacity-70">ΚΟΝΤΙΝΟΤΕΡΗ ΕΠΙΤΥΧΙΑ</p>
                      <p className="font-black text-4xl leading-none text-white">{closestSuccess?.diff != null ? `+${fmt(closestSuccess.diff)}` : "—"}</p>
                      {closestSuccess && <p className="text-xs text-gray-400 font-bold mt-1 uppercase">μόρια πάνω από τη βάση</p>}
                    </div>
                  </div>

                  {/* Grades summary + CTA */}
                  <div className="flex flex-col xl:flex-row gap-10 mb-12">
                    {/* Grades */}
                    <div className="w-full xl:w-1/3 bg-white border-[6px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                      <h3 className="font-black text-2xl uppercase tracking-tighter text-gray-900 mb-8 border-b-[4px] border-gray-900 pb-4">ΟΙ ΒΑΘΜΟΙ ΣΟΥ</h3>
                      <div className="flex flex-col gap-5">
                        {currentField.subjects.map((sub) => (
                          <div key={sub.id} className="flex justify-between items-center">
                            <span className={`font-black uppercase tracking-widest text-xs ${sub.color}`}>{sub.name}</span>
                            <span className="font-black text-2xl text-white bg-gray-900 border-[3px] border-gray-900 px-4 py-1 min-w-[75px] text-center shadow-[4px_4px_0px_rgba(249,115,22,1)]">
                              {safeGrades[sub.id].toFixed(1)}
                            </span>
                          </div>
                        ))}
                        {Object.entries(specialGrades).map(([key, v]) => (
                          <div key={key} className="flex justify-between items-center bg-brand-orange border-[4px] border-gray-900 p-3 gap-2">
                            <span className="font-black uppercase text-xs leading-tight">+ {key}</span>
                            <span className="font-black text-xl bg-white border-[3px] border-gray-900 px-3 py-1 shrink-0">{(v ?? 0).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <button onClick={resetAll} className="bg-white border-[3px] border-gray-900 text-gray-900 py-3 font-black text-xs tracking-widest uppercase hover:bg-brand-orange shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2">
                          <RotateCcw size={20} strokeWidth={3} /> ΝΕΟΣ
                        </button>
                        <button onClick={() => setStep(2)} className="bg-gray-900 text-white border-[3px] border-gray-900 py-3 font-black text-xs tracking-widest uppercase hover:bg-gray-700 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2">
                          <RotateCcw size={20} strokeWidth={3} /> ΑΛΛΑΓΗ
                        </button>
                      </div>
                      <button
                        onClick={generatePDF}
                        className="mt-4 w-full bg-emerald-500 border-[3px] border-gray-900 text-white py-4 font-black text-sm tracking-widest uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 hover:bg-emerald-400 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <Download size={22} strokeWidth={3} /> ΕΚΤΥΠΩΣΗ / PDF
                      </button>
                    </div>

                    {/* Big CTA */}
                    <div className="flex-1 flex flex-col gap-6">
                      <button type="button" className="w-full text-left bg-brand-orange border-[8px] border-gray-900 p-10 md:p-14 shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-10 group hover:bg-yellow-400 cursor-pointer hover:-translate-y-2 hover:shadow-[24px_24px_0px_rgba(0,0,0,1)] transition-all" onClick={() => setStep(5)}>
                        <div>
                          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-4">
                            ΣΕ ΠΟΙΕΣ ΣΧΟΛΕΣ <br />
                            <span className="bg-black text-white px-4 py-2 mt-2 inline-block border-[4px] border-gray-900">ΠΕΡΝΑΩ;</span>
                          </h2>
                          <p className="text-gray-900 font-bold text-lg bg-white border-[4px] border-gray-900 p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-xl">
                            Υπολογισμός με τους <strong>πραγματικούς συντελεστές βαρύτητας</strong> και τις <strong>ΕΒΕ</strong> κάθε σχολής. Βάσεις <strong>{BASES_YEAR}</strong> — {evaluations.length} σχολές του πεδίου σου.
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="bg-black text-brand-orange p-8 border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(255,255,255,1)] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                            <ChevronRight size={80} strokeWidth={4} />
                          </div>
                        </div>
                      </button>

                      {/* Funnel CTA */}
                      <div className="w-full bg-[#031516] border-[6px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(249,115,22,1)] flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">
                            ΘΕΛΕΙΣ ΝΑ <span className="text-brand-orange">ΒΕΛΤΙΩΣΕΙΣ</span><br />ΤΟ ΑΠΟΤΕΛΕΣΜΑ;
                          </h3>
                          <p className="text-gray-400 font-bold text-lg">Μίλα με τον σύμβουλο σπουδών μας. Σχεδιάζουμε μαζί σου στρατηγική βελτίωσης.</p>
                        </div>
                        <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-auto">
                          <a href="/contact" className="bg-brand-orange text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-center">
                            ΕΓΓΡΑΨΟΥ ΤΩΡΑ
                          </a>
                          <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="bg-white text-gray-900 px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-center">
                            📞 {contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 5: SCHOOLS DATABASE */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white border-[6px] border-gray-900 shadow-[20px_20px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col" style={{ minHeight: "80svh" }}>

              {/* Header */}
              <div className="bg-gray-900 border-b-[6px] border-gray-900 p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                    ΒΑΣΕΙΣ ΣΧΟΛΩΝ <span className="text-black bg-brand-orange px-2 inline-block border-[3px] border-black">{BASES_YEAR}</span>
                  </h2>
                  <p className="text-white font-black text-xs uppercase tracking-widest bg-brand-teal inline-block px-3 py-1.5 border-[3px] border-black">
                    {filtered.length} από {evaluations.length} σχολές • {currentField?.name}
                  </p>
                </div>
                <button onClick={() => setStep(4)} className="bg-brand-orange text-gray-900 border-[3px] border-gray-900 px-4 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:bg-yellow-400 flex items-center gap-2">
                  <X size={20} strokeWidth={4} /> ΠΙΣΩ
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 md:p-6 border-b-[4px] border-gray-900 bg-brand-teal flex flex-col xl:flex-row gap-4 shrink-0">
                <div className="relative w-full xl:w-2/5">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" strokeWidth={4} />
                  <input type="text" placeholder="ΑΝΑΖΗΤΗΣΗ ΣΧΟΛΗΣ, ΠΟΛΗΣ..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-[3px] border-gray-900 font-black text-gray-900 focus:outline-none uppercase text-base shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
                </div>

                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                  className="flex-1 py-4 px-4 bg-white border-[3px] border-gray-900 font-black text-gray-900 uppercase focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer">
                  <option value="all">ΟΛΕΣ ΟΙ ΠΟΛΕΙΣ</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <div className="flex gap-3">
                  <button onClick={() => setShowOnlyPass(false)} className={`flex-1 xl:flex-none px-6 py-4 border-[3px] border-gray-900 font-black uppercase text-xs tracking-widest transition-all ${!showOnlyPass ? "bg-black text-white shadow-[4px_4px_0px_rgba(249,115,22,1)]" : "bg-white text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]"}`}>ΟΛΕΣ</button>
                  <button onClick={() => setShowOnlyPass(true)} className={`flex-1 xl:flex-none px-6 py-4 border-[3px] border-gray-900 font-black uppercase text-xs tracking-widest transition-all ${showOnlyPass ? "bg-emerald-500 text-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)]" : "bg-white text-emerald-600 shadow-[4px_4px_0px_rgba(0,0,0,1)]"}`}>
                    ΜΟΝΟ ΟΣΕΣ ΠΕΡΝΑΩ ({passCount})
                  </button>
                </div>
              </div>

              {loading && (
                <div className="flex-1 flex items-center justify-center p-16">
                  <div className="flex flex-col items-center gap-6">
                    <Loader2 size={64} className="animate-spin text-brand-orange" strokeWidth={3} />
                    <p className="font-black text-2xl uppercase">Φορτώνουμε τις σχολές...</p>
                  </div>
                </div>
              )}

              {loadError && !loading && (
                <div className="flex-1 flex items-center justify-center p-16">
                  <div className="bg-red-100 border-[4px] border-red-500 p-8 text-center max-w-md">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="font-black text-xl uppercase text-red-700">Σφάλμα φόρτωσης δεδομένων</p>
                    <button onClick={() => setFetchAttempt((n) => n + 1)} className="mt-4 bg-white border-[3px] border-gray-900 px-6 py-3 font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100">
                      ΔΟΚΙΜΑΣΕ ΞΑΝΑ
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              {!loading && !loadError && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                      <Search size={48} strokeWidth={4} className="mb-4" />
                      <p className="font-black text-2xl uppercase">Δεν βρέθηκαν σχολές</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-8">
                      {filtered.map((ev) => {
                        const { faculty } = ev;
                        const ui = STATUS_UI[ev.status];
                        const coeffsOpen = openCoeffs === faculty.code;

                        return (
                          <div key={faculty.code} className="w-full bg-white border-[4px] border-gray-900 flex flex-col lg:flex-row shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all">
                            {/* Color strip */}
                            <div className={`w-full h-3 lg:w-4 lg:h-auto border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-gray-900 shrink-0 ${ui.color}`} />

                            {/* Info */}
                            <div className="flex-1 p-4 lg:p-5">
                              <div className="mb-2">
                                <span className={`px-2 py-1 font-black text-[10px] md:text-xs uppercase tracking-widest border-[2px] border-gray-900 ${ui.badge}`}>
                                  {ui.text(ev)}
                                </span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase leading-none mb-3">{faculty.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase">
                                  <Building2 size={14} strokeWidth={3} /> {faculty.institution}
                                </div>
                                {faculty.city && (
                                  <div className="flex items-center gap-1.5 bg-gray-900 text-white px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase">
                                    <MapPin size={14} strokeWidth={3} /> {faculty.city}
                                  </div>
                                )}
                                {faculty.specials.map((sp) => (
                                  <div key={sp.label} className="flex items-center gap-1.5 bg-indigo-600 text-white px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    <AlertTriangle size={14} strokeWidth={3} /> {sp.label} {Math.round(sp.coeff * 100)}%{sp.choose > 1 ? ` ×${sp.choose}` : ""}
                                  </div>
                                ))}
                                {faculty.note && (
                                  <div className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase">
                                    <Info size={14} strokeWidth={3} /> {faculty.note}
                                  </div>
                                )}
                              </div>

                              {/* EBE indicators */}
                              <div className="mt-3 flex flex-col gap-1.5 max-w-md">
                                <EbeBadge grade={ev.avgGrade} ebe={faculty.ebe} label={`ΕΒΕ ΣΧΟΛΗΣ: ${faculty.ebe}`} />
                                {faculty.specials.filter((sp) => sp.ebe !== null).map((sp) => {
                                  const used = ev.usedSpecials.filter((u) =>
                                    sp.kind === "language"
                                      ? (sp.options ?? []).includes(u.label)
                                      : u.label === sp.label
                                  );
                                  if (used.length === 0) return null;
                                  return used.map((u) => (
                                    <EbeBadge key={`${sp.label}-${u.label}`} grade={u.grade} ebe={sp.ebe as number} label={`ΕΒΕ ${u.label}: ${sp.ebe}`} />
                                  ));
                                })}
                              </div>
                            </div>

                            {/* Points Box */}
                            <div className="flex flex-col sm:flex-row lg:min-w-[360px] border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-gray-900 shrink-0">
                              {/* User points */}
                              <div className={`flex-1 flex flex-col justify-center p-4 lg:p-5 border-b-[4px] sm:border-b-0 sm:border-r-[4px] border-gray-900 ${ev.passesBase ? "bg-emerald-100" : "bg-gray-100"}`}>
                                <span className="text-[10px] bg-black text-white px-2 py-1 font-black uppercase tracking-widest mb-2 w-fit">ΤΑ ΜΟΡΙΑ ΣΟΥ</span>
                                <span className={`text-3xl lg:text-4xl font-black tracking-tighter ${ev.passesBase ? "text-emerald-700" : "text-gray-900"}`}>
                                  {ev.points === null ? "—" : fmt(ev.points)}
                                </span>
                                {ev.points === null ? (
                                  <span className="text-xs font-bold mt-1 uppercase text-indigo-700">χρειάζεται βαθμός ειδικού</span>
                                ) : ev.diff !== null && (
                                  <span className={`text-xs font-bold mt-1 flex items-center gap-1 uppercase ${ev.diff >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                                    {ev.diff >= 0
                                      ? <><TrendingUp size={12} /> +{fmt(ev.diff)} από τη βάση</>
                                      : <><TrendingDown size={12} /> {fmt(ev.diff)} από τη βάση</>}
                                  </span>
                                )}
                              </div>

                              {/* Base */}
                              <div className="flex-1 flex flex-col justify-center p-4 lg:p-5 bg-white relative">
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 font-black uppercase tracking-widest mb-2 w-fit border-[2px] border-gray-200">ΒΑΣΗ {BASES_YEAR}</span>
                                <span className="text-2xl lg:text-3xl font-black text-gray-900">{faculty.base === null ? "—" : fmt(faculty.base)}</span>

                                <button
                                  onClick={() => setOpenCoeffs(coeffsOpen ? null : faculty.code)}
                                  className={`mt-2 border-[2px] border-gray-900 text-[10px] font-black uppercase py-1 px-2 transition-colors flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] w-fit ${coeffsOpen ? "bg-brand-orange" : "bg-white hover:bg-brand-orange"} text-gray-900`}>
                                  <Info size={12} strokeWidth={3} /> ΣΥΝΤΕΛΕΣΤΕΣ
                                </button>
                                {coeffsOpen && (
                                  <div className="absolute bottom-full right-0 lg:top-1/2 lg:bottom-auto lg:right-[102%] lg:-translate-y-1/2 w-64 bg-white border-[4px] border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] p-4 z-50">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2 border-b-[2px] border-gray-900 pb-1">
                                      <span>ΒΑΡΥΤΗΤΕΣ</span>
                                      <button onClick={() => setOpenCoeffs(null)} className="text-gray-900"><X size={14} strokeWidth={3} /></button>
                                    </div>
                                    {currentField?.subjects.map((sub) => (
                                      <div key={sub.id} className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-black truncate pr-2">{sub.name}</span>
                                        <span className="font-black text-brand-teal">{Math.round(faculty.coeffs[sub.id] * 100)}%</span>
                                      </div>
                                    ))}
                                    {faculty.specials.map((sp) => (
                                      <div key={sp.label} className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-black truncate pr-2 text-indigo-700">{sp.label}{sp.choose > 1 ? ` ×${sp.choose}` : ""}</span>
                                        <span className="font-black text-indigo-700">{Math.round(sp.coeff * 100)}%</span>
                                      </div>
                                    ))}
                                    {faculty.musicIncluded && (
                                      <p className="text-[10px] text-gray-500 font-bold mt-2">Τα μουσικά μαθήματα συμμετέχουν στο 100% των μορίων.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-center text-[11px] text-gray-500 font-bold max-w-3xl mx-auto pb-4">
                    Βάσεις &amp; ΕΒΕ {BASES_YEAR}: ΓΕΛ 90%, ημερήσια, γενική σειρά. Συντελεστές βαρύτητας: ΥΑ Φ.253.1/168266/Α5/24-12-2025 (ισχύει για το {BASES_YEAR}-27 και εφεξής).
                    Ο υπολογισμός είναι ενδεικτικός και δεν αποτελεί επίσημη πηγή.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
