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

  useEffect(() => {
    if (user?.id) {
      fetchDisputes()
    }
  }, [user])

  const fetchDisputes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/disputes?userId=${user?.id}`)
      const data = await res.json()
      if (data.success) {
        setDisputes(data.disputes || [])
      }
    } catch (err) {
      console.error('Failed to fetch disputes')
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="max-w-5xl mx-auto space-y-8 text-foreground">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Incident <span className="text-destructive">Reports</span></h1>
          <p className="text-muted-foreground font-medium">Resolving technical and financial friction via Elite Mediation.</p>
        </div>

        <div className="space-y-4">
          {disputes.length > 0 ? disputes.map((dispute) => (
            <Card key={dispute.id} className="bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all group shadow-lg">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{dispute.reason}</h3>
                    <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
                      Project: {dispute.projects?.title || 'Unknown'} • Status: <span className="text-destructive">{dispute.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    Opened: {new Date(dispute.created_at).toLocaleDateString()}
                  </p>
                  <Button variant="link" className="text-primary p-0 h-auto mt-1 font-black text-xs uppercase tracking-widest">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="bg-card border border-border rounded-[2.5rem] p-12 text-center shadow-xl">
              <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <ShieldAlert className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Environment Clear</h3>
              <p className="text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">No active disputes detected in your workspace. Our escrow and milestone system is maintaining operational harmony.</p>
              <Button variant="outline" className="mt-8 border-border text-muted-foreground hover:text-foreground rounded-xl h-12 px-8">
                Contact Security Protocol
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
