import React from 'react';
import { NavbarWrapper } from '@/components/navbar-wrapper'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { HowItWorksClients, HowItWorksFreelancers } from '@/components/sections/HowItWorks'
import { Pricing } from '@/components/sections/Pricing'
import { EarningsCalculator } from '@/components/sections/EarningsCalculator'
import { Features } from '@/components/sections/Features'
import { TrustSafetyFeatures } from '@/components/sections/TrustSafetyFeatures'
import { WhyClientsChoose, WhyFreelancersChoose } from '@/components/sections/WhyChoose'
import { FeaturedTalent } from '@/components/sections/FeaturedTalent'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { CTA } from '@/components/sections/CTA'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarWrapper />
      <Hero />
      <TrustBar />
      <HowItWorksClients />
      <HowItWorksFreelancers />
      <TrustSafetyFeatures />
      <Pricing />
      <EarningsCalculator />
      <Features />
      <WhyClientsChoose />
      <WhyFreelancersChoose />
      <FeaturedTalent />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
