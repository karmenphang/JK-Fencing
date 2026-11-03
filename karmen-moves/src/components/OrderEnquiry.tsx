import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { products, site } from '../data/content'
import { MediaSlot } from './MediaSlot'
import { ArrowIcon, WhatsAppIcon } from '../lib/icons'
import { emptyEnquiry, enquiryLink, makeEnquiryRef, MAX_QTY, MY_STATES, type Enquiry } from '../lib/order'

export const ORDER_EVENT = 'km:order'

/** Any button on the page can open the enquiry with a product chosen. */
export function startOrder(productName: string) {
  window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: productName }))
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const NOTICE = 'Order enquiry only — no payment required yet.'
const STEPS = ['Product', 'Details', 'Review'] as const
/** 'handoff' = WhatsApp has been opened, but we cannot know if the customer pressed Send */
type Step = 0 | 1 | 2 | 'handoff'
const DRAFT_KEY = 'km-enquiry-draft'

const ease = [0.22, 1, 0.36, 1] as const
const field =
  'mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3.5 text-[1rem] text-charcoal outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-stone/60 focus:border-gold focus:shadow-[0_0_0_4px_rgba(184,151,90,0.15)] user-invalid:border-[#a5523f]'
const labelCls = 'block text-[0.85rem] text-ink'

interface Draft { data: Enquiry; ref: string; handoff: boolean }

/** Tab only draft, so a phone that reloads the page after switching to WhatsApp keeps the enquiry and its reference. */
function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const d = JSON.parse(raw) as Partial<Draft>
    return { data: { ...emptyEnquiry(products[0].name), ...d.data }, ref: d.ref ?? '', handoff: !!(d.handoff && d.ref) }
  } catch {
    return null
  }
}
function writeDraft(d: Draft | null) {
  try {
    if (d) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable: the form still works */
  }
}

function Notice({ tone = 'light' }: { tone?: 'light' | 'sage' }) {
  return (
    <p
      className={`flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[0.82rem] leading-snug ${
        tone === 'sage' ? 'bg-sage/25 text-sage-deep' : 'bg-champagne/60 text-ink'
      }`}
    >
      <svg viewBox="0 0 24 24" className="mt-px h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.2v.1" strokeLinecap="round" />
      </svg>
      <span><b className="font-medium">{NOTICE}</b></span>
    </p>
  )
}

function Stepper({ step }: { step: Step }) {
  const idx = step === 'handoff' ? 2 : step
  return (
    <ol className="flex items-center gap-2" aria-label="Enquiry progress">
      {STEPS.map((s, i) => {
        const state = i < idx ? 'done' : i === idx ? 'current' : 'todo'
        return (
          <li key={s} className="flex flex-1 items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.7rem] transition-colors duration-500 ${
                state === 'todo' ? 'border border-charcoal/15 text-stone' : 'bg-charcoal text-ivory'
              }`}
            >
              {state === 'done' ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={`text-[0.78rem] ${state === 'todo' ? 'text-stone' : 'text-charcoal'}`}>
              {s}
              <span className="sr-only">{state === 'done' ? ' (completed)' : state === 'current' ? ' (current step)' : ''}</span>
            </span>
            {i < STEPS.length - 1 && <span className={`h-px flex-1 transition-colors duration-500 ${i < idx ? 'bg-gold' : 'bg-charcoal/10'}`} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function Panel({ k, children }: { k: string; children: ReactNode }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  )
}

function StepTitle({ children, id }: { children: ReactNode; id: string }) {
  return (
    <h3 id={id} tabIndex={-1} className="display text-[clamp(1.8rem,5vw,2.4rem)] leading-tight outline-none">
      {children}
    </h3>
  )
}

function SummaryBlock({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow !text-[0.6rem] text-gold">{title}</p>
        {onEdit && (
          <button type="button" onClick={onEdit} className="-my-2 min-h-9 rounded-full px-3 text-[0.78rem] text-stone underline-offset-4 hover:text-charcoal hover:underline">
            Edit<span className="sr-only"> {title.toLowerCase()}</span>
          </button>
        )}
      </div>
      <div className="mt-2 text-[0.95rem] leading-relaxed text-charcoal">{children}</div>
    </div>
  )
}

export function OrderEnquiry() {
  const [initial] = useState(readDraft)
  const [step, setStep] = useState<Step>(initial?.handoff ? 'handoff' : 0)
  const [data, setData] = useState<Enquiry>(() => initial?.data ?? emptyEnquiry(products[0].name))
  // Consent was already given if we are restoring the hand off screen
  const [consent, setConsent] = useState(!!initial?.handoff)
  const [consentError, setConsentError] = useState(false)
  const [ref, setRef] = useState(initial?.ref ?? '')
  const card = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const set = <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => setData((d) => ({ ...d, [k]: v }))
  const product = products.find((p) => p.name === data.product) ?? products[0]

  useEffect(() => { writeDraft({ data, ref, handoff: step === 'handoff' }) }, [data, ref, step])

  // Preselect a product from any "Order this" button on the page
  useEffect(() => {
    const on = (e: Event) => {
      setData((d) => ({ ...d, product: (e as CustomEvent<string>).detail }))
      setStep(0)
      setConsent(false)
      setRef('')
    }
    window.addEventListener(ORDER_EVENT, on)
    return () => window.removeEventListener(ORDER_EVENT, on)
  }, [])

  // Move focus to the new step's title and keep the card in view on small screens
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const t = setTimeout(() => {
      document.getElementById(`enquiry-step-${step}`)?.focus({ preventScroll: true })
      const top = card.current?.getBoundingClientRect().top ?? 0
      if (top < 0 || top > window.innerHeight * 0.6) card.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 480)
    return () => clearTimeout(t)
  }, [step])

  const go = (s: Step) => setStep(s)
  // One unique reference per enquiry, created when the customer first reaches the review
  const goReview = () => { setRef((r) => r || makeEnquiryRef()); go(2) }
  const link = ref ? enquiryLink(data, ref) : '#order'

  return (
    <div ref={card} className="scroll-mt-24 rounded-[32px] bg-ivory p-5 shadow-[0_40px_90px_-60px_rgba(30,29,27,0.65)] ring-1 ring-charcoal/5 sm:p-9">
      {step !== 'handoff' && (
        <div className="space-y-5">
          <Notice />
          <Stepper step={step} />
        </div>
      )}

      <div className={step === 'handoff' ? '' : 'mt-8'}>
        <AnimatePresence mode="wait" initial={false}>
          {/* STEP 1 · PRODUCT */}
          {step === 0 && (
            <Panel k="s0">
              <form onSubmit={(e) => { e.preventDefault(); go(1) }}>
                <StepTitle id="enquiry-step-0">Which product?</StepTitle>
                <fieldset className="mt-5">
                  <legend className="sr-only">Choose a product</legend>
                  <div className="grid gap-3">
                    {products.map((p) => {
                      const on = p.name === data.product
                      return (
                        <label
                          key={p.id}
                          className={`group flex cursor-pointer items-center gap-4 rounded-[22px] border p-2.5 pr-4 transition-all duration-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                            on ? 'border-charcoal bg-cream shadow-[0_14px_30px_-22px_rgba(30,29,27,0.6)]' : 'border-charcoal/10 hover:border-charcoal/30'
                          }`}
                        >
                          <input type="radio" name="product" value={p.name} checked={on} onChange={() => set('product', p.name)} className="sr-only" />
                          <MediaSlot media={p.gallery[0]} showLabel={false} className="h-16 w-14 shrink-0 rounded-[14px]" sizes="56px" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.98rem] leading-snug text-charcoal">{p.name}</span>
                            <span className="mt-0.5 block text-[0.75rem] text-stone">by MOB Neck &amp; Back Rest</span>
                          </span>
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${on ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/20'}`} aria-hidden="true">
                            {on && <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="mt-7 flex items-center justify-between gap-4 rounded-[22px] border border-charcoal/10 px-4 py-3">
                  <span id="qty-label" className="text-[0.92rem] text-ink">Quantity</span>
                  <div className="flex items-center gap-1" role="group" aria-labelledby="qty-label">
                    <button type="button" onClick={() => set('qty', Math.max(1, data.qty - 1))} disabled={data.qty <= 1} className="grid h-11 w-11 place-items-center rounded-full text-xl text-charcoal transition-colors hover:bg-champagne/60 disabled:opacity-30" aria-label="Decrease quantity">−</button>
                    <output id="order-qty" aria-live="polite" className="w-8 text-center text-[1.05rem] tabular-nums">{data.qty}</output>
                    <button type="button" onClick={() => set('qty', Math.min(MAX_QTY, data.qty + 1))} disabled={data.qty >= MAX_QTY} className="grid h-11 w-11 place-items-center rounded-full text-xl text-charcoal transition-colors hover:bg-champagne/60 disabled:opacity-30" aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <p className="mt-3 text-[0.75rem] text-stone">Need more than {MAX_QTY}? Mention it in your notes and I will help.</p>

                <button type="submit" className="btn btn-primary mt-7 w-full">
                  Continue to your details <ArrowIcon />
                </button>
              </form>
            </Panel>
          )}

          {/* STEP 2 · DETAILS */}
          {step === 1 && (
            <Panel k="s1">
              <form onSubmit={(e) => { e.preventDefault(); goReview() }}>
                <div className="flex items-center justify-between gap-4">
                  <StepTitle id="enquiry-step-1">Your details</StepTitle>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[0.85rem] text-stone">
                  For <span className="text-charcoal">{data.product}</span> × {data.qty}
                  <button type="button" onClick={() => go(0)} className="underline underline-offset-4 hover:text-charcoal">Change</button>
                </p>

                <fieldset className="mt-6 grid gap-5 sm:grid-cols-2">
                  <legend className="eyebrow mb-1 !text-[0.6rem] text-gold sm:col-span-2">Contact</legend>
                  <label className={`${labelCls} sm:col-span-2`}>
                    Full name
                    <input id="order-name" required name="name" autoComplete="name" value={data.name} onChange={(e) => set('name', e.target.value)} className={field} />
                  </label>
                  <label className={labelCls}>
                    Phone number
                    <input id="order-phone" required name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="012 345 6789" pattern="[+]?[0-9 \-]{9,16}" title="Please enter a phone number, for example 012 345 6789" value={data.phone} onChange={(e) => set('phone', e.target.value)} className={field} />
                  </label>
                  <label className={labelCls}>
                    Email <span className="text-stone">(optional)</span>
                    <input id="order-email" name="email" type="email" autoComplete="email" value={data.email} onChange={(e) => set('email', e.target.value)} className={field} />
                  </label>
                </fieldset>

                <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
                  <legend className="eyebrow mb-1 !text-[0.6rem] text-gold sm:col-span-2">Delivery address</legend>
                  <label className={`${labelCls} sm:col-span-2`}>
                    Street address
                    <textarea id="order-address" required name="address" rows={2} autoComplete="street-address" value={data.address} onChange={(e) => set('address', e.target.value)} className={`${field} resize-none`} />
                  </label>
                  <label className={labelCls}>
                    Town or city
                    <input id="order-city" required name="city" autoComplete="address-level2" value={data.city} onChange={(e) => set('city', e.target.value)} className={field} />
                  </label>
                  <label className={labelCls}>
                    Postcode
                    <input id="order-postcode" required name="postcode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" maxLength={5} title="Malaysian postcodes have 5 digits" value={data.postcode} onChange={(e) => set('postcode', e.target.value.replace(/\D/g, ''))} className={field} />
                  </label>
                  <label className={`${labelCls} sm:col-span-2`}>
                    State
                    <select id="order-state" required name="state" value={data.state} onChange={(e) => set('state', e.target.value)} className={field}>
                      <option value="" disabled>Choose your state</option>
                      {MY_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className={`${labelCls} sm:col-span-2`}>
                    Notes <span className="text-stone">(optional)</span>
                    <textarea id="order-notes" name="notes" rows={2} maxLength={400} placeholder="Best time to reach you, or anything I should know" value={data.notes} onChange={(e) => set('notes', e.target.value)} className={`${field} resize-none`} />
                  </label>
                </fieldset>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => go(0)} className="btn btn-ghost sm:w-auto">Back</button>
                  <button type="submit" className="btn btn-primary flex-1">Review your enquiry <ArrowIcon /></button>
                </div>
              </form>
            </Panel>
          )}

          {/* STEP 3 · REVIEW */}
          {step === 2 && (
            <Panel k="s2">
              <StepTitle id="enquiry-step-2">Review your enquiry</StepTitle>
              <p className="mt-2 text-[0.85rem] text-stone">Please check everything below. You can edit any part.</p>

              <div className="mt-6 divide-y divide-charcoal/10 rounded-[24px] bg-cream p-5 sm:p-6">
                <SummaryBlock title="Product" onEdit={() => go(0)}>
                  <div className="flex items-center gap-4">
                    <MediaSlot media={product.gallery[0]} showLabel={false} className="h-[4.5rem] w-14 shrink-0 rounded-[14px]" sizes="56px" />
                    <div>
                      <p id="summary-product">{data.product}</p>
                      <p className="text-[0.85rem] text-stone">Quantity: <span id="summary-qty" className="tabular-nums text-charcoal">{data.qty}</span></p>
                    </div>
                  </div>
                </SummaryBlock>
                <SummaryBlock title="Contact" onEdit={() => go(1)}>
                  <p>{data.name}</p>
                  <p className="text-ink/80">{data.phone}</p>
                  {data.email && <p className="text-ink/80">{data.email}</p>}
                </SummaryBlock>
                <SummaryBlock title="Delivery" onEdit={() => go(1)}>
                  <p className="whitespace-pre-line">{data.address}</p>
                  <p>{data.postcode} {data.city}</p>
                  <p>{data.state}</p>
                </SummaryBlock>
                {data.notes.trim() && (
                  <SummaryBlock title="Notes" onEdit={() => go(1)}>
                    <p className="whitespace-pre-line text-ink/80">{data.notes}</p>
                  </SummaryBlock>
                )}
                <SummaryBlock title="Price and availability">
                  <p className="text-ink/80">I will confirm these with you personally on WhatsApp.</p>
                </SummaryBlock>
              </div>

              <div className="mt-6 rounded-[24px] border border-charcoal/10 p-5 sm:p-6">
                <p className="eyebrow !text-[0.6rem] text-gold">Your privacy</p>
                <ul className="mt-3 space-y-2 text-[0.85rem] leading-relaxed text-ink/80">
                  <li className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />This website does not store your details. They go into a WhatsApp message on your own device.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />Once you press send, {site.founder} receives them and uses them only to reply to your enquiry and arrange any order you choose to make.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />Messages are carried by WhatsApp (Meta) under its own privacy policy. Your details are never sold.</li>
                </ul>
                <a href="#/privacy" className="mt-3 inline-block text-[0.82rem] text-charcoal underline decoration-gold/60 underline-offset-4">Read the full privacy notice</a>

                <label className={`mt-5 flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-colors ${consentError ? 'bg-[#a5523f]/10' : 'bg-champagne/40'}`}>
                  <input
                    id="order-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setConsentError(false) }}
                    aria-describedby={consentError ? 'consent-error' : undefined}
                    aria-invalid={consentError || undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1e1d1b]"
                  />
                  <span className="text-[0.85rem] leading-relaxed text-ink">
                    I have read the privacy notice and agree that {site.brand} may use these details to reply to my enquiry on WhatsApp.
                  </span>
                </label>
                {consentError && <p id="consent-error" role="alert" className="mt-2 px-1 text-[0.8rem] text-[#a5523f]">Please tick the box to continue. Your consent is needed before WhatsApp opens.</p>}
              </div>

              <div className="mt-6"><Notice tone="sage" /></div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" onClick={() => go(1)} className="btn btn-ghost sm:w-auto">Back</button>
                <a
                  href={consent ? link : '#order'}
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => {
                    if (!consent) {
                      e.preventDefault()
                      setConsentError(true)
                      document.getElementById('order-consent')?.focus()
                      return
                    }
                    setStep('handoff')
                  }}
                  className={`btn btn-sage flex-1 ${consent ? '' : 'opacity-60'}`}
                >
                  <WhatsAppIcon /> Continue to WhatsApp
                </a>
              </div>
              <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-stone">
                Nothing is sent yet. WhatsApp opens with your enquiry written out,
                <br className="hidden sm:inline" /> and it only reaches me when you press <b className="font-medium text-ink">Send</b> there.
              </p>
            </Panel>
          )}

          {/* WHATSAPP HAND OFF · the enquiry is written out but not sent until the customer presses Send */}
          {step === 'handoff' && (
            <Panel k="handoff">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease }}
                  className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-deep text-white"
                >
                  <span className="absolute inset-0 rounded-full bg-sage-deep/40 motion-safe:animate-ping [animation-duration:2.4s]" aria-hidden="true" />
                  <WhatsAppIcon className="relative h-7 w-7" />
                </motion.div>
                <p className="eyebrow mt-6 text-gold">Almost there</p>
                <h3 id="enquiry-step-handoff" tabIndex={-1} className="display mt-3 text-[clamp(2rem,6vw,2.8rem)] leading-tight outline-none">
                  One last step, {data.name.trim().split(/\s+/)[0] || 'friend'}.
                </h3>
                <p className="mx-auto mt-3 max-w-[38ch] leading-relaxed text-ink/80">
                  Your enquiry is written out in WhatsApp, but it <b className="font-medium text-charcoal">has not been sent yet</b>.
                  Please press <b className="font-medium text-charcoal">Send</b> in WhatsApp. I only receive it once you do.
                </p>
                <p className="mt-5 inline-flex flex-col items-center rounded-2xl bg-cream px-5 py-3">
                  <span className="eyebrow !text-[0.58rem] text-stone">Your enquiry reference</span>
                  <span id="enquiry-ref" className="mt-1 select-all font-medium tracking-[0.08em] text-charcoal tabular-nums">{ref}</span>
                  <span className="mt-1 text-[0.7rem] text-stone">Already included in your message</span>
                </p>
              </div>

              <ol className="mx-auto mt-8 max-w-md space-y-4" aria-label="What happens next">
                {[
                  ['Press Send in WhatsApp', 'Your message is waiting in our chat with your reference included. Until you press Send, nothing reaches me.'],
                  ['I review it personally', `Once your message arrives, I read it myself, ${site.founder.split(' ')[0]}, not a bot.`],
                  ['I reply to you', 'I will confirm price, availability and delivery with you on WhatsApp.'],
                ].map(([t, sub], i) => (
                  <li key={t} className="flex gap-4" aria-current={i === 0 ? 'step' : undefined}>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.75rem] ${i === 0 ? 'bg-charcoal text-ivory' : 'border border-gold/60 text-gold'}`}>{i + 1}</span>
                    <span>
                      <span className={`block text-[0.95rem] ${i === 0 ? 'font-medium text-charcoal' : 'text-charcoal'}`}>{t}</span>
                      <span className="block text-[0.82rem] leading-relaxed text-stone">{sub}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mx-auto mt-8 max-w-md"><Notice tone="sage" /></div>

              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
                <a href={link} target="_blank" rel="noopener" className="btn btn-sage w-full">
                  <WhatsAppIcon /> Open WhatsApp to press Send
                </a>
                <p className="text-center text-[0.75rem] leading-relaxed text-stone">
                  Not sure it went? Look in your WhatsApp chat with <span className="select-all text-charcoal">{site.whatsappDisplay}</span>.
                  If your message is there with a tick beside it, it has been sent.
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => go(2)} className="btn btn-ghost flex-1">Edit my enquiry</button>
                  <button
                    type="button"
                    onClick={() => { setData(emptyEnquiry(products[0].name)); setConsent(false); setRef(''); setStep(0) }}
                    className="btn btn-ghost flex-1"
                  >
                    Start a new enquiry
                  </button>
                </div>
              </div>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
