// Business & CAC.
// Source: Companies and Allied Matters Act (CAMA) 2020, administered by the
// Corporate Affairs Commission (CAC); Finance Acts and FIRS for tax basics.

const SOURCE = 'Companies and Allied Matters Act (CAMA) 2020; Corporate Affairs Commission (CAC); FIRS'
const VERIFIED = '2026-09-08'

export const BUSINESS = [
  {
    id: 'biz-why-register',
    type: 'business',
    category: 'business',
    title: 'Why register your business',
    reference: 'CAMA 2020',
    summary:
      'Registering with the Corporate Affairs Commission (CAC) makes your business legal to operate under a name, lets you open a corporate bank account, sign contracts, and build trust with customers and partners. Operating a business name that is not registered can attract penalties.',
    original: null,
    tags: ['register', 'cac', 'business name', 'company', 'legal'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'biz-structures',
    type: 'business',
    category: 'business',
    title: 'Which structure: business name, company or NGO',
    reference: 'CAMA 2020',
    summary:
      'Common options are: a Business Name (sole proprietor or partnership — simplest, but no separate legal personality); a Company Limited by Guarantee or Incorporated Trustees (for non-profits); and a Private Company Limited by Shares (“Ltd”), which is a separate legal person that limits the owners’ liability. Most SMEs that want protection and growth register a Limited company.',
    original: null,
    tags: ['business name', 'limited', 'ltd', 'partnership', 'trustees', 'structure'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'biz-one-person',
    type: 'business',
    category: 'business',
    title: 'You can now form a one-person company',
    reference: 'CAMA 2020, s.18(2)',
    summary:
      'Under CAMA 2020 a single person can form and run a private company — you no longer need a second shareholder or director to incorporate a small company. There is also no general statutory minimum share capital that must be paid up simply to register.',
    original:
      'As from the commencement of this Act, one person may form and incorporate a private company.',
    tags: ['single member', 'one person', 'shareholder', 'director', 'small company'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'biz-how-register',
    type: 'business',
    category: 'business',
    title: 'How to register with CAC',
    reference: 'CAC pre/post-registration',
    summary:
      'Steps: reserve/check an available name on the CAC portal, then complete registration with the owners’/directors’ details, a registered address, share details (for companies) and valid ID. On approval you receive your certificate and status report. You can do it yourself on the CAC portal or through an accredited agent/lawyer.',
    original: null,
    tags: ['how to', 'name reservation', 'portal', 'certificate', 'directors'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'biz-tax',
    type: 'business',
    category: 'business',
    title: 'Tax and TIN basics',
    reference: 'FIRS / Finance Acts',
    summary:
      'Registered businesses get a Tax Identification Number (TIN) and must keep proper records. Depending on turnover, obligations can include Companies Income Tax, VAT and PAYE for staff. Small companies below the turnover threshold enjoy reduced or zero companies income tax under the Finance Act — check the current thresholds before filing.',
    original: null,
    tags: ['tax', 'tin', 'vat', 'firs', 'cit', 'paye'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'biz-compliance',
    type: 'business',
    category: 'business',
    title: 'Staying compliant after registration',
    reference: 'CAMA 2020 ongoing duties',
    summary:
      'After registering, keep up post-incorporation duties: file annual returns with CAC, keep your registered details and “persons with significant control” up to date, maintain basic company records, and renew any sector permits. Missing annual returns can lead to penalties or your company being struck off.',
    original: null,
    tags: ['annual returns', 'compliance', 'psc', 'renewal', 'penalty'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
]
