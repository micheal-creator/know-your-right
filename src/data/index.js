// Reference entries are now served by the content store (seeded from the static
// data files, editable via the CMS). This module keeps the original import
// surface so views don't need to change.
export {
  getEntries,
  getEntry,
  entriesByCategory,
  getTraffic,
  searchEntries,
} from '../store/contentStore.js'
