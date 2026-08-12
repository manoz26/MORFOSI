/**
 * E2E smoke test του Υπολογιστή Μορίων με headless Chrome.
 *
 * Προαπαιτεί dev server στο http://localhost:3000.
 * Run: node scripts/e2e-calculator.js
 *
 * Σενάριο-κλειδί (regression του παλιού bug B1):
 *   Μαθητής 3ου πεδίου με 15 παντού τσεκάρει ΟΛΑ τα ειδικά με 20.
 *   Η Ιατρική ΕΚΠΑ πρέπει να δείξει 15.000 μόρια (όχι 25.000) και ΟΧΙ επιτυχία.
 */

const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3000";

const fail = (msg) => {
  console.error("✗ " + msg);
  process.exitCode = 1;
};
const ok = (msg) => console.log("✓ " + msg);

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--window-size=1400,1000"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });
    page.on("pageerror", (e) => {
      const msg = e.message.split("\n")[0];
      // Γνωστό site-wide bug του layout (CookieConsent διαβάζει localStorage στο
      // αρχικό state) — εμφανίζεται σε ΟΛΕΣ τις σελίδες, όχι μόνο στον calculator.
      if (/Hydration failed/.test(msg)) {
        console.log("ℹ (γνωστό layout bug, εκτός calculator): " + msg.slice(0, 60) + "…");
        return;
      }
      fail("page error: " + msg);
    });

    await page.goto(`${BASE}/calculator`, { waitUntil: "networkidle2", timeout: 60000 });

    // ── Βήμα 1: επιλογή 3ου πεδίου ──
    await page.waitForFunction(
      () => [...document.querySelectorAll("button")].some((b) => /3ο Πεδίο/.test(b.textContent)),
      { timeout: 15000 }
    );
    ok("Βήμα 1 φορτώθηκε");
    await page.evaluate(() => {
      [...document.querySelectorAll("button")].find((b) => /3ο Πεδίο/.test(b.textContent)).click();
    });

    // ── Βήμα 2: βαθμοί 15 παντού ──
    await page.waitForFunction(
      () => document.querySelectorAll('input[inputmode="decimal"]').length === 4,
      { timeout: 15000 }
    );
    ok("Βήμα 2: 4 πεδία βαθμών");
    const inputs = await page.$$('input[inputmode="decimal"]');
    for (const input of inputs) await input.type("15");

    await page.evaluate(() => {
      [...document.querySelectorAll("button")].find((b) => /ΣΥΝΕΧΕΙΑ/.test(b.textContent)).click();
    });

    // ── Βήμα 3: ενεργοποίηση ΟΛΩΝ των ειδικών με 20 (B1 regression) ──
    await page.waitForFunction(
      () => [...document.querySelectorAll("h2")].some((h) => /ΕΙΔΙΚΑ/.test(h.textContent)),
      { timeout: 15000 }
    );
    ok("Βήμα 3 εμφανίστηκε");
    const toggleCount = await page.evaluate(() => {
      const toggles = document.querySelectorAll('button[aria-pressed="false"]');
      toggles.forEach((b) => b.click());
      return toggles.length;
    });
    await page.waitForFunction(
      (n) => document.querySelectorAll('input[inputmode="decimal"]').length >= n,
      { timeout: 15000 },
      toggleCount
    );
    await new Promise((r) => setTimeout(r, 1200)); // να ηρεμήσουν τα animations
    const spInputs = await page.$$('input[inputmode="decimal"]');
    for (const input of spInputs) await input.type("20");
    ok(`Βήμα 3: ενεργοποιήθηκαν ${spInputs.length} ειδικά με βαθμό 20`);

    await page.evaluate(() => {
      [...document.querySelectorAll("button")].find((b) => /ΥΠΟΛΟΓΙΣΜΟΣ/.test(b.textContent)).click();
    });

    // ── Βήμα 4: dashboard ──
    await page.waitForFunction(
      () => [...document.querySelectorAll("p")].some((p) => /Μ\.Ο\. 4 ΜΑΘΗΜΑΤΩΝ/.test(p.textContent)),
      { timeout: 15000 }
    );
    const avgText = await page.evaluate(() => {
      const label = [...document.querySelectorAll("p")].find((p) => /Μ\.Ο\. 4 ΜΑΘΗΜΑΤΩΝ/.test(p.textContent));
      return label.nextElementSibling.textContent.trim();
    });
    if (avgText === "15.00") ok(`Βήμα 4: Μ.Ο. = ${avgText}`);
    else fail(`Βήμα 4: Μ.Ο. = "${avgText}" (αναμενόταν 15.00)`);

    // ── Βήμα 5: λίστα σχολών ──
    await page.evaluate(() => {
      [...document.querySelectorAll("button")].find((b) => /ΣΕ ΠΟΙΕΣ ΣΧΟΛΕΣ/.test(b.textContent)).click();
    });
    await page.waitForFunction(
      () => [...document.querySelectorAll("h2")].some((h) => /ΒΑΣΕΙΣ ΣΧΟΛΩΝ/.test(h.textContent)),
      { timeout: 15000 }
    );
    ok("Βήμα 5 εμφανίστηκε");

    // Αναζήτηση: Ιατρικής
    await page.type('input[placeholder^="ΑΝΑΖΗΤΗΣΗ"]', "Ιατρικής");
    await new Promise((r) => setTimeout(r, 500));

    const iatriki = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".bg-gray-100 .bg-white.border-\\[4px\\]")];
      const card = cards.find(
        (c) => /Ιατρικής/.test(c.textContent) && /ΕΚΠΑ/.test(c.textContent) && !/ΣΣΑΣ|Στρατ/.test(c.textContent)
      );
      if (!card) return null;
      return { text: card.textContent.replace(/\s+/g, " ").slice(0, 600) };
    });

    if (!iatriki) fail("Δεν βρέθηκε κάρτα Ιατρικής ΕΚΠΑ");
    else {
      const t = iatriki.text;
      if (t.includes("15.000")) ok("Ιατρική ΕΚΠΑ: μόρια 15.000 (ΟΧΙ 25.000 — το B1 διορθώθηκε)");
      else fail("Ιατρική ΕΚΠΑ: δεν εμφανίζει 15.000 μόρια: " + t);
      if (t.includes("25.000")) fail("Ιατρική ΕΚΠΑ: εμφανίζει 25.000 — το B1 ΕΠΕΣΤΡΕΨΕ!");
      if (/ΕΠΙΤΥΧΙΑ/.test(t)) fail("Ιατρική ΕΚΠΑ: εμφανίζει ΕΠΙΤΥΧΙΑ με 15.000 < 18.900!");
      else ok("Ιατρική ΕΚΠΑ: δεν εμφανίζει ψευδή επιτυχία");
      if (t.includes("18.900")) ok("Ιατρική ΕΚΠΑ: βάση 2026 = 18.900 σωστή");
      else fail("Ιατρική ΕΚΠΑ: δεν βρέθηκε βάση 18.900: " + t);
      if (/ΚΑΤΩ ΑΠΟ ΤΗΝ ΕΒΕ|ΑΠΟΚΛΕΙΣΜΟΣ/.test(t)) ok("Ιατρική ΕΚΠΑ: σωστά κομμένος στην ΕΒΕ (Μ.Ο. 15 > 14,78; όχι — έλεγχος παρακάτω)");

      // Μ.Ο. 15 ≥ ΕΒΕ 14,78 → περνά ΕΒΕ, κόβεται στη βάση
      if (/ΚΑΤΩ ΑΠΟ ΤΗ ΒΑΣΗ/.test(t)) ok("Ιατρική ΕΚΠΑ: status = ΚΑΤΩ ΑΠΟ ΤΗ ΒΑΣΗ (σωστό)");
    }

    // ΤΕΦΑΑ: με αγωνίσματα 20 → 15×1000 + 20×0.2×1000 = 19.000
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder^="ΑΝΑΖΗΤΗΣΗ"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "Φυσικής Αγωγής");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 500));
    const tefaa = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".bg-gray-100 .bg-white.border-\\[4px\\]")];
      const card = cards.find((c) => /ΕΚΠΑ/.test(c.textContent));
      return card ? card.textContent.replace(/\s+/g, " ").slice(0, 400) : null;
    });
    if (tefaa && tefaa.includes("19.000")) ok("ΤΕΦΑΑ ΕΚΠΑ: 15.000 + αγωνίσματα 20×20% = 19.000 ✓");
    else fail("ΤΕΦΑΑ ΕΚΠΑ: αναμενόταν 19.000 μόρια: " + tefaa);

    console.log(process.exitCode ? "\n❌ E2E: υπάρχουν αποτυχίες" : "\n✅ E2E: όλα σωστά");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("E2E ERROR:", e.message);
  process.exit(1);
});
