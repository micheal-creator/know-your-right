// Small shared helpers.

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

// Format a plain integer amount of Naira, e.g. 3000 -> "₦3,000".
export function formatNaira(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return '₦' + Number(amount).toLocaleString('en-NG')
}

// Human-friendly date, e.g. "2026-01-20" -> "20 Jan 2026".
export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Content is flagged stale after this many days (roadmap: re-check > 6 months).
const STALE_AFTER_DAYS = 183

export function isStale(iso) {
  if (!iso) return true
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return true
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
  return days > STALE_AFTER_DAYS
}

// Normalize text for accent-insensitive, case-insensitive matching.
export function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}
