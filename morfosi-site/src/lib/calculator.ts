/**
 * Λογική Υπολογιστή Μορίων — ν. 4777/2021.
 *
 * Μόρια = ( Σ βαθμός_i × συντελεστής_i  +  Σ ειδικό_j × συντελεστής_j ) × 1000
 *   - Οι συντελεστές των 4 πανελλαδικών αθροίζουν 100% ανά τμήμα/πεδίο.
 *   - Τα ειδικά μαθήματα μετράνε ΜΟΝΟ στα τμήματα που τα απαιτούν, με τον
 *     συντελεστή του τμήματος (10% ή 20%), ΕΠΙΠΛΕΟΝ του 100%.
 *   - Στα μουσικά τμήματα τα 2 μουσικά μαθήματα είναι ΜΕΡΟΣ του 100%
 *     (musicIncluded) και μετράνε μόνο 2 από τα 4 πανελλαδικά.
 *
 * Ε.Β.Ε. (κριτήρια αποκλεισμού, ΟΧΙ τροποποιητές μορίων):
 *   - ΕΒΕ τμήματος: απλός μέσος όρος των 4 πανελλαδικών ≥ ΕΒΕ (χωρίς συντελεστές).
 *   - ΕΒΕ ειδικού μαθήματος: ο βαθμός στο ειδικό ≥ τη δική του ΕΒΕ.
 *   - Αποτυχία σε οποιοδήποτε από τα δύο = αποκλεισμός ανεξαρτήτως μορίων.
 *
 * Πηγές δεδομένων (βλ. scripts/):
 *   - Συντελεστές: ΥΑ Φ.253.1/168266/Α5/24-12-2025 (για το 2026-27 και εφεξής)
 *   - Βάσεις & ΕΒΕ 2026: ΓΕΛ 90% ημερήσια, γενική σειρά (ανακοίνωση 23/7/2026)
 */

export const BASES_YEAR = 2026;

// ── Τύποι δεδομένων (σχήμα των public/data/bases-2026-field-N.json) ──

export type SpecialKind =
  | "language"
  | "drawing-free"
  | "drawing-line"
  | "athletics"
  | "music-performance"
  | "music-theory";

export interface FacultySpecial {
  kind: SpecialKind;
  label: string;
  /** Συντελεστής 0..1 (π.χ. 0.2 = 20%) — ανά επιλεγόμενο μάθημα */
  coeff: number;
  /** Πόσα μαθήματα επιλέγει ο υποψήφιος (γλώσσες: 1 ή 2) */
  choose: number;
  /** Για kind=language: οι αποδεκτές γλώσσες */
  options: string[] | null;
  /** ΕΒΕ ειδικού μαθήματος 2026 (null αν δεν βρέθηκε) */
  ebe: number | null;
}

export interface Faculty {
  code: string;
  name: string;
  institution: string;
  institutionFull: string;
  city: string | null;
  type: string | null;
  /** Βάση 2026 (ΓΕΛ 90% ημερήσια) — null: καμία εισαγωγή φέτος */
  base: number | null;
  /** ΕΒΕ τμήματος 2026 */
  ebe: number;
  /** Συντελεστές των 4 πανελλαδικών του πεδίου, με τη σειρά του πεδίου */
  coeffs: [number, number, number, number];
  specials: FacultySpecial[];
  musicIncluded: boolean;
  note: string | null;
}

/** Βαθμοί ειδικών μαθημάτων, με κλειδιά τα SPECIAL_INPUTS keys */
export type SpecialGrades = Record<string, number | undefined>;

// ── Είσοδοι ειδικών μαθημάτων στο UI ─────────────────────────────────

export const LANGUAGE_KEYS = ["Αγγλικά", "Γαλλικά", "Γερμανικά", "Ιταλικά", "Ισπανικά"] as const;

export const KIND_TO_INPUT_KEY: Record<Exclude<SpecialKind, "language">, string> = {
  "drawing-free": "Ελεύθερο Σχέδιο",
  "drawing-line": "Γραμμικό Σχέδιο",
  athletics: "Αγωνίσματα",
  "music-performance": "Μουσική Εκτέλεση και Ερμηνεία",
  "music-theory": "Μουσική Αντίληψη, Θεωρία και Αρμονία",
};

export interface SpecialInputGroup {
  id: string;
  title: string;
  description: string;
  keys: string[];
}

export const SPECIAL_INPUT_GROUPS: SpecialInputGroup[] = [
  {
    id: "lang",
    title: "Ξένες Γλώσσες",
    description: "Για Αγγλική/Γαλλική/Γερμανική/Ιταλική/Ισπανική Φιλολογία, Διεθνών Σπουδών, Ναυτιλιακά κ.ά.",
    keys: [...LANGUAGE_KEYS],
  },
  {
    id: "drawing",
    title: "Σχέδιο",
    description: "Για Αρχιτεκτονικές σχολές και Εσωτερικής Αρχιτεκτονικής.",
    keys: ["Ελεύθερο Σχέδιο", "Γραμμικό Σχέδιο"],
  },
  {
    id: "athletics",
    title: "Αγωνίσματα ΤΕΦΑΑ",
    description: "Μέσος όρος των 3 αγωνισμάτων για τα ΤΕΦΑΑ.",
    keys: ["Αγωνίσματα"],
  },
  {
    id: "music",
    title: "Μουσικά Μαθήματα",
    description: "Για τα Τμήματα Μουσικών Σπουδών.",
    keys: ["Μουσική Εκτέλεση και Ερμηνεία", "Μουσική Αντίληψη, Θεωρία και Αρμονία"],
  },
];

// ── Βοηθητικά ────────────────────────────────────────────────────────

const EPS = 1e-9;

/** "18,5" → 18.5 (0..20), null για κενό/άκυρο. Το 0 είναι έγκυρος βαθμός. */
export function parseGradeInput(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = parseFloat(t.replace(",", "."));
  if (isNaN(n)) return null;
  return Math.min(Math.max(n, 0), 20);
}

export function gradeAverage(grades: [number, number, number, number]): number {
  return (grades[0] + grades[1] + grades[2] + grades[3]) / 4;
}

// ── Αξιολόγηση τμήματος ──────────────────────────────────────────────

export type FacultyStatus =
  | "pass"              // περνά ΕΒΕ + ειδικά + βάση
  | "below-base"        // περνά ΕΒΕ/ειδικά αλλά κάτω από τη βάση
  | "ebe-fail"          // Μ.Ο. < ΕΒΕ τμήματος
  | "special-ebe-fail"  // βαθμός ειδικού < ΕΒΕ ειδικού
  | "missing-special"   // δεν έχει εξεταστεί σε απαιτούμενο ειδικό
  | "no-base";          // περνά τα κριτήρια, αλλά δεν υπάρχει βάση 2026

export interface UsedSpecial {
  label: string;
  grade: number;
  coeff: number;
}

export interface FacultyEvaluation {
  faculty: Faculty;
  avgGrade: number;
  ebeOk: boolean;
  /** Ετικέτες απαιτούμενων ειδικών στα οποία δεν έχει εξεταστεί */
  missingSpecials: string[];
  /** Ειδικά όπου ο βαθμός < ΕΒΕ ειδικού */
  specialEbeFails: { label: string; grade: number; ebe: number }[];
  /** Τα ειδικά που μπήκαν στον υπολογισμό μορίων */
  usedSpecials: UsedSpecial[];
  /** Μόρια για ΑΥΤΟ το τμήμα — null αν λείπει απαιτούμενο ειδικό */
  points: number | null;
  /** Πληροί ΟΛΑ τα κριτήρια συμμετοχής (ΕΒΕ τμήματος + ειδικών + πλήρη ειδικά) */
  eligible: boolean;
  /** eligible ΚΑΙ μόρια ≥ βάση (ή χωρίς βάση φέτος) */
  passesBase: boolean;
  /** μόρια − βάση */
  diff: number | null;
  status: FacultyStatus;
}

export function evaluateFaculty(
  grades: [number, number, number, number],
  specialGrades: SpecialGrades,
  faculty: Faculty
): FacultyEvaluation {
  const avgGrade = gradeAverage(grades);
  const ebeOk = avgGrade >= faculty.ebe - EPS;

  const missingSpecials: string[] = [];
  const specialEbeFails: { label: string; grade: number; ebe: number }[] = [];
  const usedSpecials: UsedSpecial[] = [];

  for (const sp of faculty.specials) {
    if (sp.kind === "language") {
      const entered = (sp.options ?? [])
        .map((o) => ({ label: o, grade: specialGrades[o] }))
        .filter((x): x is { label: string; grade: number } => x.grade !== undefined);
      if (entered.length < sp.choose) {
        missingSpecials.push(sp.label);
        continue;
      }
      // Προτίμησε γλώσσες που περνούν την ΕΒΕ ειδικού· αλλιώς τις καλύτερες
      const passing = entered
        .filter((x) => sp.ebe === null || x.grade >= sp.ebe - EPS)
        .sort((a, b) => b.grade - a.grade);
      if (passing.length >= sp.choose) {
        for (const x of passing.slice(0, sp.choose))
          usedSpecials.push({ label: x.label, grade: x.grade, coeff: sp.coeff });
      } else {
        const best = [...entered].sort((a, b) => b.grade - a.grade).slice(0, sp.choose);
        for (const x of best) usedSpecials.push({ label: x.label, grade: x.grade, coeff: sp.coeff });
        const worst = best[best.length - 1];
        specialEbeFails.push({ label: worst.label, grade: worst.grade, ebe: sp.ebe ?? 0 });
      }
    } else {
      const key = KIND_TO_INPUT_KEY[sp.kind];
      const grade = specialGrades[key];
      if (grade === undefined) {
        missingSpecials.push(sp.label);
        continue;
      }
      usedSpecials.push({ label: sp.label, grade, coeff: sp.coeff });
      if (sp.ebe !== null && grade < sp.ebe - EPS)
        specialEbeFails.push({ label: sp.label, grade, ebe: sp.ebe });
    }
  }

  let points: number | null = null;
  if (missingSpecials.length === 0) {
    const core = faculty.coeffs.reduce((s, c, i) => s + c * grades[i], 0);
    const special = usedSpecials.reduce((s, u) => s + u.coeff * u.grade, 0);
    points = Math.round((core + special) * 1000);
  }

  const eligible = ebeOk && missingSpecials.length === 0 && specialEbeFails.length === 0;
  const passesBase =
    eligible && points !== null && (faculty.base === null || points >= faculty.base);
  const diff = points !== null && faculty.base !== null ? points - faculty.base : null;

  let status: FacultyStatus;
  if (missingSpecials.length > 0) status = "missing-special";
  else if (!ebeOk) status = "ebe-fail";
  else if (specialEbeFails.length > 0) status = "special-ebe-fail";
  else if (faculty.base === null) status = "no-base";
  else status = points !== null && points >= faculty.base ? "pass" : "below-base";

  return {
    faculty,
    avgGrade,
    ebeOk,
    missingSpecials,
    specialEbeFails,
    usedSpecials,
    points,
    eligible,
    passesBase,
    diff,
    status,
  };
}
