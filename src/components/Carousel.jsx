import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

// Auto-scrolling, swipeable highlight carousel with pagination dots.
// Pauses while the user touches it; respects reduced-motion.
export default function Carousel({ items, interval = 4200 }) {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)

  function stepPx() {
    const el = ref.current
    if (!el || !el.children.length) return 1
    const style = getComputedStyle(el)
    const gap = parseFloat(style.columnGap || style.gap || '12') || 12
    return el.children[0].getBoundingClientRect().width + gap
  }

  function onScroll() {
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / stepPx())
    setActive(Math.max(0, Math.min(items.length - 1, idx)))
  }

  function goTo(i) {
    const el = ref.current
    if (!el || !el.children[i]) return
    el.scrollTo({ left: el.children[i].offsetLeft, behavior: 'smooth' })
  }

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setActive((prev) => {
        const next = (prev + 1) % items.length
        goTo(next)
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [items.length, interval])

  const pause = () => (pausedRef.current = true)
  const resume = () => (pausedRef.current = false)

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={pause}
        onPointerUp={resume}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
      >
        {items.map((it) => (
          <Link
            key={it.id}
            to={it.to}
            className="flex shrink-0 basis-[46%] snap-start flex-col rounded-xl2 bg-flame p-3.5 text-white transition-transform active:scale-[0.98]"
          >
            <p className="font-sans text-[14px] font-bold leading-snug">{it.title}</p>
            <p className="mt-1 text-[12px] leading-snug text-white/85">{it.body}</p>
            <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-white/90">
              Open <Icon name="ArrowRight" size={13} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setActive(i)
              goTo(i)
            }}
            className={'h-1.5 rounded-full transition-all ' + (i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/40')}
          />
        ))}
      </div>
    </div>
  )
}
