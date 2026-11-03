# KARMEN MOVES · Design Plan, Page Structure & Animation Storyboard

Comfort. Mobility. Independence.

## 1. Brand consistent design plan

### Positioning
KARMEN MOVES is Karmen Phang's own independent wellness and mobility brand in Malaysia. It features selected comfort and support products made by **MOB Neck & Back Rest**. The site never presents itself as the official MOB website and never claims exclusive distribution. Every MOB mention carries a "featured brand" framing, and a sourcing note links to the official MOB site.

The emotional core is lived experience. The commercial core is trust: education, transparency, personal care. No medical promises.

### Voice
Warm, honest, gently strong. Short sentences for weight. No hard selling. No hyphenated or em dash phrasing in visible copy. Faith shows up softly ("By God's grace") only where Karmen herself puts it.

### Palette
| Token | Hex | Use |
|---|---|---|
| Night | `#0E0D0C` | Opening darkness, ending |
| Charcoal | `#1E1D1B` | Primary text, dark sections |
| Ivory | `#F6F1E9` | Main canvas |
| Champagne | `#E9DCC6` | Panels, media frames |
| Sage | `#A9B39C` / deep `#5F6B57` | Calm accents, care moments |
| Gold | `#B8975A` | Hairlines, numerals, focus rings |

### Typography
* Display: **Cormorant Garamond** (light, italic for emotion). Huge, tight leading, cinematic.
* Text and UI: **Inter**, small caps style eyebrow labels with wide tracking.
* Scale is fluid with `clamp()` so a Honor X9c (about 412px CSS width) and iPad both feel composed.

### Imagery rules
* Only real photography: founder portraits supplied by Karmen, product photos supplied or approved by MOB.
* Until then, every image is a **media slot**: a warm tonal frame with fine grain and a clear caption describing exactly what photo belongs there. No AI product renders, no stock pretending to be the product.
* A slot becomes a real image by adding `src` in `src/data/content.ts`. Lazy loading and `srcset` are already wired.

### UI language
* Glass navigation pill (blurred ivory, hairline gold border) that appears once the hero darkness lifts.
* Generous whitespace, 12 column grid on desktop, single column with 20px gutters on mobile.
* Buttons: solid charcoal pill (primary), hairline outline (secondary), sage WhatsApp pill.
* Mobile: sticky bottom WhatsApp bar and a full screen menu sheet.

## 2. Page structure

```
/ (single page, hash anchors)
├─ Glass nav (Story · Neck Healer · Collection · Why · Care · Contact) + WhatsApp
├─ 01 Hero            #top           Pinned 260vh, dark to ivory
├─ 02 Founder story   #story         Pinned chapters 2011 → today
├─ 03 Neck Healer     #neck-healer   Pinned product sequence + 3D placeholder + CTA
├─ 04 Collection      #collection    3 premium cards, gallery, Learn more dialog, WhatsApp
├─ 05 Why KARMEN MOVES #why          Four principles
├─ 06 Customer care   #care          Sourcing · Delivery · Warranty · FAQ · Testimonials (hidden until real)
├─ 07 Contact         #contact       Form that opens a prepared WhatsApp message
├─ 08 Ending          #end           "Every movement matters."
└─ Footer             legal links, sourcing statement

#/privacy     Privacy policy (draft for review)
#/disclaimer  Disclaimer (independence + not medical advice)
```

Hash routing keeps it a pure static site: perfect for Cloudflare Pages with zero server config.

## 3. Animation storyboard

All scroll scenes use CSS `position: sticky` inside a tall track rather than JS pinning. The page always scrolls natively, so mobile scrolling can never lock. Animations only touch `opacity` and `transform`.

### 01 Hero (track 260vh)
| Scroll | What happens |
|---|---|
| Load | Black screen. "MOVEMENT IS PRECIOUS." rises word by word, 1.2s each, slow ease. A thin gold line draws beneath. |
| 0 → 30% | Headline drifts up and softens to blur. A scroll cue pulses. |
| 25 → 55% | Background warms from night to ivory. Text colour inverts charcoal. |
| 45 → 75% | KARMEN MOVES assembles letter by letter with widening tracking. Tagline and "Comfort that supports the way you move." fade up. Buttons arrive. Glass nav fades in. |
| 75 → 100% | Whole stage scales to 0.94 and rounds its corners, like a card being set down, revealing the story section beneath. |

### 02 Founder story (track 520vh)
Left: portrait slot with slow parallax. Right: chapter text. A gold timeline on the edge fills with progress.
| Chapter | Statement | Supporting line |
|---|---|---|
| December 2011 | One moment changed everything. | ATV accident, traumatic brain injury. |
| Recovery | Movement became something I could never take for granted. | How she came to understand movement, independence, comfort. |
| Step by step | Today, every step forward has meaning. | By God's grace, rebuilding life, step by step. |
| Now | And now, I want to help others move more comfortably. | The purpose of KARMEN MOVES. |
Each chapter crossfades with a 24px lift. Portrait slot swaps caption per chapter (so Karmen can supply a photo per era). Reduced motion: chapters stack as a calm editorial column.

### 03 MOB Neck Healer (track 560vh, GSAP ScrollTrigger scrub)
| Step | Visual |
|---|---|
| A | Eyebrow "Featured from MOB Neck & Back Rest", title rises out of a champagne mask. |
| B | Hero product photo slot scales from 0.7 to 1 with a soft shadow bloom. |
| C | Three restrained callout markers draw hairlines to the frame. Labels come from verified MOB data only (currently marked pending). |
| D | Frame slides left; a usage photo/video slot slides in: "How it is used". |
| E | Close up ⇄ lifestyle crossfade. |
| F | Reserved 3D stage: dotted orbit ring with "3D model space reserved. Awaiting an accurate model from MOB." |
| G | Enquiry panel: WhatsApp enquiry + official product page link. |
Reduced motion: every step is a static stacked block.

### 04 Collection
Cards rise in with a 120ms stagger. Galleries swipe (scroll snap) on touch with dots. "Learn more" opens an accessible dialog (focus trapped, Esc closes).

### 05 Why · 06 Care · 07 Contact
Gentle reveal on enter (16px lift, fade). FAQ uses native `<details>` with animated chevron. No scroll hijacking.

### 08 Ending
Background returns to night. "Every movement matters." in large italic, words fade in one by one as they enter. CTA "Explore Karmen Moves" scrolls to top.

## 4. Performance & accessibility
* No Three.js shipped until a genuine 3D model exists (saves about 600KB).
* Fonts via Google Fonts with `display=swap` and preconnect.
* Images: `loading="lazy"`, `decoding="async"`, `sizes` + `srcset` hooks.
* `prefers-reduced-motion` disables all scrubbed and entrance animation.
* Skip link, semantic landmarks, visible focus rings, 44px tap targets, aria labels on icon buttons.

## 5. Content still needed from Karmen / MOB
See `README.md` → "Before launch".
