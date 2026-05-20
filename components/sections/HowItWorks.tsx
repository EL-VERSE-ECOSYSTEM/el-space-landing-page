import React from 'react';
import { HOW_IT_WORKS_CLIENTS, HOW_IT_WORKS_FREELANCERS } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StepCard } from '@/components/ui/StepCard'

export function HowItWorksClients() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="For Clients"
          heading="From Post to Payment in 4 Simple Steps"
          description="Everything you need to find and hire top talent, risk-free."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_CLIENTS.map((item, idx) => (
            <StepCard
              key={idx}
              icon={item.icon}
              title={item.title}
              description={item.description}
              step={idx + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksFreelancers() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="For Freelancers"
          heading="Stop Bidding. Start Building."
          description="Get matched with premium projects without the hustle."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_FREELANCERS.map((item, idx) => (
            <StepCard
              key={idx}
              icon={item.icon}
              title={item.title}
              description={item.description}
              step={idx + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
