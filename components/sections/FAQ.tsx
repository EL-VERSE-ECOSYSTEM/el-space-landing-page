'use client'
import React from 'react';

import { FAQ_ITEMS } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function FAQ() {
  const clientFAQ = FAQ_ITEMS.filter((item) => item.category === 'client')
  const freelancerFAQ = FAQ_ITEMS.filter((item) => item.category === 'freelancer')

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="FAQ"
          heading="Got Questions? We Have Answers."
          description="Everything you need to know about EL SPACE platform and ecosystem."
        />

        <Tabs defaultValue="clients" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-2xl h-14">
              <TabsTrigger
                value="clients"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm"
              >
                For Clients
              </TabsTrigger>
              <TabsTrigger
                value="freelancers"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate600 data-[state=active]:shadow-sm"
              >
                For Freelancers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="clients" className="mt-0 focus-visible:outline-none">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {clientFAQ.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`client-${idx}`}
                  className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="freelancers" className="mt-0 focus-visible:outline-none">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {freelancerFAQ.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`freelancer-${idx}`}
                  className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
