// Bing Chillin — Digital Craving & Sales Experience
// Sales proposal deck. 16:9, 8 slides, speaker notes on every slide.
const pptxgen = require("pptxgenjs");
const IMG = __dirname + "/img/";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Karmen Phang";
pres.company = "Executive Operations and AI Support";
pres.title = "Bing Chillin Digital Craving and Sales Experience";

// ---------- design system ----------
const NAVY = "0B1524";
const NAVY_DEEP = "050A12";
const PEARL = "F3F7FA";
const WHITE = "FFFFFF";
const CREAM = "EFE2CF";
const CREAM_SOFT = "F7ECDD";
const STRAW = "E23A50";
const CHERRY = "B81D36";
const GOLD = "C9A96A";
const INK = "111A26";
const ON_DARK = "C2CEDC";
const ON_DARK_DIM = "8494A6";
const ON_LIGHT = "51606F";
const ON_LIGHT_DIM = "76838F";
const LINE_D = "2A3B52";
const LINE_L = "D9E2EA";
const WA_GREEN = "1FA855";

const HEAD = "Cambria";
const BODY = "Calibri";

const W = 13.333;
const M = 0.7; // page margin

// ---------- helpers ----------
const sh = (blur, off, op) => ({ type: "outer", color: "000000", blur, offset: off, angle: 90, opacity: op });

function bg(s, file) {
  s.addImage({ path: IMG + file, x: 0, y: 0, w: 13.333, h: 7.5 });
}

function scrim(s, x, y, w, h, color, trans) {
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color, transparency: trans }, line: { type: "none" } });
}

// frosted-glass panel — the deck's one repeating motif
function panel(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: o.r === undefined ? 0.13 : o.r,
    fill: { color: o.fill || WHITE, transparency: o.trans === undefined ? 88 : o.trans },
    line: o.noLine ? { type: "none" } : { color: o.line || LINE_D, width: o.lw || 0.75 },
    shadow: o.shadow === false ? undefined : sh(o.blur || 16, o.off || 3, o.op || 0.2),
  });
}

function pill(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: h / 2,
    fill: o.fill ? { color: o.fill, transparency: o.trans || 0 } : { type: "none" },
    line: o.line ? { color: o.line, width: o.lw || 1 } : { type: "none" },
    shadow: o.shadow ? sh(10, 2, 0.18) : undefined,
  });
}

function txt(s, t, o) {
  s.addText(t, Object.assign({ isTextBox: true, margin: 0, fontFace: BODY }, o));
}

function eyebrow(s, t, x, y, color, w) {
  txt(s, t, { x, y, w: w || 8, h: 0.24, fontSize: 10, bold: true, color, charSpacing: 2.2, fontFace: BODY, valign: "middle" });
}

function dot(s, x, y, d, color) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
}

function numBadge(s, x, y, d, label, fg, bgc) {
  dot(s, x, y, d, bgc);
  txt(s, label, { x, y, w: d, h: d, align: "center", valign: "middle", fontSize: 10, bold: true, color: fg });
}

function footnote(s, t, color, y) {
  txt(s, t, { x: M, y: y === undefined ? 6.95 : y, w: W - M * 2, h: 0.3, fontSize: 8.5, color, italic: true, valign: "middle" });
}

// ============================================================
// SLIDE 1 — THE OPENING HOOK
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "hero.png"); // left-side scrim is baked into the artwork

  eyebrow(s, "A PROPOSAL FOR BING CHILLIN DESSERT CAFE   ·   PUCHONG JAYA", M, 0.68, GOLD, 8.4);

  txt(s, [
    { text: "Bing Chillin already serves the dessert.", options: { color: WHITE, breakLine: true } },
    { text: "What if the craving started before customers arrived?", options: { color: CREAM } },
  ], { x: M, y: 1.12, w: 6.9, h: 2.5, fontSize: 31, bold: true, fontFace: HEAD, lineSpacingMultiple: 1.12, valign: "top" });

  txt(s, "A personalised digital experience designed to turn curiosity into cravings, choices, visits and repeat customers.",
    { x: M, y: 3.42, w: 6.9, h: 0.9, fontSize: 15, color: ON_DARK, lineSpacingMultiple: 1.24 });

  // credit panels
  const cy = 4.95, cw = 3.45, chh = 1.32;
  panel(s, M, cy, cw, chh, { trans: 90, line: LINE_D });
  eyebrow(s, "PREPARED FOR", M + 0.28, cy + 0.22, GOLD, 2.9);
  txt(s, "Bing Chillin Dessert Cafe", { x: M + 0.28, y: cy + 0.52, w: cw - 0.5, h: 0.32, fontSize: 14.5, bold: true, color: WHITE, fontFace: HEAD });
  txt(s, "1, Jalan Kenari 9, Bandar Puchong Jaya", { x: M + 0.28, y: cy + 0.87, w: cw - 0.45, h: 0.3, fontSize: 10, color: ON_DARK_DIM });

  panel(s, M + cw + 0.3, cy, cw, chh, { trans: 90, line: LINE_D });
  eyebrow(s, "PREPARED BY", M + cw + 0.58, cy + 0.22, GOLD, 2.9);
  txt(s, "Karmen Phang", { x: M + cw + 0.58, y: cy + 0.52, w: cw - 0.5, h: 0.32, fontSize: 14.5, bold: true, color: WHITE, fontFace: HEAD });
  txt(s, "Executive Operations & AI Support", { x: M + cw + 0.58, y: cy + 0.87, w: cw - 0.45, h: 0.3, fontSize: 10, color: ON_DARK_DIM });

  txt(s, "Concept artwork. The live build would use Bing Chillin's own photography.",
    { x: 8.3, y: 6.52, w: 4.35, h: 0.3, fontSize: 9, color: ON_DARK, italic: true, align: "right" });

  footnote(s, "Address and trading hours sourced from the Bing Chillin Puchong listing published by @bestfoodmalaysia (Threads, 2026).", ON_DARK_DIM);

  s.addNotes(
    "TIMING: about 50 seconds.\n\n" +
    "OPENING SCRIPT (say this almost word for word):\n" +
    "\"Thanks for the time. I'll keep this to about six minutes. Bing Chillin already does the hardest part. The dessert is good, the space looks good, and people are photographing it. What I want to talk about is the part before someone walks in, and the part after they leave. Right now that space is doing very little work for you. This is a concept for how it could do a lot.\"\n\n" +
    "Then read the headline out loud, pause, and move on. Do not linger on this slide.\n\n" +
    "NOTE: this is a concept proposal. No Bing Chillin internal data was used anywhere in this deck."
  );
}

// ============================================================
// SLIDE 2 — THE HIDDEN SALES GAP
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "light-wide.png");

  eyebrow(s, "THE OPPORTUNITY", M, 0.6, CHERRY, 6);
  txt(s, "Customers may be interested, but still unsure what to choose, whether to visit, or what to do next.",
    { x: M, y: 0.92, w: 11.4, h: 1.05, fontSize: 26, bold: true, color: INK, fontFace: HEAD, lineSpacingMultiple: 1.08 });

  // journey strip
  const steps = ["SEE", "CRAVE", "CHOOSE", "VISIT / ORDER", "RETURN"];
  const pw = 2.16, gap = 0.3, py = 2.06, ph = 0.46;
  steps.forEach((st, i) => {
    const x = M + i * (pw + gap);
    pill(s, x, py, pw, ph, { fill: INK });
    txt(s, st, { x, y: py, w: pw, h: ph, align: "center", valign: "middle", fontSize: 11, bold: true, color: WHITE, charSpacing: 1.4 });
    if (i < steps.length - 1) {
      txt(s, "›", { x: x + pw, y: py, w: gap, h: ph, align: "center", valign: "middle", fontSize: 15, color: GOLD, bold: true });
    }
  });

  // opportunity cards
  const cards = [
    ["01", "Interest is created. The next step could be clearer.",
      "Attractive content pulls people in. Making the next action obvious turns that interest into an enquiry, an order or a visit.", "STAGE  ·  SEE › CRAVE"],
    ["02", "A generous menu deserves a guide.",
      "A first timer facing many flavours may hesitate. One guided recommendation makes the choice quick, easy and confident.", "STAGE  ·  CHOOSE"],
    ["03", "A first visit could become a habit.",
      "Without a gentle follow up, a one time visitor may stay a one time visitor. A reason to return keeps the relationship going.", "STAGE  ·  RETURN"],
  ];
  const cw = 3.8, cg = 0.35, cy = 2.86, ch = 3.22;
  cards.forEach((c, i) => {
    const x = M + i * (cw + cg);
    panel(s, x, cy, cw, ch, { fill: WHITE, trans: 4, line: LINE_L, blur: 22, op: 0.14 });
    numBadge(s, x + 0.32, cy + 0.34, 0.42, c[0], WHITE, i === 1 ? GOLD : STRAW);
    eyebrow(s, "OPPORTUNITY", x + 0.86, cy + 0.44, ON_LIGHT_DIM, 2.2);
    txt(s, c[1], { x: x + 0.32, y: cy + 1.0, w: cw - 0.64, h: 1.1, fontSize: 15.5, bold: true, color: INK, fontFace: HEAD, lineSpacingMultiple: 1.06 });
    txt(s, c[2], { x: x + 0.32, y: cy + 1.98, w: cw - 0.64, h: 0.9, fontSize: 11.5, color: ON_LIGHT, lineSpacingMultiple: 1.16 });
    txt(s, c[3], { x: x + 0.32, y: cy + 2.8, w: cw - 0.64, h: 0.24, fontSize: 8.5, bold: true, color: "8A6D2F", charSpacing: 1.2 });
  });

  footnote(s, "Framed as opportunities, not confirmed issues. No Bing Chillin sales, traffic or customer data was used to produce this slide.", ON_LIGHT_DIM, 6.5);

  s.addNotes(
    "TIMING: about 50 seconds.\n\n" +
    "Say: \"Nothing here is broken. These are just three moments where a customer is quietly deciding something, and right now we're not in the room with them.\"\n\n" +
    "Walk the journey strip left to right with your hand. Then land on the three cards, one sentence each. Do not read the body copy out loud.\n\n" +
    "If the manager pushes back or looks defensive, point at the footnote: this is framed as opportunity, and I have not looked at any of their numbers.\n\n" +
    "Do not name competitors. Do not critique their current posts."
  );
}

// ============================================================
// SLIDE 3 — THE BIG IDEA
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "dark-wide.png");
  scrim(s, 0, 0, 13.333, 7.5, NAVY_DEEP, 30);

  eyebrow(s, "THE BIG IDEA", M, 0.62, GOLD, 6);
  txt(s, "Turn Bing Chillin's digital presence into a guided craving experience.",
    { x: M, y: 0.94, w: 7.3, h: 1.5, fontSize: 27, bold: true, color: WHITE, fontFace: HEAD, lineSpacingMultiple: 1.08 });
  txt(s, "One mobile first page that does what a good server does. It shows, it suggests, it answers, and it invites you back.",
    { x: M, y: 2.42, w: 7.0, h: 0.7, fontSize: 13.5, color: ON_DARK, lineSpacingMultiple: 1.2 });

  const feats = [
    "Sensory dessert presentation",
    "Clear featured flavours",
    "“Find Your Bingsu” interactive selector",
    "Directions and opening information",
    "WhatsApp enquiry or ordering button",
    "Seasonal flavour countdown",
    "Return customer reward or reminder",
  ];
  feats.forEach((f, i) => {
    const y = 3.28 + i * 0.44;
    dot(s, M + 0.02, y + 0.09, 0.17, i % 2 === 0 ? STRAW : GOLD);
    txt(s, f, { x: M + 0.34, y, w: 6.6, h: 0.34, fontSize: 12.5, color: WHITE, valign: "middle" });
  });

  // phone mock-up
  const px = 8.5, py = 0.9, pw = 3.2, ph = 5.9;
  s.addShape(pres.ShapeType.roundRect, {
    x: px, y: py, w: pw, h: ph, rectRadius: 0.34,
    fill: { color: "070D18" }, line: { color: GOLD, width: 1.25 }, shadow: sh(28, 6, 0.45),
  });
  const sx = px + 0.14, sy = py + 0.16, sw = pw - 0.28, shh = ph - 0.32;
  s.addShape(pres.ShapeType.roundRect, { x: sx, y: sy, w: sw, h: shh, rectRadius: 0.26, fill: { color: "0C1826" }, line: { type: "none" } });

  s.addImage({ path: IMG + "phone-food.png", x: sx, y: sy, w: sw, h: 2.2 });
  eyebrow(s, "BING CHILLIN  ·  PUCHONG", sx + 0.2, sy + 0.18, CREAM_SOFT, 2.4);

  let cy2 = sy + 2.34;
  txt(s, "You've had bingsu.\nNot like this.", { x: sx + 0.2, y: cy2, w: sw - 0.4, h: 0.72, fontSize: 15, bold: true, color: WHITE, fontFace: HEAD, lineSpacingMultiple: 1.0 });

  cy2 += 0.86;
  pill(s, sx + 0.2, cy2, 1.35, 0.38, { fill: STRAW });
  txt(s, "Find My Bingsu", { x: sx + 0.2, y: cy2, w: 1.35, h: 0.38, align: "center", valign: "middle", fontSize: 8.5, bold: true, color: WHITE });
  pill(s, sx + 1.63, cy2, 1.29, 0.38, { line: "48566B", lw: 0.75 });
  txt(s, "Today's Picks", { x: sx + 1.63, y: cy2, w: 1.29, h: 0.38, align: "center", valign: "middle", fontSize: 8.5, bold: true, color: ON_DARK });

  cy2 += 0.5;
  txt(s, "Open till 11pm  ·  Jalan Kenari 9  ·  Directions", { x: sx + 0.2, y: cy2, w: sw - 0.4, h: 0.24, fontSize: 8, color: ON_DARK_DIM, valign: "middle" });

  cy2 += 0.34;
  panel(s, sx + 0.2, cy2, sw - 0.4, 0.46, { fill: GOLD, trans: 82, line: GOLD, lw: 0.5, r: 0.1, shadow: false });
  txt(s, "SEASONAL DROP ENDS IN  03 : 14 : 22", { x: sx + 0.2, y: cy2, w: sw - 0.4, h: 0.46, align: "center", valign: "middle", fontSize: 8, bold: true, color: CREAM_SOFT, charSpacing: 0.8 });

  cy2 += 0.58;
  pill(s, sx + 0.2, cy2, sw - 0.4, 0.44, { fill: WA_GREEN });
  txt(s, "Ask us on WhatsApp", { x: sx + 0.2, y: cy2, w: sw - 0.4, h: 0.44, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: WHITE });

  cy2 += 0.56;
  panel(s, sx + 0.2, cy2, sw - 0.4, 0.44, { fill: WHITE, trans: 92, line: LINE_D, lw: 0.5, r: 0.1, shadow: false });
  txt(s, "Welcome back, your 5th bingsu is on us", { x: sx + 0.2, y: cy2, w: sw - 0.4, h: 0.44, align: "center", valign: "middle", fontSize: 8, color: CREAM });

  txt(s, "Illustrative mock up", { x: px, y: py + ph + 0.12, w: pw, h: 0.26, align: "center", fontSize: 8.5, italic: true, color: ON_DARK_DIM });

  txt(s, "Concept design. Trading hours shown reflect the published Puchong hours: 11am to 11pm Sunday to Thursday, 11am to 12am Friday and Saturday (@bestfoodmalaysia, Threads, 2026).",
    { x: M, y: 6.82, w: 7.5, h: 0.5, fontSize: 8.5, color: ON_DARK_DIM, italic: true, lineSpacingMultiple: 1.1 });

  s.addNotes(
    "TIMING: about 60 seconds. This is the centre of the proposal.\n\n" +
    "Let the phone do the talking. Say: \"One page. Everything a customer needs, in the order they actually need it.\"\n\n" +
    "Do NOT read all seven features. Read three, and pick the three the manager reacts to. If they lean toward ordering, lead with the WhatsApp button. If they lean toward footfall, lead with directions and hours.\n\n" +
    "Point out the countdown and the return-customer line at the bottom of the phone. Those two are what make the page worth revisiting.\n\n" +
    "If asked \"does this exist already?\" — be honest: it is a concept built for them, and it can be live as a pilot page quickly."
  );
}

// ============================================================
// SLIDE 4 — INTERACTIVE EXPERIENCE
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "light-wide.png");

  eyebrow(s, "FIND YOUR BINGSU  ·  ILLUSTRATIVE CONCEPT", M, 0.58, CHERRY, 7);
  txt(s, "What are you craving today?",
    { x: M, y: 0.88, w: 8.2, h: 0.66, fontSize: 32, bold: true, color: INK, fontFace: HEAD });

  const LW = 8.1; // left column width

  // Question 1
  txt(s, "QUESTION 1   ·   Which mood fits you today?", { x: M, y: 1.72, w: LW, h: 0.26, fontSize: 10, bold: true, color: ON_LIGHT_DIM, charSpacing: 1.2, valign: "middle" });
  const q1 = [
    ["Rich and comforting", "cat-rich.png"],
    ["Fruity and refreshing", "cat-fruity.png"],
    ["Creamy and indulgent", "cat-creamy.png"],
    ["Surprise me", "cat-surprise.png"],
  ];
  const ow = 1.9, og = 0.17, oy = 2.06, oh = 1.72;
  q1.forEach((o, i) => {
    const x = M + i * (ow + og);
    panel(s, x, oy, ow, oh, { fill: WHITE, trans: 2, line: i === 1 ? STRAW : LINE_L, lw: i === 1 ? 1.5 : 0.75, blur: 18, op: 0.14 });
    s.addImage({ path: IMG + o[1], x: x + 0.13, y: oy + 0.13, w: ow - 0.26, h: 0.92 });
    txt(s, o[0], { x: x + 0.16, y: oy + 1.14, w: ow - 0.32, h: 0.46, fontSize: 10.5, bold: true, color: INK, valign: "top", lineSpacingMultiple: 1.02 });
  });

  // Question 2
  txt(s, "QUESTION 2   ·   Sharing, or enjoying it yourself?", { x: M, y: 4.0, w: LW, h: 0.26, fontSize: 10, bold: true, color: ON_LIGHT_DIM, charSpacing: 1.2, valign: "middle" });
  const q2 = ["Just me", "Sharing for two", "Group treat"];
  const bw = 2.58, bg2 = 0.18, by = 4.34, bh = 0.62;
  q2.forEach((o, i) => {
    const x = M + i * (bw + bg2);
    const on = i === 1;
    pill(s, x, by, bw, bh, { fill: on ? INK : WHITE, trans: on ? 0 : 4, line: on ? INK : LINE_L, lw: 0.75, shadow: true });
    txt(s, o, { x, y: by, w: bw, h: bh, align: "center", valign: "middle", fontSize: 11.5, bold: true, color: on ? WHITE : ON_LIGHT });
  });

  // Result card
  const rx = 9.15, ry = 1.72, rw = 3.45, rh = 4.6;
  panel(s, rx, ry, rw, rh, { fill: INK, trans: 4, line: INK, lw: 1, blur: 26, op: 0.3 });
  eyebrow(s, "YOUR MATCH", rx + 0.3, ry + 0.28, GOLD, 2.4);
  s.addImage({ path: IMG + "cat-fruity.png", x: rx + 0.3, y: ry + 0.62, w: rw - 0.6, h: 1.28 });
  txt(s, "A fruit forward bingsu, sized for two.",
    { x: rx + 0.3, y: ry + 2.04, w: rw - 0.6, h: 0.66, fontSize: 15, bold: true, color: WHITE, fontFace: HEAD, lineSpacingMultiple: 1.04 });
  txt(s, "Bright, cold and easy to share. Light enough after a meal, generous enough to photograph.",
    { x: rx + 0.3, y: ry + 2.72, w: rw - 0.6, h: 0.62, fontSize: 10.5, color: ON_DARK, lineSpacingMultiple: 1.14 });

  const byy = ry + 3.42;
  pill(s, rx + 0.3, byy, rw - 0.6, 0.44, { fill: STRAW });
  txt(s, "View this craving", { x: rx + 0.3, y: byy, w: rw - 0.6, h: 0.44, align: "center", valign: "middle", fontSize: 10.5, bold: true, color: WHITE });
  pill(s, rx + 0.3, byy + 0.54, rw - 0.6, 0.44, { fill: WA_GREEN });
  txt(s, "Ask on WhatsApp", { x: rx + 0.3, y: byy + 0.54, w: rw - 0.6, h: 0.44, align: "center", valign: "middle", fontSize: 10.5, bold: true, color: WHITE });

  // what the flow actually does for the customer
  panel(s, M, 5.2, 8.1, 1.06, { fill: WHITE, trans: 6, line: LINE_L, blur: 18, op: 0.12 });
  txt(s, "Two questions. One clear answer.", { x: M + 0.3, y: 5.36, w: 3.5, h: 0.32, fontSize: 15, bold: true, color: INK, fontFace: HEAD });
  txt(s, "No scrolling a long menu on a small screen. The customer gets something they can act on straight away, at 3pm or at 11pm.",
    { x: M + 0.3, y: 5.72, w: 7.5, h: 0.42, fontSize: 11.5, color: ON_LIGHT, lineSpacingMultiple: 1.1 });

  footnote(s, "Illustrative concept. Options and results shown are examples, not Bing Chillin's confirmed menu. Publicly listed items include bingsu and waffles (Chiefeater, 2026). The live selector would map only to real menu items.", ON_LIGHT_DIM, 6.66);

  s.addNotes(
    "TIMING: about 55 seconds. This is the demo moment — make it interactive.\n\n" +
    "Ask the manager the questions live: \"Which mood fits you today?\" Wait for a real answer. Then \"Sharing, or just you?\" Wait again.\n\n" +
    "When they answer, point at the result card and say: \"That's it. Two taps and the customer has decided.\"\n\n" +
    "Be clear and unprompted about this: the flavours and the result on screen are placeholders. The real version would only ever recommend items that are genuinely on their menu that day.\n\n" +
    "If they say \"our staff already do this in store\" — agree, and say that is exactly the point: this is the same conversation, happening at 10pm on someone's sofa."
  );
}

// ============================================================
// SLIDE 5 — SEASONAL URGENCY
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "dark-wide.png");
  scrim(s, 0, 0, 13.333, 7.5, NAVY_DEEP, 28);

  eyebrow(s, "SEASONAL FLAVOUR DROP  ·  PROPOSED CAMPAIGN", M, 0.6, GOLD, 8);
  txt(s, "Some cravings should not be available forever.",
    { x: M, y: 0.92, w: 9.5, h: 0.66, fontSize: 30, bold: true, color: WHITE, fontFace: HEAD });

  // left: the drop visual
  const dx = M, dy = 1.78, dw = 5.0, dh = 4.28;
  s.addImage({ path: IMG + "drop.png", x: dx, y: dy, w: dw, h: dh });
  scrim(s, dx, dy, dw, dh, NAVY_DEEP, 42);
  s.addShape(pres.ShapeType.rect, { x: dx, y: dy, w: dw, h: dh, fill: { type: "none" }, line: { color: LINE_D, width: 1 } });
  eyebrow(s, "THE CHILLIN' DROP", dx + 0.36, dy + 0.4, GOLD, 3.4);
  txt(s, "[ Seasonal flavour name ]", { x: dx + 0.36, y: dy + 0.76, w: dw - 0.72, h: 0.62, fontSize: 24, bold: true, color: WHITE, fontFace: HEAD });
  txt(s, "Available this week only at Bing Chillin Puchong.", { x: dx + 0.36, y: dy + 1.44, w: dw - 0.72, h: 0.3, fontSize: 12, color: CREAM });

  // countdown blocks
  const units = [["03", "DAYS"], ["14", "HOURS"], ["22", "MINS"]];
  const uw = 1.16, ug = 0.18, uy = dy + 1.94;
  units.forEach((u, i) => {
    const x = dx + 0.36 + i * (uw + ug);
    panel(s, x, uy, uw, 0.92, { fill: WHITE, trans: 88, line: LINE_D, r: 0.1, shadow: false });
    txt(s, u[0], { x, y: uy + 0.1, w: uw, h: 0.44, align: "center", fontSize: 22, bold: true, color: WHITE, fontFace: HEAD });
    txt(s, u[1], { x, y: uy + 0.56, w: uw, h: 0.24, align: "center", fontSize: 8, bold: true, color: GOLD, charSpacing: 1.4 });
  });

  txt(s, "Only [ x ] portions a day, while the fruit lasts.",
    { x: dx + 0.36, y: uy + 1.06, w: dw - 0.72, h: 0.3, fontSize: 11, color: ON_DARK, italic: true });

  const cta = uy + 1.44;
  pill(s, dx + 0.36, cta, 2.1, 0.46, { fill: STRAW });
  txt(s, "Remind me before it ends", { x: dx + 0.36, y: cta, w: 2.1, h: 0.46, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: WHITE });
  pill(s, dx + 2.58, cta, 1.16, 0.46, { line: "5A687C", lw: 0.75 });
  txt(s, "Share", { x: dx + 2.58, y: cta, w: 1.16, h: 0.46, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: ON_DARK });

  // right: mechanics
  const mx = 6.1, mw = 6.53;
  const mech = [
    ["Cinematic flavour reveal", "One vertical video, one still. Built to be watched, not read."],
    ["Live countdown timer", "Set to the real end date and nothing else."],
    ["“Available this week”", "Clear, specific and honest about the window."],
    ["Limited daily quantity", "Shown only when the kitchen genuinely caps it."],
    ["Story and WhatsApp sharing", "One tap to send it to the friend who always says yes."],
    ["“Remind me before it ends”", "Permission based. The customer asks to be told."],
  ];
  mech.forEach((m, i) => {
    const y = 1.78 + i * 0.70;
    panel(s, mx, y, mw, 0.64, { fill: WHITE, trans: 92, line: LINE_D, r: 0.1, shadow: false });
    dot(s, mx + 0.24, y + 0.21, 0.18, i % 2 === 0 ? STRAW : GOLD);
    txt(s, m[0], { x: mx + 0.56, y: y + 0.06, w: 3.1, h: 0.48, fontSize: 11.5, bold: true, color: WHITE, valign: "middle" });
    txt(s, m[1], { x: mx + 3.76, y: y + 0.06, w: mw - 4.0, h: 0.52, fontSize: 9.5, color: ON_DARK_DIM, valign: "middle", lineSpacingMultiple: 1.06 });
  });

  txt(s, "Ethical scarcity only: real dates, real quantities, real flavours. Curiosity brings people forward. A false timer costs trust, and it is not worth the trade.",
    { x: mx, y: 6.06, w: mw, h: 0.6, fontSize: 10.5, color: CREAM, italic: true, lineSpacingMultiple: 1.16 });

  footnote(s, "Proposed campaign concept. Flavour name, dates and quantities are placeholders to be set by Bing Chillin.", ON_DARK_DIM);

  s.addNotes(
    "TIMING: about 50 seconds.\n\n" +
    "Say: \"Bingsu is seasonal by nature. That's a gift. A flavour that's only here for a week gives people a reason to come now instead of some day.\"\n\n" +
    "The ethics line matters — say it out loud: \"The urgency only works if it's true. Real dates, real quantities. If it isn't true, it costs you trust, and it isn't worth it.\" Malaysian cafe managers have seen fake countdowns and they respect being told this upfront.\n\n" +
    "Everything in the left panel is a placeholder. They choose the flavour, the window and the daily cap. I build the mechanism.\n\n" +
    "Good moment to ask a question back: \"Do you already run limited flavours?\" Their answer tells you how fast this could launch."
  );
}

// ============================================================
// SLIDE 6 — WHATSAPP CONVERSION AND FOLLOW-UP
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "light-wide.png");

  eyebrow(s, "WHATSAPP CONVERSION  ·  ILLUSTRATIVE CONVERSATION", M, 0.58, CHERRY, 8);
  txt(s, "From “What should I order?” to a clear recommendation, in seconds.",
    { x: M, y: 0.86, w: 11.9, h: 0.92, fontSize: 24, bold: true, color: INK, fontFace: HEAD, lineSpacingMultiple: 1.06 });

  // conversation panel
  const cx = M, cy = 1.8, cw = 7.5, ch = 4.5;
  panel(s, cx, cy, cw, ch, { fill: "E9E4DB", trans: 12, line: LINE_L, blur: 22, op: 0.16 });
  txt(s, "Bing Chillin Puchong  ·  typically replies in minutes",
    { x: cx + 0.3, y: cy + 0.24, w: cw - 0.6, h: 0.26, fontSize: 9.5, bold: true, color: ON_LIGHT_DIM, valign: "middle" });

  function bubbleIn(y, t, h) {
    s.addShape(pres.ShapeType.roundRect, { x: cx + 0.3, y, w: 4.5, h, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "E2E6EA", width: 0.5 }, shadow: sh(8, 2, 0.12) });
    txt(s, t, { x: cx + 0.48, y: y + 0.08, w: 4.14, h: h - 0.16, fontSize: 11, color: INK, valign: "middle", lineSpacingMultiple: 1.1 });
  }
  function bubbleOut(y, t, h) {
    const bw2 = 5.1, x = cx + cw - 0.3 - bw2;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: bw2, h, rectRadius: 0.12, fill: { color: "DCF6C8" }, line: { color: "C6E9AC", width: 0.5 }, shadow: sh(8, 2, 0.12) });
    txt(s, t, { x: x + 0.18, y: y + 0.08, w: bw2 - 0.36, h: h - 0.16, fontSize: 11, color: "12331B", valign: "middle", lineSpacingMultiple: 1.1 });
    return x;
  }

  bubbleIn(cy + 0.6, "What would you recommend for two people? We prefer something refreshing.", 0.62);
  bubbleOut(cy + 1.3, "Happy to help. Would you prefer fruity, creamy, or less sweet?", 0.52);

  // customer selects an option
  const chipY = cy + 1.92;
  pill(s, cx + 0.3, chipY, 1.15, 0.4, { fill: INK });
  txt(s, "Fruity", { x: cx + 0.3, y: chipY, w: 1.15, h: 0.4, align: "center", valign: "middle", fontSize: 10, bold: true, color: WHITE });
  txt(s, "customer selects an option", { x: cx + 1.56, y: chipY, w: 2.4, h: 0.4, fontSize: 9, italic: true, color: ON_LIGHT_DIM, valign: "middle" });

  const ox = bubbleOut(cy + 2.44, "Then a fruit forward bingsu, sized for two.\nWe're at 1, Jalan Kenari 9, Bandar Puchong Jaya. Open till 11pm tonight.", 0.88);

  // action buttons inside the conversation
  const abY = cy + 3.42;
  const acts = ["Get directions", "See the menu", "Order now"];
  acts.forEach((a, i) => {
    const bw3 = 1.62, x = ox + i * (bw3 + 0.12);
    pill(s, x, abY, bw3, 0.42, { fill: WHITE, line: WA_GREEN, lw: 0.9 });
    txt(s, a, { x, y: abY, w: bw3, h: 0.42, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: WA_GREEN });
  });

  txt(s, "Location and trading hours shown are the publicly listed Puchong details.",
    { x: cx + 0.3, y: cy + 4.02, w: cw - 0.6, h: 0.28, fontSize: 8.5, italic: true, color: ON_LIGHT_DIM, valign: "middle" });

  // right column
  const rx = 8.55, rw = 4.08;
  panel(s, rx, cy, rw, 1.94, { fill: WHITE, trans: 2, line: LINE_L, blur: 20, op: 0.14 });
  eyebrow(s, "OPTIONAL POST VISIT FOLLOW UP", rx + 0.28, cy + 0.26, GOLD, 3.4);
  s.addShape(pres.ShapeType.roundRect, { x: rx + 0.28, y: cy + 0.62, w: rw - 0.56, h: 0.86, rectRadius: 0.12, fill: { color: "DCF6C8" }, line: { color: "C6E9AC", width: 0.5 } });
  txt(s, "Enjoyed your dessert? Here is this week's special flavour.",
    { x: rx + 0.46, y: cy + 0.7, w: rw - 0.92, h: 0.7, fontSize: 11, color: "12331B", valign: "middle", lineSpacingMultiple: 1.1 });
  txt(s, "Sent only to customers who opted in.", { x: rx + 0.28, y: cy + 1.56, w: rw - 0.56, h: 0.26, fontSize: 9, italic: true, color: ON_LIGHT_DIM });

  const wins = [
    ["Fewer repeated questions", "Hours, location, menu and recommendations answered the same way every time."],
    ["Staff stay on the floor", "The routine replies handle themselves. Real conversations still go to a person."],
    ["A reason to come back", "One honest, opt in message beats ten posts nobody sees."],
  ];
  wins.forEach((w, i) => {
    const y = cy + 2.14 + i * 0.79;
    panel(s, rx, y, rw, 0.72, { fill: WHITE, trans: 6, line: LINE_L, r: 0.1, shadow: false });
    dot(s, rx + 0.24, y + 0.27, 0.18, i === 1 ? GOLD : STRAW);
    txt(s, w[0], { x: rx + 0.54, y: y + 0.08, w: rw - 0.8, h: 0.24, fontSize: 11, bold: true, color: INK });
    txt(s, w[1], { x: rx + 0.54, y: y + 0.32, w: rw - 0.8, h: 0.34, fontSize: 9, color: ON_LIGHT, lineSpacingMultiple: 1.06 });
  });

  footnote(s, "Illustrative conversation. Final functionality depends on Bing Chillin's preferred ordering process and existing WhatsApp setup. Hours and address per the published Puchong listing (@bestfoodmalaysia, Threads, 2026).", ON_LIGHT_DIM, 6.5);

  s.addNotes(
    "TIMING: about 55 seconds.\n\n" +
    "Read the conversation out loud in two voices. It lands much better spoken than read silently. Slow down on the reply that gives the address and the closing time.\n\n" +
    "Then point at the green follow-up card on the right and say: \"Opt in only. Nobody gets messaged who didn't ask.\"\n\n" +
    "Then say this plainly: \"How far this goes depends on how you already take orders and how your WhatsApp is set up. I'd build around what you have. I'm not asking you to change your system.\"\n\n" +
    "If they ask about cost or effort here, hold it — slide 8 covers the pilot."
  );
}

// ============================================================
// SLIDE 7 — WHAT THIS COULD UNLOCK
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "light-wide.png");

  eyebrow(s, "THE SHIFT", M, 0.58, CHERRY, 6);
  txt(s, "One connected journey, not disconnected posts and links.",
    { x: M, y: 0.88, w: 11.5, h: 0.66, fontSize: 29, bold: true, color: INK, fontFace: HEAD });

  const rows = [
    ["Sees a dessert post", "Enters an immersive craving page"],
    ["Unsure what to choose", "Receives a guided recommendation"],
    ["Looks for basic information", "Gets location, hours and answers quickly"],
    ["Plans to visit later", "Receives a timely seasonal reminder"],
    ["Visits once", "Is invited back through an ethical follow up"],
  ];

  const tx = M, tw = 11.93;
  const colA = 5.05, colArrow = 0.9, colB = tw - colA - colArrow;
  const hy = 1.68, hh = 0.5;

  // header
  s.addShape(pres.ShapeType.roundRect, { x: tx, y: hy, w: colA, h: hh, rectRadius: 0.1, fill: { color: "E4EAF0" }, line: { type: "none" } });
  txt(s, "CURRENT CUSTOMER BEHAVIOUR", { x: tx + 0.3, y: hy, w: colA - 0.5, h: hh, fontSize: 10, bold: true, color: ON_LIGHT, charSpacing: 1.3, valign: "middle" });
  s.addShape(pres.ShapeType.roundRect, { x: tx + colA + colArrow, y: hy, w: colB, h: hh, rectRadius: 0.1, fill: { color: INK }, line: { type: "none" } });
  txt(s, "PROPOSED EXPERIENCE", { x: tx + colA + colArrow + 0.3, y: hy, w: colB - 0.5, h: hh, fontSize: 10, bold: true, color: GOLD, charSpacing: 1.3, valign: "middle" });

  const ry0 = hy + 0.62, rh2 = 0.74, rg = 0.12;
  rows.forEach((r, i) => {
    const y = ry0 + i * (rh2 + rg);
    panel(s, tx, y, colA, rh2, { fill: WHITE, trans: 18, line: LINE_L, r: 0.1, shadow: false });
    txt(s, r[0], { x: tx + 0.3, y, w: colA - 0.5, h: rh2, fontSize: 13, color: ON_LIGHT, valign: "middle" });
    txt(s, "→", { x: tx + colA, y, w: colArrow, h: rh2, align: "center", valign: "middle", fontSize: 17, bold: true, color: GOLD });
    panel(s, tx + colA + colArrow, y, colB, rh2, { fill: WHITE, trans: 2, line: STRAW, lw: 1.0, r: 0.1, blur: 16, op: 0.12 });
    txt(s, r[1], { x: tx + colA + colArrow + 0.3, y, w: colB - 0.5, h: rh2, fontSize: 13.5, bold: true, color: INK, valign: "middle" });
  });

  footnote(s, "A directional description of the customer experience, not a performance forecast. No revenue, percentage or traffic improvements are claimed or implied.", ON_LIGHT_DIM, 6.66);

  s.addNotes(
    "TIMING: about 40 seconds. Move fast here.\n\n" +
    "Read the left column in one breath, then the right column in one breath. Let the contrast do the work.\n\n" +
    "Say: \"I'm not going to promise you a percentage. What I'm proposing is one connected journey instead of scattered links.\"\n\n" +
    "If the manager asks for numbers, be straight: \"I don't have your numbers, and I won't invent any. The pilot on the next slide is designed so you can measure it yourself.\""
  );
}

// ============================================================
// SLIDE 8 — PROPOSED PILOT
// ============================================================
{
  const s = pres.addSlide();
  bg(s, "close.png");

  eyebrow(s, "PROPOSED PILOT", M, 0.55, GOLD, 6);
  txt(s, "Start small. Test the experience. Expand what works.",
    { x: M, y: 0.85, w: 11.9, h: 0.66, fontSize: 28, bold: true, color: WHITE, fontFace: HEAD });

  const items = [
    ["01", "One mobile first craving page", "Built for phones, built for Bing Chillin."],
    ["02", "One “Find Your Bingsu” flow", "Two questions, one confident recommendation."],
    ["03", "One seasonal flavour drop section", "Real dates, real quantities, ready to reuse."],
    ["04", "One WhatsApp conversion pathway", "Around your existing setup, not replacing it."],
    ["05", "Basic enquiry and action tracking", "So you can see what people actually do."],
    ["06", "One review and refinement session", "We look at the results together and adjust."],
  ];
  const iw = 3.8, ig = 0.35, ih = 1.16;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (iw + ig);
    const y = 1.78 + row * (ih + 0.24);
    panel(s, x, y, iw, ih, { fill: WHITE, trans: 90, line: LINE_D, r: 0.1, shadow: false });
    txt(s, it[0], { x: x + 0.26, y: y + 0.16, w: 0.5, h: 0.3, fontSize: 11, bold: true, color: GOLD, fontFace: HEAD });
    txt(s, it[1], { x: x + 0.26, y: y + 0.44, w: iw - 0.52, h: 0.3, fontSize: 12.5, bold: true, color: WHITE });
    txt(s, it[2], { x: x + 0.26, y: y + 0.75, w: iw - 0.52, h: 0.3, fontSize: 9.5, color: ON_DARK_DIM });
  });

  // investment
  const iy = 4.62;
  panel(s, M, iy, 5.6, 0.62, { fill: GOLD, trans: 84, line: GOLD, lw: 0.75, r: 0.1, shadow: false });
  txt(s, "Pilot investment:  To be discussed after confirming scope.",
    { x: M + 0.26, y: iy, w: 5.2, h: 0.62, fontSize: 12, bold: true, color: GOLD, valign: "middle" });

  // closing CTA
  txt(s, "Would you be open to a short demonstration using one of Bing Chillin's featured desserts?",
    { x: M, y: 5.45, w: 8.6, h: 1.0, fontSize: 22, bold: true, color: CREAM, fontFace: HEAD, lineSpacingMultiple: 1.06 });

  // contact
  panel(s, 9.5, 5.2, 3.13, 1.4, { trans: 90, line: LINE_D });
  eyebrow(s, "CONTACT", 9.76, 5.42, GOLD, 2.4);
  txt(s, "Karmen Phang", { x: 9.76, y: 5.72, w: 2.7, h: 0.32, fontSize: 15, bold: true, color: WHITE, fontFace: HEAD });
  txt(s, "Executive Operations & AI Support", { x: 9.76, y: 6.06, w: 2.7, h: 0.42, fontSize: 10, color: ON_DARK_DIM, lineSpacingMultiple: 1.02 });

  footnote(s, "Concept proposal prepared for Bing Chillin Dessert Cafe, Puchong. All figures, flavours and timings shown throughout are illustrative placeholders.", ON_DARK_DIM);

  s.addNotes(
    "TIMING: about 60 seconds, then stop talking.\n\n" +
    "Walk the six pilot items quickly — this is deliberately small and deliberately low risk. Say: \"Six things. Not a rebuild. If it doesn't work, you've lost very little. If it does, we know exactly what to expand.\"\n\n" +
    "On investment: \"I haven't put a number on this because I don't know your scope yet. Once we agree what's in, I'll price it properly.\" Do not improvise a figure.\n\n" +
    "CLOSING QUESTION — say it slowly, then be quiet and let them answer:\n" +
    "\"Would you be open to a short demonstration using one of Bing Chillin's featured desserts?\"\n\n" +
    "Silence after the question is doing work. Don't fill it.\n\n" +
    "If yes: agree the dessert and a date before leaving the table. If a maybe: offer to build the one page for a single featured dessert so they can see it live.\n\n" +
    "TOTAL RUN TIME: roughly 6 minutes across all eight slides."
  );
}

pres.writeFile({ fileName: __dirname + "/Bing-Chillin-Digital-Craving-and-Sales-Experience.pptx" })
  .then((f) => console.log("wrote", f));
