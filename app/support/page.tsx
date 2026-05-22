'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  HelpCircle, MessageSquare, Shield,
  LifeBuoy, Mail, Phone, Zap,
  ChevronRight, ArrowLeft, Send, CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SupportHub() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          name: 'Support User'
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast.success('Your message has been received by our response team.')
      } else {
        toast.error('Failed to transmit intel. Please try again.')
      }
    } catch (err) {
      toast.error('Connection failure to Support Nexus')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-lg bg-slate-900 border-slate-800 rounded-[3rem] p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-white" />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">Request Logged</h2>
              <p className="text-slate-400 font-medium">An EL SPACE operative will analyze your inquiry and respond within <span className="text-white font-black">2-4 business hours</span>.</p>
           </div>
           <Button onClick={() => router.push('/dashboard')} className="w-full bg-white text-slate-950 hover:bg-slate-200 font-black h-14 rounded-2xl">
              Back to Nexus
           </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/2 -right-24 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="h-24 bg-slate-950/50 backdrop-blur-xl border-b border-slate-900 flex items-center justify-between px-12 relative z-50">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">
            <ArrowLeft className="w-4 h-4" /> Back
         </button>
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
               <span className="text-slate-950 font-black text-sm">EL</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">SUPPORT</span>
         </div>
         <div className="w-20" /> {/* Spacer */}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-20 items-start">
         <div className="space-y-12">
            <div className="space-y-6">
               <h1 className="text-7xl font-black text-white tracking-tighter leading-tight">
                  How can we <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">optimize</span> your experience?
               </h1>
               <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
                  Our tactical response team is standing by to resolve technical anomalies and platform inquiries.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2rem] group hover:border-cyan-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                     <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-black tracking-tight text-lg">Email Protocol</h4>
                  <p className="text-slate-500 font-medium text-sm mt-1 mb-4">support@elspace.tech</p>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-cyan-400 transition-all" />
               </Card>
               <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2rem] group hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                     <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-white font-black tracking-tight text-lg">Live Comms</h4>
                  <p className="text-slate-500 font-medium text-sm mt-1 mb-4">Available 09:00 - 18:00 UTC</p>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-purple-400 transition-all" />
               </Card>
            </div>

            <div className="flex items-center gap-6 p-6 bg-slate-900/50 rounded-[2rem] border border-slate-800">
               <div className="w-10 h-10 rounded-full bg-emerald-500 animate-pulse" />
               <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">System Status: Optimal</p>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Global response time: 14 mins</p>
               </div>
            </div>
         </div>

         <Card className="bg-slate-900 border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Identifier (Email)</label>
                     <Input
                        name="email"
                        required
                        type="email"
                        placeholder="you@domain.com"
                        className="bg-slate-800 border-slate-700 h-16 text-white font-bold rounded-2xl px-6 focus:ring-cyan-500"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Protocol</label>
                     <Input
                        name="subject"
                        required
                        placeholder="Technical Anomaly, Billing, etc."
                        className="bg-slate-800 border-slate-700 h-16 text-white font-bold rounded-2xl px-6 focus:ring-cyan-500"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Intelligence</label>
                     <Textarea
                        name="message"
                        required
                        placeholder="Please describe the situation in detail..."
                        className="bg-slate-800 border-slate-700 min-h-[160px] text-white font-bold rounded-2xl p-6 focus:ring-cyan-500"
                     />
                  </div>
               </div>

               <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-black h-16 rounded-2xl text-xl shadow-xl shadow-cyan-500/20 transition-all"
               >
                  {loading ? 'Transmitting...' : 'Transmit Intel'} <Send className="w-5 h-5 ml-3" />
               </Button>

               <div className="flex items-center gap-3 justify-center text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                  <Shield className="w-4 h-4" /> Fully Encrypted Submission
               </div>
            </form>
         </Card>
      </main>

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12 border-t border-slate-900">
         {[
           { icon: Zap, title: 'Rapid Response', desc: 'Average ticket resolution time under 2 hours.' },
           { icon: LifeBuoy, title: 'Expert Support', desc: 'Talk to real engineers, not scripted bots.' },
           { icon: Shield, title: 'Identity Protection', desc: 'Secure verification protocols for all sensitive requests.' }
         ].map((item, i) => (
           <div key={i} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                 <item.icon className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-white font-black text-xl tracking-tight">{item.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </section>
    </div>
  )
}
