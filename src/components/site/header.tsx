"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react"
import { ArrowRight, ArrowUpRight, Menu, Phone, Mail } from "lucide-react"
import type { COBEOptions } from "cobe"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Globe, type GlobeLabel, type GlobeLane } from "@/components/ui/globe"
import { CropMarks, FlapText, Lines } from "@/components/motion"
import { company, lanes, nav } from "@/lib/content"
import { byId, lanes as netLanes, pins } from "@/lib/network"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#home" aria-label="AERON Trading — home" className={cn("block", className)}>
      <Image src="/aeron-wordmark.png" alt="AERON Trading" width={1220} height={300} priority className="h-7 w-auto md:h-8" />
    </a>
  )
}

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, "change", (v) => setHidden(v > 40))

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        animate={{ height: hidden ? 0 : "auto", opacity: hidden ? 0 : 1 }}
        className="overflow-hidden bg-ink font-mono text-[11px] tracking-wider text-white/70 uppercase"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2 md:px-8">
          <span className="flex items-center gap-2">
            <span className="relative flex size-1.5"><span className="absolute size-full animate-ping rounded-full bg-emerald-400" /><span className="size-1.5 rounded-full bg-emerald-400" /></span>
            Riyadh HQ · {company.hours}
          </span>
          <span className="hidden gap-6 sm:flex">
            <a href={company.phoneHref} className="flex items-center gap-1.5 hover:text-white"><Phone className="size-3" />{company.phone}</a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-white"><Mail className="size-3" />{company.email}</a>
          </span>
        </div>
      </motion.div>
      <div className="border-b bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:h-20 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n, i) => (
              <a key={n.href} href={n.href} className="group relative font-mono text-xs tracking-wider uppercase">
                <span className="mr-1.5 text-brand">0{i + 1}</span>{n.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className={cn(buttonVariants(), "group hidden h-11 rounded-none bg-brand px-5 font-mono text-xs tracking-wider uppercase hover:bg-ink sm:inline-flex")}>
              Request quote <ArrowUpRight className="transition-transform group-hover:rotate-45" />
            </a>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon-lg" className="rounded-none lg:hidden" aria-label="Open menu" />}>
                <Menu />
              </SheetTrigger>
              <SheetContent side="right" className="w-full rounded-none p-6 sm:max-w-md">
                <SheetHeader className="p-0"><SheetTitle><Logo /></SheetTitle></SheetHeader>
                <nav className="mt-10 flex flex-col border-t">
                  {nav.map((n, i) => (
                    <motion.a key={n.href} href={n.href} onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
                      className="flex items-baseline justify-between border-b py-5 text-3xl font-semibold uppercase font-stretch-expanded">
                      {n.label}<span className="font-mono text-xs text-brand">0{i + 1}</span>
                    </motion.a>
                  ))}
                </nav>
                <a href="#contact" onClick={() => setOpen(false)} className={cn(buttonVariants(), "mt-auto h-14 rounded-none bg-brand font-mono text-xs tracking-wider uppercase")}>
                  Request a quote <ArrowRight />
                </a>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-0.5 origin-left bg-brand" />
      </div>
    </header>
  )
}

// cobe: phi rotates longitude. This starting angle puts the Middle East in front.
const GLOBE: COBEOptions = {
  width: 800, height: 800, devicePixelRatio: 2,
  phi: 3.9, theta: 0.32, dark: 0, diffuse: 1.1, mapSamples: 20000, mapBrightness: 5,
  baseColor: [1, 1, 1], markerColor: [234 / 255, 29 / 255, 38 / 255], glowColor: [0.96, 0.95, 0.94],
  markers: pins.map((p) => ({ location: [p.lat, p.lng] as [number, number], size: p.id === "riyadh" ? 0.06 : p.kind === "hub" ? 0.04 : 0.03 })),
  markerElevation: 0,
}
// Animated dotted lanes: sea lanes in brand red, inland/office links in brand orange.
const GLOBE_LANES: GlobeLane[] = netLanes.map((l) => ({
  from: [l.from.lat, l.from.lng],
  to: [l.to.lat, l.to.lng],
  color: l.inland ? "#f37b20" : "#ea1d26",
}))

// Names only on the main dots (AERON offices). Riyadh/Dubai are close, so they label in opposite directions.
const GLOBE_LABELS: GlobeLabel[] = [
  { at: [byId.riyadh.lat, byId.riyadh.lng], text: "Riyadh", sub: "HQ", dx: -16, dy: 18 },
  { at: [byId.dubai.lat, byId.dubai.lng], text: "Dubai", sub: "Hub", dx: 16, dy: -18 },
  { at: [byId.kochi.lat, byId.kochi.lng], text: "Kerala", sub: "Office", dx: 16, dy: 14 },
]

function DepartureBoard() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setOffset((o) => (o + 1) % lanes.length), 4000)
    return () => clearInterval(t)
  }, [])
  const rows = Array.from({ length: 4 }, (_, i) => lanes[(offset + i) % lanes.length])
  return (
    <div className="bg-ink text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[11px] tracking-wider text-white/50 uppercase">
        <span>Typical trade lanes → KSA</span>
        <span className="hidden sm:block">Indicative transit</span>
      </div>
      <div className="grid grid-cols-[3.5rem_3.5rem_1fr_auto] gap-x-4 px-5 pt-3 pb-1 font-mono text-[10px] tracking-wider text-white/40 uppercase sm:grid-cols-[4rem_4rem_1fr_3rem_5rem]">
        <span>From</span><span>To</span><span>Cargo</span><span className="hidden sm:block">Mode</span><span>ETA</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[3.5rem_3.5rem_1fr_auto] items-center gap-x-4 border-t border-white/5 px-5 py-2.5 font-mono text-sm uppercase sm:grid-cols-[4rem_4rem_1fr_3rem_5rem]">
          <FlapText text={r.from} className="text-brand-2" delay={i * 0.08} />
          <FlapText text={r.to} delay={i * 0.08 + 0.05} />
          <FlapText text={r.cargo.toUpperCase()} className="truncate text-white/80" delay={i * 0.08 + 0.1} />
          <span className="hidden text-white/50 sm:block">{r.mode}</span>
          <FlapText text={r.eta} className="text-right sm:text-left" delay={i * 0.08 + 0.15} />
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-between gap-2 border-b py-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          <span>Importer · Distributor · Sourcing</span>
          <span className="hidden md:block">Riyadh · Dubai · Kerala</span>
          <span>24.7136° N, 46.6753° E</span>
        </motion.div>

        <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-[13vw] leading-[0.88] font-semibold tracking-tight uppercase font-stretch-expanded sm:text-7xl xl:text-[6.4rem]">
              <Lines lines={["Trusted", "trade for", <span key="k" className="text-brand">Saudi</span>, <span key="i" className="text-brand">industry.</span>]} delay={0.2} />
            </h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-10 grid gap-8 sm:grid-cols-2">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Your partner for quality and sustainability in trading. Bulk materials for projects of any scale, sourced from reputed manufacturers worldwide.
              </p>
              <div className="flex flex-col gap-3">
                <a href="#contact" className={cn(buttonVariants({ size: "lg" }), "group h-14 justify-between rounded-none bg-brand px-6 font-mono text-xs tracking-wider uppercase hover:bg-ink")}>
                  Request a quote <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#services" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group h-14 justify-between rounded-none px-6 font-mono text-xs tracking-wider uppercase")}>
                  View capabilities <ArrowUpRight className="transition-transform group-hover:rotate-45" />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-5">
            <div className="relative bg-paper p-3">
              <CropMarks />
              <div className="flex justify-between px-2 pt-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                <span>Fig. 01 — Sourcing network</span><span>Drag to rotate</span>
              </div>
              <div className="relative mx-auto aspect-square w-full max-w-[460px]">
                <Globe config={GLOBE} lanes={GLOBE_LANES} labels={GLOBE_LABELS} className="max-w-none" />
              </div>
              <div className="grid grid-cols-3 border-t font-mono text-[10px] tracking-wider uppercase">
                {[["HQ", "Riyadh"], ["Hub", "Dubai"], ["Office", "Kerala"]].map(([k, v]) => (
                  <div key={v} className="px-2 pt-3"><span className="text-brand">{k}</span><p className="mt-0.5 text-ink">{v}</p></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9 }} className="mx-auto max-w-[1400px] px-4 md:px-8">
        <DepartureBoard />
      </motion.div>
    </section>
  )
}
