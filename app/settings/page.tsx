'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Save, LogOut, Lock, Bell, Eye, EyeOff, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [userType] = useState<'client' | 'freelancer'>('client')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    companyName: '',
    website: '',
    language: 'English',
    timezone: 'America/New_York',
  })

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      setShowPasswordDialog(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navItems = [
    { label: 'Profile', href: '#profile' },
    { label: 'Security', href: '#security' },
    { label: 'Notifications', href: '#notifications' },
    { label: 'Billing', href: '#billing' },
  ]

  return (
    <DashboardLayout userType={userType} navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account preferences and privacy</p>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-slate-700">
            {['profile', 'security', 'notifications', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-b-cyan-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-8 space-y-6">
              {/* Avatar */}
              <div>
                <Label className="text-white mb-3 block">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                    {profileData.name.charAt(0)}
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200 mb-2 block">Full Name *</Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200 mb-2 block">Email Address *</Label>
                  <Input
                    value={profileData.email}
                    disabled
                    className="bg-slate-700 border-slate-600 text-slate-400"
                  />
                </div>
                <div>
                  <Label className="text-slate-200 mb-2 block">Phone Number</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200 mb-2 block">Website</Label>
                  <Input
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Bio/Description */}
              <div>
                <Label className="text-slate-200 mb-2 block">Bio</Label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200 mb-2 block">Language</Label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <Label className="text-slate-200 mb-2 block">Timezone</Label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  >
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Europe/Berlin</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </h3>
              </div>

              {/* Change Password */}
              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Password</h4>
                    <p className="text-sm text-slate-400">Change your password regularly to keep your account secure</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordDialog(true)}
                    className="border-slate-600 text-slate-300"
                  >
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Two Factor Authentication */}
              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              {/* Login Activity */}
              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-4">Recent Login Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">Last login today at 10:30 AM</p>
                      <p className="text-xs text-slate-500">San Francisco, CA • Chrome</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">Yesterday at 3:15 PM</p>
                      <p className="text-xs text-slate-500">San Francisco, CA • Safari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'New Messages', description: 'Get notified when you receive a message' },
                  { name: 'Project Updates', description: 'Receive updates about your projects' },
                  { name: 'Payment Notifications', description: 'Get notified about payments' },
                  { name: 'Application Updates', description: 'Receive updates about job applications' },
                  { name: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
                ].map((notif) => (
                  <div key={notif.name} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-700">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded bg-slate-600 border-slate-500"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{notif.name}</p>
                      <p className="text-sm text-slate-400">{notif.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
              </div>

              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 mb-4">No payment methods added yet.</p>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Add Payment Method
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter your current password and a new password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-200 mb-2 block">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label className="text-slate-200 mb-2 block">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-slate-200 mb-2 block">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Confirm new password"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
