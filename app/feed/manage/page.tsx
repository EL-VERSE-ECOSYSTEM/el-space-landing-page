'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowLeft, MoreHorizontal, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FeedManagePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(p =>
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="space-y-8 text-foreground">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/feed')} variant="ghost" className="text-muted-foreground hover:text-foreground rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">Nexus <span className="text-slate-700">Analytics</span></h1>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
          <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter network intel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-background border-border text-foreground rounded-2xl h-12 focus:ring-primary/20"
              />
            </div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {filteredPosts.length} Active Nodes Detected
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14 px-8">Origin Author</TableHead>
                  <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14">Data Payload</TableHead>
                  <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14">Impact Factor</TableHead>
                  <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14">Sync Time</TableHead>
                  <TableHead className="text-right text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14 px-8">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-24 text-muted-foreground font-black uppercase tracking-widest text-[10px] animate-pulse">Scouting Nexus Grid...</TableCell></TableRow>
                ) : filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-border hover:bg-muted/30 transition-colors group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-700/10 flex items-center justify-center text-xs font-black text-slate-700 border border-slate-700/20 shadow-inner">
                          {(post.user?.full_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <div className="text-foreground font-black text-sm uppercase tracking-tight">{post.user?.full_name}</div>
                          <div className="text-[10px] text-muted-foreground font-bold tracking-widest">{post.user?.el_space_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs py-6">
                      <p className="text-muted-foreground text-sm font-medium line-clamp-1">{post.content}</p>
                      {post.media_type !== 'none' && (
                        <Badge className="mt-2 bg-slate-700/5 text-slate-700 border border-slate-700/10 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          {post.media_type} Encoded
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell py-6>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <div className="text-foreground font-black text-xs">{post.likes_count}</div>
                          <div className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-foreground font-black text-xs">{post.comments_count}</div>
                          <div className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">Msgs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-foreground font-black text-xs">{post.reposts_count}</div>
                          <div className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">Syncs</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[10px] font-bold uppercase py-6">
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right px-8 py-6">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-slate-700 hover:bg-slate-700/10 rounded-xl">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
