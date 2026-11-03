import { useEffect, useId, useRef, useState } from 'react'
import { orderSettings, products, site, whatsappLink } from '../data/content'
import { Reveal } from '../lib/Reveal'
import { WhatsAppIcon } from '../lib/icons'

/** Any button on the page can open the order form with a product chosen. */
export const ORDER_EVENT = 'km:order'
export function startOrder(productName: string) {
  window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: productName }))
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const states = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang',
  'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
]

/** Short, readable reference like KM-031126-4821 so you can match chats to orders. */
function orderRef() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `KM-${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function buildOrderMessage(d: FormData, ref: string) {
  const lines = [
    `*NEW ORDER REQUEST · ${site.brand}*`,
    `Ref: ${ref}`,
    '',
    '*Order*',
    `Product: ${d.get('product')}`,
    `Quantity: ${d.get('qty')}`,
    '',
    '*Customer*',
    `Name: ${d.get('name')}`,
    `Phone: ${d.get('phone')}`,
    '',
    '*Delivery*',
    `Address: ${d.get('address')}`,
    `Postcode: ${d.get('postcode')}`,
    `State: ${d.get('state')}`,
    '',
    `Preferred payment: ${d.get('payment')}`,
  ]
  const notes = String(d.get('notes') || '').trim()
  if (notes) lines.push(`Notes: ${notes}`)
  lines.push('', 'Please confirm the price, stock and delivery. Thank you!')
  return lines.join('\n')
}

export function Contact() {
  const [mode, setMode] = useState<'order' | 'question'>('order')
  const [product, setProduct] = useState(products[0].name)
  const [sent, setSent] = useState<{ ref?: string; link: string } | null>(null)
  const firstField = useRef<HTMLSelectElement>(null)
  const uid = useId()
  const field = 'mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3.5 text-[1rem] outline-none transition-colors focus:border-gold'
  const label = 'block text-sm text-ink'

  useEffect(() => {
    const on = (e: Event) => {
      setMode('order')
      setSent(null)
      setProduct((e as CustomEvent<string>).detail)
      setTimeout(() => firstField.current?.focus({ preventScroll: true }), 700)
    }
    window.addEventListener(ORDER_EVENT, on)
    return () => window.removeEventListener(ORDER_EVENT, on)
  }, [])

  const open = (link: string, ref?: string) => {
    setSent({ ref, link })
    window.open(link, '_blank', 'noopener')
  }

  const tab = (m: typeof mode, text: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      aria-controls={`${uid}-panel`}
      onClick={() => { setMode(m); setSent(null) }}
      className={`min-h-11 flex-1 rounded-full px-4 text-[0.88rem] transition-colors duration-500 ${mode === m ? 'bg-charcoal text-ivory' : 'text-ink hover:bg-white/60'}`}
    >
      {text}
    </button>
  )

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-champagne/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow text-gold">Order &amp; contact</p>
          <h2 id="contact-title" className="display mt-5 text-[clamp(2.6rem,8vw,5.4rem)] leading-[1]">
            {mode === 'order' ? 'Ready when you are.' : 'Talk to me.'}
          </h2>
          <p className="mt-6 max-w-[38ch] leading-relaxed text-ink/80">
            {mode === 'order'
              ? 'Fill this in once and it becomes a tidy order message on WhatsApp, straight to me. I will confirm the price, stock and delivery with you personally before anything is paid.'
              : 'Tell me what you are looking for. Your message opens in WhatsApp so we can talk directly, person to person.'}
          </p>
          <ol className="mt-8 space-y-3 text-sm text-ink/80">
            {['You send your order request', 'I reply to confirm price, stock and delivery', 'You pay only after we agree', 'Your order is on its way'].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/50 text-[0.72rem] text-gold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-stone">
            WhatsApp: <span className="select-all text-charcoal">{site.whatsappDisplay}</span>
            <br />
            Email: <a className="underline decoration-gold/60 underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[28px] bg-ivory p-6 shadow-[0_30px_80px_-60px_rgba(30,29,27,0.6)] sm:p-9">
            <div role="tablist" aria-label="What would you like to do?" className="flex gap-1 rounded-full border border-charcoal/10 bg-cream p-1">
              {tab('order', 'Place an order')}
              {tab('question', 'Ask a question')}
            </div>

            <div id={`${uid}-panel`} role="tabpanel" className="mt-7">
              {mode === 'order' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const ref = orderRef()
                    open(whatsappLink(buildOrderMessage(new FormData(e.currentTarget), ref)), ref)
                  }}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <label className={`${label} sm:col-span-2`}>
                    Product
                    <select ref={firstField} id="order-product" name="product" className={field} value={product} onChange={(e) => setProduct(e.target.value)}>
                      {products.map((p) => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </label>
                  <label className={label}>
                    Quantity
                    <select id="order-qty" name="qty" className={field} defaultValue="1">
                      {Array.from({ length: orderSettings.maxQty }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                  </label>
                  <label className={label}>
                    Preferred payment
                    <select id="order-payment" name="payment" className={field} defaultValue={orderSettings.paymentOptions[0]}>
                      {orderSettings.paymentOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                  <label className={label}>
                    Full name
                    <input id="order-name" required name="name" autoComplete="name" className={field} />
                  </label>
                  <label className={label}>
                    Phone number
                    <input id="order-phone" required name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="012 345 6789" pattern="[0-9+\s\-]{9,15}" title="Please enter a valid phone number" className={field} />
                  </label>
                  <label className={`${label} sm:col-span-2`}>
                    Delivery address
                    <textarea id="order-address" required name="address" rows={2} autoComplete="street-address" className={`${field} resize-none`} />
                  </label>
                  <label className={label}>
                    Postcode
                    <input id="order-postcode" required name="postcode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" title="5 digit postcode" className={field} />
                  </label>
                  <label className={label}>
                    State
                    <select id="order-state" required name="state" className={field} defaultValue="">
                      <option value="" disabled>Choose state</option>
                      {states.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className={`${label} sm:col-span-2`}>
                    Notes <span className="text-stone">(optional)</span>
                    <textarea id="order-notes" name="notes" rows={2} placeholder="Anything I should know? Best time to call?" className={`${field} resize-none`} />
                  </label>
                  <div className="sm:col-span-2">
                    <p className="text-[0.75rem] leading-relaxed text-stone">
                      This is an order request, not a payment. Nothing is stored on this website. See the <a href="#/privacy" className="underline">privacy notice</a>.
                    </p>
                    <button type="submit" className="btn btn-primary mt-5 w-full">
                      <WhatsAppIcon /> Send order request
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const d = new FormData(e.currentTarget)
                    open(whatsappLink(`Hi Karmen, my name is ${d.get('name')}.\nAbout: ${d.get('product')}\n\n${d.get('message')}`))
                  }}
                  className="grid gap-5"
                >
                  <label className={label}>
                    Your name
                    <input id="q-name" required name="name" autoComplete="name" className={field} />
                  </label>
                  <label className={label}>
                    About
                    <select id="q-product" name="product" className={field} defaultValue="General enquiry">
                      <option>General enquiry</option>
                      {products.map((p) => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </label>
                  <label className={label}>
                    Your message
                    <textarea id="q-message" required name="message" rows={4} className={`${field} resize-none`} placeholder="A little about what you need" />
                  </label>
                  <button type="submit" className="btn btn-primary w-full">
                    <WhatsAppIcon /> Send via WhatsApp
                  </button>
                </form>
              )}
              <div aria-live="polite" className="mt-4 min-h-5 text-center text-sm text-sage-deep">
                {sent && (
                  <p>
                    {sent.ref ? <>Order request <b className="font-medium">{sent.ref}</b> is ready in WhatsApp. Just press send there.</> : 'Your message is ready in WhatsApp. Just press send there.'}
                    <br />
                    <a href={sent.link} target="_blank" rel="noopener" className="underline underline-offset-4">WhatsApp did not open? Tap here.</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
