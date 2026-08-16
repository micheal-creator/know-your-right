// Short labels + icons for each reference type (used on tags and headers).
export const TYPE_LABELS = {
  constitution: { label: 'Constitution', icon: 'ScrollText' },
  traffic: { label: 'Traffic', icon: 'Car' },
  powers: { label: 'Federal & State', icon: 'Landmark' },
}

export function typeLabel(type) {
  return TYPE_LABELS[type] || { label: 'Reference', icon: 'FileText' }
}
