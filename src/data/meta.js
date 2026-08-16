// App-wide text constants and small reference lists.

export const APP = {
  name: 'Know Your Right',
  tagline: 'Know what the law actually says.',
  blurb:
    'Look up the Constitution, traffic fines, and what your state can and cannot do — in plain language. When you need a person, connect to a real lawyer.',
}

// Shown near legal content across the app.
export const DISCLAIMER =
  'This is general legal information, not legal advice. Laws and fines change, and every situation is different. For advice on your specific case, speak to a qualified lawyer.'

export const ABOUT = {
  what:
    'Know Your Right is a plain-language reference for everyday Nigerians. It explains the Constitution, traffic laws and fines, and how power is split between the Federal Government and the states — then connects you to a real lawyer when you need one.',
  notWhat:
    'It is not an AI chatbot, not a legal-advice generator, and not a forum. It is a reference tool with a clear path to a human professional.',
  sources:
    'Content is written from official sources — the 1999 Constitution of the Federal Republic of Nigeria (as amended), the Federal Road Safety Corps (FRSC) regulations, and the Legislative Lists in the Constitution. Every entry shows a "last verified" date because the law changes.',
}

export const PRIVACY =
  'The "Hire a Lawyer" form collects only what a lawyer needs to help you: your issue type, your state, a short description, and how to reach you. We do not sell your data to third parties.'

// 36 states + FCT.
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

// Issue types used by the Hire a Lawyer form and to tag lawyers.
export const ISSUE_CATEGORIES = [
  { id: 'police-rights', label: 'Police & your rights', hint: 'Arrest, detention, search, bail' },
  { id: 'traffic', label: 'Traffic, FRSC & VIO', hint: 'Fines, impounded vehicle, accidents' },
  { id: 'tenancy', label: 'Tenancy & land', hint: 'Rent, eviction, landlord disputes, land' },
  { id: 'employment', label: 'Employment & labour', hint: 'Sack, salary, contracts' },
  { id: 'business', label: 'Business & CAC', hint: 'Registration, contracts, compliance' },
  { id: 'family', label: 'Family', hint: 'Marriage, custody, inheritance' },
  { id: 'general', label: 'Something else / not sure', hint: 'General consultation' },
]
