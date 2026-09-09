// Generates original abstract "cold dessert" art for the Bing Chillin proposal deck.
// No third-party photography, no logos. Pure vector/gradient art rendered to PNG.
const sharp = require("sharp");
const fs = require("fs");

const OUT = __dirname + "/img";
fs.mkdirSync(OUT, { recursive: true });

// deterministic pseudo-random
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const PAL = {
  navy: "#0B1524",
  navyDeep: "#050A12",
  charcoal: "#15181F",
  pearl: "#F3F7FA",
  cream: "#EFE2CF",
  creamSoft: "#F7ECDD",
  strawberry: "#E23A50",
  cherry: "#B81D36",
  gold: "#C9A96A",
};

function speckles(rand, w, h, n, color, maxR, maxOp) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * w, y = rand() * h;
    const r = 0.6 + rand() * maxR;
    const o = 0.15 + rand() * maxOp;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${o.toFixed(2)}"/>`;
  }
  return s;
}

function bokeh(rand, w, h, n, colors) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * w, y = rand() * h * 0.9;
    const r = w * (0.012 + rand() * 0.034);
    const c = colors[Math.floor(rand() * colors.length)];
    const o = 0.05 + rand() * 0.13;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}" opacity="${o.toFixed(2)}" filter="url(#soft)"/>`;
  }
  return s;
}

// A cold light bloom low in the frame - the sense of a chilled surface catching light.
function bloom(cx, cy, rw, rh, color, op) {
  return `<g filter="url(#blurBig)"><ellipse cx="${cx}" cy="${cy}" rx="${rw}" ry="${rh}" fill="${color}" opacity="${op}"/></g>`;
}

// Condensation: fine droplets with a highlight, scattered low.
function droplets(rand, w, h, n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * w;
    const y = h * 0.35 + rand() * h * 0.65;
    const r = w * (0.002 + rand() * 0.006);
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#FFFFFF" opacity="${(0.04 + rand() * 0.09).toFixed(2)}"/>`;
    s += `<circle cx="${(x - r * 0.3).toFixed(0)}" cy="${(y - r * 0.3).toFixed(0)}" r="${(r * 0.34).toFixed(1)}" fill="#FFFFFF" opacity="${(0.10 + rand() * 0.16).toFixed(2)}"/>`;
  }
  return s;
}

function defs(w) {
  return `
  <defs>
    <filter id="soft" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="${(w * 0.012).toFixed(1)}"/>
    </filter>
    <filter id="blurBig" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="${(w * 0.022).toFixed(1)}"/>
    </filter>
    <filter id="blurMid" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="${(w * 0.01).toFixed(1)}"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>`;
}

/**
 * Dark cinematic panel: deep cold gradient, warm bokeh, ice specks, condensation.
 * opts: { w,h,seed,accent,accent2,base,base2,lightX }
 */
function darkPanel(o) {
  const { w, h, seed } = o;
  const rand = rng(seed);
  const accent = o.accent || PAL.strawberry;
  const accent2 = o.accent2 || PAL.gold;
  const base = o.base || PAL.navy;
  const base2 = o.base2 || PAL.navyDeep;
  const lx = o.lightX !== undefined ? o.lightX : 0.74;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs(w)}
  <rect width="${w}" height="${h}" fill="${base2}"/>
  <rect width="${w}" height="${h}" fill="${base}" opacity="0.88"/>
  ${bloom(w * lx, h * 0.20, w * 0.46, h * 0.52, accent, 0.20)}
  ${bloom(w * (lx + 0.14), h * 0.62, w * 0.30, h * 0.40, accent2, 0.14)}
  ${bloom(w * 0.10, h * 0.88, w * 0.38, h * 0.44, "#16324A", 0.30)}
  ${bloom(w * lx, h * 0.34, w * 0.16, h * 0.20, "#FFFFFF", 0.10)}
  ${bloom(w * 0.5, h * 1.08, w * 0.65, h * 0.36, "#000000", 0.45)}
  ${bloom(w * 0.02, h * 0.04, w * 0.30, h * 0.28, "#000000", 0.35)}
  ${bokeh(rand, w, h, 22, [accent, accent2, PAL.creamSoft, "#7FA9C9"])}
  ${droplets(rand, w, h, 90)}
  ${speckles(rand, w, h, 300, "#FFFFFF", 1.5, 0.38)}
  ${speckles(rand, w, h, 70, accent2, 1.7, 0.30)}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.055"/>
  ${o.scrimLeft ? `<defs><linearGradient id="sl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${base2}" stop-opacity="0.94"/>
      <stop offset="0.42" stop-color="${base2}" stop-opacity="0.86"/>
      <stop offset="0.70" stop-color="${base2}" stop-opacity="0.42"/>
      <stop offset="1" stop-color="${base2}" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#sl)"/>` : ""}
  ${o.dim ? `<rect width="${w}" height="${h}" fill="${base2}" opacity="${o.dim}"/>` : ""}
</svg>`;
}

/** Light icy panel — pearl white with the faintest cold tint. */
function lightPanel(o) {
  const { w, h, seed } = o;
  const rand = rng(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs(w)}
  <rect width="${w}" height="${h}" fill="${PAL.pearl}"/>
  <ellipse cx="${w * 0.88}" cy="${h * 0.06}" rx="${w * 0.42}" ry="${h * 0.4}" fill="${PAL.strawberry}" opacity="0.07" filter="url(#blurBig)"/>
  <ellipse cx="${w * 0.06}" cy="${h * 0.95}" rx="${w * 0.36}" ry="${h * 0.38}" fill="${PAL.gold}" opacity="0.10" filter="url(#blurBig)"/>
  <ellipse cx="${w * 0.42}" cy="${h * 0.5}" rx="${w * 0.4}" ry="${h * 0.45}" fill="#CBD9E4" opacity="0.18" filter="url(#blurBig)"/>
  ${speckles(rand, w, h, 120, "#FFFFFF", 2.0, 0.5)}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.035"/>
</svg>`;
}

/** Flavour tile — one dominant hue in the same cold, out-of-focus language. */
function tile(o) {
  const { w, seed, accent, base } = o;
  const h = o.h || w;
  const rand = rng(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs(w)}
  <rect width="${w}" height="${h}" fill="${base}"/>
  ${bloom(w * 0.34, h * 0.22, w * 0.55, h * 0.46, accent, 0.44)}
  ${bloom(w * 0.80, h * 0.72, w * 0.42, h * 0.38, accent, 0.22)}
  ${bloom(w * 0.30, h * 0.30, w * 0.16, h * 0.14, "#FFFFFF", 0.16)}
  ${bloom(w * 0.55, h * 1.05, w * 0.7, h * 0.38, "#000000", 0.45)}
  ${bokeh(rand, w, h, 9, [accent, PAL.creamSoft])}
  ${droplets(rand, w, h, 34)}
  ${speckles(rand, w, h, 130, "#FFFFFF", 1.4, 0.42)}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.055"/>
</svg>`;
}

const jobs = [
  ["hero.png", darkPanel({ w: 2400, h: 1350, seed: 7, lightX: 0.76, scrimLeft: true })],
  ["close.png", darkPanel({ w: 2400, h: 1350, seed: 91, accent: PAL.strawberry, accent2: PAL.gold, lightX: 0.62, dim: 0.42 })],
  ["dark-wide.png", darkPanel({ w: 2400, h: 1350, seed: 21, accent: PAL.gold, accent2: PAL.strawberry, lightX: 0.30 })],
  ["drop.png", darkPanel({ w: 1600, h: 1350, seed: 33, accent: PAL.cherry, accent2: PAL.gold, lightX: 0.52 })],
  ["light-wide.png", lightPanel({ w: 2400, h: 1350, seed: 5 })],
  ["phone-food.png", tile({ w: 900, h: 1100, seed: 12, accent: PAL.strawberry, base: PAL.navy })],
  ["cat-fruity.png", tile({ w: 700, seed: 44, accent: "#F0576B", base: "#2A0E16" })],
  ["cat-creamy.png", tile({ w: 700, seed: 55, accent: PAL.gold, base: "#241A10" })],
  ["cat-rich.png", tile({ w: 700, seed: 66, accent: "#8A5A3B", base: "#1C1310" })],
  ["cat-surprise.png", tile({ w: 700, seed: 77, accent: "#7FA9C9", base: "#101A24" })],
];

(async () => {
  for (const [name, svg] of jobs) {
    await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(OUT + "/" + name);
    console.log("wrote", name);
  }
})();
