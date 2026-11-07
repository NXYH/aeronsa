// Generates public/world-dots.svg + src/lib/map-pins.json from real lat/lng.
// Run: node scripts/gen-map.mjs  (re-run after editing PLACES)
import DottedMap from "dotted-map"
import { writeFileSync } from "node:fs"

const PLACES = [
  // kind: hub = AERON office, port = KSA entry port, source = sourcing market
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", code: "RUH", lat: 24.7136, lng: 46.6753, kind: "hub" },
  { id: "dubai", name: "Dubai", country: "UAE", code: "DXB", lat: 25.2048, lng: 55.2708, kind: "hub" },
  { id: "kochi", name: "Kerala", country: "India", code: "COK", lat: 9.9312, lng: 76.2673, kind: "hub" },
  { id: "jeddah", name: "Jeddah", country: "Saudi Arabia", code: "JED", lat: 21.4858, lng: 39.1925, kind: "port" },
  { id: "dammam", name: "Dammam", country: "Saudi Arabia", code: "DMM", lat: 26.4207, lng: 50.0888, kind: "port" },
  { id: "shanghai", name: "Shanghai", country: "China", code: "SHA", lat: 31.2304, lng: 121.4737, kind: "source" },
  { id: "guangzhou", name: "Guangzhou", country: "China", code: "CAN", lat: 23.1291, lng: 113.2644, kind: "source" },
  { id: "seoul", name: "Busan", country: "South Korea", code: "PUS", lat: 35.1796, lng: 129.0756, kind: "source" },
  { id: "singapore", name: "Singapore", country: "Singapore", code: "SIN", lat: 1.3521, lng: 103.8198, kind: "source" },
  { id: "mumbai", name: "Mumbai", country: "India", code: "BOM", lat: 19.076, lng: 72.8777, kind: "source" },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", code: "IST", lat: 41.0082, lng: 28.9784, kind: "source" },
  { id: "hamburg", name: "Hamburg", country: "Germany", code: "HAM", lat: 53.5511, lng: 9.9937, kind: "source" },
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", code: "RTM", lat: 51.9244, lng: 4.4777, kind: "source" },
  { id: "milan", name: "Genoa", country: "Italy", code: "GOA", lat: 44.4056, lng: 8.9463, kind: "source" },
  { id: "houston", name: "Houston", country: "United States", code: "HOU", lat: 29.7604, lng: -95.3698, kind: "source" },
  { id: "santos", name: "Santos", country: "Brazil", code: "SSZ", lat: -23.9608, lng: -46.3336, kind: "source" },
  { id: "durban", name: "Durban", country: "South Africa", code: "DUR", lat: -29.8587, lng: 31.0218, kind: "source" },
]

const map = new DottedMap({ height: 72, grid: "diagonal", projection: { name: "robinson" }, region: { lat: { min: -56, max: 78 }, lng: { min: -180, max: 180 } } })
const { width, height } = map.image
const r = (n) => Math.round(n * 100) / 100
const pins = PLACES.map((p) => { const pt = map.getPin(p); return { ...p, x: r(pt.x), y: r(pt.y) } })
const dots = map.getPoints().map((p) => `<circle cx="${r(p.x)}" cy="${r(p.y)}" r="0.24"/>`).join("")
writeFileSync("public/world-dots.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="#1d1d1b">${dots}</svg>`)
writeFileSync("src/lib/map-pins.json", JSON.stringify({ width, height, pins }, null, 1))
console.log(width, height, pins.length, "pins")
