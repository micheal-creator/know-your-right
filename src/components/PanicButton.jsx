import { useState } from 'react'
import { AlertTriangle, Phone, X } from 'lucide-react'

// Persistent red emergency button. Its full behaviour (alert a trusted contact,
// share location, quick legal help) is still to be defined — for now it offers
// an emergency call and is clearly marked as a work in progress.
export default function PanicButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Panic — emergency help"
        className="fixed right-4 z-30 grid h-16 w-16 place-items-center rounded-full bg-danger text-white shadow-fab transition-transform active:scale-95"
        style={{ bottom: 'calc(90px + env(safe-area-inset-bottom))' }}
      >
        <span className="text-[13px] font-extrabold tracking-wide">PANIC</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Panic"
        >
          <div
            className="w-full max-w-sm rounded-xl3 bg-card p-5 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={22} />
                <h2 className="font-heading text-[20px] font-bold text-ink">Panic</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="tap grid place-items-center rounded-lg text-faint hover:text-ink">
                <X size={22} />
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              In an emergency you can call for help now. More panic features — alerting a trusted
              contact, sharing your location, and quick legal help — are coming soon.
            </p>

            <a
              href="tel:112"
              className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 font-semibold text-white transition-colors hover:bg-danger-hover"
            >
              <Phone size={18} /> Call 112 (emergency)
            </a>
            <button
              onClick={() => setOpen(false)}
              className="btn-outline mt-2 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
