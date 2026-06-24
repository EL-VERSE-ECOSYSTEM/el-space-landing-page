'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import Image from 'next/image'

function GitHubSuccessContent() {
  const router = useRouter()
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const token = searchParams.get('token')
      const userStr = searchParams.get('user')

      if (!token) {
        setError('No authentication token received')
        setTimeout(() => router.push('/auth/login?error=no_token'), 2000)
        return
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr)

          // Update auth context
          login(user, token)

          // Redirect based on user type
          setTimeout(() => {
            if (user?.user_type === 'freelancer' || user?.role === 'freelancer') {
              router.push('/freelancer/dashboard')
            } else {
              router.push('/client/dashboard')
            }
          }, 1000)
        } catch (e) {
          console.error('Failed to parse user info:', e)
          setError('Failed to process user information')
        }
      }
    } catch (err) {
      console.error('GitHub success error:', err)
      setError('An error occurred during authentication')
      setTimeout(() => router.push('/auth/login'), 2000)
    }
  }, [searchParams, router, login])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
       {/* Background Orbs */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-slate-700/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="text-center relative z-10 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary via-slate-500 to-slate-600 shadow-xl shadow-primary/20 mb-4">
          <span className="text-2xl font-black text-white">EL</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-4">
             <Loader className="w-8 h-8 animate-spin text-slate-700" />
             <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Authenticating</h1>
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">Syncing with GitHub Global Node</p>
        </div>

        {error && (
          <div className="mt-6 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] shadow-xl">
            <p className="text-red-500 font-black uppercase tracking-widest text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GitHubSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-slate-700 opacity-20" />
      </div>
    }>
      <GitHubSuccessContent />
    </Suspense>
  )
}
