import { faqs, site, testimonials } from '../data/content'
import { Reveal } from '../lib/Reveal'
import { ExternalIcon } from '../lib/icons'

function InfoCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="flex flex-col rounded-[28px] border border-charcoal/10 bg-cream p-7 sm:p-8">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h3 className="display mt-3 text-[1.9rem] leading-tight">{title}</h3>
      <div className="mt-4 flex-1 text-[0.93rem] leading-relaxed text-ink/80">{children}</div>
    </Reveal>
  )
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl border border-dashed border-gold/50 px-3 py-2 text-[0.75rem] text-stone">{children}</p>
}

/** Renders nothing until genuine testimonials are added to content.ts */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <div className="mt-24">
      <Reveal>
        <p className="eyebrow text-gold">In their words</p>
        <h3 className="display mt-4 text-[clamp(2rem,6vw,3.6rem)]">From people I have served.</h3>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Reveal key={t.name} as="article" className="rounded-[28px] bg-cream p-7">
            <p className="display text-[1.4rem] italic leading-snug">“{t.quote}”</p>
            <p className="mt-5 text-sm text-stone">{t.name}{t.location ? `, ${t.location}` : ''}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function Care() {
  return (
    <section id="care" aria-labelledby="care-title" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-gold">Customer care</p>
          <h2 id="care-title" className="display mt-5 text-[clamp(2.6rem,8vw,6rem)]">Clear, kind, and honest.</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <InfoCard eyebrow="Sourcing" title="Where products come from">
            <p>
              The products featured here are made by <b className="font-medium">MOB Neck &amp; Back Rest</b>. {site.brand} is an
              independent brand by {site.founder}. It is not the official MOB website and does not claim exclusive distribution.
            </p>
            <a href={site.mobOfficialUrl} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1.5 text-charcoal underline decoration-gold/60 underline-offset-4">
              Visit the official MOB site <ExternalIcon />
            </a>
          </InfoCard>
          <InfoCard eyebrow="Delivery" title="Getting it to you">
            <p>Delivery within Malaysia will be confirmed personally when you enquire.</p>
            <Placeholder>Placeholder: delivery areas, timing and fees to be confirmed before launch.</Placeholder>
          </InfoCard>
          <InfoCard eyebrow="Warranty" title="Peace of mind">
            <p>Warranty follows the official MOB policy for each product. I will explain it clearly before you buy.</p>
            <Placeholder>Placeholder: verified MOB warranty terms to be added.</Placeholder>
          </InfoCard>
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow text-gold">FAQ</p>
            <h3 className="display mt-4 text-[clamp(2rem,6vw,3.6rem)] leading-[1.05]">Questions people ask me.</h3>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-ink/75">Something else on your mind? Message me. I read every one.</p>
          </Reveal>
          <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.02rem] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-charcoal/15 transition-transform duration-500 group-open:rotate-45">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 pr-10 leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <Testimonials />
      </div>
    </section>
  )
}
