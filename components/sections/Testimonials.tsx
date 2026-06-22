import React from 'react';
import { TESTIMONIALS } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Quote, Star } from 'lucide-react'

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="Real Results"
          heading="What Our Community Says"
          description="Stories from clients and freelancers who&apos;ve transformed their work through EL SPACE."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, idx) => {
            return (
              <div
                key={idx}
                className="group relative flex flex-col h-full rounded-[2.5rem] border border-slate-200 bg-white p-10 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50"
              >
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-50 text-slate-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Quote className="w-6 h-6 fill-slate-500" />
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-slate400 text-slate400" />
                    ))}
                  </div>
                  <p className="text-xl font-bold text-slate-900 leading-relaxed tracking-tight mb-8">
                    &quot;{testimonial.text}&quot;
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-black text-slate-400">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{testimonial.author}</p>
                    <p className="text-sm font-bold text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
