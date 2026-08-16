// Traffic Laws & Fines.
// Source: Federal Road Safety Corps (FRSC) offence codes and the schedule of
// penalties under the National Road Traffic Regulations, 2012.
//
// IMPORTANT: These figures are the commonly published FRSC penalties and are
// provided as a guide. Amounts and penalty points are periodically reviewed, so
// always confirm the current figure with FRSC. Each row carries a lastVerified
// date and the app flags anything older than 6 months for re-check.

const SOURCE = 'FRSC National Road Traffic Regulations, 2012 (schedule of penalties) — verify current figures with FRSC'
const VERIFIED = '2026-01-20'

// severity: 'minor' | 'moderate' | 'serious'
export const TRAFFIC = [
  { id: 'trf-slv', code: 'SLV', offence: 'Speed Limit Violation', fine: 3000, points: 3, severity: 'moderate',
    summary: 'Driving above the posted speed limit for the road or your vehicle class.' },
  { id: 'trf-sbv', code: 'SBV', offence: 'Seat Belt Violation', fine: 2000, points: 2, severity: 'minor',
    summary: 'Driver or front-seat passenger not wearing a seat belt.' },
  { id: 'trf-upwd', code: 'UPWD', offence: 'Use of Phone While Driving', fine: 4000, points: 4, severity: 'moderate',
    summary: 'Making or receiving a call, or texting, on a hand-held phone while driving.' },
  { id: 'trf-dul', code: 'DUL', offence: 'Driving Without a Valid Driver’s Licence', fine: 10000, points: 5, severity: 'serious',
    summary: 'Driving with no licence, or with an expired or fake driver’s licence.' },
  { id: 'trf-vlv', code: 'VLV', offence: 'Vehicle Licence Violation', fine: 3000, points: 3, severity: 'minor',
    summary: 'Driving with an expired or missing vehicle licence.' },
  { id: 'trf-tyv', code: 'TYV', offence: 'Worn-out / Defective Tyre', fine: 3000, points: 3, severity: 'minor',
    summary: 'Driving on bald, worn-out or otherwise unsafe tyres.' },
  { id: 'trf-wov', code: 'WOV', offence: 'Wrongful Overtaking', fine: 3000, points: 3, severity: 'moderate',
    summary: 'Overtaking where it is prohibited or unsafe to do so.' },
  { id: 'trf-lsv', code: 'LSV', offence: 'Light / Sign Violation', fine: 3000, points: 3, severity: 'moderate',
    summary: 'Ignoring a traffic light or road sign, or driving with faulty/wrong lights.' },
  { id: 'trf-npv', code: 'NPV', offence: 'Number Plate Violation', fine: 3000, points: 3, severity: 'minor',
    summary: 'No number plate, a covered/obscured plate, or an unauthorised plate.' },
  { id: 'trf-mdv', code: 'MDV', offence: 'Mechanically Deficient Vehicle', fine: 3000, points: 3, severity: 'minor',
    summary: 'Driving a vehicle that is not roadworthy (e.g. bad brakes, no mirrors).' },
  { id: 'trf-rob', code: 'ROB', offence: 'Road Obstruction', fine: 3000, points: 3, severity: 'minor',
    summary: 'Parking or stopping in a way that obstructs other road users.' },
  { id: 'trf-rtv', code: 'RTV', offence: 'Route Violation', fine: 5000, points: 5, severity: 'moderate',
    summary: 'Driving against traffic (one-way) or on an unauthorised route.' },
  { id: 'trf-dai', code: 'DAI', offence: 'Driving Under Alcohol / Drug Influence', fine: 5000, points: 5, severity: 'serious',
    summary: 'Driving while impaired by alcohol or drugs.' },
  { id: 'trf-ovl', code: 'OVL', offence: 'Overloading', fine: 3000, points: 3, severity: 'moderate',
    summary: 'Carrying passengers or goods beyond the vehicle’s safe/legal capacity.' },
  { id: 'trf-dgd', code: 'DGD', offence: 'Dangerous Driving', fine: 50000, points: 10, severity: 'serious',
    summary: 'Reckless or dangerous driving that endangers lives; vehicle may be impounded.' },
  { id: 'trf-cpv', code: 'CPV', offence: 'Construction Zone / Caution Sign Violation', fine: 3000, points: 3, severity: 'minor',
    summary: 'Ignoring caution or construction-zone warning signs.' },
  { id: 'trf-fmv', code: 'FMV', offence: 'Fire-extinguisher / Safety-kit Missing', fine: 3000, points: 3, severity: 'minor',
    summary: 'No fire extinguisher, C-caution sign or first-aid box where required.' },
  { id: 'trf-umv', code: 'UMV', offence: 'Under-age / Unqualified Driving', fine: 2000, points: 2, severity: 'moderate',
    summary: 'A person below the legal driving age or otherwise unqualified driving a vehicle.' },
]

// Expose traffic offences as searchable entries too.
export const TRAFFIC_ENTRIES = TRAFFIC.map((t) => ({
  id: t.id,
  type: 'traffic',
  category: 'traffic',
  title: t.offence,
  reference: `FRSC code ${t.code}`,
  summary: `${t.summary} Fine: ₦${t.fine.toLocaleString('en-NG')}. Penalty points: ${t.points}.`,
  original: null,
  tags: ['frsc', 'traffic', 'fine', t.code.toLowerCase(), t.severity],
  lastVerified: VERIFIED,
  source: SOURCE,
  fine: t.fine,
  points: t.points,
  code: t.code,
  severity: t.severity,
}))

export const TRAFFIC_META = { source: SOURCE, lastVerified: VERIFIED }
