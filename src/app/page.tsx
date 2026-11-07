import { Hero, Navbar } from "@/components/site/header"
import { About, Faq, Process, Products, SectorMarquee, Services, Stats } from "@/components/site/sections"
import { WorldNetwork } from "@/components/site/world-network"
import { Contact, Footer } from "@/components/site/contact"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectorMarquee />
        <Stats />
        <About />
        <Services />
        <Process />
        <Products />
        <WorldNetwork />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
