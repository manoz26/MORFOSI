// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// Placeholders as requested. The user will replace these later.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bbuv8qjb'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  name: 'morfosi_studio',
  title: 'Μόρφωση CMS',

  projectId,
  dataset,

  plugins: [structureTool({ structure })],

  schema,
})
