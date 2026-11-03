# KARMEN MOVES

Comfort. Mobility. Independence.

An independent, founder led wellness and mobility website for Karmen Phang (Malaysia), featuring selected products from MOB Neck & Back Rest. This is not the official MOB website and does not imply exclusive distribution.

See `DESIGN_PLAN.md` for the design plan, page structure and scroll animation storyboard.

## Stack

React 19 · TypeScript · Tailwind CSS 4 · Motion for React · GSAP ScrollTrigger · Vite.
No Three.js yet: it gets added only when MOB supplies a genuine 3D model (see `neckHealerShowcase.modelUrl`).

## Run it

```bash
cd karmen-moves
npm install
npm run dev            # local dev server
npm run build          # production build into dist/ (for Cloudflare Pages)
npm run build:preview  # one self contained HTML file in dist-preview/
```

## Deploy on Cloudflare Pages

* Root directory: `karmen-moves`
* Build command: `npm run build`
* Output directory: `dist`
* Node version: 20 or newer

`public/_headers` sets long caching for hashed assets. Routing is hash based (`#/privacy`, `#/disclaimer`), so no redirects are needed.

## Before launch

All editable content lives in `src/data/content.ts`.

1. **WhatsApp number.** Set `site.whatsappNumber` (digits only, e.g. `60123456789`).
2. **Email.** Confirm `site.email`.
3. **Founder photos.** Four portrait slots, one per chapter of the story. Add `src` (and ideally `srcSet`) to each `media` entry. Put images in `public/images/`.
4. **Official MOB product photos.** Gallery slots for each product plus the Neck Healer showcase (hero, close up, usage, lifestyle). Use only official or MOB approved images.
5. **Verified product information.** For each product, replace `intro`, add `verifiedPoints` copied from official MOB material, then set `pending: false`. Same for the Neck Healer `callouts`. The "pending verification" tags disappear automatically.
6. **Delivery and warranty.** Replace the placeholders in `src/components/Care.tsx`.
7. **Testimonials.** Add genuine, permitted reviews to `testimonials`. The section stays hidden while the list is empty.
8. **Legal.** Have the privacy notice and disclaimer reviewed.

Note: the MOB website could not be reached from the build environment, so no MOB copy, specs or photos were used. Everything MOB specific is a clearly labelled slot.
