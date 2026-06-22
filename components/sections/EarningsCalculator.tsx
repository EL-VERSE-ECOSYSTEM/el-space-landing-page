'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function EarningsCalculator() {
  const [projectValue, setProjectValue] = useState(5000)
  const [userType, setUserType] = useState<'freelancer' | 'client'>('freelancer')

  // Calculate fees
  const calculateFee = (amount: number, userType: 'freelancer' | 'client') => {
    let fee = 0
    if (amount < 500) {
      fee = userType === 'freelancer' ? 9 : 19
    } else if (amount < 5000) {
      fee = amount * 0.05
    } else {
      fee = amount * 0.03
    }
    return fee
  }

  const fee = calculateFee(projectValue, userType)
  const earnings = userType === 'freelancer' ? projectValue - fee : projectValue + fee

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          heading="How Much Will You Make (or Pay)?"
          subheading="Earnings Calculator"
          description="Calculate your take-home earnings or see what you'll pay as a client with our transparent fee structure."
        />

        <div className="rounded-[3rem] border border-slate-200 bg-white p-8 md:p-16 shadow-2xl shadow-slate-200/50">
          <Tabs value={userType} onValueChange={(val) => setUserType(val as 'freelancer' | 'client')} className="w-full mb-12">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-2xl h-14">
                <TabsTrigger
                  value="freelancer"
                  className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate600 data-[state=active]:shadow-sm"
                >
                  Freelancer View
                </TabsTrigger>
                <TabsTrigger
                  value="client"
                  className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm"
                >
                  Client View
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {/* Slider */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Project Value
              </label>
              <span className="text-4xl font-black text-slate-900">${projectValue.toLocaleString()}</span>
            </div>
            <Slider
              value={[projectValue]}
              onValueChange={(val) => setProjectValue(val[0])}
              min={100}
              max={20000}
              step={100}
              className="w-full"
            />
            <div className="mt-4 flex justify-between text-xs font-bold text-slate-400">
              <span>$100</span>
              <span>$20,000</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100">
              <p className="mb-2 text-xs font-black text-slate-400 uppercase tracking-widest">EL SPACE Fee</p>
              <p className="text-3xl font-black text-slate-900">
                ${fee.toFixed(2)}
              </p>
              <p className="mt-4 text-sm font-bold text-slate-400 leading-relaxed">
                Covers escrow, dispute resolution, and 24/7 support.
              </p>
            </div>

            <div className={`rounded-[2rem] p-8 transition-all shadow-xl shadow-${userType === 'freelancer' ? 'purple' : 'cyan'}-500/10 border border-${userType === 'freelancer' ? 'purple' : 'cyan'}-100 bg-${userType === 'freelancer' ? 'purple' : 'cyan'}-50`}>
              <p className="mb-2 text-xs font-black text-slate-400 uppercase tracking-widest">{userType === 'freelancer' ? 'You Take Home' : 'Total Client Cost'}</p>
              <p className={`text-4xl font-black ${userType === 'freelancer' ? 'text-slate600' : 'text-slate-600'}`}>
                ${earnings.toFixed(2)}
              </p>
              <p className="mt-4 text-sm font-bold text-slate-900">
                That&apos;s {userType === 'freelancer' ? (earnings / projectValue * 100).toFixed(1) : (fee / projectValue * 100).toFixed(1)}% {userType === 'freelancer' ? 'of the project value' : 'above project cost'}
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-12 pt-12 border-t border-slate-100">
            <p className="mb-8 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Compare to Competitors
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Upwork', fee: '20%', color: 'text-slate-400' },
                { name: 'Fiverr', fee: '20%', color: 'text-slate-400' },
                { name: 'EL SPACE', fee: '3-5%', color: 'text-slate-600 font-black' }
              ].map((plat, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900">{plat.name}</span>
                  <span className={`text-lg ${plat.color}`}>{plat.fee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
