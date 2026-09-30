// src/sanity/schemaTypes/contactMessage.ts
import { defineType, defineField } from 'sanity'

/**
 * Μήνυμα από τη φόρμα επικοινωνίας. Ίδια λογική με το `enrollmentRequest`:
 * ό,τι έγραψε ο επισκέπτης μένει `readOnly` ως αρχείο.
 */
export const contactMessageType = defineType({
  name: 'contactMessage',
  title: 'Μηνύματα Επικοινωνίας',
  type: 'document',
  groups: [
    { name: 'submitted', title: 'Το μήνυμα', default: true },
    { name: 'internal', title: 'Εσωτερική διαχείριση' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Ονοματεπώνυμο',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'Τηλέφωνο',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'subject',
      title: 'Θέμα',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Μήνυμα',
      type: 'text',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Ημερομηνία υποβολής',
      type: 'datetime',
      group: 'submitted',
      readOnly: true,
    }),

    defineField({
      name: 'status',
      title: 'Κατάσταση',
      type: 'string',
      group: 'internal',
      initialValue: 'new',
      options: {
        list: [
          { title: '🔴 Νέο — δεν έχει απαντηθεί', value: 'new' },
          { title: '🟢 Απαντήθηκε', value: 'replied' },
          { title: '⚪ Αρχειοθετημένο', value: 'archived' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'suspectedSpam',
      title: 'Ύποπτο για spam',
      description:
        'Συμπληρώθηκε ασυνήθιστα γρήγορα. Αποθηκεύτηκε κανονικά — ελέγξτε το πριν το αγνοήσετε, μπορεί να είναι πραγματικό.',
      type: 'boolean',
      group: 'internal',
      readOnly: true,
    }),
    defineField({
      name: 'internalNotes',
      title: 'Σημειώσεις γραμματείας',
      type: 'text',
      group: 'internal',
    }),
  ],

  orderings: [
    {
      title: 'Νεότερα πρώτα',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      name: 'name',
      subject: 'subject',
      status: 'status',
      submittedAt: 'submittedAt',
      suspectedSpam: 'suspectedSpam',
    },
    prepare({ name, subject, status, submittedAt, suspectedSpam }) {
      const badge = { new: '🔴', replied: '🟢', archived: '⚪' }[status as string] ?? '🔴'
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : ''
      return {
        title: `${badge}${suspectedSpam ? ' ⚠️' : ''} ${name || 'Χωρίς όνομα'}`,
        subtitle: [subject, date].filter(Boolean).join(' · '),
      }
    },
  },
})
