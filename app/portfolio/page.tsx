'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Globe, Github, ExternalLink, Image as ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function PortfolioPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchPortfolio()
  }, [user])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio?userId=${user?.id}`)
      const data = await res.json()
      if (data.success) setItems(data.items || [])
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
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Professional <span className="text-cyan-500">Dossier</span></h1>
            <p className="text-slate-400 font-medium">Showcase your elite technical deployments.</p>
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-black h-12 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.length > 0 ? items.map((item) => (
            <Card key={item.id} className="bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden group hover:border-slate-700 transition-all">
              <div className="aspect-video relative bg-slate-800 flex items-center justify-center">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-700" />
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills?.map((skill: string) => (
                    <Badge key={skill} className="bg-slate-800 text-slate-400 border-none text-[10px] font-bold uppercase">{skill}</Badge>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-slate-800 border-slate-700 text-white font-bold h-10 rounded-lg">
                    <ExternalLink className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button variant="outline" size="icon" className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-500/10 h-10 w-10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="col-span-full py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
              <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Your dossier is empty. Time to showcase your work.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
