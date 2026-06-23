import React from 'react';
import { ECOSYSTEM_BRANDS } from '@/lib/constants'

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Part of the EL VERSE Ecosystem
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {ECOSYSTEM_BRANDS.map((brand) => (
            <div
              key={brand}
              className="group flex items-center transition-all duration-300 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
            >
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group-hover:bg-gradient-to-r group-hover:from-slate-500 group-hover:to-slate-600 group-hover:bg-clip-text group-hover:text-transparent">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
