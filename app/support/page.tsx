import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { Shield, MessageSquare, Mail, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Elite <span className="text-cyan-600">Assistance</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Dedicated support for high-performance teams and talent. Our protocols ensure your operations remain uninterrupted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: Shield, title: 'Security Ops', desc: 'Report account anomalies or financial friction points.' },
            { icon: MessageSquare, title: 'Direct Comms', desc: 'Chat with our elite mediation experts for dispute resolution.' },
            { icon: Mail, title: 'Ticket System', desc: 'Open a standard support inquiry for general platform questions.' },
            { icon: Zap, title: 'Priority Lane', desc: 'Instant support response for Elite Access holders.' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <item.icon className="w-12 h-12 text-cyan-600 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
           <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-6">Need immediate intervention?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium">Our global operations team is online 24/7 to maintain ecosystem integrity.</p>
              <Button className="h-16 bg-white text-slate-900 font-black px-12 rounded-2xl hover:bg-cyan-400 hover:text-white transition-all uppercase tracking-widest text-sm">
                 Initialize Live Support
              </Button>
           </div>
        </div>

        <div className="mt-16 text-center">
           <Link href="/" className="text-slate-400 hover:text-cyan-600 font-bold text-sm transition-colors">
              ← Return to Nexus Home
           </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Button({ children, className, ...props }: any) {
  return (
    <button className={`inline-flex items-center justify-center transition-colors ${className}`} {...props}>
      {children}
    </button>
  )
}
