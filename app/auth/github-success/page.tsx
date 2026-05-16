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
        setTimeout(() => router.push('/login?error=no_token'), 2000)
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
              router.push('/dashboard/freelancer')
            } else {
              router.push('/dashboard/client')
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
      setTimeout(() => router.push('/login'), 2000)
    }
  }, [searchParams, router, login])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
       {/* Background Orbs */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="text-center relative z-10 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/20 mb-4">
          <span className="text-2xl font-black text-white">EL</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
             <Loader className="w-6 h-6 animate-spin text-cyan-600" />
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Authenticating</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with GitHub Securely</p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GitHubSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-slate-200" />
      </div>
    }>
      <GitHubSuccessContent />
    </Suspense>
  )
}
