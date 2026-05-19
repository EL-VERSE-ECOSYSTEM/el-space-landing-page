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
  Shield, Mail, Lock, ArrowRight, CheckCircle,
  ChevronLeft, Eye, EyeOff, Key
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1) // 1: Password, 2: OTP
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  })

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const data = await res.json()

      if (data.needsOTP) {
        // Now trigger the OTP send
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, type: 'login', password: formData.password })
        })
        setStep(2)
        toast.success('Security code sent to your email')
      } else if (data.error) {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success) {
        login(data.user)
        toast.success(`Welcome back, ${data.user.full_name}`)
        router.push(data.user.user_type === 'client' ? '/client/dashboard' : '/freelancer/dashboard')
      } else {
        toast.error(data.error || 'Verification failed')
      }
    } catch (err) {
      toast.error('Authentication error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pointer-events-none" />

      <Card className="w-full max-w-lg bg-slate-900/40 backdrop-blur-2xl border-white/5 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <CardContent className="p-10 md:p-14">
          {step === 1 ? (
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <div className="relative w-40 h-12 mx-auto mb-8">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Secure Sign In</h1>
                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">Premium Authentication</p>

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

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white/5 border-white/5 pl-12 h-14 text-white focus:border-cyan-500/50"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                      <Link href="/forgot-password" weights="bold" className="text-[10px] text-cyan-400 uppercase tracking-widest hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter secure password"
                        className="bg-white/5 border-white/5 pl-12 h-14 text-white focus:border-cyan-500/50"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 bg-white text-slate-950 hover:bg-cyan-400 hover:text-white font-black text-lg transition-all rounded-xl">
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <div className="relative py-4">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                   <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-500 tracking-widest">
                     <span className="bg-[#0f172a] px-4">Or Social Login</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Button variant="outline" className="border-white/5 bg-white/5 hover:bg-white/10 text-white h-12">
                     <Image src="/placeholder-logo.svg" alt="G" width={16} height={16} className="mr-2" /> Google
                   </Button>
                   <Button variant="outline" className="border-white/5 bg-white/5 hover:bg-white/10 text-white h-12">
                     <Shield className="w-4 h-4 mr-2" /> GitHub
                   </Button>
                </div>

                <p className="text-center text-slate-500 text-sm">
                  New to the platform? <Link href="/signup" className="text-cyan-400 font-bold hover:underline">Register here</Link>
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
                    <Key className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">2FA Challenge</h2>
                  <p className="text-slate-400 max-w-xs mx-auto">Please enter the security code sent to <span className="text-white font-bold">{formData.email}</span></p>
               </div>

               <form onSubmit={handleLogin} className="space-y-8">
                  <div className="flex justify-center gap-3">
                     <Input
                       placeholder="••••••"
                       className="w-full max-w-[240px] h-16 text-center text-3xl font-black tracking-[1em] bg-white/5 border-white/10 text-cyan-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                       maxLength={6}
                       value={formData.otp}
                       onChange={e => setFormData({...formData, otp: e.target.value})}
                       required
                     />
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg transition-all rounded-xl">
                      Verify & Access <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-center text-slate-500 text-xs">
                      Time-sensitive code expires in 15m. <button type="button" onClick={handlePasswordSubmit} className="text-cyan-400 font-bold hover:underline">Resend Code</button>
                    </p>
                  </div>
               </form>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-40">
         © 2026 EL VERSE TECHNOLOGIES
      </div>
    </div>
  )
}
