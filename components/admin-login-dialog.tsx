'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export function AdminLoginDialog() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = 'Elspace12345@'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'true')
      localStorage.setItem('adminLoginTime', new Date().getTime().toString())
      toast.success('Admin access granted')
      setPassword('')
      setOpen(false)
      router.push('/admin')
    } else {
      toast.error('Invalid password')
      setPassword('')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-slate-400 hover:text-slate-300 transition-colors opacity-100 inline-flex items-center gap-1 font-semibold">
          <Lock className="w-3 h-3" />
          Admin
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
          <DialogDescription>
            Enter the admin password to access the dashboard
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
