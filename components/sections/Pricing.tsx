'use client'

import { useState } from 'react'
import { PRICING_CLIENT_TABLE, PRICING_FREELANCER_TABLE } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2 } from 'lucide-react'

export function Pricing() {
  const [activeTab, setActiveTab] = useState('clients')

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          heading="Simple, Fair Pricing"
          subheading="Transparent & Competitive"
          description="No hidden fees. No surprises. Just straightforward pricing that scales with your project size. We believe in fairness for everyone."
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-200 rounded-2xl h-14">
              <TabsTrigger
                value="clients"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm"
              >
                For Clients
              </TabsTrigger>
              <TabsTrigger
                value="freelancers"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
              >
                For Freelancers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="clients" className="space-y-8 focus-visible:outline-none">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Project Size
                      </th>
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Platform Fee
                      </th>
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Deliverables
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING_CLIENT_TABLE.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-cyan-50/30 transition-colors border-b border-slate-50 last:border-none">
                        <td className="px-8 py-8">
                          <p className="text-xl font-bold text-slate-900 mb-1">{row.size}</p>
                          <p className="text-sm font-bold text-slate-400">{row.range}</p>
                        </td>
                        <td className="px-8 py-8">
                          <p className="text-2xl font-black text-cyan-600">{row.fee}</p>
                        </td>
                        <td className="px-8 py-8">
                          <p className="text-slate-600 font-medium">{row.example}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Callout */}
            <div className="rounded-[2.5rem] bg-slate-900 p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-cyan-500/20" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black text-white">Why pay more elsewhere?</h3>
                  <p className="text-slate-400 font-medium max-w-xl">
                    Traditional platforms take up to <span className="text-red-400 font-bold">20%</span>.
                    On EL SPACE, you keep more value while accessing better talent.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    Keep 95%+
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">of project value</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="freelancers" className="space-y-8 focus-visible:outline-none">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Monthly Earnings
                      </th>
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Commission
                      </th>
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">
                        Benefits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING_FREELANCER_TABLE.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-purple-50/30 transition-colors border-b border-slate-50 last:border-none">
                        <td className="px-8 py-8">
                          <p className="text-xl font-bold text-slate-900 mb-1">{row.size}</p>
                          <p className="text-sm font-bold text-slate-400">{row.range}</p>
                        </td>
                        <td className="px-8 py-8">
                          <p className="text-2xl font-black text-purple-600">{row.fee}</p>
                        </td>
                        <td className="px-8 py-8">
                          <p className="text-slate-600 font-medium">{row.example}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Callout */}
            <div className="rounded-[2.5rem] bg-slate-900 p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-purple-500/20" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black text-white">Your hard work, your money.</h3>
                  <p className="text-slate-400 font-medium max-w-xl">
                    Stop giving away <span className="text-red-400 font-bold">20%</span> of your sweat.
                    Our commissions decrease as you grow.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    Up to 95%
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">of your earnings</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { title: 'Secure Escrow', text: 'Payments are funded upfront and held safely.' },
            { title: 'Instant Payouts', text: 'Withdraw your earnings as soon as work is approved.' },
            { title: 'No Subscription', text: 'Free to join and apply. No monthly membership fees.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
