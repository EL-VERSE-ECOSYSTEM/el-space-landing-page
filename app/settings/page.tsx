'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Save, LogOut, Lock, Bell, Eye, EyeOff, Upload, Moon, Sun, Monitor } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    email: '',
    phone_number: '',
    bio: '',
    location: '',
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email || '',
        phone_number: (user as any).phone_number || '',
        bio: (user as any).bio || '',
        location: (user as any).location || '',
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          updates: profileData
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        await updateUser(profileData)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Update failed')
      }
    } catch (err) {
      toast.error('Something went wrong')
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Command <span className="text-cyan-500">Center</span></h1>
          <p className="text-slate-400 font-medium">Manage your identity and interface preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Identity', icon: Lock },
              { id: 'appearance', label: 'Interface', icon: Moon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Full Name (Locked)</Label>
                      <Input value={user?.full_name || user?.name} disabled className="bg-slate-800 border-slate-700 text-slate-500 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Business Name (Locked)</Label>
                      <Input value={(user as any).business_name || 'N/A'} disabled className="bg-slate-800 border-slate-700 text-slate-500 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Email Address</Label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Phone Number</Label>
                      <Input
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Professional Bio</Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white rounded-xl min-h-[120px]"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-black h-14 rounded-2xl shadow-xl shadow-cyan-500/20"
                  >
                    {loading ? 'Synchronizing...' : 'Update Records'} <Save className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-white">Visual Deployment</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                          theme === t.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <t.icon className={`w-8 h-8 ${theme === t.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className={`font-bold ${theme === t.id ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
