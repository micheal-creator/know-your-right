import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Trash2, FolderOpen, FolderCheck, Info, Mic, ArrowLeft } from 'lucide-react'
import {
  listRecordings,
  deleteRecording,
  downloadBlob,
  formatDuration,
  formatBytes,
} from '../lib/recordings.js'
import { supportsFS, pickDirectory, getDirName, clearDirectory } from '../lib/fsAccess.js'

function RecordingItem({ rec, onDelete }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const u = URL.createObjectURL(rec.blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [rec.id, rec.blob])

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-ink">
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

export default function Recordings() {
  const [items, setItems] = useState([])
  const [dir, setDir] = useState('')
  const [err, setErr] = useState('')

  function refresh() {
    listRecordings().then(setItems).catch(() => setItems([]))
  }

  useEffect(() => {
    refresh()
    getDirName().then(setDir)
  }, [])

  async function chooseFolder() {
    setErr('')
    try {
      const handle = await pickDirectory()
      setDir(handle.name)
    } catch (e) {
      if (e && e.name !== 'AbortError') setErr('Could not set the folder.')
    }
  }

  async function useAppOnly() {
    await clearDirectory()
    setDir('')
  }

  async function onDelete(id) {
    await deleteRecording(id)
    refresh()
  }

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <ArrowLeft size={16} /> Home
      </Link>

      <header>
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <Mic size={22} />
        </div>
        <h1 className="text-[24px]">Recordings</h1>
        <p className="mt-1 text-muted">
          Audio captured by the panic button is saved on this device. Only you can see it here.
        </p>
      </header>

      {/* Save location */}
      <section className="card p-4">
        <h2 className="font-heading text-[17px] font-semibold">Save location</h2>
        {supportsFS() ? (
          dir ? (
            <>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-ink">
                <FolderCheck size={18} className="text-accent" />
                Saving to folder: <span className="font-semibold">{dir}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={chooseFolder} className="btn-outline px-3 py-2 text-sm">
                  <FolderOpen size={16} /> Change folder
                </button>
                <button onClick={useAppOnly} className="btn-outline px-3 py-2 text-sm">
                  Use app storage only
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">
                Choose a folder and new recordings will be written straight there — silently.
              </p>
              <button onClick={chooseFolder} className="btn-primary mt-3">
                <FolderOpen size={18} /> Choose folder
              </button>
            </>
          )
        ) : (
          <p className="mt-1 flex items-start gap-2 text-sm text-muted">
            <Info size={18} className="mt-0.5 shrink-0 text-accent" />
            This browser can’t write directly to a folder, so recordings are kept in the app. Use the
            download button on any recording to export it where you want.
          </p>
        )}
        {err && <p className="mt-2 text-sm font-semibold text-danger">{err}</p>}
      </section>

      {/* List */}
      <section className="space-y-3">
        <h2 className="font-heading text-[17px] font-semibold">Saved recordings</h2>
        {items.length === 0 ? (
          <div className="card p-6 text-center text-sm text-faint">No recordings yet.</div>
        ) : (
          items.map((rec) => <RecordingItem key={rec.id} rec={rec} onDelete={onDelete} />)
        )}
      </section>
    </div>
  )
}
