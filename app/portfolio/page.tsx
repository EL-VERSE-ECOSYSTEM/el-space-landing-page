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
      <div className="max-w-6xl mx-auto space-y-8 text-foreground">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Professional <span className="text-slate-700">Dossier</span></h1>
            <p className="text-muted-foreground font-medium">Showcase your elite technical deployments.</p>
          </div>
          <Button className="bg-slate-700 hover:opacity-90 text-slate-700-foreground font-black h-12 rounded-2xl border-none">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.length > 0 ? items.map((item) => (
            <Card key={item.id} className="bg-card border-border rounded-[2rem] overflow-hidden group hover:border-slate-700/30 transition-all shadow-lg">
              <div className="aspect-video relative bg-muted flex items-center justify-center">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-black text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills?.map((skill: string) => (
                    <Badge key={skill} className="bg-muted text-muted-foreground border-none text-[10px] font-bold uppercase">{skill}</Badge>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-card border-border text-foreground font-bold h-10 rounded-lg hover:bg-muted">
                    <ExternalLink className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button variant="outline" size="icon" className="bg-card border-border text-destructive hover:bg-destructive/10 h-10 w-10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="col-span-full py-24 text-center bg-card border-2 border-dashed border-border rounded-[3rem] shadow-inner">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold">Your dossier is empty. Time to showcase your work.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
