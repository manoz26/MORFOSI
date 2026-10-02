import { CONTACT_EMAIL } from "@/lib/site";
import { Metadata } from "next";
import { client } from "@/sanity/client";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου | Εκπαιδευτικός Οργανισμός Μόρφωση",
  description: "Πολιτική απορρήτου και προστασίας προσωπικών δεδομένων (GDPR) του Εκπαιδευτικού Οργανισμού Μόρφωση.",
};

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  contactEmail,
  contactPhone
}`;

export default async function PrivacyPage() {
  const settings = await client.fetch(SETTINGS_QUERY);

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="bg-white p-8 md:p-16 shadow-sm border border-gray-200 rounded-sm">
          <div className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Πολιτική Προστασίας Απορρήτου
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="font-medium text-gray-900 mb-8">
              Ο Εκπαιδευτικός Οργανισμός "Μόρφωση" αποδίδει ύψιστη σημασία στην προστασία της ιδιωτικότητας και των προσωπικών δεδομένων. Η παρούσα Δήλωση εξηγεί τον τρόπο με τον οποίο συλλέγουμε, επεξεργαζόμαστε και προστατεύουμε τις πληροφορίες των χρηστών της ιστοσελίδας, σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR - Κανονισμός (ΕΕ) 2016/679).
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">1. Συλλογή Δεδομένων</h2>
            <p>
              Κατά την περιήγησή σας στην ιστοσελίδα και ιδίως κατά τη χρήση των φορμών επικοινωνίας ή προεγγραφής, ενδέχεται να συλλέξουμε τα ακόλουθα δεδομένα προσωπικού χαρακτήρα:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Στοιχεία Ταυτοποίησης:</strong> Ονοματεπώνυμο μαθητή και νόμιμου κηδεμόνα.</li>
              <li><strong>Στοιχεία Επικοινωνίας:</strong> Διεύθυνση ηλεκτρονικού ταχυδρομείου (email), αριθμός τηλεφώνου.</li>
              <li><strong>Εκπαιδευτικά Στοιχεία:</strong> Σχολική τάξη, εκπαιδευτικό ίδρυμα φοίτησης, επιλεγμένη κατεύθυνση σπουδών.</li>
              <li><strong>Πρόσθετες Πληροφορίες:</strong> Οποιαδήποτε πληροφορία περιλαμβάνετε αυτοβούλως στα ελεύθερα πεδία κειμένου ("Σχόλια / Μήνυμα").</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">2. Σκοπός και Νόμιμη Βάση Επεξεργασίας</h2>
            <p>
              Η επεξεργασία των προσωπικών σας δεδομένων πραγματοποιείται αποκλειστικά για τους ακόλουθους σκοπούς:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Τη διαχείριση και διεκπεραίωση του αιτήματος επικοινωνίας ή της αίτησης εγγραφής σας.</li>
              <li>Την περαιτέρω ακαδημαϊκή ενημέρωση και οργάνωση του διδακτικού έργου.</li>
              <li>Τη συμμόρφωση του Οργανισμού με τις εθνικές νομικές ή κανονιστικές υποχρεώσεις.</li>
            </ul>
            <p className="mt-4">
              Η νόμιμη βάση επεξεργασίας βασίζεται στη συγκατάθεσή σας (η οποία παρέχεται με την υποβολή της σχετικής φόρμας) καθώς και στην αναγκαιότητα εκτέλεσης προπαρασκευαστικών ενεργειών προς τη σύναψη σύμβασης εκπαιδευτικών υπηρεσιών.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">3. Ασφάλεια και Εχεμύθεια</h2>
            <p>
              Λαμβάνουμε τα κατάλληλα τεχνικά και οργανωτικά μέτρα (TLS/SSL κρυπτογράφηση, συστήματα αυθεντικοποίησης και ελέγχου πρόσβασης) προκειμένου να διασφαλίσουμε ότι τα προσωπικά σας δεδομένα προστατεύονται έναντι μη εξουσιοδοτημένης πρόσβασης, αλλοίωσης, τυχαίας απώλειας ή παράνομης καταστροφής. Μόνο αυστηρά εξουσιοδοτημένο προσωπικό του Φροντιστηρίου έχει πρόσβαση σε αυτά.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">4. Χρόνος Τήρησης Δεδομένων</h2>
            <p>
              Τα δεδομένα σας διατηρούνται μόνο για το απολύτως απαραίτητο χρονικό διάστημα επίτευξης των ως άνω σκοπών, εφόσον δεν υφίσταται αντίθετη νομική, φορολογική ή λογιστική υποχρέωση περαιτέρω διατήρησής τους.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">5. Πολιτική Cookies</h2>
            <p>
              Η Ιστοσελίδα χρησιμοποιεί "Cookies" και συναφείς τεχνολογίες. Τα Cookies είναι μικρά αρχεία δεδομένων που αποθηκεύονται στον φυλλομετρητή (browser) σας.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
              <li><strong>Απολύτως Απαραίτητα Cookies:</strong> Βασικά για τη λειτουργικότητα του site (π.χ. αποθήκευση της συγκατάθεσής σας στο banner των cookies).</li>
              <li><strong>Cookies Επιδόσεων (Analytics):</strong> Χρησιμοποιούνται (π.χ. Vercel Web Analytics) για να κατανοήσουμε πώς οι επισκέπτες αλληλεπιδρούν με τον ιστότοπο, παρέχοντας πληροφορίες για τον αριθμό των επισκεπτών, το ποσοστό εγκατάλειψης, κ.λπ. σε ανώνυμη μορφή.</li>
            </ul>
            <p>
              Οι χρήστες μπορούν να διαχειριστούν ή να διαγράψουν τα cookies μέσα από τις ρυθμίσεις του προγράμματος περιήγησής τους ανά πάσα στιγμή.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">6. Τα Δικαιώματά σας</h2>
            <p>Σύμφωνα με τον Κανονισμό GDPR, διατηρείτε τα εξής δικαιώματα:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Πρόσβασης:</strong> Να ενημερωθείτε εάν και πώς επεξεργαζόμαστε δεδομένα σας.</li>
              <li><strong>Διόρθωσης:</strong> Να ζητήσετε την επικαιροποίηση ελλιπών ή εσφαλμένων στοιχείων.</li>
              <li><strong>Διαγραφής ("Λήθη"):</strong> Να ζητήσετε τη διαγραφή των στοιχείων σας, υπό τις εκ του νόμου προϋποθέσεις.</li>
              <li><strong>Ανάκλησης της συγκατάθεσης:</strong> Οποτεδήποτε, χωρίς να θίγεται η νομιμότητα της επεξεργασίας που βασίστηκε σε αυτήν πριν την ανάκληση.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 border-b pb-2">7. Αρμόδιος Επικοινωνίας</h2>
            <p>
              Για την άσκηση των δικαιωμάτων σας και για οποιαδήποτε διευκρίνιση περί της παρούσας Πολιτικής, παρακαλούμε επικοινωνήστε μαζί μας:
            </p>
            <div className="bg-gray-100 p-6 mt-4 border border-gray-200">
              <p className="m-0">Εκπαιδευτικός Οργανισμός "Μόρφωση"</p>
              <p className="m-0 text-brand-teal font-medium">
                <a href={`mailto:${settings?.contactEmail || CONTACT_EMAIL}`} className="no-underline text-brand-teal hover:underline">{settings?.contactEmail || CONTACT_EMAIL}</a>
              </p>
              <p className="m-0 text-gray-600">
                Τηλέφωνο Επικοινωνίας: <a href={`tel:${settings?.contactPhone || "210 0000000"}`} className="no-underline text-gray-600 hover:text-gray-900">{settings?.contactPhone || "210 0000000"}</a>
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mt-16 pt-6 border-t border-gray-200">
              Τελευταία Ενημέρωση: 1 Σεπτεμβρίου {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
