// Top-level categories shown on the home screen.
// `ready: false` categories are shown as "coming soon" per the roadmap.

export const CATEGORIES = [
  {
    id: 'constitution',
    title: 'Constitution & Rights',
    blurb: 'Your fundamental rights — life, dignity, liberty, fair hearing, privacy.',
    icon: 'ScrollText',
    ready: true,
  },
  {
    id: 'traffic',
    title: 'Traffic Laws & Fines',
    blurb: 'FRSC offences, fines and penalty points — searchable.',
    icon: 'Car',
    ready: true,
  },
  {
    id: 'powers',
    title: 'Federal & State Powers',
    blurb: 'What the Federal Government controls, and what your state controls.',
    icon: 'Landmark',
    ready: true,
  },
  {
    id: 'tenancy',
    title: 'Tenancy & Housing',
    blurb: 'Rent, eviction and landlord–tenant rules.',
    icon: 'Home',
    ready: false,
  },
  {
    id: 'employment',
    title: 'Employment',
    blurb: 'Contracts, termination and workers’ rights.',
    icon: 'Briefcase',
    ready: false,
  },
  {
    id: 'business',
    title: 'Business & CAC',
    blurb: 'Registering and running a business.',
    icon: 'Building2',
    ready: false,
  },
  {
    id: 'consumer',
    title: 'Consumer Rights',
    blurb: 'Faulty goods, refunds and services.',
    icon: 'ShoppingBag',
    ready: false,
  },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id)
}
