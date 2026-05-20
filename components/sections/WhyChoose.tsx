import React from 'react';
import { WHY_CLIENTS_CHOOSE, WHY_FREELANCERS_CHOOSE } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { BenefitCard } from '@/components/ui/BenefitCard'

export function WhyClientsChoose() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="For Clients"
          heading="Stop Chasing Freelancers. Start Shipping Work."
          description="Everything you need to hire with confidence."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WHY_CLIENTS_CHOOSE.map((benefit, idx) => {
            const colors: Array<'cyan' | 'purple' | 'green' | 'blue' | 'yellow' | 'pink'> = [
              'cyan', 'purple', 'green', 'blue', 'yellow', 'pink'
            ]
            return (
              <BenefitCard
                key={idx}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                colorScheme={colors[idx % colors.length]}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function WhyFreelancersChoose() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="For Freelancers"
          heading="Keep More. Stress Less."
          description="Why talented developers choose EL SPACE over other platforms."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WHY_FREELANCERS_CHOOSE.map((benefit, idx) => {
            const colors: Array<'cyan' | 'purple' | 'green' | 'blue' | 'yellow' | 'pink'> = [
              'purple', 'blue', 'yellow', 'pink', 'cyan', 'green'
            ]
            return (
              <BenefitCard
                key={idx}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                colorScheme={colors[idx % colors.length]}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
