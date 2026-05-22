'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Briefcase, Plus, Trash2, ExternalLink,
  Image as ImageIcon, Layout, Zap, Rocket,
  ChevronRight, Globe, Layers
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Badge } from '@/components/ui/badge'

interface PortfolioItem {
  id: string
  title: string
  description: string
  image_url?: string
  project_url?: string
  skills: string[]
  created_at: string
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  // New Item State
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    project_url: '',
    image_url: '',
    skills: ''
  })

  useEffect(() => {
    if (user) {
      fetchPortfolio()
    }
  }, [user])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolio?userId=${user?.id}`)
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.title.trim() || !user) return

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newItem,
          skills: newItem.skills.split(',').map(s => s.trim()).filter(s => s)
        })
      })
      const data = await response.json()
      if (data.success) {
        setItems([data.item, ...items])
        setNewItem({ title: '', description: '', project_url: '', image_url: '', skills: '' })
        setShowAdd(false)
        toast.success('Mission accomplished. Project added to portfolio.')
      }
    } catch (error) {
      toast.error('Strategic failure. Could not add project.')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setItems(items.filter(i => i.id !== id))
        toast.info('Intelligence removed from archive.')
      }
    } catch (error) {
      toast.error('Purge failed.')
    }
  }

  return (
    <DashboardLayout userType={user?.user_type || 'freelancer'}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                  <Layout className="w-7 h-7 text-white" />
                </div>
                Professional <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Dossier</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-medium">Showcase your technical achievements and tactical deployments</p>
            </div>
            <Button onClick={() => setShowAdd(!showAdd)} className="bg-white text-slate-950 hover:bg-slate-200 font-black px-8 h-12 rounded-xl">
               {showAdd ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Record Project</>}
            </Button>
          </div>

          {/* Add Form */}
          {showAdd && (
            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
               <form onSubmit={handleAddItem} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Title</label>
                           <Input
                              required
                              value={newItem.title}
                              onChange={e => setNewItem({...newItem, title: e.target.value})}
                              placeholder="e.g. NextGen Nexus Platform"
                              className="bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tech Stack (comma separated)</label>
                           <Input
                              value={newItem.skills}
                              onChange={e => setNewItem({...newItem, skills: e.target.value})}
                              placeholder="React, TypeScript, AWS"
                              className="bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Live Intelligence (URL)</label>
                           <Input
                              value={newItem.project_url}
                              onChange={e => setNewItem({...newItem, project_url: e.target.value})}
                              placeholder="https://project.com"
                              className="bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl"
                           />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Debrief (Description)</label>
                           <Textarea
                              value={newItem.description}
                              onChange={e => setNewItem({...newItem, description: e.target.value})}
                              placeholder="Describe the challenges overcome and technical solutions implemented..."
                              className="bg-slate-800 border-slate-700 min-h-[168px] text-white font-medium rounded-xl p-4"
                           />
                        </div>
                        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black h-14 rounded-xl shadow-xl shadow-purple-500/20">
                           ARCHIVE PROJECT <Rocket className="w-5 h-5 ml-2" />
                        </Button>
                     </div>
                  </div>
               </form>
            </Card>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {loading ? (
               <div className="col-span-full flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
               </div>
             ) : items.length > 0 ? items.map((item) => (
               <Card key={item.id} className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden group hover:border-purple-500/30 transition-all">
                  <div className="aspect-video bg-slate-800 flex items-center justify-center relative overflow-hidden">
                     {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     ) : (
                        <div className="text-slate-700 flex flex-col items-center gap-4">
                           <ImageIcon className="w-16 h-16" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visual Intelligence Pending</span>
                        </div>
                     )}
                     <div className="absolute top-6 right-6">
                        <Button
                           onClick={() => deleteItem(item.id)}
                           variant="ghost"
                           size="icon"
                           className="bg-black/50 backdrop-blur-md text-white hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
                  <CardContent className="p-10 space-y-6">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-purple-400 transition-colors">{item.title}</h3>
                        <div className="flex flex-wrap gap-2">
                           {item.skills.map(skill => (
                             <Badge key={skill} className="bg-slate-800 text-slate-400 border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">
                                {skill}
                             </Badge>
                           ))}
                        </div>
                     </div>

                     <p className="text-slate-400 font-medium leading-relaxed line-clamp-3">
                        {item.description}
                     </p>

                     <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-4">
                           {item.project_url && (
                             <a href={item.project_url} target="_blank" className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest hover:text-cyan-300 transition-all">
                                <Globe className="w-4 h-4" /> Live Protocol
                             </a>
                           )}
                        </div>
                        <Button variant="ghost" className="text-slate-500 hover:text-white font-black group-hover:translate-x-2 transition-all">
                           Analysis <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                     </div>
                  </CardContent>
               </Card>
             )) : (
               <div className="col-span-full py-32 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[4rem]">
                  <Layers className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                  <p className="text-slate-500 font-black text-2xl">Archive Empty</p>
                  <p className="text-slate-600 font-medium mt-2">No technical deployments recorded in your permanent record.</p>
                  <Button onClick={() => setShowAdd(true)} className="mt-10 bg-white text-slate-950 font-black h-14 rounded-xl px-10">Record First Mission</Button>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
