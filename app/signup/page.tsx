'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield, Mail, Lock, User, ArrowRight, CheckCircle,
  AlertCircle, ChevronLeft, Briefcase, Rocket, Eye, EyeOff
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [step, setStep] = useState(1) // 1: Info, 2: OTP
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    user_type: '' as 'client' | 'freelancer',
    otp: ''
  })

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.email || !formData.password || !formData.user_type) {
      toast.error('Please complete all fields and choose account type')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'register' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Verification code sent to your email')
        setStep(2)
      } else {
        toast.error(data.error || 'Failed to send verification code')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.otp.length < 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Account created successfully!')
        signup(data.user)
        router.push(data.user.user_type === 'client' ? '/client/dashboard' : '/freelancer/dashboard')
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch (err) {
      toast.error('System error during registration')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <Card className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-2xl border-white/5 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <CardContent className="p-8 md:p-12">
          {step === 1 ? (
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <div className="relative w-40 h-12 mx-auto mb-6">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Create Professional Identity</h1>
                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">Join the EL SPACE Network</p>

                <div className="flex justify-center gap-4 mt-8">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                       i === 1 ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' : 'border-white/5 text-slate-600'
                     }`}>
                       {i}
                     </div>
                   ))}
                </div>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="John Doe"
                        className="bg-white/5 border-white/5 pl-10 h-12 text-white focus:border-cyan-500/50"
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white/5 border-white/5 pl-10 h-12 text-white focus:border-cyan-500/50"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 chars"
                        className="bg-white/5 border-white/5 pl-10 h-12 text-white focus:border-cyan-500/50"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        className="bg-white/5 border-white/5 pl-10 h-12 text-white focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Choose Account Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'client', icon: Briefcase, label: 'Client', desc: 'HIRING TALENT' },
                      { id: 'freelancer', icon: Rocket, label: 'Freelancer', desc: 'FINDING WORK' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({...formData, user_type: type.id as any})}
                        className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                          formData.user_type === type.id
                          ? 'border-cyan-500 bg-cyan-500/5 ring-4 ring-cyan-500/10'
                          : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <type.icon className={`w-8 h-8 mb-4 transition-colors ${formData.user_type === type.id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                        <h4 className={`font-bold ${formData.user_type === type.id ? 'text-white' : 'text-slate-400'}`}>{type.label}</h4>
                        <p className="text-[10px] font-black text-slate-500 tracking-tighter uppercase mt-1">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full h-14 bg-white text-slate-950 hover:bg-cyan-400 hover:text-white font-black text-lg transition-all rounded-xl mt-4">
                  Secure Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-center text-slate-500 text-sm">
                  Already a member? <Link href="/login" className="text-cyan-400 font-bold hover:underline">Sign In</Link>
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               <button onClick={() => setStep(1)} className="flex items-center text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest">
                 <ChevronLeft className="w-4 h-4 mr-1" /> Back
               </button>

               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <Mail className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Verify Email</h2>
                  <p className="text-slate-400 max-w-xs mx-auto">We sent a 6-digit security code to <span className="text-white font-bold">{formData.email}</span></p>
               </div>

               <form onSubmit={handleSignup} className="space-y-8">
                  <div className="flex justify-center gap-3">
                     <Input
                       placeholder="••••••"
                       className="w-full max-w-[240px] h-16 text-center text-3xl font-black tracking-[1em] bg-white/5 border-white/10 text-cyan-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                       maxLength={6}
                       value={formData.otp}
                       onChange={e => setFormData({...formData, otp: e.target.value})}
                     />
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg transition-all rounded-xl">
                      Complete Registration <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-center text-slate-500 text-xs">
                      Didn't receive the code? <button type="button" onClick={handleSendOTP} className="text-cyan-400 font-bold hover:underline">Resend Security Code</button>
                    </p>
                  </div>
               </form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branding Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-40">
         <Shield className="w-5 h-5 text-slate-400" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AES-256 Bit Encryption Active</p>
      </div>
    </div>
  )
}
