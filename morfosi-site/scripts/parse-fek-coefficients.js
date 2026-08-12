/**
 * parse-fek-coefficients.js
 *
 * Διαβάζει την ΥΑ Φ.253.1/168266/Α5/24-12-2025 (συντελεστές βαρύτητας
 * πανελλαδικών ΓΕΛ για το ακαδ. έτος 2026-2027 και εφεξής) απευθείας από
 * το PDF και εξάγει, ανά τμήμα (κλειδί: κωδικός μηχανογραφικού):
 *   - συντελεστές των 4 πανελλαδικών μαθημάτων ανά επιστημονικό πεδίο
 *   - συντελεστές ειδικών/μουσικών μαθημάτων (στήλες 1 & 2)
 *   - συντελεστή πρακτικών δοκιμασιών (ΤΕΦΑΑ)
 *   - αν οι συντελεστές μουσικών μαθημάτων συμμετέχουν ΣΤΟ 100%
 *     (μουσικά τμήματα) ή είναι πρόσθετοι (όλα τα υπόλοιπα)
 *
 * Η θέση Χ κάθε ποσοστού καθορίζει το πεδίο/μάθημα — γι' αυτό η εξαγωγή
 * γίνεται με συντεταγμένες (custom pagerender), όχι με flat text.
 *
 * Validation: κάθε τετράδα πρέπει να αθροίζει 100% (ή 100% μαζί με τα
 * μουσικά μαθήματα για τα μουσικά τμήματα). Οτιδήποτε άλλο = hard error.
 *
 * Run: node scripts/parse-fek-coefficients.js
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const PDF_PATH = path.join(
  __dirname, "..", "..", "baseis",
  "24_12_2025_ΥΑ_συντελεστές_βαρύτητας_Πανελλαδικών_ΓΕΛ_2026_και_εφεξής_ΔΤ.pdf"
);
const OUT_PATH = path.join(__dirname, "data", "fek-coefficients-2026.json");

// Στήλες του Πίνακα (x-συντεταγμένες από το PDF):
// ίδρυμα <90 | κωδικός 90-131 | όνομα 131-256 |
// πεδίο 1: 260,284,309,334 | πεδίο 2: 358,383,408,432 |
// πεδίο 3: 457,482,506,531 | πεδίο 4: 555,580,605,629 |
// ειδικό/μουσικό 1: ~664 | ειδικό/μουσικό 2: ~709 | πρακτικές: ~758
const FIELD_COLS = {
  1: [260, 284, 309, 334],
  2: [358, 383, 408, 432],
  3: [457, 482, 506, 531],
  4: [555, 580, 605, 629],
};
const FIELD_RANGES = { 1: [256, 356], 2: [356, 455], 3: [455, 553], 4: [553, 652] };
const SP1_RANGE = [652, 697];
const SP2_RANGE = [697, 741];
const PRACTICAL_RANGE = [741, 795];

const TABLE_PAGES = { first: 4, last: 29 }; // 1-based
const Y_LINE_TOL = 3;      // items in ίδια γραμμή
const FRAGMENT_MAX_DIST = 28; // μέγιστη απόσταση θραύσματος από τη γραμμή-άγκυρα

async function extractPages() {
  const pages = [];
  const buf = fs.readFileSync(PDF_PATH);
  await pdfParse(buf, {
    pagerender: async (pageData) => {
      const tc = await pageData.getTextContent({
        normalizeWhitespace: false,
        disableCombineTextItems: true,
      });
      pages.push(
        tc.items.map((it) => ({
          s: it.str,
          x: it.transform[4],
          y: it.transform[5],
          w: it.width,
        }))
      );
      return "";
    },
  });
  return pages;
}

function groupLines(items) {
  const lines = [];
  for (const it of items) {
    if (!it.s.trim()) continue;
    let line = lines.find((l) => Math.abs(l.y - it.y) < Y_LINE_TOL);
    if (!line) {
      line = { y: it.y, its: [] };
      lines.push(line);
    }
    line.its.push(it);
  }
  lines.forEach((l) => {
    l.its.sort((a, b) => a.x - b.x);
    l.its = mergeSplitNumbers(l.its);
  });
  return lines.sort((a, b) => b.y - a.y);
}

// Σε ορισμένες γραμμές το "25%" βγαίνει σπασμένο σε items ("2","5","%").
// Συγχωνεύουμε διαδοχικά items όταν εφάπτονται οριζόντια και το
// αποτέλεσμα μοιάζει με (μερικό) ποσοστό.
function mergeSplitNumbers(items) {
  const out = [];
  for (const it of items) {
    const prev = out[out.length - 1];
    if (prev) {
      const gap = it.x - (prev.x + prev.w);
      const cand = prev.s.trim() + it.s.trim();
      if (gap > -2 && gap < 4 && /^\d/.test(prev.s.trim()) && /^\d{1,3}%?$/.test(cand)) {
        prev.s = cand;
        prev.w = it.x + it.w - prev.x;
        continue;
      }
    }
    out.push({ ...it });
  }
  return out;
}

function findCode(line) {
  const it = line.its.find(
    (i) => i.x >= 90 && i.x < 131 && /^\d{2,4}$/.test(i.s.trim())
  );
  return it ? it.s.trim() : null;
}

function parsePage(items, errors, pageNo) {
  const lines = groupLines(items);
  const anchors = lines.filter((l) => findCode(l));
  if (anchors.length === 0) return [];

  // Κάθε μη-anchor γραμμή πάει στην εγγραφή της ζώνης της: όρια ζώνης στο
  // μέσο μεταξύ διαδοχικών αγκυρών, με απόλυτο όριο FRAGMENT_MAX_DIST για
  // την πρώτη/τελευταία άγκυρα της σελίδας (ώστε να μένουν έξω οι κεφαλίδες)
  const records = anchors.map((a) => ({ anchor: a, extra: [] }));
  for (const l of lines) {
    if (anchors.includes(l)) continue;
    let best = null;
    let bestDist = Infinity;
    for (const r of records) {
      const d = Math.abs(r.anchor.y - l.y);
      if (d < bestDist) {
        bestDist = d;
        best = r;
      }
    }
    if (best && bestDist <= FRAGMENT_MAX_DIST) best.extra.push(l);
  }

  return records.map(({ anchor, extra }) => {
    // Όλες οι γραμμές της εγγραφής, από πάνω προς τα κάτω
    const all = [...extra, anchor].sort((a, b) => b.y - a.y);
    const its = all.flatMap((l) => l.its);

    const code = findCode(anchor);
    const institution = all
      .flatMap((l) => l.its.filter((i) => i.x < 90))
      .map((i) => i.s.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    let name = all
      .flatMap((l) => l.its.filter((i) => i.x >= 131 && i.x < 256))
      .map((i) => i.s.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Έδρα: τελευταία παρένθεση στο τέλος του ονόματος
    let city = null;
    const m = name.match(/\(([^()]+)\)\s*$/);
    if (m) {
      city = m[1].trim();
      name = name.slice(0, m.index).trim();
    }

    const pctIn = ([lo, hi]) =>
      its.filter(
        (i) => i.x >= lo && i.x < hi && /^\d{1,3}%$/.test(i.s.trim())
      );

    const fields = {};
    for (const f of [1, 2, 3, 4]) {
      const pcts = pctIn(FIELD_RANGES[f]);
      if (pcts.length === 0) continue;
      const vals = [0, 0, 0, 0];
      for (const p of pcts) {
        let bestCol = 0;
        let bestD = Infinity;
        FIELD_COLS[f].forEach((cx, idx) => {
          const d = Math.abs(p.x - cx);
          if (d < bestD) {
            bestD = d;
            bestCol = idx;
          }
        });
        if (vals[bestCol] !== 0)
          errors.push(`p${pageNo} ${code}: διπλή τιμή στη στήλη ${bestCol + 1} πεδίου ${f}`);
        vals[bestCol] = parseInt(p.s, 10);
      }
      fields[f] = vals;
    }

    const spVal = (range) => {
      const pcts = pctIn(range);
      if (pcts.length === 0) return 0;
      if (pcts.length > 1)
        errors.push(`p${pageNo} ${code}: πολλαπλές τιμές σε στήλη ειδικού`);
      return parseInt(pcts[0].s, 10);
    };
    const special1 = spVal(SP1_RANGE);
    const special2 = spVal(SP2_RANGE);
    const practical = spVal(PRACTICAL_RANGE);

    return { code, institution, name, city, fields, special1, special2, practical, page: pageNo };
  });
}

async function main() {
  const pages = await extractPages();
  const errors = [];
  let records = [];
  for (let p = TABLE_PAGES.first - 1; p <= TABLE_PAGES.last - 1; p++) {
    records = records.concat(parsePage(pages[p], errors, p + 1));
  }

  // ---- Validation ----
  const byCode = new Map();
  for (const r of records) {
    if (!r.code) {
      errors.push(`p${r.page}: εγγραφή χωρίς κωδικό (${r.name})`);
      continue;
    }
    if (byCode.has(r.code))
      errors.push(`Διπλός κωδικός ${r.code}: "${byCode.get(r.code).name}" και "${r.name}"`);
    byCode.set(r.code, r);
  }

  for (const r of records) {
    const spSum = r.special1 + r.special2;
    const fieldIds = Object.keys(r.fields);
    if (fieldIds.length === 0) {
      errors.push(`${r.code} ${r.name}: κανένα πεδίο με συντελεστές`);
      continue;
    }
    let model = null; // 'bonus' | 'music'
    for (const f of fieldIds) {
      const sum = r.fields[f].reduce((a, b) => a + b, 0);
      let thisModel;
      if (sum === 100) thisModel = "bonus";
      else if (sum + spSum === 100) thisModel = "music";
      else {
        errors.push(
          `${r.code} ${r.name}: πεδίο ${f} αθροίζει ${sum}% (ειδικά: ${spSum}%) — ούτε 100 ούτε 100-με-μουσικά`
        );
        continue;
      }
      if (model && model !== thisModel)
        errors.push(`${r.code} ${r.name}: ασυνεπές μοντέλο μεταξύ πεδίων`);
      model = thisModel;
    }
    r.musicIncluded = model === "music";
  }

  if (errors.length) {
    console.error(`❌ ${errors.length} σφάλματα validation:`);
    errors.forEach((e) => console.error("  -", e));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  const out = records.map(({ page, ...r }) => r);
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf8");

  // ---- Report ----
  const perField = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let withSpecial = 0, withPractical = 0, music = 0;
  for (const r of out) {
    for (const f of Object.keys(r.fields)) perField[f]++;
    if (r.special1 || r.special2) withSpecial++;
    if (r.practical) withPractical++;
    if (r.musicIncluded) music++;
  }
  console.log(`✅ ${out.length} τμήματα εξήχθησαν χωρίς σφάλματα`);
  console.log(`   ανά πεδίο: 1ο=${perField[1]}  2ο=${perField[2]}  3ο=${perField[3]}  4ο=${perField[4]}`);
  console.log(`   με ειδικό μάθημα: ${withSpecial}, με πρακτικές (ΤΕΦΑΑ): ${withPractical}, μουσικά: ${music}`);

  // Spot checks έναντι γνωστών τιμών του ΦΕΚ
  const checks = [
    ["279", { 2: [24, 22, 30, 24], 3: [20, 20, 27, 33] }], // Βιολογίας ΑΠΘ
    ["295", { 3: [25, 25, 25, 25] }],                       // Ιατρικής ΕΚΠΑ
    ["129", { 1: [25, 25, 25, 25] }],                       // Αγγλικής ΑΠΘ (ειδικό 20%)
    ["233", { 2: [25, 25, 25, 25] }],                       // Αρχιτεκτόνων ΑΠΘ (10+10)
  ];
  for (const [code, want] of checks) {
    const r = byCode.get(code);
    if (!r) { console.log(`   ⚠ spot-check: δεν βρέθηκε κωδικός ${code}`); continue; }
    for (const [f, vals] of Object.entries(want)) {
      const got = (r.fields[f] || []).join(",");
      const ok = got === vals.join(",");
      console.log(`   ${ok ? "✓" : "✗"} ${code} ${r.name} πεδίο ${f}: ${got}${ok ? "" : ` (αναμενόταν ${vals.join(",")})`}`);
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
