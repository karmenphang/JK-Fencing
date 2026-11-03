/**
 * KARMEN MOVES · single source of truth for content.
 *
 * Everything marked `pending: true` is waiting for verified information
 * from MOB Neck & Back Rest (https://www.neckandbackpain.my/) or for a real
 * photo from Karmen. Replace it, then flip `pending` to false.
 * Never fill these with guesses: no invented specs, no therapeutic claims.
 */

export const site = {
  brand: 'KARMEN MOVES',
  tagline: 'Comfort. Mobility. Independence.',
  founder: 'Karmen Phang',
  location: 'Malaysia',
  whatsappNumber: '601116350635', // international format, digits only
  whatsappDisplay: '+60 11 1635 0635',
  email: 'hello@karmenmoves.com', // TODO: confirm real inbox
  mobOfficialUrl: 'https://www.neckandbackpain.my/',
  year: new Date().getFullYear(),
}

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`

/** A photo slot. Add `src` (and ideally `srcSet`) to show a real image. */
export interface Media {
  label: string // what belongs here, shown on the placeholder
  alt: string // final alt text for the real image
  src?: string
  srcSet?: string
  tone?: 'champagne' | 'sage' | 'stone' | 'night'
}

export const founderChapters: {
  id: string
  when: string
  statement: string
  body: string
  media: Media
}[] = [
  {
    id: 'moment',
    when: 'December 2011',
    statement: 'One moment changed everything.',
    body: 'In December 2011, I experienced a life changing traumatic brain injury following an ATV accident.',
    media: {
      label: 'Portrait · Karmen, a quiet reflective image (photo to be supplied)',
      alt: 'Karmen Phang in a quiet, reflective moment',
      tone: 'night',
    },
  },
  {
    id: 'understanding',
    when: 'Recovery',
    statement: 'Movement became something I could never take for granted.',
    body: 'My recovery changed how I understood movement, independence and the importance of everyday comfort.',
    media: {
      label: 'Portrait · Karmen walking outdoors, natural light (photo to be supplied)',
      alt: 'Karmen Phang walking outdoors in soft natural light',
      tone: 'stone',
    },
  },
  {
    id: 'grace',
    when: 'Step by step',
    statement: 'Today, every step forward has meaning.',
    body: 'By God’s grace, I continued rebuilding my life, step by step.',
    media: {
      label: 'Portrait · Karmen today, warm and candid (photo to be supplied)',
      alt: 'Karmen Phang today, smiling, in warm light',
      tone: 'sage',
    },
  },
  {
    id: 'purpose',
    when: 'Now',
    statement: 'And now, I want to help others move more comfortably.',
    body: 'Today, I want to use my journey to build something meaningful, helping people discover practical products that support everyday comfort, mobility and independence.',
    media: {
      label: 'Portrait · Karmen with the collection, at home (photo to be supplied)',
      alt: 'Karmen Phang at home with the KARMEN MOVES collection',
      tone: 'champagne',
    },
  },
]

export interface Product {
  id: string
  name: string
  shortName: string
  /** Intro copy. Only the neutral line below is used until MOB info is verified. */
  intro: string
  pending: boolean
  /** Verified points copied from official MOB material. Leave empty until verified. */
  verifiedPoints: string[]
  gallery: Media[]
  officialUrl: string
}

const pendingIntro = (name: string) =>
  `${name} from MOB Neck & Back Rest, featured in the KARMEN MOVES collection. Full product details will be shared here once verified with official MOB information. Message me and I will walk you through it personally.`

export const products: Product[] = [
  {
    id: 'neck-healer',
    name: 'MOB Neck Healer',
    shortName: 'Neck Healer',
    intro: pendingIntro('The MOB Neck Healer'),
    pending: true,
    verifiedPoints: [],
    officialUrl: site.mobOfficialUrl,
    gallery: [
      { label: 'Official MOB photo · Neck Healer, front view', alt: 'MOB Neck Healer, front view', tone: 'champagne' },
      { label: 'Official MOB photo · Neck Healer, side profile', alt: 'MOB Neck Healer, side profile', tone: 'stone' },
      { label: 'Approved photo · Neck Healer in use', alt: 'MOB Neck Healer in use', tone: 'sage' },
    ],
  },
  {
    id: 'back-healer',
    name: 'MOB Back Healer',
    shortName: 'Back Healer',
    intro: pendingIntro('The MOB Back Healer'),
    pending: true,
    verifiedPoints: [],
    officialUrl: site.mobOfficialUrl,
    gallery: [
      { label: 'Official MOB photo · Back Healer, front view', alt: 'MOB Back Healer, front view', tone: 'sage' },
      { label: 'Official MOB photo · Back Healer, detail', alt: 'MOB Back Healer, detail', tone: 'champagne' },
      { label: 'Approved photo · Back Healer in use', alt: 'MOB Back Healer in use', tone: 'stone' },
    ],
  },
  {
    id: 'pelvic-hold',
    name: 'MOB Pelvic-Hold Seat Support',
    shortName: 'Pelvic-Hold Seat Support',
    intro: pendingIntro('The MOB Pelvic-Hold Seat Support'),
    pending: true,
    verifiedPoints: [],
    officialUrl: site.mobOfficialUrl,
    gallery: [
      { label: 'Official MOB photo · Pelvic-Hold Seat Support, top view', alt: 'MOB Pelvic-Hold Seat Support, top view', tone: 'stone' },
      { label: 'Official MOB photo · Pelvic-Hold Seat Support, angle', alt: 'MOB Pelvic-Hold Seat Support, angled view', tone: 'champagne' },
      { label: 'Approved photo · Seat Support on a chair', alt: 'MOB Pelvic-Hold Seat Support on a chair', tone: 'sage' },
    ],
  },
]

/** Neck Healer showcase. Callout labels must come from verified MOB material. */
export const neckHealerShowcase = {
  hero: { label: 'Official MOB photo · Neck Healer, clean studio shot', alt: 'MOB Neck Healer', tone: 'champagne' } as Media,
  closeUp: { label: 'Official MOB photo · Neck Healer, close up of surface and form', alt: 'Close up of the MOB Neck Healer', tone: 'stone' } as Media,
  usage: { label: 'Approved photo or short video · how the Neck Healer is used', alt: 'Person using the MOB Neck Healer', tone: 'sage' } as Media,
  lifestyle: { label: 'Lifestyle photo · resting at home, evening light', alt: 'Resting at home with the MOB Neck Healer', tone: 'night' } as Media,
  callouts: [
    { label: 'Detail one', text: 'Verified MOB detail to be added', pending: true },
    { label: 'Detail two', text: 'Verified MOB detail to be added', pending: true },
    { label: 'Detail three', text: 'Verified MOB detail to be added', pending: true },
  ],
  /** Set to a .glb URL once MOB supplies an accurate model. Then add React Three Fiber. */
  modelUrl: null as string | null,
}

export const principles = [
  {
    no: '01',
    title: 'Born from lived experience',
    body: 'This brand did not start in a boardroom. It started in recovery, learning how much everyday comfort shapes the way we move and the way we feel.',
  },
  {
    no: '02',
    title: 'Independence at the heart',
    body: 'Doing small things for yourself is precious. I look for products that might make ordinary days a little easier and a little more comfortable.',
  },
  {
    no: '03',
    title: 'Education and transparency',
    body: 'I tell you clearly what a product is, who makes it and where to read the official details. No miracle promises. No medical claims.',
  },
  {
    no: '04',
    title: 'Personal care, one person at a time',
    body: 'Every enquiry comes to me. I will listen, answer honestly, and if something is not right for you, I will tell you.',
  },
]

export const faqs = [
  {
    q: 'Is KARMEN MOVES the official MOB website?',
    a: 'No. KARMEN MOVES is my own independent brand. I feature selected products from MOB Neck & Back Rest. For official product information you can always visit the MOB website directly.',
  },
  {
    q: 'Will these products treat my condition?',
    a: 'These are comfort and support products, not medical treatment. I cannot promise any medical outcome. If you have pain, an injury or a health condition, please speak with your doctor or physiotherapist first.',
  },
  {
    q: 'How do I order?',
    a: 'Tap “Order this” on any product, or use the order enquiry form near the bottom of this page. It writes out your enquiry in WhatsApp, and it reaches me when you press Send there. It is an enquiry only, so no payment is needed. Once it arrives, I will review it personally and reply to confirm the details with you.',
  },
  {
    q: 'Do you deliver across Malaysia?',
    a: 'Delivery details are being finalised. Message me and I will confirm options for your area.',
  },
  {
    q: 'Is there a warranty?',
    a: 'Warranty terms follow MOB’s official policy. I will share the confirmed terms here once verified, and I am always happy to explain them when you enquire.',
  },
  {
    q: 'Which product is right for me?',
    a: 'Tell me a little about your day, how you sit, rest and move. I will share what I know honestly. For anything medical, your healthcare professional knows best.',
  },
]

/** Keep empty until you have genuine, permitted customer reviews. The section stays hidden while empty. */
export const testimonials: { quote: string; name: string; location?: string }[] = []

export const nav = [
  { href: '#story', label: 'Story' },
  { href: '#neck-healer', label: 'Neck Healer' },
  { href: '#collection', label: 'Collection' },
  { href: '#why', label: 'Why' },
  { href: '#care', label: 'Care' },
  { href: '#contact', label: 'Contact' },
]
