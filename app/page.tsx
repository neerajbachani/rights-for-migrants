import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MovementSection } from "@/components/movement-section"
import { CTASection } from "@/components/cta-section"
import { SupportSection } from "@/components/support-section"
import { ScrollPinnedContainer } from "@/components/scrollPinnedContainer"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <div className="bg-[linear-gradient(to_bottom,#FDF8EC_91%,#FFFFFF_100%)]">
      <MovementSection />
      <CTASection />
      <ScrollPinnedContainer/>
      <SupportSection/>
     <Footer/>
      </div>
       
      
    </main>
  )
}
