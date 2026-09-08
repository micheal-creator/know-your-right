// Employment & Labour.
// Source: Labour Act (Cap L1, Laws of the Federation of Nigeria 2004); the
// National Industrial Court handles employment disputes. Note: the Labour Act's
// detailed protections apply mainly to "workers" (manual labour and clerical
// work); senior/other staff are governed largely by their contract, company
// policy and common law. Confirm specifics for your situation.

const SOURCE = 'Labour Act (Cap L1 LFN 2004); National Industrial Court practice'
const VERIFIED = '2026-09-08'

export const EMPLOYMENT = [
  {
    id: 'emp-contract',
    type: 'employment',
    category: 'employment',
    title: 'You are entitled to written terms of employment',
    reference: 'Labour Act, s.7',
    summary:
      'Within three months of starting work, your employer should give you a written statement of your terms: the names of the parties, your job, the date it began, how and how much you are paid, hours, holidays, and notice periods. Keep a signed copy of your contract and any staff handbook.',
    original:
      'Not later than three months after the beginning of a worker’s period of employment, the employer shall give to the worker a written statement specifying the terms and conditions of employment.',
    tags: ['contract', 'terms', 'offer letter', 'employment', 'handbook'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-termination',
    type: 'employment',
    category: 'employment',
    title: 'Notice and termination',
    reference: 'Labour Act, s.11',
    summary:
      'Either side can end the contract by giving the notice stated in the contract. Where the contract is silent, statutory minimums apply based on length of service (for example, one day’s notice under three months; one week for 3 months–2 years; two weeks for 2–5 years; one month for five years or more). An employer can pay wages in lieu of notice instead of requiring you to work it.',
    original: null,
    tags: ['termination', 'notice', 'sack', 'dismissal', 'pay in lieu'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-wages',
    type: 'employment',
    category: 'employment',
    title: 'Wages must be paid — and paid properly',
    reference: 'Labour Act, s.15–16',
    summary:
      'Your wages must be paid when due and in legal tender. An employer cannot make unlawful deductions from your pay. Withholding earned salary is a breach you can pursue at the National Industrial Court. Nigeria also has a National Minimum Wage that employers within its scope must meet.',
    original: null,
    tags: ['wages', 'salary', 'minimum wage', 'deductions', 'unpaid'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-hours-rest',
    type: 'employment',
    category: 'employment',
    title: 'Hours, rest and overtime',
    reference: 'Labour Act',
    summary:
      'Normal working hours are fixed by agreement, collective bargaining or industry practice. Workers are entitled to rest and to a paid public-holiday/rest framework. Time worked beyond normal hours (overtime) should be handled as your contract or industry terms provide.',
    original: null,
    tags: ['hours', 'overtime', 'rest', 'working time'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-leave',
    type: 'employment',
    category: 'employment',
    title: 'Annual leave and sick leave',
    reference: 'Labour Act, s.18',
    summary:
      'After twelve months of continuous service, a worker is entitled to at least six working days of paid annual leave (more for young persons). Workers are also entitled to paid sick leave for temporary illness certified by a registered medical practitioner, up to the statutory limit.',
    original: null,
    tags: ['leave', 'annual leave', 'holiday', 'sick leave'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-maternity',
    type: 'employment',
    category: 'employment',
    title: 'Maternity protection',
    reference: 'Labour Act, s.54',
    summary:
      'A woman is entitled to maternity leave around childbirth (commonly six weeks before and six weeks after) on the terms the law provides, with protection of her position. Many employers and some states provide more generous terms. You cannot lawfully be dismissed simply for being on maternity leave.',
    original: null,
    tags: ['maternity', 'pregnancy', 'leave', 'women'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'emp-unfair',
    type: 'employment',
    category: 'employment',
    title: 'Unfair dismissal and your remedy',
    reference: 'National Industrial Court',
    summary:
      'The National Industrial Court can look beyond the bare contract and apply fairness and international labour standards. If you are dismissed without a valid reason or without fair process, you may have a claim. Gather your contract, payslips, query/warning letters and the termination letter, and act quickly.',
    original: null,
    tags: ['unfair dismissal', 'wrongful termination', 'nicn', 'redundancy', 'claim'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
]
