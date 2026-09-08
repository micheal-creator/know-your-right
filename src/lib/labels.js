// Short labels + icons for each reference type (used on tags and headers).
export const TYPE_LABELS = {
  constitution: { label: 'Constitution', icon: 'ScrollText' },
  traffic: { label: 'Traffic', icon: 'Car' },
  powers: { label: 'Federal & State', icon: 'Landmark' },
  tenancy: { label: 'Tenancy & Housing', icon: 'Home' },
  employment: { label: 'Employment', icon: 'Briefcase' },
  consumer: { label: 'Consumer Rights', icon: 'ShoppingBag' },
  business: { label: 'Business & CAC', icon: 'Building2' },
}

export function typeLabel(type) {
  return TYPE_LABELS[type] || { label: 'Reference', icon: 'FileText' }
}
