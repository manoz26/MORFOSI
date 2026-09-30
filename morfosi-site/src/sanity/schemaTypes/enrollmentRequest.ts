// src/sanity/schemaTypes/enrollmentRequest.ts
import { defineType, defineField } from 'sanity'

/**
 * Αίτηση εγγραφής από τη φόρμα του /contact.
 *
 * Τα στοιχεία που συμπλήρωσε ο κηδεμόνας είναι `readOnly`: είναι αρχείο του τι
 * δηλώθηκε, όχι πεδία προς επεξεργασία. Ό,τι αλλάζει εσωτερικά (κατάσταση,
 * σημειώσεις γραμματείας) είναι σε ξεχωριστό group.
 */
export const enrollmentRequestType = defineType({
  name: 'enrollmentRequest',
  title: 'Αιτήσεις Εγγραφής',
  type: 'document',
  groups: [
    { name: 'submitted', title: 'Τι δήλωσε ο κηδεμόνας', default: true },
    { name: 'internal', title: 'Εσωτερική διαχείριση' },
  ],
  fields: [
    // ─── Μαθητής ───────────────────────────────────────────────────────────
    defineField({
      name: 'studentName',
      title: 'Ονοματεπώνυμο Μαθητή',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'studentClass',
      title: 'Τάξη',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Ημερομηνία Γέννησης',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'school',
      title: 'Σχολείο',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),

    // ─── Κηδεμόνας ─────────────────────────────────────────────────────────
    defineField({
      name: 'parentName',
      title: 'Ονοματεπώνυμο Κηδεμόνα',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'parentPhone',
      title: 'Τηλέφωνο',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'parentEmail',
      title: 'Email',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'parentRelation',
      title: 'Σχέση με τον μαθητή',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),

    // ─── Πρόγραμμα ─────────────────────────────────────────────────────────
    defineField({
      name: 'program',
      title: 'Πρόγραμμα που επέλεξε',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'previousGrade',
      title: 'Περσινός Μ.Ο.',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'howFound',
      title: 'Πώς μας βρήκε',
      type: 'string',
      group: 'submitted',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Σχόλια κηδεμόνα',
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

    // ─── Εσωτερικά ─────────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Κατάσταση',
      type: 'string',
      group: 'internal',
      initialValue: 'new',
      options: {
        list: [
          { title: '🔴 Νέα — δεν έχει απαντηθεί', value: 'new' },
          { title: '🟡 Επικοινωνήσαμε', value: 'contacted' },
          { title: '🟢 Εγγράφηκε', value: 'enrolled' },
          { title: '⚪ Δεν προχώρησε', value: 'declined' },
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
      description: 'Δεν εμφανίζεται πουθενά δημόσια.',
      type: 'text',
      group: 'internal',
    }),
  ],

  orderings: [
    {
      title: 'Νεότερες πρώτα',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      studentName: 'studentName',
      studentClass: 'studentClass',
      parentPhone: 'parentPhone',
      status: 'status',
      submittedAt: 'submittedAt',
      suspectedSpam: 'suspectedSpam',
    },
    prepare({ studentName, studentClass, parentPhone, status, submittedAt, suspectedSpam }) {
      const badge =
        { new: '🔴', contacted: '🟡', enrolled: '🟢', declined: '⚪' }[status as string] ?? '🔴'
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : ''
      return {
        title: `${badge}${suspectedSpam ? ' ⚠️' : ''} ${studentName || 'Χωρίς όνομα'}`,
        subtitle: [studentClass, parentPhone, date].filter(Boolean).join(' · '),
      }
    },
  },
})
