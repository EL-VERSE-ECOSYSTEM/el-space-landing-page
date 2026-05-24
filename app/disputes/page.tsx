'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, MessageSquare, Clock, CheckCircle } from 'lucide-react'

export default function DisputesPage() {
  const { user } = useAuth()
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Incident <span className="text-red-500">Reports</span></h1>
          <p className="text-slate-400 font-medium">Resolving technical and financial friction via Elite Mediation.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Neutralized Environment</h3>
          <p className="text-slate-500 max-w-md mx-auto">No active disputes detected in your workspace. Our escrow and milestone system is maintaining operational harmony.</p>
          <Button variant="outline" className="mt-8 border-slate-800 text-slate-400 hover:text-white rounded-xl h-12 px-8">
            Contact Security Protocol
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
