import { useSyncExternalStore } from 'react'
import { load, save } from './local.js'
import { hasSupabase, loadSettingsRow, saveSettingsRow } from './supabaseSync.js'

// Editable site settings + design theme. Persists locally and (when configured)
// syncs to Supabase via supabaseSync.js. Powers the admin Settings page and is
// read by the public app for the site name, tagline, blurb, disclaimer + accent.

const KEY = 'kyr:cms:settings:v1'

export const THEMES = {
  green: { label: 'Forest green', rgb: '15 81 50', hover: '11 64 38', soft: '231 240 234' },
  teal: { label: 'Teal', rgb: '13 118 110', hover: '10 94 88', soft: '212 240 237' },
  navy: { label: 'Navy', rgb: '23 55 94', hover: '15 40 70', soft: '223 231 242' },
  indigo: { label: 'Indigo', rgb: '67 56 202', hover: '55 48 163', soft: '226 226 250' },
  plum: { label: 'Plum', rgb: '124 45 122', hover: '99 36 99', soft: '242 228 242' },
  slate: { label: 'Slate', rgb: '51 65 85', hover: '30 41 59', soft: '226 232 240' },
}

export const DEFAULT_SETTINGS = {
  name: 'Know Your Right',
  tagline: 'Know what the law actually says.',
  blurb:
    'Look up the Constitution, traffic fines, and what your state can and cannot do — in plain language. When you need a person, connect to a real lawyer.',
  disclaimer:
    'This is general legal information, not legal advice. Laws and fines change, and every situation is different. For advice on your specific case, speak to a qualified lawyer.',
  supportEmail: 'hello@knowyourright.ng',
  theme: 'green',
}

let state = { ...DEFAULT_SETTINGS, ...(load(KEY, {}) || {}) }
const listeners = new Set()

export function applyTheme(themeId) {
  const t = THEMES[themeId] || THEMES.green
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.style.setProperty('--kyr-accent', t.rgb)
    root.style.setProperty('--kyr-accent-hover', t.hover)
    root.style.setProperty('--kyr-accent-soft', t.soft)
  }
}

export function getSettings() {
  return state
}

export function setSettings(patch) {
  state = { ...state, ...patch }
  save(KEY, state)
  if (patch.theme) applyTheme(patch.theme)
  listeners.forEach((l) => l())
  if (hasSupabase) saveSettingsRow(state).catch(() => {})
  return state
}

// Replace the whole object (used by Supabase hydrate).
export function replaceSettings(next) {
  state = { ...DEFAULT_SETTINGS, ...next }
  save(KEY, state)
  applyTheme(state.theme)
  listeners.forEach((l) => l())
}

// Pull the latest settings from Supabase (if configured). Call once on boot.
export function hydrateSettings() {
  if (!hasSupabase) return
  loadSettingsRow()
    .then((s) => {
      if (s) replaceSettings(s)
    })
    .catch(() => {})
}

function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}

// Apply the saved theme as early as this module is imported.
applyTheme(state.theme)
