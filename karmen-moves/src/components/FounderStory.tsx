import { motion, useReducedMotion, useScroll, type MotionValue } from 'motion/react'
import { useRange } from '../lib/useRange'
import { useRef } from 'react'
import { founderChapters, site } from '../data/content'
import { MediaSlot } from './MediaSlot'
import { Reveal } from '../lib/Reveal'

const N = founderChapters.length
const c01 = (v: number) => Math.min(1, Math.max(0, v))

/** opacity window for chapter i across progress 0..1 */
function windowFor(i: number) {
  const s = i / N
  const e = (i + 1) / N
  const f = 0.035
  if (i === 0) return { input: [0, e - f, e + f], output: [1, 1, 0] }
  if (i === N - 1) return { input: [s - f, s + f, 1], output: [0, 1, 1] }
  return { input: [s - f, s + f, e - f, e + f], output: [0, 1, 1, 0] }
}

function Chapter({ i, p }: { i: number; p: MotionValue<number> }) {
  const c = founderChapters[i]
  const w = windowFor(i)
  const opacity = useRange(p, w.input, w.output)
  const y = useRange(p, [c01(i / N - 0.05), i / N + 0.05, (i + 1) / N], i === 0 ? [0, 0, -18] : [28, 0, -18])
  return (
    <motion.article style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center" aria-hidden={false}>
      <p className="eyebrow text-gold">{c.when}</p>
      <h3 className="display mt-4 text-[clamp(2.1rem,7.4vw,5rem)] leading-[1.02]">{c.statement}</h3>
      <p className="mt-6 max-w-[38ch] text-[0.98rem] leading-relaxed opacity-75 sm:text-[1.05rem]">{c.body}</p>
    </motion.article>
  )
}

function Portrait({ i, p }: { i: number; p: MotionValue<number> }) {
  const c = founderChapters[i]
  const w = windowFor(i)
  const opacity = useRange(p, w.input, w.output)
  const scale = useRange(p, [c01(i / N - 0.05), c01((i + 1) / N + 0.05)], [1.08, 1])
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <MediaSlot media={c.media} className="h-full w-full rounded-[28px]" sizes="(min-width:1024px) 40vw, 80vw" />
    </motion.div>
  )
}

function TimelineDot({ i, p }: { i: number; p: MotionValue<number> }) {
  const on = useRange(p, [c01(i / N - 0.001), i / N + 0.02], i === 0 ? [1, 1] : [0.25, 1])
  return (
    <motion.li style={{ opacity: on }} className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      <span className="eyebrow !text-[0.58rem]">{founderChapters[i].when}</span>
    </motion.li>
  )
}

export function FounderStory() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const bg = useRange(p, [0, 0.5, 0.71, 0.77], ['#0e0d0c', '#1e1d1b', '#24221f', '#f6f1e9'])
  const fg = useRange(p, [0, 0.71, 0.77], ['#f6f1e9', '#f6f1e9', '#1e1d1b'])
  const fill = useRange(p, [0, 1], [0, 1])

  const Intro = (
    <div className="mx-auto max-w-6xl px-5 pb-6 pt-28 sm:px-8 sm:pt-36">
      <Reveal>
        <p className="eyebrow text-gold">The founder</p>
        <h2 className="display mt-5 max-w-[16ch] text-[clamp(2.6rem,8vw,6rem)]">
          Hi, I’m {site.founder.split(' ')[0]}.
        </h2>
        <p className="mt-6 max-w-[42ch] text-[1rem] leading-relaxed opacity-70">
          This is where KARMEN MOVES began. Not with a product. With a moment, and everything that came after it.
        </p>
      </Reveal>
    </div>
  )

  if (reduce) {
    return (
      <section id="story" aria-labelledby="story-title" className="bg-night text-ivory">
        <h2 id="story-title" className="sr-only">The founder story</h2>
        {Intro}
        <div className="mx-auto max-w-6xl space-y-24 px-5 pb-28 sm:px-8">
          {founderChapters.map((c) => (
            <article key={c.id} className="grid gap-8 md:grid-cols-2 md:items-center">
              <MediaSlot media={c.media} className="aspect-[4/5] rounded-[28px]" />
              <div>
                <p className="eyebrow text-gold">{c.when}</p>
                <h3 className="display mt-4 text-[clamp(2rem,6vw,4rem)] leading-[1.05]">{c.statement}</h3>
                <p className="mt-5 max-w-[38ch] leading-relaxed opacity-75">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <motion.section id="story" aria-labelledby="story-title" style={{ backgroundColor: bg, color: fg }} className="relative">
      <h2 id="story-title" className="sr-only">The founder story</h2>
      {Intro}
      <div ref={track} className="relative h-[520svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[minmax(0,44%)_minmax(0,1fr)] gap-6 px-5 pb-10 pt-24 sm:px-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1 md:items-center md:gap-16 md:py-24">
            {/* Portraits */}
            <div className="relative mx-auto h-full w-full max-w-[26rem] md:aspect-[4/5] md:h-auto">
              {founderChapters.map((c, i) => <Portrait key={c.id} i={i} p={p} />)}
            </div>
            {/* Text */}
            <div className="relative h-full">
              {founderChapters.map((c, i) => <Chapter key={c.id} i={i} p={p} />)}
            </div>
          </div>
          {/* Timeline */}
          <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="flex gap-4">
              <div className="relative h-56 w-px bg-current/15">
                <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gold" />
              </div>
              <ul className="flex h-56 flex-col justify-between">
                {founderChapters.map((c, i) => <TimelineDot key={c.id} i={i} p={p} />)}
              </ul>
            </div>
          </div>
          <div className="absolute inset-x-5 top-[calc(env(safe-area-inset-top)+5.25rem)] h-px bg-current/10 lg:hidden">
            <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-gold" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
