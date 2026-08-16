// Federal & State Powers.
// Source: 1999 Constitution (as amended) — Section 4 and the Second Schedule
// (Exclusive Legislative List and Concurrent Legislative List), the Land Use
// Act, and well-known case law. Verify against the official gazette.

const SOURCE = '1999 Constitution (as amended), Section 4 & Second Schedule; Land Use Act'
const VERIFIED = '2026-01-20'

export const POWERS = [
  {
    id: 'pow-how',
    type: 'powers',
    category: 'powers',
    title: 'How power is shared in Nigeria',
    reference: 'Section 4 & Second Schedule',
    summary:
      'Nigeria is a federation. The Constitution lists matters only the National Assembly (Federal) can legislate on — the Exclusive Legislative List. It lists matters both the Federal and State Houses of Assembly can legislate on — the Concurrent Legislative List. Everything not on either list is "residual" and belongs to the states. Where a state law clashes with a valid federal law on a concurrent matter, the federal law prevails.',
    original:
      'The National Assembly shall have power to make laws... with respect to any matter included in the Exclusive Legislative List... The National Assembly and a House of Assembly shall have power to make laws with respect to matters in the Concurrent Legislative List.',
    tags: ['federal', 'state', 'legislative list', 'concurrent', 'residual'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-exclusive',
    type: 'powers',
    category: 'powers',
    title: 'What only the Federal Government can do',
    reference: 'Exclusive Legislative List (Second Schedule, Part I)',
    summary:
      'Only the Federal Government makes laws on matters such as: defence and the armed forces, the police (Nigeria Police Force), foreign affairs, citizenship and passports, immigration, customs and export duties, currency and banking, mines and minerals (including oil and gas), aviation, railways, and drugs and poisons. States cannot legislate on these.',
    original:
      'Items on the Exclusive Legislative List include defence, arms/ammunition, aviation, banks/banking, citizenship, currency, customs, immigration, mines and minerals (including oil fields and natural gas), police, and railways, among others.',
    tags: ['federal', 'police', 'oil', 'currency', 'defence', 'immigration', 'customs'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-concurrent',
    type: 'powers',
    category: 'powers',
    title: 'What Federal and State share',
    reference: 'Concurrent Legislative List (Second Schedule, Part II)',
    summary:
      'Both the Federal Government and the states can make laws on concurrent matters such as: electricity, higher/technological and post-primary education, collection of certain taxes and revenue, agriculture, industrial development, and statistics. If a state law conflicts with a valid federal law on the same concurrent matter, the federal law wins to the extent of the conflict.',
    original:
      'The Concurrent Legislative List sets out areas (such as allocation of revenue, electricity, education, and agriculture) on which both the National Assembly and State Houses of Assembly may legislate, subject to the Constitution.',
    tags: ['concurrent', 'electricity', 'education', 'tax', 'agriculture'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-residual',
    type: 'powers',
    category: 'powers',
    title: 'What your state controls (residual powers)',
    reference: 'Residual matters',
    summary:
      'Anything not on the Exclusive or Concurrent lists is for the states. This is why many everyday things are governed by state law: local road-traffic management, markets and street trading, tenancy and rent, town planning, chieftaincy matters, and administration of land within the state.',
    original:
      'Matters not included in the Exclusive or Concurrent Legislative Lists fall within the residual competence of the states.',
    tags: ['state', 'residual', 'markets', 'tenancy', 'planning', 'traffic'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-police',
    type: 'powers',
    category: 'powers',
    title: 'Who controls the police?',
    reference: 'Section 214 & Exclusive List',
    summary:
      'The Constitution establishes a single national police force — the Nigeria Police Force — and says no other police force shall be established for the federation or any part of it (except as an Act of the National Assembly may provide). Policing is a federal matter. "State police" would require a constitutional amendment, which is an ongoing national debate. State bodies like traffic agencies are not police forces.',
    original:
      'There shall be a Police Force for Nigeria, which shall be known as the Nigeria Police Force, and... no other police force shall be established for the Federation or any part thereof.',
    tags: ['police', 'state police', 'security', 'npf', 'federal'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-state-traffic',
    type: 'powers',
    category: 'powers',
    title: 'Can states make their own traffic rules?',
    reference: 'Residual / concurrent practice',
    summary:
      'Yes. States run their own road-traffic management within the state, often through agencies such as LASTMA (Lagos) or the Vehicle Inspection Office (VIO). The FRSC is the federal agency for road safety, especially on federal highways. So on the same journey you may deal with FRSC, a state traffic agency, and the police — each within their own powers.',
    original:
      'Road-traffic management within a state is generally handled under state law and agencies, while the FRSC operates under federal law across the country.',
    tags: ['traffic', 'lastma', 'vio', 'frsc', 'state', 'road'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-okada',
    type: 'powers',
    category: 'powers',
    title: 'Can a state ban okada or keke?',
    reference: 'Residual powers',
    summary:
      'Yes. Regulating transport within the state — including restricting or banning commercial motorcycles (okada) or tricycles (keke) on certain roads — falls within state powers. Several states have imposed such bans or restrictions. The specific rules, affected roads and penalties differ from state to state.',
    original:
      'Regulation of local transport is a matter for the states under their residual competence.',
    tags: ['okada', 'keke', 'ban', 'motorcycle', 'transport', 'state'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-land',
    type: 'powers',
    category: 'powers',
    title: 'Who "owns" land in your state?',
    reference: 'Land Use Act',
    summary:
      'Under the Land Use Act, all land in each state is vested in the Governor of that state, who holds it in trust for the people. In practice you hold land through a right of occupancy, and transfers of land usually need the Governor’s consent. This is why land documentation and consent are handled at state level.',
    original:
      'Subject to the provisions of this Act, all land comprised in the territory of each State in the Federation is hereby vested in the Governor of that State, and such land shall be held in trust and administered for the use and common benefit of all Nigerians.',
    tags: ['land', 'governor', 'right of occupancy', 'c of o', 'consent'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
  {
    id: 'pow-tenancy',
    type: 'powers',
    category: 'powers',
    title: 'Tenancy and rent are state matters',
    reference: 'Residual powers',
    summary:
      'Landlord-and-tenant rules — notice periods, how eviction must be done, and limits on rent demands — are set by state law, so they differ across states (for example, Lagos has its own Tenancy Law). Eviction must follow the legal process in your state; a landlord generally cannot lawfully throw you out, lock you out or seize your property without a court order.',
    original:
      'Tenancy is governed by the law of each state; consult your state’s tenancy or rent legislation for the exact rules.',
    tags: ['tenancy', 'rent', 'eviction', 'landlord', 'notice', 'state'],
    lastVerified: VERIFIED,
    source: SOURCE,
  },
]
