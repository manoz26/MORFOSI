/**
 * parse-bases-2026.js
 *
 * Διαβάζει τα αρχειοθετημένα HTML του aeitei.gr (Βάσεις 2026, ΓΕΛ 90%
 * ημερήσια, ανά επιστημονικό πεδίο — κατέβηκαν 13/8/2026) από
 * D:\MORFOSI\baseis\2026\ και εξάγει ανά σχολή:
 *   κωδικό μηχανογραφικού, ίδρυμα, όνομα, πόλη, τύπο, ΕΒΕ 2026,
 *   ΕΒΕ ειδικών μαθημάτων (με ετικέτα), βάση 2026, σημείωση ειδικού.
 *
 * Run: node scripts/parse-bases-2026.js
 * Output: scripts/data/bases-2026-raw.json
 */

const fs = require("fs");
const path = require("path");

const IN_DIR = path.join(__dirname, "..", "..", "baseis", "2026");
const OUT_PATH = path.join(__dirname, "data", "bases-2026-raw.json");

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function parseNum(s) {
  // "18.950" → 18950, "12,99" → 12.99
  const t = s.trim();
  if (!t || t === "-" || t === "—") return null;
  if (/^\d{1,3}(\.\d{3})+$/.test(t)) return parseInt(t.replace(/\./g, ""), 10);
  return parseFloat(t.replace(/\./g, "").replace(",", "."));
}

function parseRow(row, fieldId, errors) {
  const codeM = row.match(/<b>(\d{2,4})<\/b>/);
  if (!codeM) return null;
  const code = codeM[1];

  const instM = row.match(/<font size=-2>([^<]+)/);
  const nameM = row.match(/<a href="sxoli\.php\?sxoli=\d+"[^>]*>([^<]+)<\/a>/);
  const noteM = row.match(/<font size=-1><b>([^<]+)<\/b><\/font>/);
  const cityM = row.match(/<a href="sxoli\.php\?city=[^"]*"[^>]*>([^<]+)<\/a>/);

  // Στήλη τύπου: το <td> αμέσως μετά το κλείσιμο της στήλης σχολής
  const typeM = row.match(/<\/font><td>([^<]+)</) || row.match(/<td>(ΑΕΙ|ΣΤΡΑΤΙΩΤΙΚΕΣ[^<]*)</);

  // ΕΒΕ: πρώτο <div class=ebe> χωρίς label
  const ebeM = row.match(/<div class=ebe>([\d,]+)<\/div>/);

  // ΕΒΕ ειδικών: ζεύγη <div class="lbl ebe-idikou">LABEL</div>VALUE
  const ebeSpecials = [];
  const spRe = /<div class="lbl ebe-idikou">([^<]+)<\/div>([\d,]+)/g;
  let m;
  while ((m = spRe.exec(row)) !== null) {
    ebeSpecials.push({ label: decode(m[1]), ebe: parseNum(m[2]) });
  }

  const baseM = row.match(/<td class=vaseis>([\d.,]+|-|—)?/);

  const rec = {
    code,
    fieldId,
    institutionFull: instM ? decode(instM[1]) : null,
    name: nameM ? decode(nameM[1]) : null,
    specialNote: noteM ? decode(noteM[1]) : null,
    type: typeM ? decode(typeM[1]) : null,
    city: cityM ? decode(cityM[1]) : null,
    ebe: ebeM ? parseNum(ebeM[1]) : null,
    ebeSpecials,
    base: baseM && baseM[1] ? parseNum(baseM[1]) : null,
  };

  if (!rec.name) errors.push(`πεδίο ${fieldId} κωδ ${code}: δεν βρέθηκε όνομα`);
  if (!rec.institutionFull) errors.push(`πεδίο ${fieldId} κωδ ${code}: δεν βρέθηκε ίδρυμα`);
  if (rec.ebe === null) errors.push(`πεδίο ${fieldId} κωδ ${code} (${rec.name}): δεν βρέθηκε ΕΒΕ`);
  // Κενή βάση = καμία εισαγωγή φέτος (π.χ. ΠΑΕΑ Κρήτης) — θεμιτό, μένει null
  if (rec.base === null && !/<td class=vaseis>(&nbsp;|\s*)</.test(row))
    errors.push(`πεδίο ${fieldId} κωδ ${code} (${rec.name}): δεν βρέθηκε βάση`);
  return rec;
}

function main() {
  const errors = [];
  const all = [];
  for (const f of [1, 2, 3, 4]) {
    const file = path.join(IN_DIR, `aeitei-vaseis-2026-gel90-pedio-${f}.html`);
    const html = fs.readFileSync(file, "utf8");
    const rows = html.split(/<tr class=row[12]>/).slice(1);
    let count = 0;
    for (const row of rows) {
      const rec = parseRow(row.split("</table>")[0], f, errors);
      if (rec) {
        all.push(rec);
        count++;
      }
    }
    console.log(`πεδίο ${f}: ${count} σχολές`);
  }

  // Διπλοεγγραφές μέσα στο ίδιο πεδίο = bug
  const seen = new Set();
  for (const r of all) {
    const k = `${r.fieldId}:${r.code}`;
    if (seen.has(k)) errors.push(`Διπλός κωδικός ${r.code} στο πεδίο ${r.fieldId}`);
    seen.add(k);
  }
  // Ίδιος κωδικός σε πολλά πεδία πρέπει να έχει ΙΔΙΑ βάση/ΕΒΕ
  const byCode = new Map();
  for (const r of all) {
    if (!byCode.has(r.code)) byCode.set(r.code, []);
    byCode.get(r.code).push(r);
  }
  for (const [code, recs] of byCode) {
    const bases = new Set(recs.map((r) => r.base));
    const ebes = new Set(recs.map((r) => r.ebe));
    if (bases.size > 1) errors.push(`Κωδ ${code}: διαφορετική βάση μεταξύ πεδίων: ${[...bases].join(", ")}`);
    if (ebes.size > 1) errors.push(`Κωδ ${code}: διαφορετική ΕΒΕ μεταξύ πεδίων: ${[...ebes].join(", ")}`);
  }

  if (errors.length) {
    console.error(`❌ ${errors.length} σφάλματα:`);
    errors.forEach((e) => console.error("  -", e));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(all, null, 2), "utf8");
  console.log(`✅ ${all.length} εγγραφές (${byCode.size} μοναδικές σχολές) → ${path.relative(process.cwd(), OUT_PATH)}`);

  // Αναφορά: distinct σημειώσεις ειδικών & ετικέτες ΕΒΕ ειδικών
  const notes = new Map();
  const labels = new Map();
  for (const r of all) {
    if (r.specialNote) notes.set(r.specialNote, (notes.get(r.specialNote) || 0) + 1);
    for (const sp of r.ebeSpecials) labels.set(sp.label, (labels.get(sp.label) || 0) + 1);
  }
  console.log("\n— Σημειώσεις ειδικών μαθημάτων —");
  [...notes.entries()].sort((a, b) => b[1] - a[1]).forEach(([n, c]) => console.log(`  ${c}× ${n}`));
  console.log("\n— Ετικέτες ΕΒΕ ειδικών —");
  [...labels.entries()].sort((a, b) => b[1] - a[1]).forEach(([n, c]) => console.log(`  ${c}× ${n}`));
}

main();
