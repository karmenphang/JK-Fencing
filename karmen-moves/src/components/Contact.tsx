import { useState } from 'react'
import { products, site, whatsappLink } from '../data/content'
import { Reveal } from '../lib/Reveal'
import { WhatsAppIcon } from '../lib/icons'

/**
 * No backend needed: the form composes a WhatsApp message.
 * Later this can POST to a Cloudflare Pages Function instead.
 */
export function Contact() {
  const [sent, setSent] = useState(false)
  const field = 'mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3.5 text-[1rem] outline-none transition-colors focus:border-gold'

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-champagne/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow text-gold">Contact</p>
          <h2 id="contact-title" className="display mt-5 text-[clamp(2.6rem,8vw,5.4rem)] leading-[1]">Talk to me.</h2>
          <p className="mt-6 max-w-[38ch] leading-relaxed text-ink/80">
            Tell me what you are looking for. Your message opens in WhatsApp so we can talk directly, person to person.
          </p>
          <p className="mt-8 text-sm text-stone">
            Prefer email? <a className="underline decoration-gold/60 underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            className="rounded-[28px] bg-ivory p-6 shadow-[0_30px_80px_-60px_rgba(30,29,27,0.6)] sm:p-9"
            onSubmit={(e) => {
              e.preventDefault()
              const d = new FormData(e.currentTarget)
              const msg = `Hi Karmen, my name is ${d.get('name')}.\nInterested in: ${d.get('product')}\n\n${d.get('message')}`
              window.open(whatsappLink(msg), '_blank', 'noopener')
              setSent(true)
            }}
          >
            <label className="block text-sm text-ink">
              Your name
              <input required name="name" autoComplete="name" className={field} />
            </label>
            <label className="mt-5 block text-sm text-ink">
              I am interested in
              <select name="product" className={field} defaultValue="General enquiry">
                <option>General enquiry</option>
                {products.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="mt-5 block text-sm text-ink">
              Your message
              <textarea required name="message" rows={4} className={`${field} resize-none`} placeholder="A little about what you need" />
            </label>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-stone">
              Nothing is stored on this website. See the <a href="#/privacy" className="underline">privacy notice</a>.
            </p>
            <button type="submit" className="btn btn-primary mt-6 w-full">
              <WhatsAppIcon /> Send via WhatsApp
            </button>
            <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-sage-deep">
              {sent ? 'WhatsApp opened in a new tab. Thank you, I will reply personally.' : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
