import { useRef, useState } from 'react'
import { products, type Product, whatsappLink } from '../data/content'
import { MediaSlot } from './MediaSlot'
import { Reveal } from '../lib/Reveal'
import { ArrowIcon, ExternalIcon, WhatsAppIcon } from '../lib/icons'

function Gallery({ product, rounded = 'rounded-[24px]' }: { product: Product; rounded?: string }) {
  const [index, setIndex] = useState(0)
  const strip = useRef<HTMLDivElement>(null)
  const go = (i: number) => {
    const el = strip.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div
        ref={strip}
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto ${rounded}`}
        aria-label={`${product.name} photos`}
        role="region"
        tabIndex={0}
      >
        {product.gallery.map((m) => (
          <div key={m.label} className="w-full shrink-0 snap-center">
            <MediaSlot media={m} className="aspect-[4/5] w-full" sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" />
          </div>
        ))}
      </div>
      <div className="absolute right-3 top-3 flex justify-end gap-0.5 rounded-full bg-ivory/55 px-1 backdrop-blur-sm">
        {product.gallery.map((m, i) => (
          <button
            key={m.label}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show photo ${i + 1} of ${product.gallery.length}`}
            aria-current={i === index}
            className="grid h-6 w-6 place-items-center"
          >
            <span className={`block h-1.5 rounded-full bg-charcoal/60 transition-all duration-500 ${i === index ? 'w-5 opacity-100' : 'w-1.5 opacity-40'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

function PendingTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/70 px-2.5 py-1 text-[0.65rem] tracking-wide text-ink">
      <span className="h-1 w-1 rounded-full bg-gold" /> Details pending MOB verification
    </span>
  )
}

function ProductDialog({ product, dialogRef }: { product: Product; dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const close = () => dialogRef.current?.close()
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${product.id}-dlg-title`}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[min(56rem,calc(100vw-1.5rem))] max-h-[calc(100svh-1.5rem)] overflow-y-auto rounded-[28px] bg-ivory p-0 text-charcoal shadow-2xl backdrop:bg-night/60 backdrop:backdrop-blur-sm"
    >
      <div className="grid md:grid-cols-2">
        <div className="p-3 md:p-4">
          <Gallery product={product} rounded="rounded-[20px]" />
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow text-gold">MOB Neck &amp; Back Rest</p>
            <button type="button" onClick={close} className="-mr-2 -mt-2 grid h-11 w-11 place-items-center rounded-full hover:bg-champagne/60" aria-label="Close">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
          <h3 id={`${product.id}-dlg-title`} className="display mt-3 text-[clamp(2rem,6vw,3rem)] leading-[1.02]">{product.name}</h3>
          {product.pending && <div className="mt-4"><PendingTag /></div>}
          <p className="mt-5 leading-relaxed text-ink/85">{product.intro}</p>
          {product.verifiedPoints.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm">
              {product.verifiedPoints.map((pt) => <li key={pt} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />{pt}</li>)}
            </ul>
          )}
          <p className="mt-5 text-[0.75rem] leading-relaxed text-stone">
            Comfort and support product. Not a medical device claim and not a substitute for professional advice.
          </p>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <a href={whatsappLink(`Hi Karmen, I would like to learn more about the ${product.name}.`)} target="_blank" rel="noopener" className="btn btn-sage w-full">
              <WhatsAppIcon /> Enquire on WhatsApp
            </a>
            <a href={product.officialUrl} target="_blank" rel="noopener" className="btn btn-ghost w-full">
              Official MOB information <ExternalIcon />
            </a>
          </div>
        </div>
      </div>
    </dialog>
  )
}

function Card({ product, i }: { product: Product; i: number }) {
  const dlg = useRef<HTMLDialogElement>(null)
  return (
    <Reveal as="article" delay={i * 0.12} className="group flex flex-col rounded-[32px] bg-cream p-3 shadow-[0_30px_70px_-55px_rgba(30,29,27,0.6)] transition-shadow duration-700 hover:shadow-[0_40px_90px_-50px_rgba(30,29,27,0.6)]">
      <Gallery product={product} />
      <div className="flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow !text-[0.6rem] text-stone">0{i + 1} · MOB</p>
          {product.pending && <PendingTag />}
        </div>
        <h3 className="display mt-3 text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.05]">{product.name}</h3>
        <p className="mt-3 line-clamp-3 text-[0.92rem] leading-relaxed text-ink/80">{product.intro}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button type="button" onClick={() => dlg.current?.showModal()} className="btn btn-ghost !min-h-11 flex-1 whitespace-nowrap !px-4">
            Learn more <ArrowIcon />
          </button>
          <a
            href={whatsappLink(`Hi Karmen, I would like to enquire about the ${product.name}.`)}
            target="_blank"
            rel="noopener"
            className="btn btn-sage !min-h-11 flex-1 whitespace-nowrap !px-4"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <WhatsAppIcon /> Enquire
          </a>
        </div>
      </div>
      <ProductDialog product={product} dialogRef={dlg} />
    </Reveal>
  )
}

export function Collection() {
  return (
    <section id="collection" aria-labelledby="collection-title" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-gold">Explore the collection</p>
          <h2 id="collection-title" className="display mt-5 text-[clamp(2.6rem,8vw,6rem)]">
            Chosen with care.
          </h2>
          <p className="mt-6 max-w-[48ch] leading-relaxed text-ink/80">
            Three comfort and support products from MOB Neck &amp; Back Rest that I feature here. MOB is the maker.
            I am an independent founder sharing what I believe in, with clear information and a real person to talk to.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => <Card key={p.id} product={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}
