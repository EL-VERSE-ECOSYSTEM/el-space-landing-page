import React from 'react';
import { HERO_CLIENT, HERO_FREELANCER } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Zap, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react'

export function Hero() {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5 py-16 md:py-24 lg:py-32">
      {/* Premium animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow top-right */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        {/* Purple glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        {/* Blue accent */}
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-[100px] animate-pulse animation-delay-1000" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* EL SPACE branding section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-primary/30 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Zap className="w-4 h-4 text-primary" />
              ✨ Trusted by 10,000+ Professionals
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-slate-500 to-accent bg-clip-text text-transparent inline-block">EL</span>
            <span className="text-foreground ml-3">SPACE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 font-bold">
            Freelance Without the Friction
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where top talent meets great opportunities. Escrow-protected payments, vetted professionals, instant payouts. Your next great project starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 mb-12">
          {/* Client Side */}
          <div className="group flex flex-col justify-center space-y-6 p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <div className="inline-block max-w-max rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Users className="w-4 h-4" />
                {HERO_CLIENT.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground text-balance">
              {HERO_CLIENT.headline}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {HERO_CLIENT.subheadline}
            </p>
            
            {/* Quick Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-primary/20 transition-all">
                <div className="p-2.5 bg-primary/10 rounded-xl mt-0.5 text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Escrow Protection</p>
                  <p className="text-sm text-muted-foreground">100% payment secured</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-primary/20 transition-all">
                <div className="p-2.5 bg-slate-500/10 rounded-xl mt-0.5 text-slate-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Instant Payouts</p>
                  <p className="text-sm text-muted-foreground">Get paid in minutes</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary">
                {HERO_CLIENT.fee}
              </p>
            </div>
            <Link href="/auth/register" className="w-full pt-2">
              <Button
                size="lg"
                className="w-full bg-foreground hover:bg-primary text-background font-bold text-lg py-7 rounded-2xl transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-95 group/btn"
              >
                {HERO_CLIENT.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Freelancer Side */}
          <div className="group flex flex-col justify-center space-y-6 p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10">
            <div className="inline-block max-w-max rounded-full bg-accent/10 px-4 py-2 border border-accent/20">
              <span className="text-sm font-semibold text-accent flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {HERO_FREELANCER.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground text-balance">
              {HERO_FREELANCER.headline}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {HERO_FREELANCER.subheadline}
            </p>

            {/* Quick Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-accent/20 transition-all">
                <div className="p-2.5 bg-accent/10 rounded-xl mt-0.5 text-accent">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Work You Love</p>
                  <p className="text-sm text-muted-foreground">Choose projects that excite you</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border group-hover:border-accent/20 transition-all">
                <div className="p-2.5 bg-slate-500/10 rounded-xl mt-0.5 text-slate-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Secure Payments</p>
                  <p className="text-sm text-muted-foreground">Escrow-backed protection</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm font-semibold text-accent">
                {HERO_FREELANCER.fee}
              </p>
            </div>
            <Link href="/auth/register" className="w-full pt-2">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary via-slate-500 to-accent hover:opacity-90 text-background font-bold text-lg py-7 rounded-2xl transition-all hover:shadow-xl hover:shadow-slate-500/30 active:scale-95 group/btn"
              >
                {HERO_FREELANCER.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* New Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border">
          {[
            { label: 'Active Users', value: '10K+', color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Projects Done', value: '500+', color: 'text-slate-500', bg: 'bg-slate-500/10' },
            { label: 'Paid Out', value: '$2M+', color: 'text-accent', bg: 'bg-accent/10' },
            { label: 'Satisfaction', value: '98%', color: 'text-slate500', bg: 'bg-slate500/10' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all shadow-sm">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
