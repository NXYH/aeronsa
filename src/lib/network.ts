// Shared trade-network data for the hero globe and the network map (positions from scripts/gen-map.mjs).
import data from "@/lib/map-pins.json"

export type Pin = (typeof data.pins)[number]
export const mapSize = { width: data.width, height: data.height }
export const pins = data.pins
export const byId = Object.fromEntries(pins.map((p) => [p.id, p])) as Record<string, Pin>
export const sources = pins.filter((p) => p.kind === "source")
export const hubs = pins.filter((p) => p.kind !== "source")

/** Red Sea entry (Jeddah) for Europe / Americas / Africa, Gulf entry (Dammam) for Asia. */
export const portFor = (p: Pin) => (p.lng < 35 ? byId.jeddah : byId.dammam)

/** Every lane: source → KSA port, then ports & offices → Riyadh HQ. */
export const lanes = [
  ...sources.map((s) => ({ id: s.id, from: s, to: portFor(s), inland: false })),
  ...["jeddah", "dammam", "dubai", "kochi"].map((id) => ({ id: `${id}-ruh`, from: byId[id], to: byId.riyadh, inland: true })),
]
