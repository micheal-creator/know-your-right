import Icon from './Icon.jsx'

// Consistent header for secondary screens: an icon tile, a title, and an
// optional subtitle. Keeps every screen visually aligned.
export default function ScreenHeader({ icon, iconTone = 'accent', title, subtitle, children }) {
  return (
    <header>
      {icon && (
        <div
          className={
            'mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ' +
            (iconTone === 'danger' ? 'bg-danger/10 text-danger' : 'bg-accent-soft text-accent')
          }
        >
          <Icon name={icon} size={22} />
        </div>
      )}
      <h1 className="section-title text-[26px] sm:text-[28px]">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      {children}
    </header>
  )
}
