/**
 * Scroll scrubbed photo sequence for the product reveal.
 * With official MOB turntable photos it shows the real product rotating, frame by frame.
 * Without them it draws clearly labelled placeholder frames, never a guessed product.
 */
export interface Turntable {
  draw(t: number): void
  resize(): void
}

export function createTurntable(canvas: HTMLCanvasElement, frames: string[], placeholderCount: number): Turntable {
  const ctx = canvas.getContext('2d')!
  const images: (HTMLImageElement | null)[] = frames.map(() => null)
  let last = -1
  let w = 1, h = 1, dpr = 1

  // Preload real frames progressively; the nearest loaded frame is drawn meanwhile
  frames.forEach((src, i) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => { images[i] = img; if (last >= 0) paint(last, true) }
    img.src = src
  })

  function resize() {
    const r = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (last >= 0) paint(last, true)
  }

  function nearestLoaded(i: number) {
    for (let d = 0; d < images.length; d++) {
      if (images[i - d]) return images[i - d]
      if (images[i + d]) return images[i + d]
    }
    return null
  }

  function paintPlaceholder(i: number, n: number) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#f3ece0')
    g.addColorStop(1, '#e2d4bb')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // soft light pool
    const rg = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, w * 0.6)
    rg.addColorStop(0, 'rgba(255,255,255,0.55)')
    rg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, w, h)

    // turntable: an ellipse with a marker that travels with the frame angle
    const cx = w / 2, cy = h * 0.62, rx = w * 0.34, ry = rx * 0.26
    const angle = (i / n) * Math.PI * 2
    ctx.strokeStyle = 'rgba(184,151,90,0.55)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 5])
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    // swept arc shows rotation progress
    ctx.strokeStyle = 'rgba(184,151,90,0.95)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, Math.PI / 2, Math.PI / 2 + angle)
    ctx.stroke()
    const mx = cx + Math.cos(Math.PI / 2 + angle) * rx
    const my = cy + Math.sin(Math.PI / 2 + angle) * ry
    ctx.fillStyle = '#1e1d1b'
    ctx.beginPath()
    ctx.arc(mx, my, 4, 0, Math.PI * 2)
    ctx.fill()

    // text
    ctx.fillStyle = 'rgba(30,29,27,0.55)'
    ctx.textAlign = 'center'
    ctx.font = '500 10px Inter, system-ui, sans-serif'
    const label = 'OFFICIAL MOB PHOTO SEQUENCE'
    ctx.fillText(label.split('').join(String.fromCharCode(8202)), cx, h * 0.18)
    ctx.fillStyle = '#1e1d1b'
    ctx.font = `300 ${Math.round(w * 0.075)}px "Cormorant Garamond", Georgia, serif`
    ctx.fillText('Awaiting MOB photos', cx, h * 0.3)
    ctx.fillStyle = 'rgba(30,29,27,0.6)'
    ctx.font = '400 11px Inter, system-ui, sans-serif'
    ctx.fillText(`Frame ${String(i + 1).padStart(2, '0')} of ${n}  ·  ${Math.round((i / n) * 360)}°`, cx, h * 0.86)
    ctx.fillStyle = 'rgba(30,29,27,0.45)'
    ctx.fillText('The real product will rotate here as you scroll', cx, h * 0.86 + 18)
  }

  function paint(t: number, force = false) {
    const n = frames.length || placeholderCount
    const i = Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))))
    if (!force && i === last) return
    last = i
    ctx.clearRect(0, 0, w, h)
    if (frames.length) {
      const img = images[i] ?? nearestLoaded(i)
      if (!img) return paintPlaceholder(i, n)
      // contain fit on an ivory ground, so product proportions are never distorted
      ctx.fillStyle = '#f6f1e9'
      ctx.fillRect(0, 0, w, h)
      const s = Math.min(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    } else {
      paintPlaceholder(i, n)
    }
  }

  resize()
  return { draw: (t) => paint(t), resize }
}
