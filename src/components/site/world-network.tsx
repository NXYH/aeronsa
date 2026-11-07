"use client"

// Geographically accurate network map. Dots + pin positions are pre-projected (Robinson) by
// scripts/gen-map.mjs using dotted-map, so pins sit exactly where the real cities are.
// Concept adapted from Aceternity UI's World Map, with its lat/lng projection bug fixed.
import { useState } from "react"
import { motion } from "motion/react"
import { byId, hubs, mapSize as data, portFor, sources } from "@/lib/network"
import { Label, Reveal } from "@/components/motion"
import { cn } from "@/lib/utils"


function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const dx = b.x - a.x, dy = b.y - a.y
  const lift = Math.min(Math.hypot(dx, dy) * 0.28, 16)
  return `M${a.x},${a.y} Q${mx},${my - lift} ${b.x},${b.y}`
}

export function WorldNetwork() {
  const [active, setActive] = useState<string | null>(null)
  const routes = sources.map((s) => ({ s, port: portFor(s), d: arc(s, portFor(s)) }))
  const inland = [byId.jeddah, byId.dammam, byId.dubai, byId.kochi].map((h) => ({ id: h.id, d: arc(h, byId.riyadh), dashed: h.kind === "hub" }))

  return (
    <section id="network" className="scroll-mt-20 border-t py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-4"><Label n="05">Global network</Label></Reveal>
          <Reveal delay={0.1} className="md:col-span-8">
            <h2 className="text-4xl leading-[0.95] font-semibold tracking-tight uppercase font-stretch-expanded md:text-6xl">
              42+ countries.<br /><span className="text-brand">One destination.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Verified suppliers across Asia, Europe, the GCC and the Americas — consolidated through Jeddah and Dammam and delivered to your door anywhere in the Kingdom.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative mt-14">
          <div className="relative w-full" style={{ aspectRatio: `${data.width} / ${data.height}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
            <img src="/world-dots.svg" alt="" className="absolute inset-0 size-full opacity-30 select-none" draggable={false} />
            <svg viewBox={`0 0 ${data.width} ${data.height}`} className="absolute inset-0 size-full overflow-visible" role="img" aria-label="Map of AERON sourcing markets and Saudi entry ports">
              {inland.map((r, i) => (
                <motion.path key={r.id} d={r.d} fill="none" stroke="var(--brand)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeDasharray={r.dashed ? "3 3" : undefined}
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
              ))}
              {routes.map(({ s, d }, i) => {
                const on = active === s.id, dim = active && !on
                return (
                  <g key={s.id} style={{ opacity: dim ? 0.15 : 1, transition: "opacity .3s" }}>
                    <motion.path id={`route-${s.id}`} d={d} fill="none" stroke={on ? "var(--brand)" : "var(--ink)"} strokeOpacity={on ? 1 : 0.55}
                      strokeWidth={on ? 2 : 1} vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.6 + i * 0.12, ease: "easeInOut" }} />
                    {/* cargo travelling the lane */}
                    <circle r={0.55} fill="var(--brand-2)">
                      <animateMotion dur={`${3 + (i % 4) * 0.6}s`} begin={`${2.4 + i * 0.35}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                        <mpath href={`#route-${s.id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                )
              })}
              {sources.map((s) => (
                <g key={s.id} onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} className="cursor-pointer">
                  <circle cx={s.x} cy={s.y} r={2.4} fill="transparent" />
                  <circle cx={s.x} cy={s.y} r={active === s.id ? 0.9 : 0.6} fill="var(--ink)" />
                  <text x={s.x} y={s.y - 1.4} textAnchor="middle" className="hidden fill-ink font-mono text-[1.5px] md:block">{s.code}</text>
                </g>
              ))}
              {hubs.map((h) => {
                const hq = h.id === "riyadh", port = h.kind === "port"
                return (
                  <g key={h.id}>
                    {!port && (
                      <circle cx={h.x} cy={h.y} r={0.8} fill="none" stroke="var(--brand)" strokeWidth={0.25}>
                        <animate attributeName="r" values="0.8;3.2" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <rect x={h.x - (hq ? 0.9 : 0.6)} y={h.y - (hq ? 0.9 : 0.6)} width={hq ? 1.8 : 1.2} height={hq ? 1.8 : 1.2} fill={port ? "white" : "var(--brand)"} stroke="var(--brand)" strokeWidth={0.3} transform={`rotate(45 ${h.x} ${h.y})`} />
                    {!port && (
                      <text x={h.x + (h.id === "dubai" ? 1.8 : 0)} y={h.y + (h.id === "dubai" ? -1.2 : 3.2)} textAnchor={h.id === "dubai" ? "start" : "middle"} className="hidden fill-brand font-mono text-[1.6px] font-medium uppercase md:block">
                        {h.name}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            <span className="flex items-center gap-2"><span className="size-2 rotate-45 bg-brand" />AERON office</span>
            <span className="flex items-center gap-2"><span className="size-2 rotate-45 border border-brand bg-white" />KSA entry port</span>
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-ink" />Sourcing market</span>
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-brand-2" />Cargo in motion</span>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-6">
          {sources.map((s) => (
            <button
              key={s.id} onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}
              className={cn("group border-r border-b p-4 text-left transition-colors", active === s.id ? "bg-ink text-white" : "hover:bg-paper")}
            >
              <span className={cn("font-mono text-xs", active === s.id ? "text-brand-2" : "text-brand")}>{s.code} → {portFor(s).code}</span>
              <span className="mt-2 block font-semibold">{s.name}</span>
              <span className={cn("text-sm", active === s.id ? "text-white/60" : "text-muted-foreground")}>{s.country}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">Representative sourcing markets shown. Network spans 42+ countries.</p>
      </div>
    </section>
  )
}
