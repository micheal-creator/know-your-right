// File System Access helpers so the user can choose a folder to save panic
// recordings into. Supported on desktop Chromium browsers; on unsupported
// browsers (most mobile) we fall back to the in-app copy + manual export.

import { getSetting, setSetting, delSetting } from './recordings.js'

const KEY = 'saveDir'

export function supportsFS() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'
}

// Prompt the user to pick a folder (requires a user gesture) and remember it.
export async function pickDirectory() {
  if (!supportsFS()) throw new Error('unsupported')
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' })
  if (handle.requestPermission) {
    await handle.requestPermission({ mode: 'readwrite' })
  }
  await setSetting(KEY, handle)
  return handle
}

export async function getDirHandle() {
  try {
    return (await getSetting(KEY)) || null
  } catch {
    return null
  }
}

export async function getDirName() {
  const h = await getDirHandle()
  return h?.name || ''
}

export async function clearDirectory() {
  await delSetting(KEY)
}

// Silent permission check — never prompts (keeps the panic flow discreet).
async function hasPermission(handle) {
  if (!handle?.queryPermission) return true
  try {
    return (await handle.queryPermission({ mode: 'readwrite' })) === 'granted'
  } catch {
    return false
  }
}

async function writeToDir(handle, filename, blob) {
  const fileHandle = await handle.getFileHandle(filename, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(blob)
  await writable.close()
}

// Attempts to save silently into the chosen folder.
// Returns { saved:true, dir } or { saved:false, reason }.
export async function saveToChosenDir(filename, blob) {
  const handle = await getDirHandle()
  if (!handle) return { saved: false, reason: 'no-dir' }
  if (!(await hasPermission(handle))) return { saved: false, reason: 'no-permission' }
  try {
    await writeToDir(handle, filename, blob)
    return { saved: true, dir: handle.name }
  } catch {
    return { saved: false, reason: 'write-failed' }
  }
}
