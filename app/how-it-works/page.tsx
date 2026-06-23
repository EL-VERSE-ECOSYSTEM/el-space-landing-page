import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { HowItWorksClients, HowItWorksFreelancers } from '@/components/sections/HowItWorks'
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* Decorative Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="text-center mb-20 relative z-10">
          <h1 className="text-6xl font-black mb-6 tracking-tight text-foreground uppercase">
            How <span className="bg-gradient-to-r from-slate-600 via-slate-600 to-slate600 bg-clip-text text-transparent">EL SPACE</span> Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The friction-less ecosystem for the world&apos;s top tech talent and most ambitious companies.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-16 flex justify-center gap-4 relative z-10">
          <button className="px-8 py-3 bg-primary text-primary-foreground shadow-xl shadow-primary/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            Client Hub
          </button>
          <button className="px-8 py-3 bg-muted text-muted-foreground rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-muted/80 hover:text-foreground">
            Freelancer Hub
          </button>
        </div>

        {/* How It Works for Clients */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center uppercase tracking-tight">Clients Process</h2>
          <HowItWorksClients />
        </section>

        {/* Divider */}
        <div className="border-t border-border my-16"></div>

        {/* How It Works for Freelancers */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center uppercase tracking-tight">Freelancers Process</h2>
          <HowItWorksFreelancers />
        </section>

        {/* Key Features Section */}
        <section className="mb-24 relative z-10">
          <h2 className="text-4xl font-black text-foreground mb-12 text-center tracking-tight uppercase">The EL SPACE Edge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: 'Secure Escrow', desc: 'Enterprise-grade payment protection for every milestone.' },
              { icon: '⚡', title: 'Instant Liquidity', desc: 'Get paid immediately upon approval. No net-30 wait times.' },
              { icon: '💎', title: 'Top 1% Talent', desc: 'Rigorous vetting process ensures elite quality for every hire.' },
              { icon: '💬', title: 'Contextual Chat', desc: 'Direct, real-time communication built into the workspace.' },
              { icon: '🎯', title: 'Precision Milestones', desc: 'Granular project tracking for maximum accountability.' },
              { icon: '⭐', title: 'Verified Reputation', desc: 'Transparent history and peer-reviewed work quality.' }
            ].map((feature, i) => (
              <div key={i} className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all group duration-500">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border border-border rounded-[3rem] p-16 text-center mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-slate500/10 pointer-events-none" />
          <h2 className="text-5xl font-black text-foreground mb-6 relative z-10 tracking-tight uppercase">Ready to transcend?</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl font-medium relative z-10">
            Join the decentralized workforce where quality is the only currency that matters.
          </p>
          <div className="flex gap-6 justify-center flex-wrap relative z-10">
            <Link
              href="/auth/register"
              className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 uppercase tracking-widest text-sm"
            >
              Post a Project
            </Link>
            <Link
              href="/auth/register"
              className="px-10 py-5 border-2 border-border text-foreground font-black rounded-2xl transition-all hover:bg-muted uppercase tracking-widest text-sm"
            >
              Browse Network
            </Link>
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-border">
          <Link
            href="/"
            className="text-primary hover:opacity-80 transition-opacity"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
