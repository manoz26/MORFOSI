// src/sanity/schemaTypes/studentSuccess.ts
import { defineType, defineField } from 'sanity'

export const studentSuccessType = defineType({
  name: 'studentSuccess',
  title: 'Επιτυχόντες & Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'studentName',
      title: 'Ονοματεπώνυμο Μαθητή',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Έτος Επιτυχίας',
      type: 'number',
    }),
    defineField({
      name: 'university',
      title: 'Σχολή Εισαγωγής / Φοίτησης',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Κριτική / Δήλωση',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Φωτογραφία',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isTopScorer',
      title: 'Ήταν από τους Πρώτους;',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'approved',
      title: 'Εγκεκριμένο για δημοσίευση στην Αρχική;',
      description:
        'Μένει κλειστό μέχρι να ελεγχθεί το κείμενο. Μόνο τα εγκεκριμένα εμφανίζονται δημόσια στην ενότητα «Ιστορίες Επιτυχίας».',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'studentName', university: 'university', year: 'year', approved: 'approved', media: 'photo' },
    prepare({ title, university, year, approved, media }) {
      return {
        title: `${approved ? '✓' : '⛔'} ${title}`,
        subtitle: [university, year].filter(Boolean).join(' · ') || 'Χωρίς σχολή/έτος',
        media,
      }
    },
  },
})
