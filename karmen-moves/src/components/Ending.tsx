import { motion, useReducedMotion } from 'motion/react'
import { nav, site } from '../data/content'

const line = ['Every', 'movement', 'matters.']

export function Ending() {
  const reduce = useReducedMotion()
  return (
    <section id="end" aria-labelledby="end-title" className="relative overflow-hidden bg-night px-5 pb-24 pt-32 text-center text-ivory sm:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-gold/10 blur-[100px]" />
      <h2 id="end-title" className="display relative flex flex-wrap justify-center gap-x-[0.25em] text-[clamp(3rem,12vw,9.5rem)] italic">
        {line.map((w, i) => (
          <motion.span
            key={w}
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.4, delay: i * 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        ))}
      </h2>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1.1 }}
        className="relative"
      >
        <p className="mx-auto mt-8 max-w-[30ch] text-[1.05rem] leading-relaxed text-ivory/70">Discover comfort for your everyday journey.</p>
        <a href="#top" className="btn btn-light mt-10">Explore Karmen Moves</a>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-night px-5 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] pt-10 text-ivory/60 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="hairline opacity-40" />
        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="display text-[2rem] tracking-[0.14em] text-ivory">KARMEN <span className="text-gold">MOVES</span></p>
            <p className="eyebrow mt-3 !text-[0.6rem]">{site.tagline}</p>
            <p className="mt-5 max-w-[40ch] text-[0.8rem] leading-relaxed">
              An independent, founder led wellness and mobility brand by {site.founder}, {site.location}. Featuring selected products from
              MOB Neck &amp; Back Rest. Not the official MOB website. No exclusive distribution is implied.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow !text-[0.6rem] text-ivory/40">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-ivory">{n.label}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className="eyebrow !text-[0.6rem] text-ivory/40">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#/privacy" className="hover:text-ivory">Privacy notice</a></li>
              <li><a href="#/disclaimer" className="hover:text-ivory">Disclaimer</a></li>
              <li><a href={site.mobOfficialUrl} target="_blank" rel="noopener" className="hover:text-ivory">Official MOB website</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-14 text-[0.72rem] leading-relaxed text-ivory/40">
          © {site.year} {site.brand}. MOB, MOB Neck &amp; Back Rest and related product names belong to their respective owner.
          Information on this site is general and is not medical advice.
        </p>
      </div>
    </footer>
  )
}
