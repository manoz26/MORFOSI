// src/sanity/schemaTypes/facilityPhoto.ts
import { defineType, defineField } from 'sanity'

export const facilityPhotoType = defineType({
  name: 'facilityPhoto',
  title: 'Φωτογραφίες Χώρου',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος (π.χ. Αίθουσα Α1)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Φωτογραφία Χώρου',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Σύντομη Περιγραφή (προαιρετικό)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Σειρά Εμφάνισης',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'featured',
      title: 'Στις 6 βασικές φωτογραφίες',
      description:
        'Φαίνονται πάντα στη σελίδα «Σχετικά». Όλες οι υπόλοιπες ανοίγουν μόνο με το κουμπί «Δείτε όλες». Αν είναι σημειωμένες λιγότερες από 6, συμπληρώνονται με τις επόμενες κατά σειρά.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hideFromMain',
      title: 'Μόνο στο «Δείτε όλες τις φωτογραφίες»',
      description:
        'Για φωτογραφίες πολύ παρόμοιες με άλλες: δεν εμφανίζονται στην κύρια gallery, μόνο όταν ο επισκέπτης ανοίξει το «Δείτε όλες».',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'photo', featured: 'featured', hidden: 'hideFromMain', order: 'order' },
    prepare: ({ title, media, featured, hidden, order }) => ({
      title,
      media,
      subtitle: `${featured ? '★ Βασική' : hidden ? 'Μόνο στο «Δείτε όλες»' : 'Στο «Δείτε όλες»'} · σειρά ${order ?? '-'}`,
    }),
  },
})
