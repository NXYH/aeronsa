import type { Metadata } from "next"
import { Archivo, IBM_Plex_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// Archivo's width axis gives us expanded, freight-signage style headings from one standard family.
const sans = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] })
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "AERON Trading — Saudi Arabia's Premier Importer & Distributor",
  description:
    "AERON Trading connects Saudi businesses to verified suppliers in 42+ countries: global sourcing, quality inspection, customs clearance and door-to-door logistics.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-full bg-background font-sans text-ink">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
