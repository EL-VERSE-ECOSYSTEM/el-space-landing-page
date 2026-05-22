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
    <DashboardLayout userType={user?.user_type || 'freelancer'}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                  <ListTodo className="w-7 h-7 text-white" />
                </div>
                Mission <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Backlog</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-medium">Strategic objective tracking and management</p>
            </div>
          </div>

          {/* Add Todo */}
          <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
             <form onSubmit={handleAddTodo} className="flex gap-4">
                <Input
                   value={newTodo}
                   onChange={(e) => setNewTodo(e.target.value)}
                   placeholder="Identify new strategic objective..."
                   className="bg-slate-800 border-slate-700 h-16 text-white font-bold rounded-2xl px-6 focus:ring-cyan-500"
                />
                <Button type="submit" className="bg-white text-slate-950 hover:bg-cyan-500 hover:text-white font-black px-10 rounded-2xl h-16 transition-all shadow-xl shadow-slate-950">
                   <Plus className="w-6 h-6 mr-2" /> DEPLOY
                </Button>
             </form>
          </Card>

          {/* List */}
          <div className="space-y-4">
             {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
               </div>
             ) : todos.length > 0 ? todos.map((todo) => (
               <Card key={todo.id} className={`bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden transition-all group ${todo.is_completed ? 'opacity-50' : 'hover:border-slate-700'}`}>
                  <CardContent className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <button
                           onClick={() => toggleTodo(todo.id, todo.is_completed)}
                           className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              todo.is_completed ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 hover:text-cyan-400 border border-slate-700'
                           }`}
                        >
                           {todo.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div>
                           <p className={`text-xl font-black tracking-tight ${todo.is_completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                              {todo.name}
                           </p>
                           <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-slate-600" />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Added {new Date(todo.created_at).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </div>
                     <Button
                        onClick={() => deleteTodo(todo.id)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                     >
                        <Trash2 className="w-5 h-5" />
                     </Button>
                  </CardContent>
               </Card>
             )) : (
               <div className="text-center py-24 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
                  <Rocket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white">Backlog Cleared</h3>
                  <p className="text-slate-500 mt-2">No active objectives detected in your sector.</p>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
