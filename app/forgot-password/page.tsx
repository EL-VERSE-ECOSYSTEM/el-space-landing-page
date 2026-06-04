'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
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
        toast.success('Password reset email sent!')
      } else {
        toast.error(data.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="bg-card/80 backdrop-blur-xl border-border shadow-2xl">
            <CardContent className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary to-blue-600 rounded-full p-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-foreground">Check Your Email</h2>
                <p className="text-muted-foreground">
                  We&apos;ve sent a password reset link to <span className="text-primary font-black">{email}</span>
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3 text-left">
                <p className="text-sm text-foreground font-black uppercase tracking-widest">Next steps:</p>
                <ol className="text-sm text-muted-foreground space-y-2 font-medium">
                  <li className="flex gap-3">
                    <span className="text-primary font-black">01</span> Check your email inbox
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-black">02</span> Click the reset link
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-black">03</span> Create a new password
                  </li>
                </ol>
              </div>

              <p className="text-xs text-muted-foreground font-medium">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:text-primary/80 font-black transition-colors"
                >
                  Try Again
                </button>
              </p>

              <Link href="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-xl">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo area */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary via-blue-600 to-purple-700 shadow-xl shadow-primary/20 transition-transform hover:scale-110">
            <span className="text-2xl font-black text-white">EL</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">Reset Password</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Premium Recovery Protocol</p>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-border shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-foreground text-2xl font-black">Identify Account</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl font-bold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitting...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {/* Back to login */}
              <Link href="/auth/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 font-black text-xs uppercase tracking-widest h-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Matrix
                </Button>
              </Link>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 rounded-2xl bg-muted/50 border border-border">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter text-center">
                🔒 Secure transmission active. Check your email within 5 minutes.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          <p>© 2026 EL VERSE TECHNOLOGIES</p>
        </div>
      </div>
    </div>
  )
}
