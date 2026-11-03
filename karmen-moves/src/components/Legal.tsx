import { site } from '../data/content'

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main" className="min-h-[100svh] bg-ivory px-5 pb-24 pt-32 sm:px-8">
      <article className="mx-auto max-w-2xl">
        <a href="#top" className="eyebrow text-gold">← Back to {site.brand}</a>
        <h1 className="display mt-6 text-[clamp(2.6rem,8vw,4.6rem)]">{title}</h1>
        <p className="mt-3 text-sm text-stone">Draft for review. Last updated {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long' })}.</p>
        <div className="mt-10 space-y-5 leading-relaxed text-ink/85 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-[1.8rem] [&_h2]:text-charcoal">
          {children}
        </div>
      </article>
    </main>
  )
}

export function Privacy() {
  return (
    <Shell title="Privacy notice">
      <p>
        {site.brand} is run by {site.founder} in {site.location}. I respect your privacy and handle personal data in line with
        Malaysia’s Personal Data Protection Act 2010 (PDPA).
      </p>
      <h2>What this website collects</h2>
      <p>
        This website does not store the details you type into the contact form. When you press send, your message is passed
        to WhatsApp on your own device, and you choose whether to send it.
      </p>
      <h2>When you contact me</h2>
      <p>
        If you message me on WhatsApp or by email, I use your name, contact details and message only to reply to you, answer
        your questions and arrange any order you request. I do not sell your data.
      </p>
      <h2>Third parties</h2>
      <p>
        WhatsApp (Meta) handles messages you send through it under its own privacy policy. Fonts are served by Google Fonts.
        The website is hosted on Cloudflare.
      </p>
      <h2>Your rights</h2>
      <p>You may ask to access, correct or delete the personal data I hold about you by contacting {site.email}.</p>
      <p className="rounded-xl border border-dashed border-gold/50 p-4 text-sm text-stone">
        Placeholder note: please have this notice reviewed before launch, especially if analytics, a mailing list or online
        payments are added.
      </p>
    </Shell>
  )
}

export function Disclaimer() {
  return (
    <Shell title="Disclaimer">
      <h2>An independent brand</h2>
      <p>
        {site.brand} is an independent wellness and mobility brand founded by {site.founder}. It is not the official website of
        MOB Neck &amp; Back Rest, is not owned or operated by MOB, and does not claim exclusive distribution of any MOB product.
        MOB, MOB Neck &amp; Back Rest and related product names belong to their respective owner. For official information please
        visit <a className="underline" href={site.mobOfficialUrl} target="_blank" rel="noopener">{site.mobOfficialUrl}</a>.
      </p>
      <h2>Not medical advice</h2>
      <p>
        The products featured are comfort and support products. Nothing on this website is medical advice, diagnosis or
        treatment, and no product is promised to cure, treat or prevent any condition. Please speak with a qualified healthcare
        professional about pain, injury or any health concern.
      </p>
      <h2>My story</h2>
      <p>
        My personal story is shared to explain why I started this brand. It is not a claim that any product featured here
        played a part in my recovery from brain injury.
      </p>
      <h2>Product information</h2>
      <p>
        I do my best to keep product details accurate and based on official MOB information. Where details are still being
        verified, they are clearly marked. Please confirm specifics with me before ordering.
      </p>
    </Shell>
  )
}
