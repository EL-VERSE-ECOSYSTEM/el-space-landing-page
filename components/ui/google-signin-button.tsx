'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

interface GoogleSignInProps {
  onSuccess?: (token: string) => void
  onError?: (error: string) => void
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  fullWidth?: boolean
  text?: string
  className?: string
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  size = 'default',
  variant = 'outline',
  fullWidth = false,
  text = 'Continue with Google',
  className = '',
}: GoogleSignInProps) {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      // Get Google OAuth URL
      const urlResponse = await fetch('/api/auth/google?action=url')
      const { url } = await urlResponse.json()

      if (!url) {
        throw new Error('Failed to get Google auth URL')
      }

      // Redirect to Google OAuth
      window.location.href = url
    } catch (error) {
      console.error('[Google Sign-In] Error:', error)
      const message = error instanceof Error ? error.message : 'Failed to initiate sign-in'
      toast.error(message)
      onError?.(message)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      variant={variant}
      size={size as any}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
          {text}
        </>
      )}
    </Button>
  )
}

export default GoogleSignInButton
