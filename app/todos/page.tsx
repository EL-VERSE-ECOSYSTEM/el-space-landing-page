'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  CheckCircle2, Circle, Plus, Trash2,
  ListTodo, Calendar, AlertCircle, Rocket
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard/auth-guard'

interface Todo {
  id: string
  name: string
  is_completed: boolean
  created_at: string
}

export default function TodosPage() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos?userId=${user?.id}`)
      const data = await response.json()
      if (data.success) {
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim() || !user) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: newTodo
        })
      })
      const data = await response.json()
      if (data.success) {
        setTodos([data.todo, ...todos])
        setNewTodo('')
        toast.success('Objective added to backlog.')
      }
    } catch (error) {
      toast.error('Failed to add objective.')
    }
  }

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todoId: id,
          isCompleted: !currentStatus
        })
      })
      if (response.ok) {
        setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t))
      }
    } catch (error) {
      toast.error('Sync error.')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id))
        toast.info('Objective removed.')
      }
    } catch (error) {
      toast.error('Removal failed.')
    }
  }

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-foreground pb-20">
        <main className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-foreground tracking-tighter flex items-center gap-4 uppercase">
                <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center shadow-2xl shadow-primary/20">
                  <ListTodo className="w-7 h-7 text-slate-700-foreground" />
                </div>
                Mission <span className="bg-gradient-to-r from-primary to-slate-500 bg-clip-text text-transparent">Backlog</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg font-medium">Strategic objective tracking and management</p>
            </div>
          </div>

          {/* Add Todo */}
          <Card className="bg-card border-border rounded-[2.5rem] p-8 shadow-2xl shadow-black/5">
             <form onSubmit={handleAddTodo} className="flex gap-4">
                <Input
                   value={newTodo}
                   onChange={(e) => setNewTodo(e.target.value)}
                   placeholder="Identify new strategic objective..."
                   className="bg-muted border-border h-16 text-foreground font-bold rounded-2xl px-6 focus:ring-primary/20"
                />
                <Button type="submit" className="bg-slate-700 text-slate-700-foreground hover:bg-slate-700/90 font-black px-10 rounded-2xl h-16 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                   <Plus className="w-6 h-6 mr-2" /> DEPLOY
                </Button>
             </form>
          </Card>

          {/* List */}
          <div className="space-y-4">
             {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-slate-700 border-t-transparent rounded-full"></div>
               </div>
             ) : todos.length > 0 ? todos.map((todo) => (
               <Card key={todo.id} className={`bg-card border-border rounded-[2rem] overflow-hidden transition-all group ${todo.is_completed ? 'opacity-40' : 'hover:border-slate-700/20 shadow-lg'}`}>
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <button
                           onClick={() => toggleTodo(todo.id, todo.is_completed)}
                           className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              todo.is_completed ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/20' : 'bg-muted text-muted-foreground hover:text-slate-700 border border-border'
                           }`}
                        >
                           {todo.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <div>
                           <p className={`text-xl font-black tracking-tight uppercase ${todo.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {todo.name}
                           </p>
                           <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground/40" />
                              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Added {new Date(todo.created_at).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </div>
                     <Button
                        onClick={() => deleteTodo(todo.id)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                     >
                        <Trash2 className="w-5 h-5" />
                     </Button>
                  </CardContent>
               </Card>
             )) : (
               <div className="text-center py-24 bg-card/50 border-2 border-dashed border-border rounded-[3rem] shadow-inner">
                  <Rocket className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Backlog Cleared</h3>
                  <p className="text-muted-foreground font-medium mt-2">No active objectives detected in your sector.</p>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
