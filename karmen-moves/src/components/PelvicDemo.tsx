import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pelvicDemo as demo, products } from '../data/content'
import { MediaSlot } from './MediaSlot'
import { ArrowIcon } from '../lib/icons'
import { startOrder } from './OrderEnquiry'
import type { PelvicStage } from '../demo/pelvicScene'
import { createTurntable, type Turntable } from '../demo/turntable'

gsap.registerPlugin(ScrollTrigger)

const product = products.find((p) => p.id === 'pelvic-hold')!
export const PRODUCT_EVENT = 'km:product'
const openProduct = () => window.dispatchEvent(new CustomEvent(PRODUCT_EVENT, { detail: product.id }))

// progress helpers (kept local so the 3D module can load lazily)
const c01 = (v: number) => Math.min(1, Math.max(0, v))
const range = (p: number, a: number, b: number) => c01((p - a) / (b - a))
const win = (p: number, a: number, b: number, f = 0.03) => Math.min(range(p, a, a + f), 1 - range(p, b - f, b))

const CAPTIONS = [
  { id: 'problem', a: -1, b: 0.15, eyebrow: 'MOB Pelvic-Hold · How to use', title: 'You’re sitting.\nBut are you supported?', sub: 'Scroll to see how the MOB Pelvic-Hold Seat Support fits into your everyday chair.' },
  { id: 'reveal', a: 0.165, b: 0.32, eyebrow: 'Introducing', title: 'MOB Pelvic-Hold\nSeat Support', sub: 'Made by MOB Neck & Back Rest. Shown from official product photographs.' },
  { id: 'position', a: 0.335, b: 0.5, eyebrow: 'Step 1', title: 'Position your support.', sub: demo.steps.position.sub, pending: demo.steps.position.pending || !demo.placement.verified },
  { id: 'sit', a: 0.51, b: 0.7, eyebrow: 'Step 2', title: 'Sit comfortably.', sub: demo.steps.sit.sub, pending: demo.steps.sit.pending },
  { id: 'settle', a: 0.71, b: 0.865, eyebrow: 'Step 3', title: 'Find your comfortable position.', sub: demo.steps.settle.sub, pending: demo.steps.settle.pending },
]
const DOTS = [0.07, 0.24, 0.42, 0.6, 0.78, 0.94]

function Pending({ children = 'Pending MOB verification' }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/80 px-2.5 py-1 text-[0.65rem] tracking-wide text-ink">
      <span className="h-1 w-1 rounded-full bg-gold" /> {children}
    </span>
  )
}

function FinalCard({ still }: { still?: boolean }) {
  return (
    <div className={`mx-auto grid w-full max-w-4xl items-center gap-6 rounded-[32px] bg-cream/95 p-5 shadow-[0_40px_100px_-50px_rgba(30,29,27,0.55)] backdrop-blur-md sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10 ${still ? '' : 'ring-1 ring-charcoal/5'}`}>
      <MediaSlot media={product.gallery[1]} className="aspect-[4/3] w-full rounded-[22px] md:aspect-[4/5]" sizes="(min-width:768px) 36vw, 90vw" />
      <div>
        <p className="eyebrow text-gold">MOB Pelvic-Hold Seat Support</p>
        <h3 className="display mt-4 text-[clamp(2rem,5.2vw,3.4rem)] leading-[1.02]">Your everyday sitting routine deserves attention.</h3>
        <p className="mt-4 max-w-[40ch] text-[0.92rem] leading-relaxed text-ink/80">
          Explore the product details, or send me an order enquiry. No payment is needed to ask.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" data-final-btn onClick={openProduct} className="btn btn-primary">
            Explore MOB Pelvic-Hold <ArrowIcon />
          </button>
          <button type="button" data-final-btn onClick={() => startOrder(product.name)} className="btn btn-ghost">
            Order enquiry
          </button>
        </div>
      </div>
    </div>
  )
}

/** Reduced motion or no WebGL: the same story as calm, still steps. */
function StillSteps({ stills }: { stills: (string | null)[] }) {
  const items = [
    ...CAPTIONS.map((c, i) => ({ ...c, img: i === 1 ? null : stills[i] })),
  ]
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="space-y-16">
        {items.map((c, i) => (
          <article key={c.id} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
            {i === 1 || !c.img ? (
              <MediaSlot media={product.gallery[i === 1 ? 0 : 2]} className="aspect-[4/3] w-full rounded-[28px]" />
            ) : (
              <img src={c.img} alt={`${c.title.replace('\n', ' ')} Illustrated with a placeholder for the product.`} className="aspect-[4/3] w-full rounded-[28px] bg-champagne/40 object-cover" />
            )}
            <div>
              <p className="eyebrow text-gold">{c.eyebrow}</p>
              <h3 className="display mt-3 whitespace-pre-line text-[clamp(2rem,6vw,3.4rem)] leading-[1.02]">{c.title}</h3>
              <p className="mt-4 max-w-[42ch] leading-relaxed text-ink/80">{c.sub}</p>
              {'pending' in c && c.pending && <div className="mt-4"><Pending /></div>}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-20"><FinalCard still /></div>
    </div>
  )
}

export function PelvicDemo() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const stageBox = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const ttCanvas = useRef<HTMLCanvasElement>(null)
  const stage = useRef<PelvicStage | null>(null)
  const turntable = useRef<Turntable | null>(null)
  const progress = useRef(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [stills, setStills] = useState<(string | null)[] | null>(null)

  // ----- lazy load the 3D stage only when the section gets close -----
  useEffect(() => {
    const el = reduce ? stageBox.current : track.current
    if (!el) return
    let cancelled = false
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      try {
        const { createPelvicStage } = await import('../demo/pelvicScene')
        if (cancelled) return
        if (reduce) {
          // render still frames once, then release the GPU
          const c = document.createElement('canvas')
          const box = document.createElement('div')
          box.style.cssText = 'position:fixed;left:-9999px;top:0;width:960px;height:720px'
          box.appendChild(c)
          document.body.appendChild(box)
          const s = createPelvicStage(c, { placementZ: demo.placement.z, placementRotY: demo.placement.rotationY })
          const shots = [0.08, 0, 0.49, 0.69, 0.85].map((p, i) => (i === 1 ? null : s.snapshot(p, 960, 720)))
          s.dispose()
          box.remove()
          setStills(shots)
          return
        }
        stage.current = createPelvicStage(canvas.current!, { placementZ: demo.placement.z, placementRotY: demo.placement.rotationY })
        setReady(true)
      } catch {
        setFailed(true)
        setStills([])
      }
    }, { rootMargin: '150% 0px 150% 0px' })
    io.observe(el)
    return () => { cancelled = true; io.disconnect() }
  }, [reduce])

  useEffect(() => () => { stage.current?.dispose(); stage.current = null }, [])

  // ----- the scroll timeline: one value drives the 3D stage and every overlay -----
  useLayoutEffect(() => {
    if (reduce || failed || !track.current) return
    const q = gsap.utils.selector(track)
    if (ttCanvas.current) turntable.current = createTurntable(ttCanvas.current, demo.turntableFrames, demo.placeholderFrameCount)

    let raf = 0
    const paint = () => {
      raf = 0
      const p = progress.current
      stage.current?.render(p)
      turntable.current?.draw(range(p, 0.18, 0.3))

      // captions: lift in, lift out, fully reversible
      CAPTIONS.forEach((c) => {
        const el = q(`[data-cap="${c.id}"]`)[0] as HTMLElement | undefined
        if (!el) return
        const i = c.a < 0 ? 1 : range(p, c.a, c.a + 0.03)
        const o = range(p, c.b - 0.03, c.b)
        el.style.opacity = String(Math.min(i, 1 - o))
        el.style.transform = `translate3d(0, ${(1 - i) * 28 - o * 28}px, 0)`
        el.style.visibility = Math.min(i, 1 - o) < 0.01 ? 'hidden' : 'visible'
      })

      // ivory veil behind the photo sequence and the finale
      const veil = Math.max(0.86 * win(p, 0.15, 0.335, 0.035), 0.72 * range(p, 0.875, 0.93))
      const v = q('[data-veil]')[0] as HTMLElement
      if (v) v.style.opacity = String(veil)

      // photo sequence card: rises in, rotates by scroll, then hands over to the 3D support
      const card = q('[data-turntable]')[0] as HTMLElement
      if (card) {
        const inn = range(p, 0.155, 0.21)
        const out = range(p, 0.295, 0.335)
        card.style.opacity = String(Math.min(inn, 1 - out))
        card.style.visibility = Math.min(inn, 1 - out) < 0.01 ? 'hidden' : 'visible'
        const sc = 0.86 + 0.14 * (1 - Math.pow(1 - inn, 3)) - 0.42 * out
        card.style.transform = `translate3d(${out * 18}vw, ${(1 - inn) * 40 + out * 10}px, 0) scale(${sc})`
      }

      // close up annotations: dot on the 3D point, label nudged into view, line between them
      const an = stage.current?.anchors()
      const aOn = win(p, 0.735, 0.865, 0.025)
      const box = stageBox.current
      const W = box?.clientWidth ?? 0
      const H = box?.clientHeight ?? 0
      const pad = 12
      const OFFSETS: Record<string, [number, number]> = { product: [-0.5, 1], area1: [-1, -1], area2: [0, -1] } // label anchor direction
      demo.annotations.forEach((a, i) => {
        const label = q(`[data-anno="${a.id}"]`)[0] as HTMLElement | undefined
        const dot = q(`[data-anno-dot="${a.id}"]`)[0] as HTMLElement | undefined
        const line = q(`[data-anno-line="${a.id}"]`)[0] as unknown as SVGLineElement | undefined
        const pt = an?.[a.id as 'product' | 'area1' | 'area2']
        if (!label || !dot || !line || !pt) return
        const o = Math.min(aOn, range(p, 0.735 + i * 0.02, 0.765 + i * 0.02))
        const vis = o < 0.01 ? 'hidden' : 'visible'
        const lw = label.offsetWidth, lh = label.offsetHeight
        const [ox, oy] = OFFSETS[a.id] ?? [0, -1]
        const gap = Math.min(64, W * 0.1)
        let lx = pt.x + (ox < 0 ? (ox === -0.5 ? -lw / 2 : -lw - gap * 0.6) : gap * 0.6)
        let ly = pt.y + (oy < 0 ? -lh - gap : gap)
        lx = Math.min(Math.max(lx, pad), W - lw - pad)
        ly = Math.min(Math.max(ly, pad + 70), H - lh - pad - 40)
        label.style.transform = `translate3d(${lx}px, ${ly}px, 0)`
        dot.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`
        const ex = Math.min(Math.max(pt.x, lx + 14), lx + lw - 14)
        const ey = ly + (ly + lh / 2 < pt.y ? lh : 0)
        line.setAttribute('x1', String(pt.x)); line.setAttribute('y1', String(pt.y))
        line.setAttribute('x2', String(ex)); line.setAttribute('y2', String(ey))
        for (const el of [label, dot] as HTMLElement[]) { el.style.opacity = String(o); el.style.visibility = vis }
        line.setAttribute('opacity', String(o))
      })

      // provisional placement note rides with the support as it lands
      const note = q('[data-placement-note]')[0] as HTMLElement | undefined
      if (note && an) {
        const o = win(p, 0.47, 0.6, 0.02)
        note.style.opacity = String(o)
        note.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        note.style.transform = `translate3d(${an.support.x}px, ${an.support.y + 34}px, 0)`
      }

      // finale
      const fin = q('[data-final]')[0] as HTMLElement
      if (fin) {
        const f = range(p, 0.885, 0.945)
        fin.style.opacity = String(f)
        fin.style.visibility = f < 0.01 ? 'hidden' : 'visible'
        fin.style.transform = `translate3d(0, ${(1 - f) * 36}px, 0) scale(${0.97 + 0.03 * f})`
        fin.style.pointerEvents = f > 0.6 ? 'auto' : 'none'
      }

      // progress rail
      q('[data-dot]').forEach((d, i) => {
        const on = p >= DOTS[i] - 0.06
        ;(d as HTMLElement).dataset.on = String(on)
      })
      const bar = q('[data-bar]')[0] as HTMLElement
      if (bar) bar.style.transform = `scaleX(${p})`
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }

    const ctx = gsap.context(() => {
      const proxy = { p: 0 }
      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65, // a touch of inertia, like a camera on a rail
          invalidateOnRefresh: true,
        },
        onUpdate: () => { progress.current = proxy.p; schedule() },
      })
    }, track)

    const onResize = () => { stage.current?.resize(); turntable.current?.resize(); schedule() }
    window.addEventListener('resize', onResize)
    schedule()
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [reduce, failed, ready])

  if (reduce || failed) {
    return (
      <section id="pelvic-demo" aria-labelledby="pelvic-demo-title" className="bg-ivory">
        <h2 id="pelvic-demo-title" className="sr-only">How to use the MOB Pelvic-Hold Seat Support</h2>
        <div ref={stageBox}>
          <StillSteps stills={stills ?? []} />
        </div>
      </section>
    )
  }

  return (
    <section id="pelvic-demo" aria-labelledby="pelvic-demo-title" className="relative bg-ivory">
      <h2 id="pelvic-demo-title" className="sr-only">How to use the MOB Pelvic-Hold Seat Support, a scroll demonstration</h2>
      <div ref={track} className="relative h-[780svh]">
        <div ref={stageBox} className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(120%_80%_at_60%_45%,#fbf8f3_0%,#f1e8da_55%,#e6d9c3_100%)]">
          {/* 3D stage */}
          <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />
          {!ready && (
            <div className="absolute inset-0 grid place-items-center">
              <p className="eyebrow animate-pulse text-stone">Preparing the demonstration</p>
            </div>
          )}

          {/* soft ivory wash behind the captions on phones, so text always reads over the 3D stage */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-ivory via-ivory/80 to-transparent lg:hidden" />

          {/* veil for the photo sequence and the finale */}
          <div data-veil className="pointer-events-none absolute inset-0 bg-ivory opacity-0" />

          {/* annotations: dots follow the 3D support, labels stay inside the screen, lines join them */}
          <div className="pointer-events-none absolute inset-0">
            <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              {demo.annotations.map((a) => (
                <line key={a.id} data-anno-line={a.id} x1="0" y1="0" x2="0" y2="0" stroke="#b8975a" strokeOpacity="0.8" strokeWidth="1" opacity="0" />
              ))}
            </svg>
            {demo.annotations.map((a) => (
              <div key={a.id}>
                <span data-anno-dot={a.id} className="invisible absolute -left-[7px] -top-[7px] grid h-3.5 w-3.5 place-items-center rounded-full bg-ivory opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <div data-anno={a.id} className="glass invisible absolute left-0 top-0 w-max max-w-[min(13rem,44vw)] rounded-2xl px-3 py-2 opacity-0">
                  <p className="text-[0.72rem] leading-snug text-charcoal">{a.label}</p>
                  {a.pending && <p className="mt-0.5 text-[0.6rem] text-stone">Pending MOB verification</p>}
                </div>
              </div>
            ))}
            {!demo.placement.verified && (
              <div data-placement-note className="invisible absolute left-0 top-0 opacity-0">
                <p className="-translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal/85 px-3 py-1.5 text-[0.65rem] text-ivory">
                  Placeholder shape · provisional position
                </p>
              </div>
            )}
          </div>

          {/* photo sequence (official MOB turntable photos go here) */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 pt-[18svh] lg:pl-[38%] lg:pt-0">
            <div data-turntable className="invisible aspect-[4/5] w-[min(70vw,23rem)] overflow-hidden rounded-[28px] opacity-0 shadow-[0_50px_100px_-50px_rgba(30,29,27,0.6)] will-change-transform lg:w-[min(30vw,25rem)]">
              <canvas ref={ttCanvas} aria-hidden="true" className="h-full w-full" />
            </div>
          </div>

          {/* captions */}
          <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-[calc(env(safe-area-inset-top)+5.5rem)] sm:px-8 lg:inset-y-0 lg:flex lg:items-center lg:pt-0 lg:pl-[max(2.5rem,calc((100vw-72rem)/2+2rem))]">
            <div className="relative w-full max-w-[28rem] md:max-w-[34rem] lg:h-[18rem] lg:max-w-[28rem]">
              {CAPTIONS.map((c, i) => (
                <div key={c.id} data-cap={c.id} className={`absolute inset-x-0 top-0 will-change-transform lg:top-1/2 lg:-translate-y-1/2 ${i === 0 ? '' : 'invisible opacity-0'}`}>
                  <p className="eyebrow text-gold">{c.eyebrow}</p>
                  <h3 className="display mt-3 whitespace-pre-line text-[clamp(2.1rem,7.6vw,4.4rem)] leading-[1.0] text-charcoal">{c.title}</h3>
                  <p className="mt-4 max-w-[36ch] text-[0.9rem] leading-relaxed text-ink/75 lg:text-[0.98rem]">{c.sub}</p>
                  {'pending' in c && c.pending && <div className="mt-3"><Pending /></div>}
                </div>
              ))}
            </div>
          </div>

          {/* finale */}
          <div data-final className="invisible absolute inset-0 grid place-items-center px-4 opacity-0 sm:px-8" style={{ pointerEvents: 'none' }}>
            <FinalCard />
          </div>

          {/* progress rail */}
          <div className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] left-1/2 flex lg:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] -translate-x-1/2 flex-col items-center gap-2.5">
            <div className="flex gap-2">
              {DOTS.map((d) => (
                <span key={d} data-dot data-on="false" className="h-1.5 w-1.5 rounded-full bg-charcoal/20 transition-colors duration-500 data-[on=true]:bg-gold" />
              ))}
            </div>
            <div className="h-px w-24 overflow-hidden bg-charcoal/10"><div data-bar className="h-full w-full origin-left scale-x-0 bg-gold" /></div>
          </div>

          <p className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 hidden max-w-[17rem] text-right text-[0.65rem] leading-snug text-stone lg:block">
            Demonstration preview. Product shown as a labelled placeholder until MOB’s official photos and instructions are added.
          </p>
        </div>
      </div>
    </section>
  )
}
