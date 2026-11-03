import { useState } from 'react'
import { products, site, whatsappLink } from '../data/content'
import { Reveal } from '../lib/Reveal'
import { WhatsAppIcon } from '../lib/icons'
import { OrderEnquiry } from './OrderEnquiry'

export { startOrder } from './OrderEnquiry'

function QuestionForm() {
  const [sent, setSent] = useState('')
  const field = 'mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3.5 text-[1rem] outline-none transition-colors focus:border-gold'
  return (
    <div className="rounded-[32px] bg-ivory p-5 shadow-[0_40px_90px_-60px_rgba(30,29,27,0.65)] ring-1 ring-charcoal/5 sm:p-9">
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          const d = new FormData(e.currentTarget)
          const link = whatsappLink(`Hi Karmen, my name is ${d.get('name')}.\nAbout: ${d.get('product')}\n\n${d.get('message')}`)
          setSent(link)
          window.open(link, '_blank', 'noopener')
        }}
      >
        <label className="block text-[0.85rem] text-ink">
          Your name
          <input id="q-name" required name="name" autoComplete="name" className={field} />
        </label>
        <label className="block text-[0.85rem] text-ink">
          About
          <select id="q-product" name="product" className={field} defaultValue="General enquiry">
            <option>General enquiry</option>
            {products.map((p) => <option key={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className="block text-[0.85rem] text-ink">
          Your message
          <textarea id="q-message" required name="message" rows={4} className={`${field} resize-none`} placeholder="A little about what you need" />
        </label>
        <p className="text-[0.75rem] leading-relaxed text-stone">
          Your message opens in WhatsApp on your device. Nothing is stored on this website. See the <a href="#/privacy" className="underline">privacy notice</a>.
        </p>
        <button type="submit" className="btn btn-primary w-full"><WhatsAppIcon /> Send via WhatsApp</button>
        <p aria-live="polite" className="min-h-5 text-center text-sm text-sage-deep">
          {sent && <>Your message is ready in WhatsApp. <a className="underline" href={sent} target="_blank" rel="noopener">Did not open? Tap here.</a></>}
        </p>
      </form>
    </div>
  )
}

export function Contact() {
  const [mode, setMode] = useState<'order' | 'question'>('order')

  const tab = (m: typeof mode, text: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${m}`}
      aria-selected={mode === m}
      aria-controls="contact-panel"
      onClick={() => setMode(m)}
      className={`min-h-11 flex-1 rounded-full px-4 text-[0.88rem] transition-colors duration-500 ${mode === m ? 'bg-charcoal text-ivory' : 'text-ink hover:bg-white/60'}`}
    >
      {text}
    </button>
  )

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-champagne/40 py-24 sm:py-32">
      <div id="order" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-5 sm:px-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow text-gold">Order enquiry &amp; contact</p>
          <h2 id="contact-title" className="display mt-5 text-[clamp(2.6rem,8vw,5.4rem)] leading-[1]">
            {mode === 'order' ? 'Ready when you are.' : 'Talk to me.'}
          </h2>
          <p className="mt-6 max-w-[38ch] leading-relaxed text-ink/80">
            {mode === 'order'
              ? 'Tell me what you would like and where it should go. Your enquiry comes to me on WhatsApp, and I review every one personally.'
              : 'Tell me what you are looking for. Your message opens in WhatsApp so we can talk directly, person to person.'}
          </p>
          <div role="tablist" aria-label="What would you like to do?" className="mt-8 flex max-w-sm gap-1 rounded-full border border-charcoal/10 bg-ivory/70 p-1">
            {tab('order', 'Order enquiry')}
            {tab('question', 'Ask a question')}
          </div>
          <p className="mt-8 hidden text-sm leading-relaxed text-stone md:block">
            WhatsApp <span className="select-all text-charcoal">{site.whatsappDisplay}</span>
            <br />
            Email <a className="underline decoration-gold/60 underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </Reveal>

        <div id="contact-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="min-w-0">
          {mode === 'order' ? <OrderEnquiry /> : <QuestionForm />}
        </div>
      </div>
    </section>
  )
}
