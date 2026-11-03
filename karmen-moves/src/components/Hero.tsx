import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useRange } from '../lib/useRange'
import { useRef } from 'react'
import { site } from '../data/content'

const ease = [0.22, 1, 0.36, 1] as const
const opening = ['MOVEMENT', 'IS', 'PRECIOUS.']

function Buttons() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a href="#collection" className="btn btn-primary w-full sm:w-auto">Explore Our Collection</a>
      <a href="#story" className="btn btn-ghost w-full sm:w-auto">Meet the Founder</a>
    </div>
  )
}

function Brand({ letterSpacing }: { letterSpacing?: unknown }) {
  return (
    <>
      <p className="eyebrow text-gold">{site.tagline}</p>
      <motion.h1
        className="display mt-6 text-[clamp(2.9rem,13vw,10.5rem)] font-light text-charcoal"
        style={letterSpacing ? { letterSpacing: letterSpacing as string } : undefined}
      >
        KARMEN<br className="sm:hidden" /> MOVES
      </motion.h1>
      <div className="hairline mx-auto mt-7 w-40" />
      <p className="display mx-auto mt-7 max-w-[22ch] text-[clamp(1.5rem,4.6vw,2.6rem)] italic leading-[1.15] text-ink">
        Comfort that supports the way you move.
      </p>
    </>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] })

  // a slow sunrise: night, warm dusk, champagne, ivory
  const bg = useRange(p, [0.2, 0.32, 0.42, 0.5], ['#0e0d0c', '#2e271f', '#d9c9ad', '#f6f1e9'])
  const openOpacity = useRange(p, [0, 0.26], [1, 0])
  const openY = useRange(p, [0, 0.3], [0, -70])
  const openBlur = useRange(p, [0.05, 0.28], ['blur(0px)', 'blur(10px)'])
  const cueOpacity = useRange(p, [0, 0.08], [1, 0])
  const brandOpacity = useRange(p, [0.38, 0.56], [0, 1])
  const brandY = useRange(p, [0.38, 0.62], [40, 0])
  const spacing = useRange(p, [0.38, 0.7], ['0.42em', '0.06em'])
  const stageScale = useRange(p, [0.8, 1], [1, 0.93])
  const stageRadius = useRange(p, [0.8, 1], [0, 36])

  if (reduce) {
    return (
      <section id="top" aria-label="Introduction">
        <div className="grid min-h-[70svh] place-items-center bg-night px-6 text-center">
          <p className="display text-[clamp(2.4rem,9vw,7rem)] text-ivory">MOVEMENT IS PRECIOUS.</p>
        </div>
        <div className="bg-ivory px-6 py-28 text-center">
          <Brand />
          <Buttons />
        </div>
      </section>
    )
  }

  return (
    <section id="top" ref={track} aria-label="Introduction" className="relative h-[260svh] bg-night">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ backgroundColor: bg, scale: stageScale, borderRadius: stageRadius }}
          className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 will-change-transform"
        >
          {/* Opening line */}
          <motion.div style={{ opacity: openOpacity, y: openY, filter: openBlur }} className="absolute inset-0 grid place-items-center px-6">
            <div className="text-center">
              <p className="display flex flex-wrap justify-center gap-x-[0.28em] text-[clamp(2.5rem,10vw,8.5rem)] text-ivory">
                {opening.map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.6, delay: 0.5 + i * 0.75, ease }}
                    className="inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </p>
              <motion.div
                className="hairline mx-auto mt-8 w-48 origin-center"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 2.8, ease }}
              />
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-center text-ivory/60"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6, duration: 1.2 }}>
              <p className="eyebrow !text-[0.6rem]">Scroll</p>
              <div className="mx-auto mt-3 h-10 w-px bg-ivory/40 [animation:cue_2.4s_ease-in-out_infinite]" />
            </motion.div>
          </motion.div>

          {/* Brand reveal */}
          <motion.div style={{ opacity: brandOpacity, y: brandY }} className="relative w-full max-w-5xl text-center">
            <Brand letterSpacing={spacing} />
            <Buttons />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
