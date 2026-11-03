import { principles } from '../data/content'
import { Reveal } from '../lib/Reveal'

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative overflow-hidden bg-charcoal py-24 text-ivory sm:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sage/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-gold">Why KARMEN MOVES</p>
          <h2 id="why-title" className="display mt-5 max-w-[18ch] text-[clamp(2.4rem,7vw,5.4rem)]">
            Comfort, offered the way I would want it offered to me.
          </h2>
        </Reveal>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-ivory/10 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.no} delay={i * 0.08} className="bg-charcoal p-7 sm:p-10">
              <p className="display text-[2.6rem] italic text-gold/80">{p.no}</p>
              <h3 className="display mt-4 text-[1.9rem] leading-tight">{p.title}</h3>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-ivory/65">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
