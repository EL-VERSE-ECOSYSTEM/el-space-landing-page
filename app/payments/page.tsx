'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, History, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react'

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchPayments()
  }, [user])

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/payments?userId=${user?.id}`)
      const data = await res.json()
      if (data.success) setPayments(data.payments || [])
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
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Global <span className="text-emerald-500">Ledger</span></h1>
          <p className="text-slate-400 font-medium">Historical audit of all network financial activity.</p>
        </div>

        <div className="space-y-4">
          {payments.length > 0 ? payments.map((p) => (
            <Card key={p.id} className="bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-700 transition-all group">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                    {p.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{p.description}</h3>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()} • {p.payment_type?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black tracking-tighter ${p.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {p.amount > 0 ? '+' : ''}${Math.abs(p.amount).toLocaleString()}
                  </p>
                  <Badge className={`mt-1 px-3 py-0.5 rounded-lg font-black text-[9px] uppercase tracking-widest ${
                    p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>{p.status}</Badge>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
              <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No financial operations detected.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
