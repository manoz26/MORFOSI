// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'

import { postType } from './post'
import { bookType } from './book'
import { studentSuccessType } from './studentSuccess'
import { teacherType } from './teacher'
import { programType } from './program'
import { siteSettingsType } from './siteSettings'
import { facilityPhotoType } from './facilityPhoto'
import { examMaterialType } from './examMaterial'
import { planPageType } from './planPage'
import { successYearType } from './successYear'
import { eventPhotoType } from './eventPhoto'
import { enrollmentRequestType } from './enrollmentRequest'
import { contactMessageType } from './contactMessage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    bookType,
    studentSuccessType,
    teacherType,
    programType,
    siteSettingsType,
    facilityPhotoType,
    examMaterialType,
    planPageType,
    successYearType,
    eventPhotoType,
    // Παράγονται από τις φόρμες του site, δεν δημιουργούνται με το χέρι.
    enrollmentRequestType,
    contactMessageType,
  ],
}
