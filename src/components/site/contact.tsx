"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { toast } from "sonner"
import { ArrowRight, ArrowUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BorderBeam } from "@/components/ui/border-beam"
import { Label, Lines, Reveal } from "@/components/motion"
import { company, nav, products } from "@/lib/content"
import { cn } from "@/lib/utils"

const volumes = ["Not sure yet", "Single shipment", "Monthly supply", "Annual contract"]
const cell = "relative border-r border-b p-3 pt-6 focus-within:bg-brand-soft/60 transition-colors"
const tag = "absolute top-2 left-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
const field = "w-full bg-transparent text-base outline-none placeholder:text-ink/30"

export function Contact() {
  const [cats, setCats] = useState<string[]>([])
  const toggle = (c: string) => setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    // ponytail: no backend — opens the user's mail client. Swap for a form/email API when the client picks one.
    const body = [
      `Name: ${f.get("name")}`, `Email: ${f.get("email")}`, `Phone: ${f.get("phone")}`, `Company: ${f.get("company") || "-"}`,
      `Delivery city: ${f.get("city") || "-"}`, `Volume: ${f.get("volume")}`, `Categories: ${cats.join(", ") || "-"}`, "", String(f.get("message") || ""),
    ].join("\n")
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`RFQ — ${f.get("name")}`)}&body=${encodeURIComponent(body)}`
    toast.success("Opening your email app", { description: "Your quote request is ready to send to our team." })
  }

  return (
    <section id="contact" className="scroll-mt-20 border-t bg-paper py-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal><Label n="07">Working with us</Label></Reveal>
          <h2 className="mt-8 text-4xl leading-[0.95] font-semibold tracking-tight uppercase font-stretch-expanded md:text-6xl">
            <Lines inView lines={["Let's build", "a reliable", <span key="s" className="text-brand">supply chain.</span>]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">
              We manage supplier verification, inspection, customs and final delivery — so you reduce risk, save time and source with confidence.
            </p>
            <dl className="mt-10 border-t">
              {[["Phone", company.phone, company.phoneHref], ["Email", company.email, `mailto:${company.email}`], ["Hours", company.hours], ["Web", company.website]].map(([k, v, href]) => (
                <div key={k} className="flex justify-between gap-4 border-b py-4">
                  <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{k}</dt>
                  <dd className="text-right font-medium">{href ? <a href={href} className="underline-offset-4 hover:text-brand hover:underline">{v}</a> : v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form onSubmit={onSubmit} className="relative bg-white">
            <BorderBeam size={160} duration={8} colorFrom="#ea1d26" colorTo="#f37b20" borderWidth={2} />
            <div className="flex items-center justify-between border-b bg-ink px-4 py-3 font-mono text-xs tracking-wider text-white uppercase">
              <span>Request for quotation</span><span className="text-white/50">Form AER-RFQ / 01</span>
            </div>
            <div className="grid border-l sm:grid-cols-2">
              <div className={cell}><label htmlFor="name" className={tag}>01 · Full name *</label><input id="name" name="name" required className={field} placeholder="Your name" /></div>
              <div className={cell}><label htmlFor="company" className={tag}>02 · Company</label><input id="company" name="company" className={field} placeholder="Optional" /></div>
              <div className={cell}><label htmlFor="email" className={tag}>03 · Email *</label><input id="email" name="email" type="email" required className={field} placeholder="name@company.com" /></div>
              <div className={cell}><label htmlFor="phone" className={tag}>04 · Phone *</label><input id="phone" name="phone" type="tel" required className={field} placeholder="+966" /></div>
              <div className={cell}><label htmlFor="city" className={tag}>05 · Delivery city</label><input id="city" name="city" className={field} placeholder="Riyadh, Jeddah, Dammam…" /></div>
              <div className={cell}>
                <label htmlFor="volume" className={tag}>06 · Order volume</label>
                <Select name="volume" defaultValue={volumes[0]}>
                  <SelectTrigger id="volume" className="h-7 w-full rounded-none border-0 p-0 text-base shadow-none focus-visible:ring-0"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">{volumes.map((v) => <SelectItem key={v} value={v} className="rounded-none">{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <fieldset className={cn(cell, "sm:col-span-2")}>
                <legend className={tag}>07 · Product categories</legend>
                <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {products.map((p) => {
                    const on = cats.includes(p.title)
                    return (
                      <button type="button" key={p.title} onClick={() => toggle(p.title)} aria-pressed={on} className="group flex items-center gap-3 text-left">
                        <span className={cn("grid size-5 shrink-0 place-items-center border transition-colors", on ? "border-brand bg-brand" : "border-ink/40 group-hover:border-ink")}>
                          <motion.svg viewBox="0 0 12 12" className="size-3 text-white" initial={false}>
                            <motion.path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth={2} initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.25 }} />
                          </motion.svg>
                        </span>
                        <span className={cn("text-sm transition-colors", on ? "text-ink" : "text-muted-foreground group-hover:text-ink")}>{p.title}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <div className={cn(cell, "sm:col-span-2")}>
                <label htmlFor="message" className={tag}>08 · Requirements</label>
                <textarea id="message" name="message" rows={4} className={cn(field, "resize-none")} placeholder="Specs, quantities, grades, timeline…" />
              </div>
            </div>
            <button type="submit" className="group flex w-full items-center justify-between bg-brand px-5 py-5 font-mono text-sm tracking-wider text-white uppercase transition-colors hover:bg-ink">
              Submit request <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            {/* full logo — its white tagline only reads on dark */}
            <Image src="/aeron-logo.png" alt="AERON Trading — International Trade Partner" width={1323} height={652} className="h-auto w-64" />
            <p className="mt-6 max-w-sm text-white/60">
              Industrial trading, global procurement, sourcing, supply chain solutions, import &amp; export support and customized procurement services.
            </p>
          </div>
          <FooterCol title="Index" className="md:col-span-2">
            {nav.map((n, i) => <a key={n.href} href={n.href} className="block w-fit text-white/70 hover:text-white"><span className="mr-2 font-mono text-xs text-brand">0{i + 1}</span>{n.label}</a>)}
          </FooterCol>
          <FooterCol title="Offices" className="md:col-span-2">
            {[["Riyadh", "Saudi Arabia"], ["Dubai", "UAE"], ["Kerala", "India"]].map(([c, k]) => <p key={c} className="text-white/70">{c} <span className="text-white/35">· {k}</span></p>)}
          </FooterCol>
          <FooterCol title="Contact" className="md:col-span-3">
            <a href={company.phoneHref} className="block text-white/70 hover:text-white">{company.phone}</a>
            <a href={`mailto:${company.email}`} className="block text-white/70 hover:text-white">{company.email}</a>
            <p className="text-white/70">{company.hours}</p>
          </FooterCol>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 py-6 font-mono text-[11px] tracking-wider text-white/40 uppercase sm:flex-row sm:items-center">
          <p>© 2026 AERON Trading. All rights reserved.</p>
          <p>World Wide Networks · Indian Origin · Global Destinations</p>
          <a href="#home" className="flex items-center gap-2 hover:text-white">Back to top <ArrowUp className="size-3" /></a>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-5 font-mono text-[11px] tracking-wider text-white/40 uppercase">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
