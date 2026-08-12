/**
 * Tests για τη λογική του Υπολογιστή Μορίων.
 *
 * Run: npm run test:calc
 * (κάνει compile το src/lib/calculator.ts σε scripts/.test-build και τρέχει
 *  αυτό το αρχείο με το built-in node:test)
 *
 * Τα tests διαβάζουν τα ΠΡΑΓΜΑΤΙΚΑ public/data/bases-2026-field-N.json ώστε
 * να ελέγχουν και δεδομένα, όχι μόνο μαθηματικά.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { evaluateFaculty, parseGradeInput, gradeAverage } = require("./.test-build/calculator.js");

const DATA_DIR = path.join(__dirname, "..", "public", "data");
const fieldData = {};
for (const f of [1, 2, 3, 4]) {
  fieldData[f] = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, `bases-2026-field-${f}.json`), "utf8")
  );
}
const byCode = (f, code) => {
  const fac = fieldData[f].find((x) => x.code === code);
  assert.ok(fac, `δεν βρέθηκε κωδ ${code} στο πεδίο ${f}`);
  return fac;
};

const NO_SPECIALS = {};

test("parseGradeInput: δεκαδικά με κόμμα, όρια, κενά, το 0 είναι έγκυρο", () => {
  assert.equal(parseGradeInput("18,5"), 18.5);
  assert.equal(parseGradeInput("18.5"), 18.5);
  assert.equal(parseGradeInput("0"), 0);
  assert.equal(parseGradeInput("25"), 20);
  assert.equal(parseGradeInput("-3"), 0);
  assert.equal(parseGradeInput(""), null);
  assert.equal(parseGradeInput("abc"), null);
});

test("Ιατρική ΕΚΠΑ (295): ίσοι συντελεστές, χωρίς ειδικά", () => {
  const fac = byCode(3, "295");
  const r18 = evaluateFaculty([18, 18, 18, 18], NO_SPECIALS, fac);
  assert.equal(r18.points, 18000);
  assert.equal(r18.ebeOk, true); // 18 ≥ 14,78
  assert.equal(r18.status, "below-base"); // 18000 < 18900

  const r19 = evaluateFaculty([19, 19, 19, 19], NO_SPECIALS, fac);
  assert.equal(r19.points, 19000);
  assert.equal(r19.status, "pass");
});

test("B1 regression: τα ειδικά ΔΕΝ προστίθενται σε σχολές που δεν τα απαιτούν", () => {
  const fac = byCode(3, "295"); // Ιατρική ΕΚΠΑ
  const allSpecials = {
    Αγγλικά: 20, Γαλλικά: 20, Γερμανικά: 20, Ιταλικά: 20, Ισπανικά: 20,
    "Ελεύθερο Σχέδιο": 20, "Γραμμικό Σχέδιο": 20, Αγωνίσματα: 20,
    "Μουσική Εκτέλεση και Ερμηνεία": 20, "Μουσική Αντίληψη, Θεωρία και Αρμονία": 20,
  };
  const r = evaluateFaculty([15, 15, 15, 15], allSpecials, fac);
  assert.equal(r.points, 15000); // ΟΧΙ 25000 όπως το παλιό bug
  assert.equal(r.passesBase, false);
  assert.equal(r.usedSpecials.length, 0);
});

test("Βιολογίας ΑΠΘ (279): ίδια βαθμολογία, διαφορετικά μόρια ανά πεδίο", () => {
  const f2 = byCode(2, "279");
  const f3 = byCode(3, "279");
  assert.equal(f2.base, f3.base); // ίδια βάση, κοινή σχολή
  const grades = [20, 10, 15, 12];
  const r2 = evaluateFaculty(grades, NO_SPECIALS, f2);
  const r3 = evaluateFaculty(grades, NO_SPECIALS, f3);
  // πεδίο 2: 24/22/30/24 → 4.8+2.2+4.5+2.88 = 14.38
  assert.equal(r2.points, 14380);
  // πεδίο 3: 20/20/27/33 → 4+2+4.05+3.96 = 14.01
  assert.equal(r3.points, 14010);
});

test("Αγγλικής ΑΠΘ (129): ειδικό Αγγλικά 20% — μόνο με βαθμό, με έλεγχο ΕΒΕ ειδικού", () => {
  const fac = byCode(1, "129");
  // Χωρίς Αγγλικά: δεν υπολογίζονται μόρια
  const missing = evaluateFaculty([15, 15, 15, 15], NO_SPECIALS, fac);
  assert.equal(missing.status, "missing-special");
  assert.equal(missing.points, null);
  assert.equal(missing.eligible, false);

  // Με Αγγλικά 18: 15000 + 18×0.2×1000 = 18600 ≥ 17425
  const ok = evaluateFaculty([15, 15, 15, 15], { Αγγλικά: 18 }, fac);
  assert.equal(ok.points, 18600);
  assert.equal(ok.status, "pass");

  // Με Αγγλικά 13 (< ΕΒΕ ειδικού 13,63): αποκλεισμός παρά τα μόρια
  const low = evaluateFaculty([15, 15, 15, 15], { Αγγλικά: 13 }, fac);
  assert.equal(low.status, "special-ebe-fail");
  assert.equal(low.eligible, false);
  assert.equal(low.points, 17600); // υπολογίζονται, αλλά δεν αρκούν για εισαγωγή
});

test("Αρχιτεκτόνων ΕΜΠ (231): δύο σχέδια 10%+10%, βάση πάνω από 20.000 εφικτή", () => {
  const fac = byCode(2, "231");
  assert.ok(fac.base > 20000);
  const r = evaluateFaculty(
    [20, 20, 20, 20],
    { "Ελεύθερο Σχέδιο": 20, "Γραμμικό Σχέδιο": 20 },
    fac
  );
  assert.equal(r.points, 24000);
  assert.equal(r.status, "pass");

  // Μόνο ένα σχέδιο = λείπει απαιτούμενο ειδικό
  const one = evaluateFaculty([20, 20, 20, 20], { "Ελεύθερο Σχέδιο": 20 }, fac);
  assert.equal(one.status, "missing-special");
});

test("ΤΕΦΑΑ ΕΚΠΑ (401): αγωνίσματα 20% επιπλέον, με δική τους ΕΒΕ", () => {
  const fac = byCode(1, "401");
  const r = evaluateFaculty([15, 15, 15, 15], { Αγωνίσματα: 16 }, fac);
  // core: 15×(0.30+0.25+0.25+0.20)=15 → 15000, +16×0.2×1000=3200
  assert.equal(r.points, 18200);
  assert.equal(r.status, "pass"); // βάση 17226

  const lowAth = evaluateFaculty([15, 15, 15, 15], { Αγωνίσματα: 5 }, fac);
  assert.equal(lowAth.status, "special-ebe-fail"); // 5 < ΕΒΕ αγωνισμάτων 7,78
});

test("Μουσικών ΕΚΠΑ (408): μουσικά μαθήματα ΜΕΣΑ στο 100%, μόνο 2 πανελλαδικά μετράνε", () => {
  const fac = byCode(1, "408");
  assert.equal(fac.musicIncluded, true);
  assert.deepEqual(fac.coeffs, [0.3, 0, 0.2, 0]);
  const r = evaluateFaculty(
    [16, 10, 14, 10],
    { "Μουσική Εκτέλεση και Ερμηνεία": 15, "Μουσική Αντίληψη, Θεωρία και Αρμονία": 12 },
    fac
  );
  // 16×0.3 + 14×0.2 + 15×0.2 + 12×0.3 = 4.8+2.8+3+3.6 = 14.2
  assert.equal(r.points, 14200);
  // Ο τέλειος μουσικός φτάνει ακριβώς 20.000 (όχι 24.000)
  const perfect = evaluateFaculty(
    [20, 20, 20, 20],
    { "Μουσική Εκτέλεση και Ερμηνεία": 20, "Μουσική Αντίληψη, Θεωρία και Αρμονία": 20 },
    fac
  );
  assert.equal(perfect.points, 20000);
});

test("Ξένων Γλωσσών Ιονίου (385): επιλογή 2 από 3 γλώσσες, οι 2 καλύτερες που περνούν ΕΒΕ", () => {
  const fac = byCode(1, "385");
  // 3 γλώσσες: παίρνει τις 2 καλύτερες (18, 15)
  const r = evaluateFaculty(
    [15, 15, 15, 15],
    { Αγγλικά: 18, Γαλλικά: 12, Γερμανικά: 15 },
    fac
  );
  // core 15×(0.4+0.2+0.2+0.2)=15 → 15000 + (18+15)×0.2×1000 = 21600
  assert.equal(r.points, 21600);
  assert.equal(r.usedSpecials.map((u) => u.label).sort().join(","), "Αγγλικά,Γερμανικά");

  // Μόνο μία γλώσσα: λείπει η δεύτερη
  const one = evaluateFaculty([15, 15, 15, 15], { Αγγλικά: 18 }, fac);
  assert.equal(one.status, "missing-special");
});

test("ΕΒΕ τμήματος: απλός Μ.Ο. των 4 βαθμών, το 0 είναι έγκυρος βαθμός", () => {
  const fac = byCode(3, "295"); // Ιατρική, ΕΒΕ 14,78
  const r = evaluateFaculty([0, 20, 20, 20], NO_SPECIALS, fac);
  assert.equal(gradeAverage([0, 20, 20, 20]), 15);
  assert.equal(r.ebeOk, true); // 15 ≥ 14,78
  const fail = evaluateFaculty([10, 15, 15, 15], NO_SPECIALS, fac);
  assert.equal(fail.ebeOk, false); // 13,75 < 14,78
  assert.equal(fail.status, "ebe-fail");
  assert.equal(fail.eligible, false);
});

test("ΟΡΙΑΚΑ: Μ.Ο. ακριβώς ίσος με την ΕΒΕ περνάει", () => {
  const fac = byCode(3, "295"); // ΕΒΕ 14,78
  const r = evaluateFaculty([14.78, 14.78, 14.78, 14.78], NO_SPECIALS, fac);
  assert.equal(r.ebeOk, true);
});

test("INVARIANT: ο τέλειος μαθητής περνά ΚΑΘΕ σχολή κάθε πεδίου", () => {
  const allSpecials = {
    Αγγλικά: 20, Γαλλικά: 20, Γερμανικά: 20, Ιταλικά: 20, Ισπανικά: 20,
    "Ελεύθερο Σχέδιο": 20, "Γραμμικό Σχέδιο": 20, Αγωνίσματα: 20,
    "Μουσική Εκτέλεση και Ερμηνεία": 20, "Μουσική Αντίληψη, Θεωρία και Αρμονία": 20,
  };
  for (const f of [1, 2, 3, 4]) {
    for (const fac of fieldData[f]) {
      const r = evaluateFaculty([20, 20, 20, 20], allSpecials, fac);
      assert.equal(
        r.passesBase,
        true,
        `πεδίο ${f} κωδ ${fac.code} ${fac.name}: τέλειος μαθητής δεν περνά (μόρια ${r.points}, βάση ${fac.base}, status ${r.status})`
      );
    }
  }
});

test("ΔΕΔΟΜΕΝΑ: κάθε σχολή έχει έγκυρους συντελεστές και ΕΒΕ", () => {
  for (const f of [1, 2, 3, 4]) {
    for (const fac of fieldData[f]) {
      const coreSum = fac.coeffs.reduce((s, c) => s + c, 0);
      const spSum = fac.specials.reduce((s, sp) => s + sp.coeff * sp.choose, 0);
      const total = fac.musicIncluded ? coreSum + spSum : coreSum;
      assert.ok(
        Math.abs(total - 1) < 1e-9,
        `πεδίο ${f} κωδ ${fac.code}: συντελεστές αθροίζουν ${total}`
      );
      assert.ok(fac.ebe > 0 && fac.ebe <= 20, `πεδίο ${f} κωδ ${fac.code}: άκυρη ΕΒΕ ${fac.ebe}`);
      if (fac.base !== null)
        assert.ok(fac.base > 0 && fac.base <= 28000, `πεδίο ${f} κωδ ${fac.code}: άκυρη βάση ${fac.base}`);
      for (const sp of fac.specials) {
        assert.ok(sp.coeff > 0, `πεδίο ${f} κωδ ${fac.code}: ειδικό με μηδενικό συντελεστή`);
        if (sp.kind === "language") assert.ok(sp.options && sp.options.length >= sp.choose);
      }
    }
  }
});

test("ΚΟΙΝΕΣ ΣΧΟΛΕΣ: ίδια βάση/ΕΒΕ σε όλα τα πεδία όπου εμφανίζονται", () => {
  const seen = new Map();
  for (const f of [1, 2, 3, 4]) {
    for (const fac of fieldData[f]) {
      const prev = seen.get(fac.code);
      if (prev) {
        assert.equal(prev.base, fac.base, `κωδ ${fac.code}: διαφορετική βάση μεταξύ πεδίων`);
        assert.equal(prev.ebe, fac.ebe, `κωδ ${fac.code}: διαφορετική ΕΒΕ μεταξύ πεδίων`);
      } else {
        seen.set(fac.code, fac);
      }
    }
  }
});
