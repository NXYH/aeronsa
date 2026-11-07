"use client"

// Magic UI Globe, adapted for cobe v2 + animated dotted trade lanes.
// cobe's native arcs are solid/static, so lanes are drawn on a 2D canvas overlay using
// cobe's own projection (copied from cobe@2 `O()`/`U()`), kept in sync with phi each frame.
import { useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400
const R = 0.8 // cobe globe radius in clip space

export type GlobeLane = { from: [number, number]; to: [number, number]; color: string }
/** Label pinned to a location; dx/dy (css px) nudge it off the marker so close cities don't collide. */
export type GlobeLabel = { at: [number, number]; text: string; sub?: string; dx?: number; dy?: number }

type V3 = [number, number, number]
// cobe@2 U(): lat/lng → unit vector
const toVec = ([lat, lng]: [number, number]): V3 => {
  const la = (lat * Math.PI) / 180, lo = (lng * Math.PI) / 180 - Math.PI, c = Math.cos(la)
  return [-c * Math.cos(lo), Math.sin(la), c * Math.sin(lo)]
}
// cobe@2 O(): world → [x 0..1, y 0..1, visible] for scale 1, offset 0, square canvas
function project(p: V3, phi: number, theta: number): [number, number, boolean, number] {
  const ct = Math.cos(theta), cp = Math.cos(phi), st = Math.sin(theta), sp = Math.sin(phi)
  const x = cp * p[0] + sp * p[2]
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2]
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2]
  return [(x + 1) / 2, (-y + 1) / 2, z >= 0 || x * x + y * y >= R * R, z]
}

/** Precomputed great-circle lane: unit endpoints, angle, peak lift. */
function prepLane(l: GlobeLane) {
  const a = toVec(l.from), b = toVec(l.to)
  const angle = Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])))
  return { a, b, angle, lift: Math.min(0.2, 0.03 + angle * 0.11), color: l.color, dots: Math.max(6, Math.round(angle * 42)) }
}
type Lane = ReturnType<typeof prepLane>

// point at t∈[0,1] along the elevated great circle (slerp + sine lift)
function along(l: Lane, t: number): V3 {
  const s = Math.sin(l.angle) || 1
  const wa = Math.sin((1 - t) * l.angle) / s, wb = Math.sin(t * l.angle) / s
  const r = R * (1 + l.lift * Math.sin(Math.PI * t))
  return [(wa * l.a[0] + wb * l.b[0]) * r, (wa * l.a[1] + wb * l.b[1]) * r, (wa * l.a[2] + wb * l.b[2]) * r]
}

export function Globe({
  className,
  config,
  lanes = [],
  labels = [],
  laneStagger = 160,
  speed = 0.0025,
}: {
  className?: string
  config: COBEOptions
  lanes?: GlobeLane[]
  labels?: GlobeLabel[]
  /** ms between each lane starting to draw */
  laneStagger?: number
  speed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const r = useMotionValue(0)
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const overlay = overlayRef.current!
    const ctx = overlay.getContext("2d")!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const prepared = lanes.map(prepLane)
    const pinned = labels.map((l) => ({ ...l, v: toVec(l.at).map((n) => n * R) as V3 }))
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() || "monospace"
    let width = canvas.offsetWidth
    let phi = config.phi
    const onResize = () => { width = canvas.offsetWidth }
    window.addEventListener("resize", onResize)

    const globe = createGlobe(canvas, { ...config, width: width * 2, height: width * 2 })

    const start = performance.now()
    let frame = 0
    let last = start
    const loop = (now: number) => {
      // time-based so rotation speed is the same on 60Hz and 120Hz screens (`speed` = rad per 60fps frame)
      if (pointerInteracting.current === null && !reduce) phi += speed * Math.min(4, (now - last) / 16.67)
      last = now
      const p = phi + rs.get()
      globe.update({ phi: p, width: width * 2, height: width * 2 })

      const size = Math.round(width * dpr)
      if (overlay.width !== size) { overlay.width = size; overlay.height = size }
      ctx.clearRect(0, 0, size, size)
      const elapsed = now - start

      prepared.forEach((lane, i) => {
        // 0→1 draw-in from the source, staggered per lane
        const grow = reduce ? 1 : Math.min(1, Math.max(0, (elapsed - 700 - i * laneStagger) / 1100))
        if (grow <= 0) return
        const flow = reduce ? 0 : ((elapsed / 2600) * (6 / lane.dots) * 6) % 1 // dots march toward destination
        ctx.fillStyle = lane.color
        for (let j = 0; j < lane.dots; j++) {
          const t = (j + flow * 1) / lane.dots
          if (t > grow) break
          const [x, y, vis] = project(along(lane, t), p, config.theta)
          if (!vis) continue
          const edge = Math.min(1, t * 6, (1 - t) * 6) // fade in/out at the endpoints
          ctx.globalAlpha = 0.35 + 0.65 * edge
          ctx.beginPath()
          ctx.arc(x * size, y * size, 1.25 * dpr, 0, Math.PI * 2)
          ctx.fill()
        }
        // cargo: brighter dot riding the lane once it's drawn
        if (grow >= 1 && !reduce) {
          const t = ((elapsed / 1000 / (2.2 + lane.angle * 1.5)) + i * 0.37) % 1
          const [x, y, vis] = project(along(lane, t), p, config.theta)
          if (vis) {
            ctx.globalAlpha = 0.18
            ctx.beginPath(); ctx.arc(x * size, y * size, 5 * dpr, 0, Math.PI * 2); ctx.fill()
            ctx.globalAlpha = 1
            ctx.beginPath(); ctx.arc(x * size, y * size, 2.4 * dpr, 0, Math.PI * 2); ctx.fill()
          }
        }
      })
      // office labels: leader line + pill, fading out as the city turns toward the limb
      const labelIn = reduce ? 1 : Math.min(1, Math.max(0, (elapsed - 1200) / 600))
      for (const l of pinned) {
        const [x, y, , z] = project(l.v, p, config.theta)
        const alpha = Math.min(1, Math.max(0, z / 0.25)) * labelIn
        if (alpha <= 0) continue
        const px = x * size, py = y * size
        const lx = px + (l.dx ?? 14) * dpr, ly = py + (l.dy ?? -14) * dpr
        ctx.globalAlpha = alpha
        ctx.font = `500 ${10.5 * dpr}px ${mono}`
        const label = l.text.toUpperCase(), sub = l.sub?.toUpperCase() ?? ""
        const tw = ctx.measureText(label).width
        ctx.font = `400 ${9 * dpr}px ${mono}`
        const sw = sub ? ctx.measureText(sub).width + 6 * dpr : 0
        const h = 18 * dpr, padX = 6 * dpr, w = tw + sw + padX * 2
        // flip to the other side if the pill would run off the canvas
        const wantLeft = (l.dx ?? 14) < 0
        const left = wantLeft ? lx - w >= 0 : lx + w > size
        const ax = left === wantLeft ? lx : 2 * px - lx // mirror the leader when flipped
        ctx.strokeStyle = "#141414"; ctx.lineWidth = dpr
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ax, ly); ctx.stroke()
        const bx = left ? ax - w : ax, by = ly - h / 2
        ctx.fillStyle = "#141414"; ctx.fillRect(bx, by, w, h)
        ctx.fillStyle = "#ea1d26"; ctx.fillRect(bx, by, 2 * dpr, h)
        ctx.textBaseline = "middle"
        ctx.font = `500 ${10.5 * dpr}px ${mono}`; ctx.fillStyle = "#ffffff"; ctx.fillText(label, bx + padX, ly)
        if (sub) { ctx.font = `400 ${9 * dpr}px ${mono}`; ctx.fillStyle = "#f37b20"; ctx.fillText(sub, bx + padX + tw + 6 * dpr, ly) }
      }
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    const fade = setTimeout(() => { canvas.style.opacity = "1"; overlay.style.opacity = "1" }, 0)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(fade)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config, lanes, labels, laneStagger, speed])

  const setPointer = (v: number | null) => {
    pointerInteracting.current = v
    if (canvasRef.current) canvasRef.current.style.cursor = v !== null ? "grabbing" : "grab"
  }
  const move = (clientX: number) => {
    if (pointerInteracting.current === null) return
    r.set(r.get() + (clientX - pointerInteracting.current) / MOVEMENT_DAMPING)
  }

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-150", className)}>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        onPointerDown={(e) => setPointer(e.clientX)}
        onPointerUp={() => setPointer(null)}
        onPointerOut={() => setPointer(null)}
        onMouseMove={(e) => move(e.clientX)}
        onTouchMove={(e) => e.touches[0] && move(e.touches[0].clientX)}
      />
      <canvas ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-500" />
    </div>
  )
}
