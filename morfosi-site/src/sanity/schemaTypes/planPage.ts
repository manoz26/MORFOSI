// src/sanity/schemaTypes/planPage.ts
import { defineType, defineField } from 'sanity'

export const planPageType = defineType({
  name: 'planPage',
  title: 'Πλάνο Σπουδών',
  type: 'document',
  fields: [
    defineField({
      name: 'level',
      title: 'Εκπαιδευτική Βαθμίδα',
      type: 'string',
      options: {
        list: [
          { title: 'Γυμνάσιο', value: 'gymnasio' },
          { title: 'Λύκειο', value: 'lykeio' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Υπότιτλος / Slogan',
      type: 'string',
      description: 'Μια σύντομη φράση-slogan για τη βαθμίδα (π.χ. "Χτίζουμε γερές βάσεις")',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Κύρια Περιγραφή',
      type: 'text',
      rows: 4,
      description: 'Η κύρια δεσκριπτιόν της εκπαιδευτικής βαθμίδας',
    }),
    defineField({
      name: 'features',
      title: 'Χαρακτηριστικά Προγράμματος',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Emoji Εικονίδιο', type: 'string', description: 'π.χ. 📚, 🎯, ✅' }),
            defineField({ name: 'title', title: 'Τίτλος', type: 'string' }),
            defineField({ name: 'description', title: 'Περιγραφή', type: 'text', rows: 2 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'subjects',
      title: 'Μαθήματα που διδάσκονται',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'subjectName', title: 'Όνομα Μαθήματος', type: 'string' }),
            defineField({ name: 'hoursPerWeek', title: 'Ώρες/Εβδομάδα', type: 'number' }),
            defineField({ name: 'category', title: 'Κατηγορία', type: 'string', options: { list: ['Θετικά', 'Θεωρητικά', 'Γλώσσες', 'Γενική Παιδεία', 'Ανθρωπιστικών Σπουδών', 'Θετικών Σπουδών', 'Σπουδών Υγείας', 'Οικονομίας & Πληροφορικής'] } }),
          ],
        },
      ],
    }),
    defineField({
      name: 'methodology',
      title: 'Μεθοδολογία / Τρόπος Διδασκαλίας',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'stats',
      title: 'Στατιστικά',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Τιμή (π.χ. 7) — μόνο πραγματικά νούμερα', type: 'string' }),
            defineField({ name: 'label', title: 'Ετικέτα (π.χ. Επιτυχία)', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'CTA Κείμενο',
      type: 'string',
      description: 'Κείμενο του κουμπιού CTA (π.χ. "Εγγράψου Τώρα")',
    }),
  ],
  preview: {
    select: { title: 'level', subtitle: 'tagline' },
    prepare({ title, subtitle }) {
      const labels: Record<string, string> = {
        gymnasio: '🏫 Γυμνάσιο',
        lykeio: '🎓 Λύκειο',
      }
      return { title: labels[title] || title, subtitle }
    },
  },
})
