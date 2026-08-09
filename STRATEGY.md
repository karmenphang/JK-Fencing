# JK Fencing — Trial Class Funnel: Strategy & Copy Reference

Concept demo built for JK Fencing by Karmen Phang. Live page: `index.html`.

## 1. Conversion Strategy Summary

- **3-second hook** — the hero states the offer (RM80 beginner trial), the audience (children 5+, teens, adult beginners), the emotional payoff (confidence/focus), and the action (Check Trial Availability / WhatsApp) in one screen, no scrolling required.
- **AIDA** — Attention: an emotionally-charged parent-facing headline about undiscovered confidence. Interest: the "Why Fencing" benefits section (focus, confidence, coordination, discipline, respect). Desire: the first-lesson journey + programme path let parents picture their child enjoying and progressing in the sport. Action: every section funnels toward the `#book` section and its two WhatsApp-first paths.
- **Zeigarnik open loop** — "Your child may be one lesson away from discovering a sport they never knew they could love" opens in the hero, recurs after the benefits section, and is resolved (not answered, but *offered resolution*) at the final conversion quote and CTA.
- **Ethical FOMO** — the only urgency used is real: "Trial availability depends on the current class schedule. Message JK Fencing to check your preferred session." No countdowns, fake spot counters, or invented scarcity anywhere on the page.
- **Two-tier WhatsApp conversion** — a one-field "quick" WhatsApp path (relationship + age) for low-friction enquiries, and a fuller lead form for people who want to leave complete details; both resolve to a pre-filled WhatsApp message, since WhatsApp enquiry is the primary KPI.
- **Post-trial funnel** — the "Beyond the First Trial" section explicitly frames the RM80 trial as step one of five (trial → foundations → regular training → skills progression → camps/competition), supporting the secondary goal of converting trial students into recurring customers.

## 2. Complete Page Copy

The full, final copy lives directly in `index.html` (every heading, paragraph, FAQ answer, and CTA label is production copy, not lorem ipsum). Structure mirrors the brief exactly:

1. Hero — headline, subhead, primary/secondary CTA, reassurance line, location chip, open-loop line
2. Why Fencing? — 5 benefit cards + closing loop line
3. What Will My Child Experience? — 6-step first-lesson timeline
4. The RM80 Beginner Trial — price card + 7-question Q&A grid
5. Meet JK Fencing (trust) — 6 editable placeholder panels
6. Beyond the First Trial (programme path) — 5-step journey
7. FAQ — 9 objections answered, accordion
8. Conversion section — closing quote, CTA, honest capacity note
9. Book section — quick WhatsApp form + full lead form
10. Footer — address, map, contact placeholders, credit line

Every claim not explicitly given in the brief is marked inline with a **"Confirm with JK Fencing"** pending tag rather than invented.

## 3. Missing-Information Checklist for JK Fencing

Please confirm/supply the following before launch:

**Contact & operations**
- [ ] Official WhatsApp number (used to power every CTA — see `js/main.js`, `WHATSAPP_NUMBER`)
- [ ] Operating hours / days classes run
- [ ] Class schedule (days, times, session length)

**Trial class details**
- [ ] What's included in the RM80 trial
- [ ] Trial session duration
- [ ] Whether equipment is provided or must be brought/rented
- [ ] Dress code / what to wear
- [ ] Whether parents may observe the trial
- [ ] Exact age groupings/classes accepted
- [ ] What happens immediately after the trial (enrolment steps, any follow-up offer)

**Regular programme**
- [ ] Regular class fees and packages
- [ ] Description of beginner foundations curriculum
- [ ] Skills progression / grading structure, if any
- [ ] Camp and/or competitive programme details

**Trust content**
- [ ] Coach photo(s) and introduction
- [ ] Coach qualifications/certifications
- [ ] Real parent testimonials (with permission)
- [ ] Real student progress stories (with permission)
- [ ] Competition or camp photographs
- [ ] Safety practices (equipment checks, supervision ratios, protocols)

**Brand assets**
- [ ] Logo file (currently a placeholder crossed-blades mark)
- [ ] Real action photography (currently uses abstract line motifs, no stock/fake photos)
- [ ] Social media links, if any, for the footer

## 4. Mobile Wireframe (top-to-bottom flow)

```
┌──────────────────────────────┐
│ ☰ JK FENCING            [CTA]│  sticky header
├──────────────────────────────┤
│         HERO (navy)          │
│  Eyebrow: JK Fencing · PJ     │
│  H1: Behind the mask...       │
│  Sub: RM80 beginner trial...  │
│  [Check Trial Availability]   │
│  [Ask on WhatsApp]            │
│  Complete beginners welcome.. │
│  📍 Glomac Centro, PJU 6A     │
│  "Every fencer starts as..."  │
├──────────────────────────────┤
│  WHY FENCING (white)          │
│  5 stacked benefit cards      │
│  closing loop line             │
├──────────────────────────────┤
│  FIRST LESSON (navy)          │
│  6-step numbered timeline     │
├──────────────────────────────┤
│  RM80 TRIAL (white)           │
│  price card + [Reserve]       │
│  7 Q&A cards (stacked)        │
├──────────────────────────────┤
│  MEET JK FENCING (navy)       │
│  6 dashed placeholder panels  │
├──────────────────────────────┤
│  BEYOND THE TRIAL (white)     │
│  5-step programme timeline    │
├──────────────────────────────┤
│  FAQ (navy)                   │
│  9 accordion items            │
├──────────────────────────────┤
│  CONVERSION QUOTE (navy)      │
│  [Check RM80 Trial Availability]│
│  honest capacity note         │
├──────────────────────────────┤
│  BOOK (white)                 │
│  Quick WhatsApp mini-form     │
│  Full lead form                │
├──────────────────────────────┤
│  FOOTER (dark navy)           │
│  address + map + contact      │
│  "Conversion concept by       │
│   Karmen Phang."               │
└──────────────────────────────┘
│ [💬] [   Book RM80 Trial   ]  │  sticky bottom bar
└──────────────────────────────┘
```

## 5. WhatsApp Follow-Up Message Templates

These are for JK Fencing's team to send manually (or via a CRM/WhatsApp Business tool) — they are not auto-sent by the page.

**A. Immediate enquiry response**
> Hi [Name], thanks so much for reaching out to JK Fencing! 🤺 We'd love to have [child's name/you] try our RM80 beginner trial class. Could you let us know a few days/times that generally work, and we'll check what's currently available? No fencing experience needed at all — just come ready to move!

**B. Reminder for someone who enquired but didn't book**
> Hi [Name], just checking in! We haven't confirmed a trial slot for [child's name/you] yet — no rush at all, we just didn't want your enquiry to slip through the cracks. If you're still keen to give fencing a try, let us know a day/time that suits and we'll see what we can arrange. 😊

**C. Reminder before the confirmed trial class**
> Hi [Name], looking forward to seeing [child's name/you] at JK Fencing for the trial class on [date/time]! [Confirm with JK Fencing: what to bring/wear]. Feel free to message us if anything comes up before then — see you soon!

---
*Conversion concept by Karmen Phang.*
