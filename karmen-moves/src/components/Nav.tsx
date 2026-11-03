import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { nav, site, whatsappLink } from '../data/content'
import { WhatsAppIcon } from '../lib/icons'
import { useScrolledPast } from '../lib/useScrolledPast'

export function Nav({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const scrolled = useScrolledPast(1.05)
  const visible = alwaysVisible || scrolled
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-all duration-700 ease-[var(--ease-silk)] ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <nav aria-label="Main" className="glass flex w-full max-w-5xl items-center justify-between rounded-full py-2 pl-5 pr-2">
          <a href="#top" className="display text-[1.05rem] font-medium tracking-[0.18em] text-charcoal" aria-label="KARMEN MOVES, back to top">
            KARMEN <span className="text-[#9a7b45]">MOVES</span>
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-3.5 py-2 text-[0.8rem] text-ink transition-colors hover:bg-white/60 hover:text-charcoal">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
            <a
              href={whatsappLink(`Hi Karmen, I found ${site.brand} and would like to ask about your products.`)}
              target="_blank"
              rel="noopener"
              className="btn btn-sage !min-h-10 !px-4 !text-[0.8rem]"
            >
              <WhatsAppIcon /> <span className="hidden sm:inline">Enquire</span>
              <span className="sr-only sm:hidden">Enquire on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-charcoal hover:bg-white/60 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M4 9h16M4 15h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-ivory/95 px-6 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="display text-lg tracking-[0.18em]">KARMEN <span className="text-[#9a7b45]">MOVES</span></span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="mt-14 space-y-1">
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={n.href} onClick={() => setOpen(false)} className="display block py-2 text-[2.6rem] text-charcoal">
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto space-y-3">
              <div className="hairline" />
              <p className="eyebrow pt-3 text-stone">{site.tagline}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Mobile only: calm WhatsApp bar pinned to the bottom once past the hero. */
export function MobileEnquiryBar() {
  const visible = useScrolledPast(1.6)
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-700 ease-[var(--ease-silk)] md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <a
        href={whatsappLink('Hi Karmen, I would like to ask about the MOB products you feature.')}
        target="_blank"
        rel="noopener"
        className="glass flex min-h-13 items-center justify-between rounded-full py-2 pl-5 pr-2 text-[0.85rem] text-charcoal"
      >
        <span>Questions? Ask Karmen personally.</span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-deep text-white">
          <WhatsAppIcon />
        </span>
      </a>
    </div>
  )
}
