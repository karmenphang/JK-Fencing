# JK Fencing — Trial Class Enrolment Funnel (Concept Demo)

A mobile-first, single-page trial-class enrolment funnel for JK Fencing, a fencing academy in Petaling Jaya. Built as a static site — no build step, no backend, no dependencies beyond Google Fonts.

This is a **conversion concept demo** created by Karmen Phang for JK Fencing. See `STRATEGY.md` for the full conversion strategy write-up, complete page copy summary, missing-information checklist, mobile wireframe, and WhatsApp follow-up message templates.

## Running it locally

No build step needed — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before launch — required configuration

1. **WhatsApp number.** Open `js/main.js` and replace the placeholder in:
   ```js
   var WHATSAPP_NUMBER = "60XXXXXXXXX";
   ```
   with JK Fencing's real number (digits only, country code first, e.g. `60123456789`). It's left as a non-numeric placeholder on purpose so the demo can never accidentally message a real person.

2. **Everything tagged "Confirm with JK Fencing"** across the page (trial-class logistics, regular fees, schedule, safety practices, etc.) needs a real answer from JK Fencing before this goes live. See the checklist in `STRATEGY.md` for the full list.

3. **Trust section content** (`#trust` in `index.html`) — replace the six dashed placeholder panels with the coach's real photo/bio, qualifications, testimonials, student stories, event photos and safety practices. No names, quotes or credentials have been invented.

4. **Photography.** The page currently uses abstract line/geometric motifs instead of photos, since no real photography was supplied. Swap in real action shots of JK Fencing's coaching and students once available.

## File structure

```
index.html        Full page markup + copy
css/style.css      Design system (navy / white / silver, mobile-first)
js/main.js         WhatsApp link builder, form handling, no dependencies
assets/favicon.svg Placeholder crossed-blades mark (swap for real logo)
STRATEGY.md         Conversion strategy, copy, checklist, wireframe, WA templates
```

---
*Conversion concept by Karmen Phang.*
