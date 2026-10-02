import { CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

/**
 * Στέλνει κάθε υποβολή φόρμας ως email στη γραμματεία, μέσω Resend
 * (https://resend.com). Ο αποστολέας είναι στο δικό μας domain, οπότε δεν
 * χρειάζεται καμία ενέργεια από τον παραλήπτη· το Reply-To είναι ο γονέας,
 * άρα ένα απλό «Απάντηση» πηγαίνει κατευθείαν σε αυτόν.
 *
 * Env (Vercel):
 *   RESEND_API_KEY  — υποχρεωτικό· χωρίς αυτό δεν στέλνεται τίποτα
 *   NOTIFY_EMAIL    — προαιρετικό, αλλιώς CONTACT_EMAIL (μπορεί και λίστα με κόμμα)
 *   NOTIFY_FROM     — προαιρετικό, αλλιώς forma@<domain>
 */
const API_KEY = process.env.RESEND_API_KEY;
const TO = (process.env.NOTIFY_EMAIL || CONTACT_EMAIL).split(",").map((s) => s.trim());
const FROM = process.env.NOTIFY_FROM || `Ιστοσελίδα Μόρφωση <forma@${SITE_DOMAIN}>`;

export const hasEmailNotify = Boolean(API_KEY);

type Row = [label: string, value: string | undefined | null];

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function cell(label: string, value: string) {
  let v = esc(value).replace(/\n/g, "<br>");
  if (/τηλ/i.test(label)) v = `<a href="tel:${esc(value.replace(/[^\d+]/g, ""))}">${v}</a>`;
  if (/email/i.test(label)) v = `<a href="mailto:${esc(value)}">${v}</a>`;
  return `<tr><td style="padding:10px 14px;border-bottom:1px solid #ddd;color:#555;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #ddd;font-weight:bold">${v}</td></tr>`;
}

/** Επιστρέφει true μόνο αν το email έφυγε. Δεν πετάει ποτέ. */
export async function sendNotification({
  subject,
  heading,
  rows,
  replyTo,
}: {
  subject: string;
  heading: string;
  rows: Row[];
  replyTo?: string;
}): Promise<boolean> {
  if (!API_KEY) {
    console.warn("[notify] Λείπει το RESEND_API_KEY — δεν στάλθηκε email.");
    return false;
  }
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]?.trim()));
  // Μεγάλα γράμματα και απλή μορφή: το διαβάζει η γραμματεία, συχνά από κινητό.
  const html = `<div style="font-family:Arial,sans-serif;font-size:18px;line-height:1.5;color:#111;max-width:640px">
<h2 style="color:#095f77;margin:0 0 16px">${esc(heading)}</h2>
<table style="border-collapse:collapse;width:100%;font-size:18px">${filled.map(([l, v]) => cell(l, v)).join("")}</table>
${replyTo ? `<p style="margin-top:20px;color:#555">Πατήστε «Απάντηση» για να απαντήσετε απευθείας στον αποστολέα.</p>` : ""}
</div>`;
  const text = `${heading}\n\n${filled.map(([l, v]) => `${l}: ${v}`).join("\n")}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: TO, subject, html, text, reply_to: replyTo || undefined }),
    });
    if (!res.ok) {
      console.error("[notify] Resend απέτυχε:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify] Σφάλμα δικτύου:", e);
    return false;
  }
}
