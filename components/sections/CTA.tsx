import React from 'react';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-slate-900 relative overflow-hidden">
      {/* Decorative gradient backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card/30 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 md:p-16 text-center space-y-10 shadow-2xl">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white text-balance tracking-tight">
              Ready to Transform Your<br />
              <span className="bg-gradient-to-r from-slate-400 via-slate-400 to-slate-400 bg-clip-text text-transparent">
                Freelance Journey?
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of talented freelancers and forward-thinking clients already using EL SPACE to build the future together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-white hover:bg-slate-50 text-slate-900 font-black text-lg px-10 py-8 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 group"
              >
                Post a Job Today <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white font-black text-lg px-10 py-8 rounded-[2rem] transition-all"
              >
                Apply as Freelancer
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-4">
            {[
              'No credit card required',
              'Free to post',
              'Global payments',
              'Verified talent'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-sm font-bold text-slate-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
