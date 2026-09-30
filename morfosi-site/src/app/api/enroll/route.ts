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

const enrollSchema = z
  .object({
    studentName: z.string().min(2, "Το όνομα μαθητή είναι πολύ μικρό").max(100),
    studentClass: z.string().min(1, "Επιλέξτε τάξη"),
    dateOfBirth: z.string().optional().or(z.literal("")),
    school: z.string().max(100).optional().or(z.literal("")),
    parentName: z.string().min(2, "Το όνομα κηδεμόνα είναι πολύ μικρό").max(100),
    parentPhone: z.string().min(8, "Μη έγκυρο τηλέφωνο").max(20),
    parentEmail: z.string().email("Μη έγκυρο email"),
    parentRelation: z.string().default("Γονέας"),
    program: z.string().min(1, "Επιλέξτε πρόγραμμα"),
    previousGrade: z.string().max(10).optional().or(z.literal("")),
    howFound: z.string().optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    agreeTerms: z.boolean().refine((val) => val === true, "Πρέπει να συμφωνήσετε με τους όρους"),
  })
  .merge(guardFieldsSchema);

export async function POST(req: Request) {
  try {
    if (!withinRateLimit("enroll", clientIp(req))) {
      return NextResponse.json(
        { error: "Έχετε υπερβεί το όριο των 6 αιτήσεων. Δοκιμάστε ξανά σε 1 λεπτό." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = enrollSchema.parse(body);

    // Σιωπηλή απόρριψη: το bot βλέπει success και δεν ξαναδοκιμάζει αλλιώς.
    // Σιωπηλή απόρριψη μόνο στο honeypot: το bot βλέπει success και δεν ξαναδοκιμάζει αλλιώς.
    if (isHoneypotTripped({ _hp: data._hp })) {
      return NextResponse.json({ success: true, message: "Η αίτηση αποθηκεύτηκε επιτυχώς" });
    }

    if (!hasWriteAccess) {
      // Χωρίς token δεν υπάρχει τρόπος να σωθεί η αίτηση. Καλύτερα να το δει ο
      // χρήστης και να τηλεφωνήσει, παρά να νομίζει ότι στάλθηκε και να χαθεί.
      console.error("[enroll] Λείπει το SANITY_API_WRITE_TOKEN — η αίτηση ΔΕΝ αποθηκεύτηκε.");
      return NextResponse.json(
        { error: "Τεχνικό πρόβλημα στην υποβολή. Καλέστε μας στο 210 506 3610." },
        { status: 503 }
      );
    }

    await writeClient.create({
      _type: "enrollmentRequest",
      studentName: data.studentName,
      studentClass: data.studentClass,
      dateOfBirth: data.dateOfBirth || undefined,
      school: data.school || undefined,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail,
      parentRelation: data.parentRelation,
      program: data.program,
      previousGrade: data.previousGrade || undefined,
      howFound: data.howFound || undefined,
      notes: data.notes || undefined,
      submittedAt: new Date().toISOString(),
      status: "new",
      // Αποθηκεύεται κανονικά· το flag είναι μόνο ένδειξη για τη γραμματεία.
      suspectedSpam: isSuspiciouslyFast({ _t: data._t }) || undefined,
    });

    return NextResponse.json(
      { success: true, message: "Η αίτηση αποθηκεύτηκε επιτυχώς" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Μη έγκυρα δεδομένα συμπλήρωσης", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    // Το σφάλμα καταγράφεται ώστε μια αποτυχημένη εγγραφή να μην περάσει απαρατήρητη.
    console.error("[enroll] Αποτυχία αποθήκευσης:", error);
    return NextResponse.json(
      { error: "Τεχνικό πρόβλημα στην υποβολή. Καλέστε μας στο 210 506 3610." },
      { status: 500 }
    );
  }
}
