import React from 'react';
import { HERO_CLIENT, HERO_FREELANCER } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Zap, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react'

export function Hero() {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-purple-50/30 py-16 md:py-24 lg:py-32">
      {/* Premium animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow top-right */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        {/* Purple glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        {/* Blue accent */}
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse animation-delay-1000" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* EL SPACE branding section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Zap className="w-4 h-4 text-cyan-500" />
              ✨ Trusted by 10,000+ Professionals
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent inline-block">EL</span>
            <span className="text-slate-900 ml-3">SPACE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 font-bold">
            Freelance Without the Friction
          </p>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Where top talent meets great opportunities. Escrow-protected payments, vetted professionals, instant payouts. Your next great project starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 mb-12">
          {/* Client Side */}
          <div className="group flex flex-col justify-center space-y-6 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="inline-block max-w-max rounded-full bg-cyan-500/10 px-4 py-2 border border-cyan-500/20">
              <span className="text-sm font-semibold text-cyan-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {HERO_CLIENT.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-slate-900 text-balance">
              {HERO_CLIENT.headline}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {HERO_CLIENT.subheadline}
            </p>
            
            {/* Quick Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-cyan-200 transition-all">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl mt-0.5 text-cyan-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Escrow Protection</p>
                  <p className="text-sm text-slate-500">100% payment secured</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-cyan-200 transition-all">
                <div className="p-2.5 bg-blue-500/10 rounded-xl mt-0.5 text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Instant Payouts</p>
                  <p className="text-sm text-slate-500">Get paid in minutes</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
              <p className="text-sm font-semibold text-cyan-700">
                {HERO_CLIENT.fee}
              </p>
            </div>
            <Link href="/auth/register" className="w-full pt-2">
              <Button
                size="lg"
                className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-lg py-7 rounded-2xl transition-all hover:shadow-xl hover:shadow-cyan-500/20 active:scale-95 group/btn"
              >
                {HERO_CLIENT.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Freelancer Side */}
          <div className="group flex flex-col justify-center space-y-6 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="inline-block max-w-max rounded-full bg-purple-500/10 px-4 py-2 border border-purple-500/20">
              <span className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {HERO_FREELANCER.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-slate-900 text-balance">
              {HERO_FREELANCER.headline}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {HERO_FREELANCER.subheadline}
            </p>

            {/* Quick Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-purple-200 transition-all">
                <div className="p-2.5 bg-purple-500/10 rounded-xl mt-0.5 text-purple-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Work You Love</p>
                  <p className="text-sm text-slate-500">Choose projects that excite you</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-purple-200 transition-all">
                <div className="p-2.5 bg-blue-500/10 rounded-xl mt-0.5 text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Secure Payments</p>
                  <p className="text-sm text-slate-500">Escrow-backed protection</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
              <p className="text-sm font-semibold text-purple-700">
                {HERO_FREELANCER.fee}
              </p>
            </div>
            <Link href="/auth/register" className="w-full pt-2">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-lg py-7 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 group/btn"
              >
                {HERO_FREELANCER.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* New Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-200">
          {[
            { label: 'Active Users', value: '10K+', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { label: 'Projects Done', value: '500+', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Paid Out', value: '$2M+', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Satisfaction', value: '98%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition-all shadow-sm">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
