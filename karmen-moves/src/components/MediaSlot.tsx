import type { Media } from '../data/content'

const tones: Record<NonNullable<Media['tone']>, string> = {
  champagne: 'from-[#efe4d0] via-[#e4d4b8] to-[#cdb994] text-charcoal/70',
  sage: 'from-[#d9ddcf] via-[#bcc4ae] to-[#8e9a82] text-charcoal/70',
  stone: 'from-[#e8e2d8] via-[#d2c9bb] to-[#a99f90] text-charcoal/70',
  night: 'from-[#2b2925] via-[#1f1d1a] to-[#121110] text-ivory/70',
}

/**
 * A photo slot. With `src` it renders a lazy, responsive image.
 * Without it, a refined tonal placeholder that names exactly which real
 * photo belongs here, so nothing fake ever ships.
 */
export function MediaSlot({
  media,
  className = '',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  showLabel = true,
}: {
  media: Media
  className?: string
  sizes?: string
  priority?: boolean
  showLabel?: boolean
}) {
  if (media.src) {
    return (
      <div className={`relative overflow-hidden bg-champagne ${className}`}>
        <img
          src={media.src}
          srcSet={media.srcSet}
          sizes={sizes}
          alt={media.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }
  const tone = tones[media.tone ?? 'champagne']
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${media.label}`}
      className={`grain relative overflow-hidden bg-gradient-to-br ${tone} ${className}`}
    >
      {/* soft light pool */}
      <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[70%] w-[70%] rounded-full bg-black/10 blur-3xl" />
      {/* slow sheen */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent [animation:sheen_7s_var(--ease-silk)_infinite]" />
      {/* frame */}
      <div className="pointer-events-none absolute inset-3 rounded-[inherit] border border-current/15 sm:inset-4" />
      {showLabel && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
          <p className="max-w-[28ch] text-[0.7rem] leading-relaxed tracking-wide">
            <span className="eyebrow mb-1.5 block !text-[0.6rem] opacity-70">Photo slot</span>
            {media.label}
          </p>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3.2" />
          </svg>
        </div>
      )}
    </div>
  )
}
