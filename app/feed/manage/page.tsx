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
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/feed')} variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-black text-white tracking-tight text-transparent bg-gradient-to-r from-white to-slate-500 bg-clip-text">Nexus Analytics</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search community intel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white rounded-xl"
              />
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {filteredPosts.length} Entries Detected
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableHead className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Author</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Content Insight</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Engagement</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Timestamp</TableHead>
                <TableHead className="text-right text-slate-400 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-500 font-bold">Scanning Nexus Network...</TableCell></TableRow>
              ) : filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-cyan-400">
                        {(post.user?.full_name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{post.user?.full_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{post.user?.el_space_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-slate-300 text-sm truncate">{post.content}</p>
                    {post.media_type !== 'none' && (
                      <Badge className="mt-1 bg-cyan-500/10 text-cyan-400 border-none text-[8px] font-black uppercase">
                        {post.media_type} Attached
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-white font-black text-xs">{post.likes_count}</div>
                        <div className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xs">{post.comments_count}</div>
                        <div className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Msgs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xs">{post.reposts_count}</div>
                        <div className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Syncs</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs font-medium">
                    {new Date(post.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
