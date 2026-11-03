import { site } from '../data/content'

export interface Enquiry {
  product: string
  qty: number
  name: string
  phone: string
  email: string
  address: string
  city: string
  postcode: string
  state: string
  notes: string
}

export const emptyEnquiry = (product: string): Enquiry => ({
  product,
  qty: 1,
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postcode: '',
  state: '',
  notes: '',
})

export const MAX_QTY = 5

export const MY_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang',
  'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
]

// No 0/O/1/I/L so references are easy to read aloud and type
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

/**
 * Unique enquiry reference, e.g. KM-261103-7QH4X.
 * Date part + 5 random characters from a 31 letter alphabet (about 28 million
 * combinations per day), using the browser's secure random source.
 */
export function makeEnquiryRef(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  const rand = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `KM-${date}-${rand}`
}

/** The exact WhatsApp message Karmen receives. No prices, stock or payment details. */
export function buildEnquiryMessage(e: Enquiry, ref: string) {
  const lines = [
    `*NEW ORDER ENQUIRY · ${site.brand}*`,
    `Enquiry ref: ${ref}`,
    '',
    '*Product*',
    `${e.product}`,
    `Quantity: ${e.qty}`,
    '',
    '*Customer*',
    `Name: ${e.name.trim()}`,
    `Phone: ${e.phone.trim()}`,
  ]
  if (e.email.trim()) lines.push(`Email: ${e.email.trim()}`)
  lines.push(
    '',
    '*Delivery*',
    `${e.address.trim()}`,
    `${e.postcode.trim()} ${e.city.trim()}`,
    `${e.state}`,
  )
  if (e.notes.trim()) lines.push('', `*Notes*`, e.notes.trim())
  lines.push(
    '',
    'This is an order enquiry only. I understand no payment is required yet and Karmen will reply personally to confirm the details.',
    'I agree to the KARMEN MOVES privacy notice.',
  )
  return lines.join('\n')
}

export const enquiryLink = (e: Enquiry, ref: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(buildEnquiryMessage(e, ref))}`
