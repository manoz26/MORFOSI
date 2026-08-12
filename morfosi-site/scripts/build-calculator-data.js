/**
 * build-calculator-data.js
 *
 * Ενώνει (με κλειδί τον ΚΩΔΙΚΟ ΜΗΧΑΝΟΓΡΑΦΙΚΟΥ):
 *   - scripts/data/bases-2026-raw.json      (βάσεις + ΕΒΕ 2026, aeitei/minedu)
 *   - scripts/data/fek-coefficients-2026.json (συντελεστές ΥΑ Δεκ. 2025, 2026+)
 * και παράγει public/data/bases-2026-field-{1..4}.json για τον Υπολογιστή Μορίων.
 *
 * Κανόνες:
 *   - ΚΑΝΕΝΑ σιωπηλό default: ό,τι δεν ματσάρει => hard error στο build.
 *   - Το ειδικό μάθημα μπαίνει ΜΟΝΟ στα τμήματα που το απαιτούν, με τον
 *     συντελεστή ΤΟΥ τμήματος από το ΦΕΚ.
 *   - Μουσικά τμήματα: οι συντελεστές μουσικών μαθημάτων είναι ΜΕΡΟΣ του
 *     100% (musicIncluded: true).
 *   - Invariant: ο τέλειος μαθητής (20 παντού + ειδικά) περνά ΚΑΘΕ σχολή.
 *
 * Run: node scripts/build-calculator-data.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const OUT_DIR = path.join(__dirname, "..", "public", "data");

const bases = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "bases-2026-raw.json"), "utf8"));
const fek = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "fek-coefficients-2026.json"), "utf8"));
const fekByCode = new Map(fek.map((r) => [r.code, r]));

const errors = [];
const warnings = [];

// ── Ίδρυμα: σύντομη ονομασία ─────────────────────────────────────────
const INSTITUTION_SHORT = {
  "ΕΘΝΙΚΟ & ΚΑΠΟΔΙΣΤΡΙΑΚΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΑΘΗΝΩΝ": "ΕΚΠΑ",
  "ΑΡΙΣΤΟΤΕΛΕΙΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΘΕΣΣΑΛΟΝΙΚΗΣ": "ΑΠΘ",
  "ΕΘΝΙΚΟ ΜΕΤΣΟΒΙΟ ΠΟΛΥΤΕΧΝΕΙΟ": "ΕΜΠ",
  "ΔΗΜΟΚΡΙΤΕΙΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΘΡΑΚΗΣ": "ΔΠΘ",
  "ΠΑΝΕΠΙΣΤΗΜΙΟ ΜΑΚΕΔΟΝΙΑΣ": "ΠΑΜΑΚ",
  "ΠΑΝΕΠΙΣΤΗΜΙΟ ΔΥΤΙΚΗΣ ΑΤΤΙΚΗΣ": "ΠΑΔΑ",
  "ΔΙΕΘΝΕΣ ΠΑΝΕΠΙΣΤΗΜΙΟ ΕΛΛΑΔΑΣ": "ΔΙΠΑΕ",
  "ΕΛΛΗΝΙΚΟ ΜΕΣΟΓΕΙΑΚΟ ΠΑΝΕΠΙΣΤΗΜΙΟ": "ΕΛΜΕΠΑ",
  "ΑΝΩΤΑΤΗ ΣΧΟΛΗ ΚΑΛΩΝ ΤΕΧΝΩΝ": "ΑΣΚΤ",
  "ΑΝΩΤΑΤΗ ΣΧΟΛΗ ΠΑΙΔΑΓΩΓΙΚΗΣ & ΤΕΧΝΟΛΟΓΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ": "ΑΣΠΑΙΤΕ",
  "ΟΙΚΟΝΟΜΙΚΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΑΘΗΝΩΝ": "ΟΠΑ",
  "ΓΕΩΠΟΝΙΚΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΑΘΗΝΩΝ": "ΓΠΑ",
  "ΠΑΝΤΕΙΟ ΠΑΝΕΠΙΣΤΗΜΙΟ ΚΟΙΝΩΝΙΚΩΝ ΚΑΙ ΠΟΛΙΤΙΚΩΝ ΕΠΙΣΤΗΜΩΝ": "ΠΑΝΤΕΙΟ",
  "ΧΑΡΟΚΟΠΕΙΟ ΠΑΝΕΠΙΣΤΗΜΙΟ": "ΧΑΡΟΚΟΠΕΙΟ",
  "ΠΑΝΕΠΙΣΤΗΜΙΟ ΠΕΙΡΑΙΑ": "ΠΑ.ΠΕΙ.",
  "ΠΑΝΕΠΙΣΤΗΜΙΟ ΠΕΙΡΑΙΩΣ": "ΠΑ.ΠΕΙ.",
};

function institutionShort(full) {
  if (!full) return null;
  // "(ΕΚΠΑ)" στο τέλος → χρησιμοποίησέ το
  const m = full.match(/\(([^()]+)\)\s*$/);
  const base = m ? full.slice(0, m.index).trim() : full.trim();
  if (m) return m[1].trim();
  return INSTITUTION_SHORT[base] || base;
}

function institutionBase(full) {
  if (!full) return null;
  const m = full.match(/\(([^()]+)\)\s*$/);
  return m ? full.slice(0, m.index).trim() : full.trim();
}

// ── Ειδικά μαθήματα: από note + ΕΒΕ ειδικών + συντελεστές ΦΕΚ ────────
const LANGS = ["Αγγλικά", "Γαλλικά", "Γερμανικά", "Ιταλικά", "Ισπανικά"];

function ebeOf(rec, ...labelParts) {
  const hit = rec.ebeSpecials.find((sp) =>
    labelParts.some((p) => sp.label.toLowerCase().includes(p.toLowerCase()))
  );
  return hit ? hit.ebe : null;
}

function buildSpecials(rec, f) {
  const note = rec.specialNote || "";
  const sp1 = f.special1 / 100;
  const sp2 = f.special2 / 100;
  const practical = f.practical / 100;
  const specials = [];
  const ctx = `κωδ ${rec.code} ${rec.name}`;

  if (/Εξέταση σε αγωνίσματα/i.test(note)) {
    if (!practical) errors.push(`${ctx}: αγωνίσματα χωρίς συντελεστή πρακτικών στο ΦΕΚ`);
    specials.push({
      kind: "athletics",
      label: "Αγωνίσματα (ΤΕΦΑΑ)",
      coeff: practical,
      choose: 1,
      options: null,
      ebe: ebeOf(rec, "Αγωνίσματα"),
    });
  } else if (/Μουσική Εκτέλεση/i.test(note)) {
    if (!f.musicIncluded) errors.push(`${ctx}: μουσικό τμήμα αλλά ΦΕΚ δεν δίνει musicIncluded`);
    specials.push({
      kind: "music-performance",
      label: "Μουσική Εκτέλεση και Ερμηνεία",
      coeff: sp1,
      choose: 1,
      options: null,
      ebe: ebeOf(rec, "Εκτέλεση"),
    });
    specials.push({
      kind: "music-theory",
      label: "Μουσική Αντίληψη, Θεωρία και Αρμονία",
      coeff: sp2,
      choose: 1,
      options: null,
      ebe: ebeOf(rec, "Αντίληψη"),
    });
  } else if (/Ελεύθερο και Γραμμικό Σχέδιο/i.test(note)) {
    if (!sp1 || !sp2) errors.push(`${ctx}: δύο σχέδια αλλά ΦΕΚ δίνει ${f.special1}%/${f.special2}%`);
    specials.push({
      kind: "drawing-free", label: "Ελεύθερο Σχέδιο", coeff: sp1, choose: 1, options: null,
      ebe: ebeOf(rec, "Ελεύθερο"),
    });
    specials.push({
      kind: "drawing-line", label: "Γραμμικό Σχέδιο", coeff: sp2, choose: 1, options: null,
      ebe: ebeOf(rec, "Γραμμικό"),
    });
  } else if (/Ελεύθερο Σχέδιο/i.test(note)) {
    if (!sp1) errors.push(`${ctx}: ελεύθερο σχέδιο χωρίς συντελεστή στο ΦΕΚ`);
    if (sp2) errors.push(`${ctx}: ένα σχέδιο στη σημείωση, δύο συντελεστές στο ΦΕΚ`);
    specials.push({
      kind: "drawing-free", label: "Ελεύθερο Σχέδιο", coeff: sp1, choose: 1, options: null,
      ebe: ebeOf(rec, "Ελεύθερο", "Σχέδιο"),
    });
  } else if (/Επιλογή δύο από τα/i.test(note)) {
    const opts = LANGS.filter((l) => note.includes(l));
    if (sp1 !== sp2) errors.push(`${ctx}: "δύο από τα" με άνισους συντελεστές ${f.special1}%/${f.special2}%`);
    if (!sp1) errors.push(`${ctx}: "δύο από τα" χωρίς συντελεστή στο ΦΕΚ`);
    specials.push({
      kind: "language", label: "Ξένες Γλώσσες (2)", coeff: sp1, choose: 2, options: opts,
      ebe: ebeOf(rec, "Ξένες Γλώσσες", "Ξένη Γλώσσα"),
    });
  } else if (/Ειδικό μάθημα/i.test(note)) {
    const opts = LANGS.filter((l) => note.includes(l));
    if (opts.length === 0) {
      errors.push(`${ctx}: αταξινόμητη σημείωση ειδικού: "${note}"`);
    } else {
      if (!sp1) errors.push(`${ctx}: ειδικό γλώσσας χωρίς συντελεστή στο ΦΕΚ`);
      if (sp2) errors.push(`${ctx}: ειδικό γλώσσας αλλά το ΦΕΚ δίνει και 2ο συντελεστή`);
      specials.push({
        kind: "language",
        label: opts.length === 1 ? opts[0] : "Ξένη Γλώσσα",
        coeff: sp1,
        choose: 1,
        options: opts,
        ebe: ebeOf(rec, "Ξένη Γλώσσα", ...opts),
      });
    }
  }

  // Cross-check: το ΦΕΚ έχει συντελεστές ειδικών που δεν καλύψαμε;
  const covered = specials.reduce((s, x) => s + x.coeff * (x.choose || 1), 0);
  const fekTotal = sp1 * (specials.some((s) => s.choose === 2) ? 0 : 1) + sp2 + practical;
  const fekSum = specials.some((s) => s.choose === 2) ? sp1 + sp2 + practical : sp1 + sp2 + practical;
  if (Math.abs(covered - fekSum) > 1e-9) {
    errors.push(
      `${ctx}: ασυμφωνία ειδικών — ΦΕΚ ${f.special1}%/${f.special2}%/πρακτ ${f.practical}% vs note "${note}" (ΕΒΕ ειδικών: ${rec.ebeSpecials.map((s) => s.label).join(", ") || "καμία"})`
    );
  }
  // ΕΒΕ ειδικού πρέπει να υπάρχει για κάθε απαιτούμενο ειδικό
  for (const s of specials) {
    if (s.ebe === null) warnings.push(`${ctx}: δεν βρέθηκε ΕΒΕ για "${s.label}"`);
  }
  return specials;
}

// ── Κύρια ένωση ──────────────────────────────────────────────────────
const outByField = { 1: [], 2: [], 3: [], 4: [] };
const seenFekCodes = new Set();

for (const rec of bases) {
  const f = fekByCode.get(rec.code);
  const ctx = `πεδίο ${rec.fieldId} κωδ ${rec.code} ${rec.name}`;
  if (!f) {
    errors.push(`${ctx}: ΔΕΝ βρέθηκε στο ΦΕΚ συντελεστών`);
    continue;
  }
  seenFekCodes.add(rec.code);
  const coeffsPct = f.fields[rec.fieldId];
  if (!coeffsPct) {
    errors.push(`${ctx}: το ΦΕΚ δεν δίνει συντελεστές για το πεδίο ${rec.fieldId} (έχει: ${Object.keys(f.fields).join(",")})`);
    continue;
  }

  const specials = buildSpecials(rec, f);

  // Μη-ειδικές σημειώσεις κρατιούνται ως πληροφορία
  let note = null;
  if (/επιπλέον προϋποθέσεις/i.test(rec.specialNote || "")) note = "Ισχύουν επιπλέον προϋποθέσεις εισαγωγής";
  else if (/άρρενες/i.test(rec.specialNote || "")) note = rec.specialNote;
  else if (/Κάντε κλικ/i.test(rec.specialNote || "")) {
    warnings.push(`${ctx}: σημείωση "Κάντε κλικ..." — χρειάζεται χειροκίνητο έλεγχο`);
    note = null;
  }

  outByField[rec.fieldId].push({
    code: rec.code,
    name: rec.name,
    institution: institutionShort(rec.institutionFull),
    institutionFull: institutionBase(rec.institutionFull),
    city: rec.city,
    type: rec.type ? rec.type.replace(/\s+/g, " ").trim() : null,
    base: rec.base,
    ebe: rec.ebe,
    coeffs: coeffsPct.map((p) => p / 100),
    specials,
    musicIncluded: !!f.musicIncluded,
    note,
  });
}

// ΦΕΚ τμήματα που δεν εμφανίζονται πουθενά στις βάσεις (πληροφοριακό)
for (const r of fek) {
  if (!seenFekCodes.has(r.code))
    warnings.push(`ΦΕΚ κωδ ${r.code} ${r.institution} ${r.name}: δεν υπάρχει στις βάσεις 2026 ΓΕΛ 90%`);
}

// ── Invariant: τέλειος μαθητής περνά τα πάντα ────────────────────────
for (const [fid, list] of Object.entries(outByField)) {
  for (const fac of list) {
    const core = fac.coeffs.reduce((s, c) => s + 20 * c, 0);
    const special = fac.specials.reduce((s, sp) => s + 20 * sp.coeff * (sp.choose || 1), 0);
    const maxPoints = Math.round((core + special) * 1000);
    if (fac.base !== null && maxPoints < fac.base) {
      errors.push(
        `πεδίο ${fid} κωδ ${fac.code} ${fac.name}: μέγιστο δυνατό ${maxPoints} < βάση ${fac.base} — ΑΔΥΝΑΤΗ σχολή`
      );
    }
  }
}

// ── Αναφορά & έξοδος ─────────────────────────────────────────────────
if (warnings.length) {
  console.log(`⚠ ${warnings.length} προειδοποιήσεις:`);
  warnings.forEach((w) => console.log("  -", w));
}
if (errors.length) {
  console.error(`\n❌ ${errors.length} σφάλματα — ΔΕΝ γράφτηκε τίποτα:`);
  errors.forEach((e) => console.error("  -", e));
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let total = 0;
for (const fid of [1, 2, 3, 4]) {
  const list = outByField[fid].sort((a, b) => (b.base || 0) - (a.base || 0));
  const out = path.join(OUT_DIR, `bases-2026-field-${fid}.json`);
  fs.writeFileSync(out, JSON.stringify(list, null, 1), "utf8");
  console.log(`✅ πεδίο ${fid}: ${list.length} σχολές → ${path.relative(process.cwd(), out)}`);
  total += list.length;
}
console.log(`Σύνολο: ${total} εγγραφές.`);

// Μικρό μανιφέστο για το UI (πλήθη, έτος)
const manifest = {
  year: 2026,
  generatedAt: new Date().toISOString().slice(0, 10),
  counts: Object.fromEntries([1, 2, 3, 4].map((f) => [f, outByField[f].length])),
  total,
};
fs.writeFileSync(path.join(OUT_DIR, "bases-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log("✅ bases-manifest.json ενημερώθηκε");
