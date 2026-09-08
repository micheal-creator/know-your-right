// Tenancy & Housing.
// Tenancy is mainly STATE law, so exact notice periods and procedures differ by
// state. This content explains the common position and uses the Lagos State
// Tenancy Law 2011 as a well-known reference. Always confirm your own state's law.

const SOURCE = 'State tenancy/rent laws (e.g. Lagos State Tenancy Law 2011); Recovery of Premises laws'
const VERIFIED = '2026-09-08'

export const TENANCY = [
  {
    id: 'ten-basics',
    type: 'tenancy',
    category: 'tenancy',
    title: 'Tenancy is governed by your state’s law',
    reference: 'State tenancy / rent laws',
    summary:
      'Landlord-and-tenant rules — how much notice you get, how rent may be collected, and how eviction must be done — are set by each state, so they can differ. Lagos, for example, has its own Tenancy Law. Wherever you are, a landlord must follow the legal process; they cannot simply force you out.',
    original: null,
    tags: ['tenancy', 'rent', 'landlord', 'tenant', 'state', 'housing'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-eviction',
    type: 'tenancy',
    category: 'tenancy',
    title: 'You cannot be evicted without due process',
    reference: 'Recovery of Premises / Tenancy Law',
    summary:
      'A landlord who wants you out must first give you the proper written notice to quit, then a further notice of the owner’s intention to go to court, and then obtain a court order. Locking you out, removing the roof or doors, cutting off power/water, throwing out your belongings, or using threats to force you out is unlawful — even if you owe rent.',
    original: null,
    tags: ['eviction', 'notice to quit', 'court order', 'self-help', 'lockout'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-notice',
    type: 'tenancy',
    category: 'tenancy',
    title: 'How much notice you should get',
    reference: 'e.g. Lagos Tenancy Law 2011, s.13',
    summary:
      'Where the tenancy agreement does not state otherwise, common statutory notice periods are: a week for a weekly tenant, a month for a monthly tenant, three months for a quarterly or half-yearly tenant, and six months for a yearly tenant. A tenant who stays after the term may still be entitled to notice. Your written agreement can change these periods, so read it.',
    original: null,
    tags: ['notice', 'quit', 'monthly', 'yearly', 'period'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-rent-advance',
    type: 'tenancy',
    category: 'tenancy',
    title: 'Rent, advance rent and receipts',
    reference: 'e.g. Lagos Tenancy Law 2011, s.4–5',
    summary:
      'In some states (such as Lagos) it is an offence for a landlord to demand or receive rent above a certain period in advance from a sitting or new tenant, and it is also an offence for a tenant to offer it. You are entitled to a receipt showing the date, your name, the property, the period covered and the amount paid. Keep every receipt.',
    original: null,
    tags: ['rent', 'advance', 'one year', 'receipt', 'payment'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-deposit',
    type: 'tenancy',
    category: 'tenancy',
    title: 'Caution/security deposit',
    reference: 'Tenancy agreement + state law',
    summary:
      'A caution or security deposit is meant to cover damage beyond normal wear and tear, not to be kept by default. When you leave the property in good condition, you are generally entitled to a refund. Take dated photos when you move in and out, and get the agreement to state clearly what the deposit covers.',
    original: null,
    tags: ['deposit', 'caution fee', 'security', 'refund', 'damage'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-repairs',
    type: 'tenancy',
    category: 'tenancy',
    title: 'Repairs and quiet enjoyment',
    reference: 'Tenancy agreement + common law',
    summary:
      'You are entitled to peaceably enjoy the property. The landlord is usually responsible for major/structural repairs, while tenants handle minor upkeep — but the agreement can allocate this differently. A landlord should give reasonable notice before visiting, not enter as they please.',
    original: null,
    tags: ['repairs', 'maintenance', 'quiet enjoyment', 'entry', 'notice'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'ten-agreement',
    type: 'tenancy',
    category: 'tenancy',
    title: 'Get it in writing',
    reference: 'Practical guide',
    summary:
      'Insist on a written tenancy agreement that states the rent and what it covers, the duration, notice periods, who pays for repairs, and the deposit terms. A clear agreement protects both sides and is your strongest evidence if a dispute reaches court.',
    original: null,
    tags: ['agreement', 'contract', 'lease', 'terms', 'evidence'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
]
