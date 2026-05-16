'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, DollarSign, Star, Zap } from 'lucide-react'

export function DashboardStats({ stats }: { stats: any }) {
  const items = [
    { label: 'Active Projects', value: stats?.activeProjects || '0', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Earned', value: `$${stats?.totalEarned || '0'}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Job Success', value: `${stats?.jobSuccess || '100'}%`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Profile Views', value: stats?.profileViews || '0', icon: Zap, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <Card key={i} className="border-2 border-slate-50 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <item.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-3xl font-black text-slate-900">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
