import { Footer, Nav } from '../components/Brand'
import { Examples } from '../components/landing/Examples'
import { Contact, Faq } from '../components/landing/FaqContact'
import { Hero } from '../components/landing/Hero'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Pricing } from '../components/landing/Pricing'
import { SportsBand } from '../components/landing/SportsBand'
import { ShowcaseBand } from '../components/landing/ShowcaseBand'
import { ManagedService } from '../components/showcase/ManagedService'

export function Landing() {
  return (
    <div className="tatami-weave min-h-screen overflow-x-clip">
      <Nav />
      <Hero />
      <SportsBand />
      <HowItWorks />
      <ShowcaseBand />
      <ManagedService />
      <Examples />
      <Pricing />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}
