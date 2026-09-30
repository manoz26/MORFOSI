import type { StructureResolver } from 'sanity/structure'

/**
 * Προσαρμοσμένο μενού του Studio.
 *
 * Η προεπιλογή του Sanity δείχνει όλους τους τύπους σε μία αλφαβητική λίστα.
 * Με 14 τύπους, οι αιτήσεις εγγραφής — το μόνο πράγμα που πρέπει να ελέγχεται
 * καθημερινά — θα κατέληγαν κάπου στη μέση. Εδώ μπαίνουν πρώτες, χωρισμένες σε
 * «νέες» και «όλες», ώστε ο έλεγχος να είναι ένα κλικ.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Μόρφωση')
    .items([
      S.listItem()
        .title('📥 Αιτήσεις Εγγραφής')
        .child(
          S.list()
            .title('Αιτήσεις Εγγραφής')
            .items([
              S.listItem()
                .title('🔴 Νέες — χρειάζονται απάντηση')
                .child(
                  S.documentList()
                    .title('Νέες αιτήσεις')
                    .filter('_type == "enrollmentRequest" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Όλες οι αιτήσεις')
                .child(
                  S.documentList()
                    .title('Όλες οι αιτήσεις')
                    .filter('_type == "enrollmentRequest"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('✉️ Μηνύματα Επικοινωνίας')
        .child(
          S.list()
            .title('Μηνύματα')
            .items([
              S.listItem()
                .title('🔴 Νέα — χρειάζονται απάντηση')
                .child(
                  S.documentList()
                    .title('Νέα μηνύματα')
                    .filter('_type == "contactMessage" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Όλα τα μηνύματα')
                .child(
                  S.documentList()
                    .title('Όλα τα μηνύματα')
                    .filter('_type == "contactMessage"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // Το siteSettings είναι μοναδικό έγγραφο — ανοίγει κατευθείαν αντί για λίστα του ενός.
      S.listItem()
        .title('⚙️ Ρυθμίσεις Site')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      // Το υπόλοιπο περιεχόμενο, με τη συνηθισμένη συμπεριφορά.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return !['enrollmentRequest', 'contactMessage', 'siteSettings'].includes(id ?? '')
      }),
    ])
