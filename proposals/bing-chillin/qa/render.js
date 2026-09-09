// Approximate renderer for QA: draws parsed pptx geometry + text to PNG.
// Not pixel-perfect against PowerPoint, but faithful for layout, overlap and overflow checks.
const fs = require("fs");
const sharp = require("sharp");
const zlib = require("zlib");

const DPI = 110;
const PW = Math.round(13.333 * DPI);
const PH = Math.round(7.5 * DPI);
const data = JSON.parse(fs.readFileSync(__dirname + "/layout.json", "utf8"));
const MEDIA = __dirname + "/media/";
const OUT = __dirname + "/out/";
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// crude per-character width factors (em units) for the two families in use
function charW(ch, face, bold) {
  const wide = "MW@%mw";
  const narrow = "iljItfr.,:;'|!()[]";
  let f = face && face.startsWith("Cam") ? 0.50 : 0.475;
  if (bold) f += 0.028;
  if (wide.includes(ch)) f += 0.28;
  else if (narrow.includes(ch)) f -= 0.20;
  else if (ch === " ") f -= 0.20;
  else if (ch >= "A" && ch <= "Z") f += 0.09;
  return f;
}
function textW(s, sz, face, bold) {
  let w = 0;
  for (const ch of s) w += charW(ch, face, bold) * sz;
  return w / 72; // inches
}

// greedy word wrap for a paragraph made of runs (uses first run's metrics)
function wrap(para, boxW) {
  const lines = [];
  let cur = [];
  let curW = 0;
  const push = () => { lines.push(cur); cur = []; curW = 0; };
  for (const r of para.runs) {
    if (r.br) { push(); continue; }
    const face = r.face, sz = r.sz, bold = r.b;
    for (const seg of r.t.split("\n")) {
      if (seg !== r.t.split("\n")[0]) push();
      const words = seg.split(" ");
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "");
        const ww = textW(word, sz, face, bold);
        if (curW + ww > boxW && cur.length) push();
        cur.push({ t: word, sz, face, bold, i: r.i, color: r.color });
        curW += ww;
      }
    }
  }
  if (cur.length) lines.push(cur);
  return lines.filter((l) => l.length);
}

const px = (v) => (v * DPI).toFixed(1);

function shapeSvg(it) {
  let s = "";
  const rx = it.prst === "roundRect" ? Math.min(it.w, it.h) * DPI * 0.16 : 0;
  const hasFill = it.fill && it.fill[1] > 0.02;
  const hasLine = it.line;
  if (hasFill || hasLine) {
    const f = hasFill ? `fill="#${it.fill[0]}" fill-opacity="${it.fill[1].toFixed(2)}"` : `fill="none"`;
    const l = hasLine ? `stroke="#${it.line.color}" stroke-width="${(it.line.w * DPI / 72).toFixed(2)}"` : "";
    s += `<rect x="${px(it.x)}" y="${px(it.y)}" width="${px(it.w)}" height="${px(it.h)}" rx="${rx.toFixed(1)}" ${f} ${l}/>`;
  }
  if (!it.paras.length) return s;

  // lay out text
  const allLines = [];
  for (const p of it.paras) {
    const ls = wrap(p, it.w);
    for (const l of ls) allLines.push({ algn: p.algn, parts: l });
  }
  const lh = (l) => Math.max(...l.parts.map((p) => p.sz)) * 1.22;
  const totalPt = allLines.reduce((a, l) => a + lh(l), 0);
  const totalIn = totalPt / 72;
  let y;
  if (it.anchor === "ctr") y = it.y + (it.h - totalIn) / 2;
  else if (it.anchor === "b") y = it.y + it.h - totalIn;
  else y = it.y;

  const overflow = totalIn > it.h + 0.02;
  for (const l of allLines) {
    const asc = lh(l) * 0.78 / 72;
    y += asc;
    const lw = l.parts.reduce((a, p) => a + textW(p.t, p.sz, p.face, p.bold), 0);
    let x = it.x;
    if (l.algn === "ctr") x = it.x + (it.w - lw) / 2;
    else if (l.algn === "r") x = it.x + it.w - lw;
    for (const p of l.parts) {
      s += `<text x="${px(x)}" y="${px(y)}" font-family="${p.face === "Cambria" ? "serif" : "sans-serif"}" font-size="${(p.sz * DPI / 72).toFixed(1)}" ${p.bold ? 'font-weight="700"' : ""} ${p.i ? 'font-style="italic"' : ""} fill="#${p.color}" xml:space="preserve">${esc(p.t)}</text>`;
      x += textW(p.t, p.sz, p.face, p.bold);
    }
    y += (lh(l) - lh(l) * 0.78) / 72;
  }
  if (overflow) {
    s += `<rect x="${px(it.x)}" y="${px(it.y)}" width="${px(it.w)}" height="${px(it.h)}" fill="none" stroke="#FF00FF" stroke-width="2" stroke-dasharray="6 4"/>`;
  }
  return s;
}

(async () => {
  for (let n = 0; n < data.slides.length; n++) {
    const sl = data.slides[n];
    const layers = [];
    let buf = "";
    const flush = () => {
      if (!buf) return;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}">${buf}</svg>`;
      layers.push({ input: Buffer.from(svg), top: 0, left: 0 });
      buf = "";
    };
    for (const it of sl.items) {
      if (it.kind === "pic") {
        flush();
        const file = MEDIA + it.target.split("/").pop();
        if (fs.existsSync(file)) {
          const w = Math.max(1, Math.round(it.w * DPI));
          const h = Math.max(1, Math.round(it.h * DPI));
          const img = await sharp(file).resize(w, h, { fit: "fill" }).png().toBuffer();
          layers.push({ input: img, left: Math.round(it.x * DPI), top: Math.round(it.y * DPI) });
        }
      } else {
        buf += shapeSvg(it);
      }
    }
    flush();
    const name = OUT + "slide-" + String(n + 1).padStart(2, "0") + ".png";
    await sharp({ create: { width: PW, height: PH, channels: 4, background: "#FFFFFF" } })
      .composite(layers).png().toFile(name);
    console.log("rendered", name);
  }
})();
