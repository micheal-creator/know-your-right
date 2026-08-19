import { useCallback, useEffect, useState } from 'react'
import { Mic, Square, Download, Trash2, X, Phone, AlertTriangle } from 'lucide-react'
import { useAudioRecorder } from '../lib/useAudioRecorder.js'
import {
  saveRecording,
  listRecordings,
  deleteRecording,
  downloadBlob,
  formatDuration,
  formatBytes,
  extForMime,
} from '../lib/recordings.js'
import { uid } from '../services/local.js'
import { cn } from '../lib/format.js'

function stamp(ms) {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function RecordingItem({ rec, onDelete }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const u = URL.createObjectURL(rec.blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [rec.id, rec.blob])

  return (
    <div className="rounded-xl2 border border-line bg-paper p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">
            {new Date(rec.createdAt).toLocaleString()}
          </p>
          <p className="text-[12px] text-faint">
            {formatDuration(rec.duration)} · {formatBytes(rec.size)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => downloadBlob(rec.blob, rec.filename)}
            aria-label="Download recording"
            className="tap grid place-items-center rounded-lg text-muted hover:text-accent"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => onDelete(rec.id)}
            aria-label="Delete recording"
            className="tap grid place-items-center rounded-lg text-muted hover:text-danger"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {url && <audio controls src={url} className="mt-2 w-full" />}
    </div>
  )
}

export default function PanicButton() {
  const { status, seconds, error, start, stop } = useAudioRecorder()
  const [open, setOpen] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [savedMsg, setSavedMsg] = useState('')

  const recording = status === 'recording'
  const requesting = status === 'requesting'
  const saving = status === 'saving'

  const refresh = useCallback(() => {
    listRecordings().then(setRecordings).catch(() => {})
  }, [])

  useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  async function handleStop() {
    const duration = seconds
    const blob = await stop()
    setOpen(true)
    if (!blob || !blob.size) return
    const created = Date.now()
    const filename = `panic-${stamp(created)}.${extForMime(blob.type)}`
    const item = { id: uid('rec'), createdAt: created, filename, mime: blob.type, size: blob.size, duration, blob }
    try {
      await saveRecording(item)
    } catch {
      /* keep going — the download below still saves a copy */
    }
    downloadBlob(blob, filename)
    setSavedMsg('Recording saved to your device and to the app.')
    refresh()
  }

  async function onFab() {
    if (recording) {
      await handleStop()
      return
    }
    setSavedMsg('')
    setOpen(true)
    await start()
  }

  async function onDelete(id) {
    await deleteRecording(id)
    refresh()
  }

  return (
    <>
      {/* Floating PANIC button */}
      <button
        type="button"
        onClick={onFab}
        aria-label={recording ? 'Stop recording' : 'Panic — start recording'}
        className="fixed right-4 z-30 h-16 w-16 rounded-full"
        style={{ bottom: 'calc(90px + env(safe-area-inset-bottom))' }}
      >
        {recording && (
          <span className="absolute inset-0 rounded-full bg-danger/50 animate-ping" aria-hidden="true" />
        )}
        <span
          className={cn(
            'relative grid h-16 w-16 place-items-center rounded-full bg-danger text-white shadow-fab transition-transform active:scale-95',
            recording && 'ring-4 ring-danger/30',
          )}
        >
          {recording ? (
            <span className="flex flex-col items-center leading-none">
              <Square size={16} className="fill-current" />
              <span className="mt-1 text-[10px] font-extrabold tracking-wide">STOP</span>
            </span>
          ) : saving ? (
            <span className="text-[11px] font-bold">…</span>
          ) : (
            <span className="text-[13px] font-extrabold tracking-wide">PANIC</span>
          )}
        </span>
      </button>

      {/* Sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Panic recorder"
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl3 bg-card p-5 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl2 bg-danger/10 text-danger">
                  <AlertTriangle size={20} />
                </span>
                <div>
                  <h2 className="font-heading text-[20px] font-bold leading-none text-ink">Panic</h2>
                  <p className="mt-1 text-[12px] text-faint">Records audio and saves it to your device.</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="tap grid place-items-center rounded-lg text-faint hover:text-ink"
              >
                <X size={22} />
              </button>
            </div>

            {/* Recording / controls */}
            <div className="mt-4">
              {recording ? (
                <div className="rounded-xl3 border border-danger/30 bg-danger/5 p-5 text-center">
                  <div className="flex items-center justify-center gap-2 text-danger">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
                    <span className="text-[13px] font-semibold uppercase tracking-wide">Recording</span>
                  </div>
                  <p className="mt-2 font-heading text-[40px] font-bold tabular-nums text-ink">
                    {formatDuration(seconds)}
                  </p>
                  <button
                    onClick={handleStop}
                    className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 font-semibold text-white hover:bg-danger-hover"
                  >
                    <Square size={16} className="fill-current" /> Stop &amp; save
                  </button>
                </div>
              ) : requesting ? (
                <div className="rounded-xl3 border border-line bg-paper p-5 text-center text-sm text-muted">
                  Requesting microphone access…
                </div>
              ) : error ? (
                <div className="rounded-xl2 border border-warnsoft bg-warnsoft/60 p-4 text-sm text-muted">
                  <p className="font-semibold text-warn">{error}</p>
                  <p className="mt-1">You can still call for help below.</p>
                  <button onClick={() => start()} className="btn-outline mt-3 w-full">
                    <Mic size={18} /> Try again
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => start()}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 font-semibold text-white hover:bg-danger-hover"
                >
                  <Mic size={18} /> Start recording
                </button>
              )}
            </div>

            {savedMsg && !recording && (
              <p className="mt-3 rounded-xl2 bg-accent-soft px-3 py-2 text-[13px] font-medium text-accent">
                {savedMsg}
              </p>
            )}

            <a
              href="tel:112"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-muted hover:text-danger"
            >
              <Phone size={15} /> Call 112 (emergency)
            </a>

            {/* Saved recordings */}
            <div className="mt-5">
              <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-faint">
                Saved recordings
              </h3>
              {recordings.length === 0 ? (
                <p className="rounded-xl2 border border-line bg-paper p-4 text-center text-[13px] text-faint">
                  No recordings yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {recordings.map((rec) => (
                    <RecordingItem key={rec.id} rec={rec} onDelete={onDelete} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
