// All site copy, sourced from aeronsa.com and cleaned up (typos fixed, placeholder FAQ rewritten).
import {
  Search, Globe2, Ship, FileCheck2, Network, Zap,
  Cog, Layers, Cpu, Wheat, HardHat, Fuel, Building2, SprayCan,
  type LucideIcon,
} from "lucide-react"

export const company = {
  name: "AERON Trading",
  tagline: "International Trade Partner",
  values: ["Quality", "Reliability", "Integrity", "Global Sourcing", "Customer Support"],
  phone: "+966 11 234 5678",
  phoneHref: "tel:+966112345678",
  email: "info@aerontrading.com",
  website: "www.aerontrading.com",
  hours: "Mon – Sat, 09:00 – 18:00",
}

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Network", href: "#network" },
  { label: "FAQ", href: "#faq" },
]

export const sectors = [
  "Oil Fields", "Packaging & Electrical", "Manufacturing", "Medical", "FMCG",
  "Construction", "Agriculture", "Timber", "Minerals",
]

export const stats = [
  { value: 42, suffix: "+", label: "Sourcing countries", code: "A" },
  { value: 16, suffix: "+", label: "Verified suppliers", code: "B" },
  { value: 10, suffix: "+", label: "Years in supply chain", code: "C" },
  { value: 100, suffix: "%", label: "End-to-end handling", code: "D" },
]

// ponytail: indicative transit windows for typical lanes, not live shipment data.
export const lanes = [
  { from: "SHA", to: "DMM", cargo: "Steel pipes", mode: "Sea", eta: "20–24 D" },
  { from: "HAM", to: "JED", cargo: "Machinery", mode: "Sea", eta: "16–20 D" },
  { from: "BOM", to: "DMM", cargo: "Food products", mode: "Sea", eta: "06–08 D" },
  { from: "IST", to: "JED", cargo: "Construction", mode: "Sea", eta: "08–10 D" },
  { from: "PUS", to: "DMM", cargo: "Electrical", mode: "Sea", eta: "22–26 D" },
  { from: "HOU", to: "DMM", cargo: "Oil & gas", mode: "Sea", eta: "30–35 D" },
  { from: "CAN", to: "RUH", cargo: "Safety & PPE", mode: "Air", eta: "02–04 D" },
]

export const about = {
  statement:
    "AERON Trading is a dynamic trading company delivering quality products across diverse sectors. From construction materials and agriculture to timber and minerals, we connect Saudi businesses to reputed manufacturers worldwide — treating every partnership as a long-term commitment to trust, reliability and sustainable growth.",
  pillars: [
    { title: "Verified network", body: "Every supplier is vetted for quality, capacity and authenticity." },
    { title: "Inspected orders", body: "Quality checks and documentation before anything ships." },
    { title: "Compliance handled", body: "HS codes, approvals and duties managed for KSA entry." },
    { title: "Door-to-door", body: "From the factory floor to your warehouse or project site." },
  ],
}

export const services: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Market Research", body: "Insights on trending products and market demand so you buy the right goods at the right time.", icon: Search },
  { title: "Global Sourcing", body: "Direct access to reputable global suppliers, vetted for quality and authenticity.", icon: Globe2 },
  { title: "Shipping & Logistics", body: "Door-to-door delivery to your warehouse from anywhere, with commercial license support.", icon: Ship },
  { title: "Customs Clearance", body: "HS code classification, regulatory approvals, duty processing and documentation.", icon: FileCheck2 },
  { title: "Distribution", body: "Efficient movement of goods from producers to end consumers across Saudi Arabia.", icon: Network },
  { title: "Fast Delivery", body: "Timely, safe and on-schedule delivery, coordinated from origin to your door.", icon: Zap },
]

export const process = [
  { title: "Requirement", body: "Share specs, quantities and timelines." },
  { title: "Sourcing", body: "Shortlist verified manufacturers, negotiate pricing." },
  { title: "Inspection", body: "Quality-checked and documented pre-shipment." },
  { title: "Shipping", body: "Multi-modal freight by sea, air or land." },
  { title: "Customs", body: "Clearance, duties and compliance end-to-end." },
  { title: "Delivery", body: "Final delivery to your warehouse or site." },
]

export const products: { title: string; body: string; icon: LucideIcon; items: string[]; code: string }[] = [
  { title: "Machinery & Spares", code: "AERU 100231 4", body: "Industrial machinery, replacement parts and maintenance spares.", icon: Cog, items: ["Pumps", "Motors", "Bearings", "Gearboxes"] },
  { title: "Steel & Metal", code: "AERU 100418 2", body: "Structural steel, pipes, sheets and fabricated metal goods.", icon: Layers, items: ["Pipes", "Sheets", "Rebar", "Profiles"] },
  { title: "Electrical & Instrumentation", code: "AERU 100562 9", body: "Cables, switchgear, panels and precision instruments.", icon: Cpu, items: ["Cables", "Switchgear", "Sensors", "Panels"] },
  { title: "Food Products", code: "AERU 100733 1", body: "Bulk food commodities and FMCG goods from certified producers.", icon: Wheat, items: ["Grains", "Pulses", "FMCG", "Bulk"] },
  { title: "Safety & PPE", code: "AERU 100847 6", body: "Certified protective gear for industrial and site workforces.", icon: HardHat, items: ["Helmets", "Gloves", "Coveralls", "Footwear"] },
  { title: "Oil & Gas Equipment", code: "AERU 100915 0", body: "Valves, fittings and field equipment, upstream to downstream.", icon: Fuel, items: ["Valves", "Fittings", "Flanges", "Drilling"] },
  { title: "Construction Materials", code: "AERU 101026 3", body: "Building materials for projects of every scale.", icon: Building2, items: ["Cement", "Tiles", "Timber", "Insulation"] },
  { title: "Cleaning Materials", code: "AERU 101184 7", body: "Industrial and commercial cleaning chemicals and supplies.", icon: SprayCan, items: ["Chemicals", "Janitorial", "Degreasers", "Bulk"] },
]

export const faqs = [
  { q: "Which countries does AERON Trading source from?", a: "We work with verified suppliers across 42+ countries, including Asia, Europe, the GCC and the Americas." },
  { q: "What types of products can you import?", a: "Industrial machinery and spares, steel and metal products, electrical and instrumentation, safety and PPE, oil and gas equipment, construction materials, chemicals, medical supplies, food products and bulk cargo." },
  { q: "Do you handle customs clearance in Saudi Arabia?", a: "Yes. We manage documentation, HS code classification, regulatory approvals, duty processing and compliance for smooth entry into the Kingdom." },
  { q: "How do I track my shipment?", a: "Once your order ships, we share your order reference, bill of lading or airway bill number, and a dedicated coordinator who sends you status updates through every stage until delivery." },
  { q: "Do you provide door-to-door delivery?", a: "Yes — supplier coordination, purchasing, inspection, shipping, customs and final delivery to your site." },
  { q: "Are products quality checked before shipping?", a: "Every order goes through inspection and documentation before shipment, so what arrives matches what you ordered." },
]
