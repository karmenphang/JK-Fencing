/**
 * MOB Pelvic-Hold demonstration · 3D stage.
 *
 * Everything is a pure function of one scroll progress value p (0..1):
 * render(p) always produces the same frame, so scrolling backwards reverses
 * the sequence exactly and nothing can drift or jump.
 *
 * What is real 3D here: a studio, a generic office chair and a neutral clay
 * figure. The MOB product is NOT modelled. Until MOB supplies an accurate
 * model, it appears as a clearly labelled placeholder volume.
 */
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// ---------- timeline (shared with the overlay component) ----------
export const SCENES = {
  problem: [0, 0.15],
  reveal: [0.15, 0.32],
  position: [0.32, 0.5],
  sit: [0.5, 0.7],
  closeup: [0.7, 0.86],
  final: [0.86, 1],
} as const

// ---------- maths helpers ----------
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
const smooth = (t: number) => t * t * (3 - 2 * t)
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const deg = THREE.MathUtils.degToRad

// ---------- dimensions (metres) ----------
const SEAT_TOP = 0.44
/**
 * MOB Pelvic-Hold form, traced from a real photo of the product (see content.ts → pelvicDemo.form).
 * Overwritten at start up from opts.form. Approximate until MOB confirms dimensions.
 */
const SUPPORT = { w: 0.42, h: 0.06, d: 0.4, corner: 0.075, frontBow: 0.008 }
const ANKLE = { y: 0.085, z: 0.4 }
const THIGH = 0.42
const SHIN = 0.42

// ---------- camera path: [p, position, target, pull back on portrait screens] ----------
type Key = [number, [number, number, number], [number, number, number], number]
const CAMERA: Key[] = [
  [0.0, [3.6, 2.0, 4.4], [0, 0.62, 0], 1.55],
  [0.13, [2.35, 1.35, 2.75], [0, 0.6, 0], 1.55],
  [0.32, [2.0, 1.55, 2.35], [0, 0.6, 0], 1.55],
  [0.48, [1.45, 1.5, 1.85], [0, 0.48, 0], 1.55],
  [0.56, [2.7, 1.4, 2.4], [0, 0.78, 0.05], 1.5],
  [0.7, [2.55, 1.25, 1.85], [0, 0.72, 0.05], 1.5],
  // close up: on phones the camera drops to seat level so the cushion, not the head, fills the frame
  [0.84, [1.1, 0.78, 0.82], [0, 0.56, 0.02], 1.3],
  [1.0, [2.9, 1.55, 3.3], [0, 0.66, 0], 1.55],
]

export interface Anchor { x: number; y: number; visible: boolean }

export interface PelvicStage {
  render(p: number): void
  resize(): void
  anchors(): Record<string, Anchor>
  snapshot(p: number, width: number, height: number): string
  dispose(): void
}

export interface StageOptions {
  placementZ: number
  placementRotY: number
  /** Measured or traced product form in metres. */
  form?: { w: number; d: number; h: number; corner: number }
  /** Texture images taken from the genuine product photo. */
  textures?: { mesh: string; label: string; colour: string }
  /** Called when a texture finishes loading, so the host can redraw. */
  onAsset?: () => void
}

export function createPelvicStage(canvas: HTMLCanvasElement, opts: StageOptions): PelvicStage {
  if (opts.form) Object.assign(SUPPORT, opts.form)
  const mobileGPU = Math.min(window.innerWidth, window.innerHeight) < 700
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileGPU ? 1.75 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 40)

  // ---------- light: soft studio ----------
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0xcbbfa9, 1.15))
  const key = new THREE.DirectionalLight(0xfff3e2, 2.3)
  key.position.set(2.2, 4.2, 2.6)
  key.castShadow = true
  key.shadow.mapSize.set(mobileGPU ? 1024 : 2048, mobileGPU ? 1024 : 2048)
  key.shadow.camera.left = -1.6
  key.shadow.camera.right = 1.6
  key.shadow.camera.top = 1.8
  key.shadow.camera.bottom = -1.2
  key.shadow.camera.near = 1
  key.shadow.camera.far = 9
  key.shadow.radius = 6
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xe9dcc6, 0.7)
  rim.position.set(-2.4, 2.6, -3)
  scene.add(rim)

  // ---------- floor: shadow catcher + soft contact shadow ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.16 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  const contactTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grd.addColorStop(0, 'rgba(40,34,26,0.55)')
    grd.addColorStop(0.55, 'rgba(40,34,26,0.18)')
    grd.addColorStop(1, 'rgba(40,34,26,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })()
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }))
  contact.rotation.x = -Math.PI / 2
  contact.position.y = 0.002
  scene.add(contact)

  // ---------- materials ----------
  const fabric = new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.92, metalness: 0 })
  const shell = new THREE.MeshStandardMaterial({ color: 0x1f1e1c, roughness: 0.55, metalness: 0.05 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x9a958d, roughness: 0.3, metalness: 0.75 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151413, roughness: 0.7 })
  const clay = new THREE.MeshStandardMaterial({ color: 0xdccdb7, roughness: 0.72, metalness: 0, transparent: true, opacity: 1 })

  const cast = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; return m }

  // ---------- office chair (generic, not a MOB product) ----------
  const chair = new THREE.Group()
  scene.add(chair)
  // seat
  const seat = cast(new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.48, 6, 0.035), fabric))
  seat.position.set(0, SEAT_TOP - 0.04, 0)
  chair.add(seat)
  const seatPan = cast(new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.03, 0.42, 3, 0.012), shell))
  seatPan.position.set(0, SEAT_TOP - 0.095, 0)
  chair.add(seatPan)
  // backrest with lumbar curve suggestion (two stacked rounded pads)
  const back = new THREE.Group()
  back.position.set(0, SEAT_TOP + 0.05, -0.25)
  back.rotation.x = deg(-9)
  chair.add(back)
  const backLow = cast(new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.3, 0.07, 6, 0.03), fabric))
  backLow.position.set(0, 0.2, 0.015)
  const backHigh = cast(new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.3, 0.065, 6, 0.03), fabric))
  backHigh.position.set(0, 0.48, 0)
  back.add(backLow, backHigh)
  const spine = cast(new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.42, 0.03, 2, 0.012), shell))
  spine.position.set(0, 0.1, -0.05)
  back.add(spine)
  // armrests
  for (const sx of [-1, 1]) {
    const post = cast(new THREE.Mesh(new RoundedBoxGeometry(0.035, 0.22, 0.05, 2, 0.012), shell))
    post.position.set(sx * 0.28, SEAT_TOP + 0.03, -0.04)
    const pad = cast(new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.03, 0.26, 4, 0.014), shell))
    pad.position.set(sx * 0.28, SEAT_TOP + 0.15, 0.0)
    const strut = cast(new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.025, 0.2, 2, 0.01), shell))
    strut.position.set(sx * 0.255, SEAT_TOP - 0.09, -0.04)
    chair.add(post, pad, strut)
  }
  // gas lift + base
  const lift = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.27, 24), metal))
  lift.position.set(0, 0.24, 0)
  const sleeve = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.12, 24), shell))
  sleeve.position.set(0, 0.15, 0)
  const hub = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.05, 24), metal))
  hub.position.set(0, 0.09, 0)
  chair.add(lift, sleeve, hub)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 10
    const arm = new THREE.Group()
    arm.rotation.y = a
    const legGeo = new RoundedBoxGeometry(0.33, 0.035, 0.05, 2, 0.014)
    const leg = cast(new THREE.Mesh(legGeo, metal))
    leg.position.set(0.18, 0.085, 0)
    leg.rotation.z = deg(-5)
    const caster = cast(new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), rubber))
    caster.scale.set(1, 1, 0.75)
    caster.position.set(0.33, 0.03, 0)
    const fork = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 8), metal))
    fork.position.set(0.33, 0.06, 0)
    arm.add(leg, caster, fork)
    chair.add(arm)
  }

  // ---------- MOB Pelvic-Hold, traced from a genuine photo ----------
  // Top outline and soft rounded edges follow the photo. Mesh texture, colour and the label
  // are the photo's own pixels. The camera path only ever shows the faces the photo shows
  // (top, front, the sitter's left side), never the unseen underside or back.
  const support = new THREE.Group()
  scene.add(support)
  const supportShape = (() => {
    const { w, d, corner: r } = SUPPORT
    const hw = w / 2, hd = d / 2, bow = SUPPORT.frontBow
    const sh = new THREE.Shape()
    // shape +y is the back edge, -y the front edge (slightly convex, as in the photo)
    sh.moveTo(-hw + r, hd)
    sh.lineTo(hw - r, hd)
    sh.quadraticCurveTo(hw, hd, hw, hd - r)
    sh.lineTo(hw, -hd + r)
    sh.quadraticCurveTo(hw, -hd, hw - r, -hd)
    sh.quadraticCurveTo(0, -hd - bow * 2, -hw + r, -hd)
    sh.quadraticCurveTo(-hw, -hd, -hw, -hd + r)
    sh.lineTo(-hw, hd - r)
    sh.quadraticCurveTo(-hw, hd, -hw + r, hd)
    return sh
  })()
  const bevel = Math.min(0.022, SUPPORT.h * 0.38)
  const supportGeo = new THREE.ExtrudeGeometry(supportShape, {
    depth: SUPPORT.h - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: 6,
    curveSegments: 18,
  })
  supportGeo.rotateX(-Math.PI / 2) // extrusion becomes thickness (y), shape +y becomes the back (-z)
  supportGeo.center()
  const meshColour = new THREE.Color(opts.textures?.colour ?? '#2a6459')
  const supportMat = new THREE.MeshStandardMaterial({ color: meshColour, roughness: 0.93, metalness: 0, transparent: true, opacity: 1 })
  const supportMesh = new THREE.Mesh(supportGeo, supportMat)
  supportMesh.castShadow = true
  supportMesh.receiveShadow = true
  support.add(supportMesh)

  // label patch: the photo's own label, rectified, lying on the top near the front, on the sitter's left
  const labelMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7, transparent: true, opacity: 1, polygonOffset: true, polygonOffsetFactor: -2 })
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.118, 0.054), labelMat)
  label.rotation.x = -Math.PI / 2
  label.position.set(SUPPORT.w * 0.25, SUPPORT.h / 2 + 0.0012, SUPPORT.d / 2 - 0.068)
  label.receiveShadow = true
  support.add(label)

  if (opts.textures) {
    const loader = new THREE.TextureLoader()
    loader.load(opts.textures.mesh, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping
      t.repeat.set(7, 7) // one photo tile covers about 14 cm of the real mesh
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      supportMat.map = t
      supportMat.bumpMap = t
      supportMat.bumpScale = 1.2
      supportMat.color.setRGB(1.0, 0.92, 1.04) // texture carries the real colour; balance measured against the photo under these lights
      supportMat.needsUpdate = true
      opts.onAsset?.()
    })
    loader.load(opts.textures.label, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      labelMat.map = t
      labelMat.color.set(0xffffff)
      labelMat.needsUpdate = true
      opts.onAsset?.()
    })
  }
  const restPos = new THREE.Vector3(0, SEAT_TOP + SUPPORT.h / 2, opts.placementZ)

  // ---------- neutral clay figure (about 1.70 m, standard proportions) ----------
  const body = new THREE.Group()
  scene.add(body)
  // Limbs are built at their real bone length, so joints never stretch or squash
  const cap = (r: number, len: number) => cast(new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 16), clay))
  const ell = () => cast(new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), clay))
  const pelvis = ell()
  const abdomen = ell()
  const chest = ell()
  const neck = cap(0.045, 0.1)
  const head = ell()
  const thighs = [cap(0.072, THIGH), cap(0.072, THIGH)]
  const shins = [cap(0.05, SHIN), cap(0.05, SHIN)]
  const feet = [cast(new THREE.Mesh(new RoundedBoxGeometry(0.095, 0.06, 0.245, 4, 0.028), clay)), cast(new THREE.Mesh(new RoundedBoxGeometry(0.095, 0.06, 0.245, 4, 0.028), clay))]
  const uppers = [cap(0.042, 0.29), cap(0.042, 0.29)]
  const fores = [cap(0.035, 0.26), cap(0.035, 0.26)]
  const hands = [ell(), ell()]
  body.add(pelvis, abdomen, chest, neck, head, ...thighs, ...shins, ...feet, ...uppers, ...fores, ...hands)

  const Y = new THREE.Vector3(0, 1, 0)
  const tmp = new THREE.Vector3()
  /** Place a bone between two joints */
  function limb(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
    tmp.subVectors(b, a)
    m.position.copy(a).addScaledVector(tmp, 0.5)
    m.quaternion.setFromUnitVectors(Y, tmp.normalize())
  }

  /** Two bone IK in the sagittal (y,z) plane, knee bending forward */
  function legIK(hip: THREE.Vector3, ankle: THREE.Vector3, knee: THREE.Vector3) {
    const dy = ankle.y - hip.y
    const dz = ankle.z - hip.z
    const d = Math.min(Math.hypot(dy, dz), THIGH + SHIN - 1e-4)
    const a = Math.acos(clamp01((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d)))
    const base = Math.atan2(dz, -dy) // angle from straight down, forward positive
    const ang = base + a
    knee.set(hip.x, hip.y - Math.cos(ang) * THIGH, hip.z + Math.sin(ang) * THIGH)
  }

  const V = () => new THREE.Vector3()
  const P = V(), S = V(), dir = V(), hipL = V(), hipR = V(), kneeL = V(), kneeR = V(), ankL = V(), ankR = V()
  const shL = V(), shR = V(), elL = V(), elR = V(), wrL = V(), wrR = V(), neckTop = V(), headC = V()

  /** s: 0 standing in front of the chair, 1 seated on the support */
  function pose(s: number) {
    const descend = smoother(range(s, 0.12, 1))
    const back = smoother(range(s, 0, 0.88))
    const seatedY = SEAT_TOP + SUPPORT.h + 0.1
    P.set(0, lerp(0.92, seatedY, descend), lerp(0.36, opts.placementZ - 0.04, back))
    // torso: hinge forward while lowering, then settle upright against the backrest
    const lean = s < 0.58 ? 30 * smooth(range(s, 0.02, 0.58)) : lerp(30, -6, smoother(range(s, 0.58, 1)))
    const th = deg(lean)
    dir.set(0, Math.cos(th), Math.sin(th))

    pelvis.position.copy(P)
    pelvis.scale.set(0.165, 0.11, 0.125)
    pelvis.rotation.set(th, 0, 0)
    abdomen.position.copy(P).addScaledVector(dir, 0.2)
    abdomen.scale.set(0.15, 0.14, 0.11)
    abdomen.rotation.set(th, 0, 0)
    chest.position.copy(P).addScaledVector(dir, 0.38)
    chest.scale.set(0.19, 0.17, 0.12)
    chest.rotation.set(th, 0, 0)
    S.copy(P).addScaledVector(dir, 0.5)
    neckTop.copy(S).addScaledVector(dir, 0.1)
    limb(neck, S, neckTop)
    headC.copy(S).addScaledVector(dir, 0.2)
    head.position.copy(headC)
    head.scale.set(0.085, 0.112, 0.098)
    head.rotation.set(th * 0.6, 0, 0)

    // legs: ankles planted, knees solved
    hipL.set(-0.09, P.y - 0.02, P.z)
    hipR.set(0.09, P.y - 0.02, P.z)
    ankL.set(-0.1, ANKLE.y, ANKLE.z)
    ankR.set(0.1, ANKLE.y, ANKLE.z)
    legIK(hipL, ankL, kneeL)
    legIK(hipR, ankR, kneeR)
    limb(thighs[0], hipL, kneeL)
    limb(thighs[1], hipR, kneeR)
    limb(shins[0], kneeL, ankL)
    limb(shins[1], kneeR, ankR)
    feet[0].position.set(-0.1, 0.035, ANKLE.z + 0.075)
    feet[1].position.set(0.1, 0.035, ANKLE.z + 0.075)

    // arms: hang, reach slightly forward for balance, then rest on the thighs
    const a1 = s < 0.5 ? lerp(4, 32, smooth(range(s, 0, 0.5))) : lerp(32, 12, smooth(range(s, 0.5, 1)))
    const a2 = s < 0.5 ? lerp(8, 48, smooth(range(s, 0, 0.5))) : lerp(48, 64, smooth(range(s, 0.5, 1)))
    const shoulderW = 0.19
    shL.set(-shoulderW, S.y - 0.03, S.z)
    shR.set(shoulderW, S.y - 0.03, S.z)
    const t1 = deg(a1) + th * 0.5
    const t2 = deg(a2) + th * 0.3
    const inward = lerp(0.02, 0.06, s)
    elL.set(-shoulderW - 0.015, shL.y - Math.cos(t1) * 0.29, shL.z + Math.sin(t1) * 0.29)
    elR.set(shoulderW + 0.015, shR.y - Math.cos(t1) * 0.29, shR.z + Math.sin(t1) * 0.29)
    wrL.set(-shoulderW + inward, elL.y - Math.cos(t2) * 0.26, elL.z + Math.sin(t2) * 0.26)
    wrR.set(shoulderW - inward, elR.y - Math.cos(t2) * 0.26, elR.z + Math.sin(t2) * 0.26)
    limb(uppers[0], shL, elL)
    limb(uppers[1], shR, elR)
    limb(fores[0], elL, wrL)
    limb(fores[1], elR, wrR)
    for (const [i, w] of [[0, wrL], [1, wrR]] as const) {
      hands[i].position.copy(w).add(tmp.set(0, -0.03, 0.035))
      hands[i].scale.set(0.035, 0.05, 0.06)
      hands[i].rotation.set(deg(a2) * 0.6, 0, 0)
    }
  }

  // ---------- camera ----------
  const camPos = V(), camTgt = V(), a = V(), b = V(), tmpStart = V()
  let portrait = false
  function cameraAt(p: number) {
    let i = 0
    while (i < CAMERA.length - 2 && p > CAMERA[i + 1][0]) i++
    const [p0, pos0, t0, m0] = CAMERA[i]
    const [p1, pos1, t1, m1] = CAMERA[i + 1]
    const t = smoother(range(p, p0, p1))
    camPos.set(lerp(pos0[0], pos1[0], t), lerp(pos0[1], pos1[1], t), lerp(pos0[2], pos1[2], t))
    camTgt.set(lerp(t0[0], t1[0], t), lerp(t0[1], t1[1], t), lerp(t0[2], t1[2], t))
    if (portrait) {
      // pull back on tall screens so the whole chair stays in frame
      a.subVectors(camPos, camTgt).multiplyScalar(lerp(m0, m1, t))
      camPos.copy(camTgt).add(a)
      const low = Math.sin(range(p, 0.7, 0.98) * Math.PI) // lower, flatter view for the close up
      camPos.y -= 0.32 * low
      camTgt.y -= 0.06 * low
    }
    camera.position.copy(camPos)
    camera.lookAt(camTgt)
  }

  let w = 1, h = 1
  function resize() {
    const r = canvas.parentElement!.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    renderer.setSize(w, h, false)
    portrait = w / h < 0.85
    camera.aspect = w / h
    camera.fov = portrait ? 38 : 30
    // frame the stage away from the copy: right side on wide screens, lower part on tall ones
    if (portrait) camera.setViewOffset(w, h, 0, -h * 0.13, w, h)
    else camera.setViewOffset(w, h, -w * 0.16, 0, w, h)
    camera.updateProjectionMatrix()
  }

  // ---------- one frame ----------
  let lastP = -1
  function update(p: number) {
    cameraAt(p)

    // support: invisible → hovering in front (reveal hand off) → glides onto the seat → settles
    const appear = range(p, 0.3, 0.34)
    const travel = smoother(range(p, 0.34, 0.47))
    const land = range(p, 0.47, 0.5)
    supportMat.opacity = appear
    labelMat.opacity = appear
    supportMat.transparent = labelMat.transparent = appear < 0.999
    supportMesh.castShadow = appear > 0.5
    support.visible = appear > 0.001
    // hand off from the photo: start on the camera ray through the photo card's centre on screen
    const wide = w >= 1024
    tmpStart.set(wide ? 0.36 : 0, wide ? 0.02 : -0.2, 0.5).unproject(camera).sub(camera.position).normalize()
    const start = b.copy(camera.position).addScaledVector(tmpStart, wide ? 1.7 : 2.3)
    // arc: lerp with a lift so it travels like a placed object, not a slide
    support.position.set(
      lerp(start.x, restPos.x, travel),
      lerp(start.y, restPos.y, travel) + Math.sin(travel * Math.PI) * 0.12,
      lerp(start.z, restPos.z, travel),
    )
    // tiny settle: dips a few millimetres and recovers as it lands
    const settle = Math.sin(land * Math.PI) * (1 - land) * 0.006
    support.position.y -= settle
    support.scale.set(1 + settle * 2, 1 - settle * 6, 1 + settle * 2)
    // in flight the top stays tilted towards the camera, so the unphotographed underside is never shown
    support.rotation.set(lerp(deg(22), 0, travel), lerp(deg(-30), opts.placementRotY, travel), lerp(deg(-8), 0, travel))

    // figure: fades in standing, sits down, stays seated for the close up and the finale
    const fig = range(p, 0.5, 0.535)
    body.visible = fig > 0.001
    clay.opacity = fig
    clay.transparent = fig < 0.999
    const shadows = fig > 0.6
    if (body.children[0].castShadow !== shadows) body.children.forEach((c) => { c.castShadow = shadows })
    pose(smoother(range(p, 0.53, 0.69)))

    contact.scale.setScalar(1 + 0.1 * fig)
    lastP = p
  }

  function render(p: number) {
    update(p)
    renderer.render(scene, camera)
  }

  // ---------- screen positions for HTML annotations ----------
  const proj = V()
  function toScreen(v: THREE.Vector3): Anchor {
    proj.copy(v).project(camera)
    return { x: (proj.x * 0.5 + 0.5) * w, y: (-proj.y * 0.5 + 0.5) * h, visible: proj.z < 1 }
  }
  function anchors() {
    const sp = support.position
    return {
      product: toScreen(b.set(sp.x + SUPPORT.w * 0.1, sp.y - SUPPORT.h * 0.1, sp.z + SUPPORT.d * 0.5)),
      area1: toScreen(b.set(sp.x - SUPPORT.w * 0.32, sp.y + SUPPORT.h * 0.5, sp.z - SUPPORT.d * 0.1)),
      area2: toScreen(b.set(sp.x + SUPPORT.w * 0.42, sp.y + SUPPORT.h * 0.5, sp.z + SUPPORT.d * 0.05)),
      support: toScreen(sp),
    }
  }

  function snapshot(p: number, sw: number, sh: number) {
    const prev = { w, h, pr: renderer.getPixelRatio() }
    renderer.setPixelRatio(1)
    renderer.setSize(sw, sh, false)
    portrait = sw / sh < 0.85
    camera.aspect = sw / sh
    camera.fov = portrait ? 38 : 30
    camera.clearViewOffset()
    camera.updateProjectionMatrix()
    w = sw; h = sh
    render(p)
    const url = canvas.toDataURL('image/webp', 0.85)
    renderer.setPixelRatio(prev.pr)
    w = prev.w; h = prev.h
    resize()
    if (lastP >= 0) render(lastP)
    return url
  }

  function dispose() {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
    })
    ;[fabric, shell, metal, rubber, clay, supportMat, labelMat, floor.material as THREE.Material, contact.material as THREE.Material].forEach((m) => m.dispose())
    contactTex.dispose()
    renderer.dispose()
  }

  resize()
  return { render, resize, anchors, snapshot, dispose }
}
