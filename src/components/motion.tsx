"use client"

import { motion, useInView, useScroll, useTransform, type MotionValue, type Variants } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className, delay = 0, y = 32 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

const stagger: Variants = { show: { transition: { staggerChildren: 0.07 } } }
const item: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </motion.div>
  )
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={item}>{children}</motion.div>
}

/** Each line slides up from behind a mask. Trigger lives on the (unclipped) wrapper. */
export function Lines({ lines, className, delay = 0, inView = false }: { lines: ReactNode[]; className?: string; delay?: number; inView?: boolean }) {
  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      {...(inView ? { whileInView: "show", viewport: { once: true, margin: "-40px" } } : { animate: "show" })}
      variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span className="block" variants={{ hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1, ease } } }}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Words fade from grey to ink as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
  const words = text.split(" ")
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  )
}
function Word({ children, p, range }: { children: string; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(p, range, [0.14, 1])
  return <motion.span style={{ opacity }} className="inline-block whitespace-pre">{children} </motion.span>
}

const FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789–"
/** Split-flap (departure board) text: characters cycle before settling. Server renders final text. */
export function FlapText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!seen) return
    let frame = 0
    let id: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      id = setInterval(() => {
        frame++
        setOut(text.split("").map((ch, i) => (ch === " " || frame > 4 + i * 1.2 ? ch : FLAP[Math.floor(Math.random() * FLAP.length)])).join(""))
        if (frame > 6 + text.length * 1.2) clearInterval(id)
      }, 40)
    }, delay * 1000)
    return () => { clearTimeout(start); clearInterval(id) }
  }, [text, seen, delay])
  return <span ref={ref} className={cn("tabular-nums", className)}>{out}</span>
}

/** "(01) — About" style section label. */
export function Label({ n, children, className, light }: { n: string; children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-xs tracking-wider uppercase", light ? "text-white/60" : "text-muted-foreground", className)}>
      <span className="text-brand">({n})</span>
      <span className={cn("h-px w-10", light ? "bg-white/30" : "bg-ink/30")} />
      {children}
    </p>
  )
}

/** Crop marks in the four corners of a positioned parent. */
export function CropMarks({ className }: { className?: string }) {
  const c = "absolute size-3 border-ink"
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(c, "top-0 left-0 border-t border-l")} />
      <span className={cn(c, "top-0 right-0 border-t border-r")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "right-0 bottom-0 border-r border-b")} />
    </span>
  )
}
