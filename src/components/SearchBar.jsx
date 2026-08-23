import { useRef } from 'react'
import Icon from './Icon.jsx'

// Reusable search field. Instant local filtering is handled by the parent via
// onChange; onSubmit lets the parent navigate to a full results page.
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search the law…  e.g. “arrested”, “seat belt”, “okada”',
  autoFocus = false,
  onClear,
}) {
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.(value)
    inputRef.current?.blur()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
        <Icon name="Search" size={20} />
      </span>
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        autoFocus={autoFocus}
        aria-label="Search the law"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tap w-full rounded-xl2 border border-line bg-card py-3.5 pl-12 pr-11 text-base text-ink shadow-card placeholder:text-faint focus:border-accent"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClear?.()
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="tap absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center rounded-full p-1.5 text-faint hover:text-ink"
        >
          <Icon name="X" size={18} />
        </button>
      ) : null}
    </form>
  )
}
