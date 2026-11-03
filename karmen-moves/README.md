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

1. **WhatsApp number.** Set to +60 11 1635 0635 (`site.whatsappNumber`). See `WHATSAPP_TEMPLATES.md` for the order flow and auto replies.
2. **Email.** Confirm `site.email`.
3. **Founder photos.** Four portrait slots, one per chapter of the story. Add `src` (and ideally `srcSet`) to each `media` entry. Put images in `public/images/`.
4. **Official MOB product photos.** Gallery slots for each product plus the Neck Healer showcase (hero, close up, usage, lifestyle). Use only official or MOB approved images.
5. **Verified product information.** For each product, replace `intro`, add `verifiedPoints` copied from official MOB material, then set `pending: false`. Same for the Neck Healer `callouts`. The "pending verification" tags disappear automatically.
6. **Delivery and warranty.** Replace the placeholders in `src/components/Care.tsx`.
7. **Testimonials.** Add genuine, permitted reviews to `testimonials`. The section stays hidden while the list is empty.
8. **Legal.** Have the privacy notice and disclaimer reviewed.

Note: the MOB website could not be reached from the build environment, so no MOB copy, specs or photos were used. Everything MOB specific is a clearly labelled slot.

## MOB Pelvic-Hold scroll demonstration (`#pelvic-demo`)

A pinned, scroll scrubbed demonstration between the Collection and Why sections.
Six scenes, all driven by one scroll value, so scrolling back reverses it exactly:
the problem, the product reveal, Step 1 position, Step 2 sit, Step 3 close up, the final showcase.

* `src/components/PelvicDemo.tsx` · pinned stage, GSAP ScrollTrigger timeline, captions, annotations, finale
* `src/demo/pelvicScene.ts` · Three.js stage: studio light and soft shadows, a generic office chair, a neutral clay figure with a natural sit down motion (hip hinge, planted feet, two bone leg IK), camera path
* `src/demo/turntable.ts` · scroll scrubbed photo sequence for the product reveal

Three.js loads only when a visitor scrolls near the section (about 136 KB compressed), so the rest of the site is not slowed down.
With reduced motion turned on, the section becomes calm still steps rendered once from the same 3D scene. Without WebGL it falls back to photo slots.

### Product presentation (from Karmen's genuine photo)

* **Reveal:** the real photo (`src/assets/pelvic-hold/pelvic-hold-on-chair-*.webp`), unedited, with a scroll controlled push in towards the cushion. No rotation is faked.
* **3D cushion:** a simple form traced from the same photo (rounded outline, soft edges, slightly convex front). Its mesh texture (`mesh.webp`), colour (`#2a6459`, measured) and label (`label.webp`, perspective corrected) are the photo's own pixels. The camera only shows the faces the photo shows (top, front, the sitter's left side). In flight its top stays tilted towards the camera, so the unphotographed underside is never seen.
* **Proportions are approximate** (`form`, about 42 × 40 × 6 cm) because one angled photo cannot give exact sizes. Replace them with MOB's official measurements and set `approximate: false`.
* **Placement stays labelled provisional** until `placement.verified` is true.

### To make it fully genuine (all in `pelvicDemo`, `src/data/content.ts`)

1. **Turntable photos.** Ask MOB for a 360° photo sequence of the Pelvic-Hold (ideally 36 frames, 10° apart, same camera, light and background). Save them as `public/images/pelvic-hold/turntable-01.webp` etc. and list them in `turntableFrames`. They scrub automatically as the visitor scrolls.
2. **Product on the chair.** Today a translucent, dashed outline volume marks where the product goes. It is deliberately not the product's shape. If MOB supplies an accurate 3D model (.glb), set `modelUrl` and replace the placeholder volume in `pelvicScene.ts` (a GLTFLoader swap). Otherwise keep the placeholder and rely on the photos.
3. **Placement.** Set `placement.z` (metres from seat centre, + towards the front edge) and `placement.rotationY` from MOB's official instructions, then `verified: true`.
4. **Step wording.** Replace `steps.position.sub` and `steps.sit.sub` with MOB's verified instructions and set `pending: false`.
5. **Close up labels.** Replace the two "Support area" annotation labels with MOB's own names for those areas, or remove them.
