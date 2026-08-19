import { useState } from 'react'
import { useAudioRecorder } from '../lib/useAudioRecorder.js'
import { saveRecording, extForMime } from '../lib/recordings.js'
import { saveToChosenDir } from '../lib/fsAccess.js'
import { uid } from '../services/local.js'
import { cn } from '../lib/format.js'

function stamp(ms) {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

// Stealth panic recorder.
// Tap to start recording silently (mic permission already granted). The only
// on-screen sign is a faint red dot at the very top — so, to anyone else, the
// screen looks normal. Tap again to stop; the file saves silently to the user's
// chosen folder (if set) and always to the in-app store. Manage everything from
// the Recordings screen (menu → Recordings).
export default function PanicButton() {
  const { status, seconds, start, stop } = useAudioRecorder()
  const [busy, setBusy] = useState(false)
  const recording = status === 'recording'

  async function handleStop() {
    const duration = seconds
    const blob = await stop()
    if (!blob || !blob.size) return
    const created = Date.now()
    const filename = `panic-${stamp(created)}.${extForMime(blob.type)}`
    const item = {
      id: uid('rec'),
      createdAt: created,
      filename,
      mime: blob.type,
      size: blob.size,
      duration,
      blob,
    }
    try {
      await saveRecording(item) // always keep an in-app copy
    } catch {
      /* ignore */
    }
    try {
      await saveToChosenDir(filename, blob) // silently write to the chosen folder if available
    } catch {
      /* ignore — in-app copy is kept regardless */
    }
  }

  async function onTap() {
    if (busy) return
    setBusy(true)
    try {
      if (recording) {
        await handleStop()
      } else {
        await start()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Faint, discreet recording indicator at the very top of the screen. */}
      {recording && (
        <span
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1 z-40 h-2 w-2 -translate-x-1/2 rounded-full bg-danger/60 animate-pulse"
        />
      )}

      {/* Softened PANIC button: neutral shadow + subtle outline, not shouting. */}
      <button
        type="button"
        onClick={onTap}
        aria-label={recording ? 'Stop recording' : 'Panic'}
        aria-pressed={recording}
        className={cn(
          'fixed right-4 z-30 grid h-16 w-16 place-items-center rounded-full bg-danger text-white shadow-fab ring-1 ring-danger-hover/50 transition-transform active:scale-95',
        )}
        style={{ bottom: 'calc(90px + env(safe-area-inset-bottom))' }}
      >
        <span className="text-[13px] font-extrabold tracking-wide">PANIC</span>
      </button>
    </>
  )
}
