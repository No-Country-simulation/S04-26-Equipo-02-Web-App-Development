import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { ForProfessionals } from "@/components/landing/for-professionals"
import { ForCompanies } from "@/components/landing/for-companies"
import { Community } from "@/components/landing/community"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <ForProfessionals />
      <ForCompanies />
      <Community />
      <CTA />
      <Footer />
    </main>
  )
}
