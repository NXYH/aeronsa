"use client"

import { createRef, forwardRef, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { ArrowUpRight, Building2, Plus, Ship, Warehouse } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { BorderBeam } from "@/components/ui/border-beam"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label, Lines, Reveal, ScrollWords, Stagger, StaggerItem } from "@/components/motion"
import { about, company, faqs, process, products, sectors, services, stats } from "@/lib/content"
import { cn } from "@/lib/utils"

const wrap = "mx-auto max-w-[1400px] px-4 md:px-8"

function Heading({ children, className }: { children: ReactNode[]; className?: string }) {
  return (
    <h2 className={cn("text-4xl leading-[0.95] font-semibold tracking-tight uppercase font-stretch-expanded md:text-6xl", className)}>
      <Lines lines={children} inView />
    </h2>
  )
}

/* ─────────── Marquees ─────────── */
export function SectorMarquee() {
  return (
    <section aria-label="Sectors we serve" className="mt-16 overflow-hidden">
      <div className="-mx-4 -rotate-1 bg-brand py-3 text-white">
        <Marquee className="[--duration:35s] [--gap:2.5rem]" pauseOnHover>
          {sectors.map((s) => (
            <span key={s} className="flex items-center gap-10 text-2xl font-semibold whitespace-nowrap uppercase font-stretch-expanded md:text-3xl">
              {s}<span className="size-2.5 rotate-45 bg-white" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="-mx-4 rotate-1 border-y bg-white py-3">
        <Marquee reverse className="[--duration:45s] [--gap:2.5rem]">
          {company.values.map((v) => (
            <span key={v} className="flex items-center gap-10 font-mono text-sm tracking-widest whitespace-nowrap uppercase">
              {v}<span className="text-brand">✕</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

/* ─────────── Stats ─────────── */
export function Stats() {
  return (
    <section className={cn(wrap, "py-24")}>
      <Stagger className="grid grid-cols-2 border-t border-l lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="group relative overflow-hidden border-r border-b p-6 md:p-8">
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
            <p className="font-mono text-xs text-muted-foreground">[{s.code}]</p>
            <p className="mt-10 text-5xl font-semibold tracking-tight font-stretch-expanded md:text-7xl">
              <NumberTicker value={s.value} className="tracking-tight text-ink" />
              <span className="text-brand">{s.suffix}</span>
            </p>
            <p className="mt-3 font-mono text-xs tracking-wider uppercase">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* ─────────── About ─────────── */
export function About() {
  return (
    <section id="about" className={cn(wrap, "scroll-mt-20 border-t py-24")}>
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-4"><Label n="01">About AERON</Label></Reveal>
        <div className="md:col-span-8">
          <ScrollWords text={about.statement} className="text-2xl leading-[1.25] font-medium tracking-tight md:text-4xl" />
        </div>
      </div>
      <Stagger className="mt-20 grid border-t border-l sm:grid-cols-2 lg:grid-cols-4">
        {about.pillars.map((p, i) => (
          <StaggerItem key={p.title} className="group relative border-r border-b p-6 md:p-8">
            {/* accent sits on the cell's top border and spans it on hover */}
            <span className="absolute -top-px left-0 h-0.5 w-10 bg-brand transition-all duration-500 group-hover:w-full" />
            <p className="font-mono text-xs text-brand">0{i + 1}</p>
            <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-muted-foreground">{p.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/* ─────────── Services — editorial index ─────────── */
export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-t py-24">
      <div className={cn(wrap, "grid gap-10 md:grid-cols-12")}>
        <Reveal className="md:col-span-4"><Label n="02">What we do</Label></Reveal>
        <div className="md:col-span-8">
          <Heading>{["Six disciplines.", <span key="s" className="text-brand">One supply chain.</span>]}</Heading>
        </div>
      </div>
      <div className={cn(wrap, "mt-16")}>
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.04}>
            <a href="#contact" className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 overflow-hidden border-t py-7 last:border-b md:grid-cols-12 md:gap-6 md:py-9">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
              <span className="relative font-mono text-sm text-brand md:col-span-1 md:pl-4">0{i + 1}</span>
              <h3 className="relative text-2xl font-semibold uppercase transition-colors duration-300 font-stretch-expanded group-hover:text-white md:col-span-5 md:text-4xl">{s.title}</h3>
              <p className="relative col-span-3 col-start-2 text-muted-foreground transition-colors duration-300 group-hover:text-white/70 md:col-span-5 md:col-start-auto">{s.body}</p>
              <span className="relative row-start-1 grid size-12 place-items-center justify-self-end border transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-white md:col-span-1 md:row-start-auto md:mr-4">
                <ArrowUpRight className="size-5" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─────────── How it works — animated beams + tracker ─────────── */
const Node = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(({ children, className }, ref) => (
  <div ref={ref} className={cn("z-10 grid place-items-center border bg-white font-mono text-xs shadow-[4px_4px_0_0_var(--ink)]", className)}>{children}</div>
))
Node.displayName = "Node"

function SupplyBeams() {
  const box = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const srcs = ["CN", "DE", "IN", "TR", "US"]
  const dests = [{ icon: Ship, label: "Port" }, { icon: Warehouse, label: "Warehouse" }, { icon: Building2, label: "Project site" }]
  // stable ref objects for each node (held in state so the list can be mapped during render)
  const [s] = useState(() => srcs.map(() => createRef<HTMLDivElement>()))
  const [d] = useState(() => dests.map(() => createRef<HTMLDivElement>()))
  return (
    <div ref={box} className="relative flex items-center justify-between bg-paper px-4 py-10 md:px-16">
      <div className="flex flex-col gap-3 md:gap-4">
        {srcs.map((c, i) => <Node key={c} ref={s[i]} className="size-11 text-sm font-medium md:size-14">{c}</Node>)}
      </div>
      <div ref={hub} className="relative z-10 grid w-28 place-items-center border-2 border-ink bg-white px-3 py-6 md:w-52 md:py-10">
        <Image src="/aeron-wordmark.png" alt="AERON" width={1220} height={300} className="h-auto w-full" />
        <p className="mt-3 hidden text-center font-mono text-[10px] tracking-wider text-muted-foreground uppercase md:block">Source · Inspect · Clear</p>
        <BorderBeam size={90} duration={5} colorFrom="#ea1d26" colorTo="#f37b20" borderWidth={2} />
      </div>
      <div className="flex flex-col gap-6">
        {dests.map((x, i) => (
          <Node key={x.label} ref={d[i]} className="h-12 w-12 gap-1 md:h-16 md:w-28">
            <x.icon className="size-4 text-brand" /><span className="hidden text-[10px] uppercase md:block">{x.label}</span>
          </Node>
        ))}
      </div>
      {s.map((r, i) => <AnimatedBeam key={i} containerRef={box} fromRef={r} toRef={hub} curvature={(2 - i) * 18} pathColor="#141414" pathOpacity={0.12} gradientStartColor="#ea1d26" gradientStopColor="#f37b20" delay={i * 0.3} duration={4} />)}
      {d.map((r, i) => <AnimatedBeam key={i} containerRef={box} fromRef={hub} toRef={r} curvature={(1 - i) * 12} pathColor="#141414" pathOpacity={0.12} gradientStartColor="#f37b20" gradientStopColor="#ea1d26" delay={1.5 + i * 0.3} duration={4} />)}
    </div>
  )
}

function Checkpoint({ p, i, total, progress }: { p: (typeof process)[number]; i: number; total: number; progress: MotionValue<number> }) {
  const at = i / (total - 1)
  const bg = useTransform(progress, [at - 0.05, at], ["#ffffff", "#ea1d26"])
  const border = useTransform(progress, [at - 0.05, at], ["#d9d6cf", "#ea1d26"])
  return (
    <div className="relative pt-10">
      <motion.span style={{ backgroundColor: bg, borderColor: border }} className="absolute top-0 left-0 size-4 -translate-y-1/2 rotate-45 border-2" />
      <p className="font-mono text-xs text-muted-foreground">STEP {String(i + 1).padStart(2, "0")}</p>
      <h3 className="mt-2 text-lg font-semibold uppercase font-stretch-expanded">{p.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
    </div>
  )
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] })
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const shipX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  return (
    <section id="process" className="scroll-mt-20 border-t py-24">
      <div className={cn(wrap, "grid gap-10 md:grid-cols-12")}>
        <Reveal className="md:col-span-4"><Label n="03">How it works</Label></Reveal>
        <div className="md:col-span-8">
          <Heading>{["From factory floor", <span key="w" className="text-brand">to your warehouse.</span>]}</Heading>
          <Reveal delay={0.1}><p className="mt-6 max-w-xl text-lg text-muted-foreground">One accountable partner across every stage — so you reduce risk, save time and source with confidence.</p></Reveal>
        </div>
      </div>
      <Reveal className={cn(wrap, "mt-14")}><SupplyBeams /></Reveal>
      <div ref={ref} className={cn(wrap, "relative mt-16")}>
        <div className="relative hidden h-px bg-border lg:block">
          <motion.div style={{ width }} className="absolute inset-y-0 left-0 bg-brand" />
          <motion.div style={{ left: shipX }} className="absolute -top-9 -translate-x-1/2 text-brand"><Ship className="size-6" /></motion.div>
        </div>
        <div className="grid gap-x-6 gap-y-10 border-t sm:grid-cols-2 lg:grid-cols-6 lg:border-t-0">
          {process.map((p, i) => <Checkpoint key={p.title} p={p} i={i} total={process.length} progress={scrollYProgress} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Products — shipping containers, horizontal scroll ─────────── */
const containerColors = ["bg-brand text-white", "bg-ink text-white", "bg-brand-2 text-ink", "bg-paper text-ink"]

export function Products() {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  useEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches
      setDist(desktop && track.current ? Math.max(0, track.current.scrollWidth - window.innerWidth + 64) : 0)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  return (
    <section id="products" ref={section} className="relative scroll-mt-20 border-t bg-white" style={{ height: dist ? `calc(100vh + ${dist}px)` : undefined }}>
      <div className={cn("overflow-hidden py-24", dist && "sticky top-0 flex h-screen flex-col justify-center py-0")}>
        <div className={cn(wrap, "w-full")}>
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-4"><Label n="04">Our products</Label></Reveal>
            <div className="flex items-end justify-between gap-6 md:col-span-8">
              <Heading className="md:text-5xl">{["Industrial supplies,", <span key="c" className="text-brand">sourced & certified.</span>]}</Heading>
              <span className="hidden shrink-0 font-mono text-xs text-muted-foreground lg:block">Scroll →</span>
            </div>
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className={cn("mt-12 flex gap-5 px-4 md:px-8", !dist && "snap-x snap-mandatory overflow-x-auto pb-4")}>
          {products.map((p, i) => (
            <article key={p.title} className={cn("group relative flex h-[440px] w-[300px] shrink-0 snap-start flex-col overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-2 md:w-[360px]", containerColors[i % 4])}>
              {/* corrugated container ribs */}
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(0_0_0/0.09)_0_3px,transparent_3px_22px)] transition-[background-position] duration-700 group-hover:bg-[position:22px_0]" />
              <span aria-hidden className="absolute inset-x-0 top-0 h-3 border-b border-black/15 bg-black/10" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-3 border-t border-black/15 bg-black/10" />
              <div className="relative mt-3 flex items-start justify-between font-mono">
                <div>
                  <p className="text-lg font-medium tracking-wider">{p.code}</p>
                  <p className="text-[10px] opacity-60">22G1 · MAX GROSS 30,480 KG</p>
                </div>
                <p.icon className="size-7 opacity-80" strokeWidth={1.5} />
              </div>
              <div className="relative mt-auto">
                <p className="font-mono text-xs opacity-60">CAT. {String(i + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</p>
                <h3 className="mt-2 text-2xl leading-none font-semibold break-words uppercase font-stretch-expanded">{p.title}</h3>
                <p className="mt-3 text-sm opacity-75">{p.body}</p>
                <ul className="mt-5 mb-3 flex flex-wrap gap-1.5 font-mono text-[11px] uppercase">
                  {p.items.map((it) => <li key={it} className="border border-current/30 px-2 py-0.5">{it}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── FAQ ─────────── */
export function Faq() {
  return (
    <section id="faq" className={cn(wrap, "grid scroll-mt-20 gap-10 border-t py-24 md:grid-cols-12")}>
      <div className="md:col-span-4">
        <Reveal><Label n="06">FAQ</Label></Reveal>
        <Heading className="mt-8 md:text-5xl">{["Questions,", <span key="a" className="text-brand">answered.</span>]}</Heading>
      </div>
      <Reveal delay={0.1} className="md:col-span-8">
        <Accordion className="border-t">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`f${i}`} className="border-b">
              <AccordionTrigger className="group/faq rounded-none py-6 text-left text-lg font-medium hover:no-underline md:text-xl [&>[data-slot=accordion-trigger-icon]]:hidden!">
                <span className="flex w-full items-start gap-5">
                  <span className="mt-1.5 font-mono text-xs text-brand">0{i + 1}</span>
                  <span className="flex-1">{f.q}</span>
                  <span className="grid size-9 shrink-0 place-items-center border transition-all duration-300 group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:border-brand group-aria-expanded/accordion-trigger:bg-brand group-aria-expanded/accordion-trigger:text-white">
                    <Plus className="size-4" />
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-9 text-base leading-relaxed text-muted-foreground md:pr-16">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  )
}
