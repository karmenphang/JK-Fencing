import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { neckHealerShowcase as show, products, site, whatsappLink } from '../data/content'
import { MediaSlot } from './MediaSlot'
import { ArrowIcon, ExternalIcon, WhatsAppIcon } from '../lib/icons'
import { Reveal } from '../lib/Reveal'
import { startOrder } from './Contact'

gsap.registerPlugin(ScrollTrigger)

const product = products.find((p) => p.id === 'neck-healer')!

const captions = [
  { t: 'Introducing the MOB Neck Healer.', s: 'A closer look at a product I chose to feature.' },
  { t: 'Considered details.', s: 'Each detail will be described using official MOB information only.' },
  { t: 'In everyday use.', s: 'How it is used, shown with approved photos or video.' },
  { t: 'Up close. And at home.', s: 'From the surface it is made of, to the quiet evening it belongs to.' },
  { t: 'Reserved for 3D.', s: 'An accurate 3D model will live here once MOB supplies one.' },
]

const pins = [
  { x: '16%', y: '14%', align: 'left' },
  { x: '84%', y: '40%', align: 'right' },
  { x: '20%', y: '64%', align: 'left' },
] as const

function ModelPlaceholder() {
  return (
    <div className="grain relative grid h-full w-full place-items-center overflow-hidden rounded-[32px] bg-gradient-to-b from-[#f3ece0] to-[#e3d6bf]">
      <div className="absolute aspect-square w-[78%] rounded-full border border-dashed border-gold/50 [animation:orbit_40s_linear_infinite]" />
      <div className="absolute aspect-square w-[56%] rounded-full border border-gold/25" />
      <div className="absolute h-[1px] w-[70%] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="relative max-w-[22ch] px-6 text-center">
        <p className="eyebrow text-gold">3D model space</p>
        <p className="display mt-3 text-[clamp(1.4rem,4.5vw,2rem)] leading-tight text-charcoal">
          Awaiting an accurate model from MOB.
        </p>
        <p className="mt-3 text-[0.75rem] leading-relaxed text-stone">
          I will not show a guessed 3D version of a real product.
        </p>
      </div>
    </div>
  )
}

function EnquiryPanel() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
      <Reveal>
        <div className="grid gap-10 rounded-[32px] bg-cream p-7 shadow-[0_30px_80px_-50px_rgba(30,29,27,0.45)] sm:p-12 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="eyebrow text-gold">Interested in the Neck Healer?</p>
            <h3 className="display mt-4 text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.05]">Let’s talk, honestly and personally.</h3>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-ink/80">
              Ask me anything. Price, availability, how it is used, whether it suits your routine. I will answer you myself,
              and point you to the official MOB details too.
            </p>
            {product.pending && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-champagne/70 px-3 py-1.5 text-[0.7rem] text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Product details pending verification with MOB
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button type="button" onClick={() => startOrder(product.name)} className="btn btn-primary w-full">
              Order the Neck Healer <ArrowIcon />
            </button>
            <a
              href={whatsappLink('Hi Karmen, I would like to enquire about the MOB Neck Healer.')}
              target="_blank"
              rel="noopener"
              className="btn btn-sage w-full"
            >
              <WhatsAppIcon /> Enquire on WhatsApp
            </a>
            <a href={product.officialUrl} target="_blank" rel="noopener" className="btn btn-ghost w-full">
              Official MOB product page <ExternalIcon />
            </a>
            <a href="#collection" className="group mt-1 inline-flex items-center justify-center gap-2 text-[0.85rem] text-stone hover:text-charcoal">
              See the full collection <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

function Header() {
  return (
    <>
      <p className="eyebrow text-gold">Featured from MOB Neck &amp; Back Rest</p>
      <h2 id="neck-title" className="display mt-5 text-[clamp(3rem,12vw,9rem)]">
        Neck Healer
      </h2>
      <p className="mx-auto mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-stone">
        A product by MOB, featured in the {site.brand} collection.
      </p>
    </>
  )
}

export function NeckHealer() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduce || !track.current) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(track)
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 1 },
        scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
      })

      gsap.set(q('[data-l="frame"], [data-l="usage"], [data-l="close"], [data-l="life"], [data-l="model"]'), { autoAlpha: 0 })
      gsap.set(q('[data-l="frame"]'), { scale: 0.72, y: 40 })
      gsap.set(q('[data-l="usage"]'), { yPercent: 18 })
      gsap.set(q('[data-l="close"], [data-l="life"]'), { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0% round 32px)' })
      gsap.set(q('[data-l="model"]'), { scale: 0.9 })
      gsap.set(q('[data-pin]'), { autoAlpha: 0, scale: 0.6 })
      gsap.set(q('[data-cap]'), { autoAlpha: 0, y: 18 })
      gsap.set(q('[data-l="title"]'), { autoAlpha: 1 })

      tl
        // A → B: title lifts away, product frame blooms
        .to(q('[data-l="title"]'), { autoAlpha: 0, y: -80, filter: 'blur(8px)' })
        .to(q('[data-l="frame"]'), { autoAlpha: 1, scale: 1, y: 0, duration: 1.2 }, '<0.2')
        .to(q('[data-cap="0"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.4')
        // C: callouts
        .to(q('[data-cap="0"]'), { autoAlpha: 0, y: -14, duration: 0.5 }, '+=0.6')
        .to(q('[data-cap="1"]'), { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(q('[data-pin]'), { autoAlpha: 1, scale: 1, stagger: 0.25, duration: 0.6, ease: 'back.out(1.6)' }, '<')
        // D: usage
        .to(q('[data-pin]'), { autoAlpha: 0, duration: 0.4 }, '+=0.8')
        .to(q('[data-cap="1"]'), { autoAlpha: 0, y: -14, duration: 0.5 }, '<')
        .to(q('[data-l="frame"]'), { scale: 0.9, autoAlpha: 0, duration: 0.9 }, '<')
        .to(q('[data-l="usage"]'), { autoAlpha: 1, yPercent: 0, duration: 1 }, '<0.2')
        .to(q('[data-cap="2"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.3')
        // E: close up wipe, then lifestyle wipe
        .to(q('[data-cap="2"]'), { autoAlpha: 0, y: -14, duration: 0.5 }, '+=0.8')
        .to(q('[data-l="close"]'), { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.1 }, '<')
        .to(q('[data-cap="3"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.4')
        .to(q('[data-l="life"]'), { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.1 }, '+=0.6')
        // F: 3D placeholder
        .to(q('[data-cap="3"]'), { autoAlpha: 0, y: -14, duration: 0.5 }, '+=0.7')
        .to(q('[data-l="model"]'), { autoAlpha: 1, scale: 1, duration: 1 }, '<')
        .to(q('[data-cap="4"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.3')
        .to({}, { duration: 0.8 })
        .to(q('[data-l="progress"]'), { scaleX: 1, ease: 'none', duration: tl.duration() }, 0)
    }, track)
    return () => ctx.revert()
  }, [reduce])

  if (reduce) {
    return (
      <section id="neck-healer" aria-labelledby="neck-title" className="bg-ivory">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 text-center sm:px-8">
          <Header />
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:grid-cols-2 sm:px-8">
          {[show.hero, show.usage, show.closeUp, show.lifestyle].map((m) => (
            <MediaSlot key={m.label} media={m} className="aspect-[4/5] rounded-[28px]" />
          ))}
          <div className="aspect-[4/5]"><ModelPlaceholder /></div>
          <ul className="space-y-3 self-center">
            {show.callouts.map((c) => (
              <li key={c.label} className="rounded-2xl border border-charcoal/10 p-4 text-sm"><b className="font-medium">{c.label}.</b> {c.text}</li>
            ))}
          </ul>
        </div>
        <EnquiryPanel />
      </section>
    )
  }

  return (
    <section id="neck-healer" aria-labelledby="neck-title" className="relative bg-ivory">
      <div ref={track} className="relative h-[620svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* soft stage light */}
          <div className="pointer-events-none absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/70 blur-[90px]" />

          {/* Title */}
          <div data-l="title" className="absolute inset-0 grid place-items-center px-6 text-center">
            <div><Header /></div>
          </div>

          {/* Frame box: all media layers share it */}
          <div className="absolute left-1/2 top-[41%] aspect-[4/5] h-[min(52svh,calc(82vw*1.25))] md:top-[44%] md:h-[min(60svh,calc(82vw*1.25))] -translate-x-1/2 -translate-y-1/2">
            <div data-l="frame" className="absolute inset-0">
              <MediaSlot media={show.hero} className="h-full w-full rounded-[32px] shadow-[0_50px_100px_-50px_rgba(30,29,27,0.55)]" priority sizes="(min-width:768px) 40vw, 82vw" />
              {pins.map((pin, i) => (
                <div key={i} data-pin className="absolute" style={{ left: pin.x, top: pin.y }}>
                  <span className="absolute -left-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-ivory shadow">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  <div className={`glass absolute top-4 w-max max-w-[9.5rem] rounded-2xl px-3 py-2 text-left ${pin.align === 'right' ? 'right-0' : 'left-0'}`}>
                    <p className="eyebrow !text-[0.55rem] text-gold">{show.callouts[i].label}</p>
                    <p className="mt-0.5 text-[0.72rem] leading-snug text-ink">{show.callouts[i].text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div data-l="usage" className="absolute inset-0">
              <MediaSlot media={show.usage} className="h-full w-full rounded-[32px]" sizes="(min-width:768px) 40vw, 82vw" />
            </div>
            <div data-l="close" className="absolute inset-0">
              <MediaSlot media={show.closeUp} className="h-full w-full rounded-[32px]" sizes="(min-width:768px) 40vw, 82vw" />
            </div>
            <div data-l="life" className="absolute inset-0">
              <MediaSlot media={show.lifestyle} className="h-full w-full rounded-[32px]" sizes="(min-width:768px) 40vw, 82vw" />
            </div>
            <div data-l="model" className="absolute inset-0">
              <ModelPlaceholder />
            </div>
          </div>

          {/* Captions */}
          <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] md:bottom-[max(2.25rem,calc(env(safe-area-inset-bottom)+1.5rem))] px-6 text-center">
            <div className="relative mx-auto h-[5.5rem] max-w-xl">
              {captions.map((c, i) => (
                <div key={i} data-cap={i} className="absolute inset-0">
                  <p className="display text-[clamp(1.6rem,5vw,2.4rem)] leading-tight">{c.t}</p>
                  <p className="mt-1.5 text-[0.82rem] text-stone">{c.s}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-4 h-px w-28 overflow-hidden bg-charcoal/10">
              <div data-l="progress" className="h-full w-full origin-left scale-x-0 bg-gold" />
            </div>
          </div>
        </div>
      </div>
      <EnquiryPanel />
    </section>
  )
}
