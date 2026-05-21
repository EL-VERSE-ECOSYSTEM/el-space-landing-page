'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

interface GitHubSignInProps {
  onSuccess?: (token: string) => void
  onError?: (error: string) => void
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  fullWidth?: boolean
  text?: string
  className?: string
}

export function GitHubSignInButton({
  onSuccess,
  onError,
  size = 'default',
  variant = 'outline',
  fullWidth = false,
  text = 'Continue with GitHub',
  className = '',
}: GitHubSignInProps) {
  const [loading, setLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    setLoading(true)
    try {
      // Get GitHub OAuth URL
      const urlResponse = await fetch('/api/auth/github?action=url')
      const { url } = await urlResponse.json()

      if (!url) {
        throw new Error('Failed to get GitHub auth URL')
      }

      // Redirect to GitHub OAuth
      window.location.href = url
    } catch (error) {
      console.error('[GitHub Sign-In] Error:', error)
      const message = error instanceof Error ? error.message : 'Failed to initiate sign-in'
      toast.error(message)
      onError?.(message)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGitHubSignIn}
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
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.545 2.91 1.184.092-.923.35-1.545.636-1.9-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          {text}
        </>
      )}
    </Button>
  )
}
