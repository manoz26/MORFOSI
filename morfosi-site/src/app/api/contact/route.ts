import { NextResponse } from "next/server";
import { z } from "zod";
import { writeClient, hasWriteAccess } from "@/sanity/writeClient";
import {
  guardFieldsSchema,
  isHoneypotTripped,
  isSuspiciouslyFast,
  withinRateLimit,
  clientIp,
} from "@/lib/formGuard";

const contactSchema = z
  .object({
    name: z.string().min(2, "Το όνομα είναι πολύ μικρό").max(100),
    phone: z.string().max(20).optional().or(z.literal("")),
    email: z.string().email("Μη έγκυρο email"),
    subject: z.string().min(1, "Επιλέξτε θέμα"),
    message: z.string().min(10, "Το μήνυμα είναι πολύ μικρό").max(5000),
  })
  .merge(guardFieldsSchema);

export async function POST(req: Request) {
  try {
    if (!withinRateLimit("contact", clientIp(req))) {
      return NextResponse.json(
        { error: "Έχετε υπερβεί το όριο των 6 μηνυμάτων. Δοκιμάστε ξανά σε 1 λεπτό." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = contactSchema.parse(body);

    // Σιωπηλή απόρριψη μόνο στο honeypot — βλ. σχόλιο στο formGuard.
    if (isHoneypotTripped({ _hp: data._hp })) {
      return NextResponse.json({ success: true, message: "Το μήνυμα εστάλη με επιτυχία" });
    }

    if (!hasWriteAccess) {
      console.error("[contact] Λείπει το SANITY_API_WRITE_TOKEN — το μήνυμα ΔΕΝ αποθηκεύτηκε.");
      return NextResponse.json(
        { error: "Τεχνικό πρόβλημα στην αποστολή. Καλέστε μας στο 210 506 3610." },
        { status: 503 }
      );
    }

    await writeClient.create({
      _type: "contactMessage",
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message,
      submittedAt: new Date().toISOString(),
      status: "new",
      suspectedSpam: isSuspiciouslyFast({ _t: data._t }) || undefined,
    });

    return NextResponse.json(
      { success: true, message: "Το μήνυμα εστάλη με επιτυχία" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Μη έγκυρα δεδομένα συμπλήρωσης", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[contact] Αποτυχία αποθήκευσης:", error);
    return NextResponse.json(
      { error: "Τεχνικό πρόβλημα στην αποστολή. Καλέστε μας στο 210 506 3610." },
      { status: 500 }
    );
  }
}
