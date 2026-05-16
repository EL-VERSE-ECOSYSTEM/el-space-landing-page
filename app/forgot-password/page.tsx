'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, CheckCircle, ShieldCheck, Loader, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
        toast.success('Recovery path initialized!')
      } else {
        toast.error(data.message || 'Verification failed')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo area */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/20">
            <span className="text-2xl font-black text-white">EL</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Account Recovery</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Restore Secure Access</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {isSubmitted ? (
            <div className="space-y-8 py-4">
              <div className="flex justify-center">
                 <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-10 h-10" />
                 </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Check Your Inbox</h3>
                <p className="text-slate-500 font-medium">
                  Verification link dispatched to:<br/>
                  <span className="text-cyan-600 font-bold">{email}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Steps</p>
                <div className="space-y-3">
                   {[
                     'Locate the recovery email',
                     'Follow the specialized link',
                     'Establish a new secure password'
                   ].map((step, i) => (
                     <div key={i} className="flex gap-3 items-center">
                        <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-black text-white">{i + 1}</div>
                        <p className="text-sm font-bold text-slate-600">{step}</p>
                     </div>
                   ))}
                </div>
              </div>

              <Link href="/login" className="block">
                <Button className="w-full h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-slate-200">
                  Return to Sign In
                </Button>
              </Link>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-cyan-600 transition-colors"
              >
                Didn&apos;t receive email? Resend
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Identify Account</h3>
                <p className="text-slate-500 font-medium">Enter your verified email to receive recovery instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-cyan-500/10 group"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing Request...
                    </span>
                  ) : (
                    "Initialize Recovery"
                  )}
                </Button>

                <Link href="/login" className="block">
                  <button
                    type="button"
                    className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Sign In
                  </button>
                </Link>
              </form>

              <div className="pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-3 p-4 bg-cyan-50/50 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" />
                    <p className="text-[10px] font-bold text-cyan-800 leading-tight">Your data is protected by multi-layered encryption during recovery.</p>
                 </div>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 EL VERSE TECHNOLOGIES</p>
        </div>
      </div>
    </div>
  )
}
