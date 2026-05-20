"use client"
import { AboutUs } from "@/components/aboutus"
import CTAConsultation from "@/components/cta-consultation"
import Founder from "@/components/founder"
import { HeroSection } from "@/components/hero"
import Membership from "@/components/membership"
import { Mission } from "@/components/mission"
import {PremiumServices} from "@/components/premium-services"
import { ServicesGrid } from "@/components/services-grid"
import Testimonials from "@/components/testimonials"

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutUs />
      <ServicesGrid />
      <Mission />
      <Membership />
      <PremiumServices />
      <Founder />
      <Testimonials />
      <CTAConsultation />
    </div>
  )
}

export default Home