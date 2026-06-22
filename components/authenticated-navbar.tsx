'use client'
import Image from 'next/image';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X, LogOut, Settings, User, Wallet, MessageSquare, Bell, MoreVertical } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const PUBLIC_NAV_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Browse Freelancers', href: '/freelancers' },
]

const AUTHENTICATED_NAV_LINKS = [
  { label: 'Browse', href: '/freelancers', icon: '🔍' },
  { label: 'Messages', href: '/messages', icon: '💬' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
  { label: 'Feed', href: '/feed', icon: '📰' },
]

const USER_MENU_ITEMS = [
  { label: 'Dashboard', href: '/client/dashboard', icon: 'dashboard' },
  { label: 'My Projects', href: '/jobs', icon: 'projects' },
  { label: 'My Profile', href: '/freelancer/[id]', icon: 'user' },
  { label: 'Applications', href: '/applications', icon: 'briefcase' },
  { label: 'Earnings', href: '/earnings', icon: 'dollar' },
  { label: 'Wallet', href: '/wallet', icon: 'wallet' },
  { label: 'Milestones', href: '/milestones', icon: 'target' },
  { label: 'Disputes', href: '/disputes', icon: 'alert' },
  { label: 'Reviews', href: '/reviews', icon: 'star' },
  { label: 'Payments', href: '/payments', icon: 'credit' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
]

export function AuthenticatedNavbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    // logout() already handles redirection to '/' in auth-provider.tsx
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-500/20 bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/client/dashboard" className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="EL SPACE"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-400 to-slate-400 bg-clip-text text-transparent sm:inline-block">
              EL SPACE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {AUTHENTICATED_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-slate-400 hover:bg-slate-500/10"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Actions */}
            <Link href="/wallet">
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:text-slate400 hover:bg-slate500/10 gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden xl:inline">Wallet</span>
              </Button>
            </Link>

            <div className="w-px h-6 bg-slate-700" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-slate-400 hover:bg-slate-500/10 gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-600/50 flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden xl:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800 border-slate-700"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {user?.role === 'client' ? 'Client' : 'Freelancer'}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Dashboard & Profile */}
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'} className="flex gap-2">
                    <span>📊</span> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/settings" className="flex gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Financial */}
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/wallet" className="flex gap-2">
                    <Wallet className="w-4 h-4" /> Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/payments" className="flex gap-2">
                    💳 Payments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/earnings" className="flex gap-2">
                    💵 Earnings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Project Management */}
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/milestones" className="flex gap-2">
                    🎯 Milestones
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/disputes" className="flex gap-2">
                    ⚖️ Disputes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/reviews" className="flex gap-2">
                    ⭐ Reviews
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Communication */}
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/messages" className="flex gap-2">
                    <MessageSquare className="w-4 h-4" /> Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/notifications" className="flex gap-2">
                    <Bell className="w-4 h-4" /> Notifications
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-red-500/20 text-red-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/wallet">
              <Button size="sm" variant="ghost" className="p-2">
                <Wallet className="w-5 h-5 text-slate400" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="p-2">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-slate-800 border-slate-700"
              >
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/wallet">Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/milestones">Milestones</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/disputes">Disputes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/reviews">Reviews</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/payments">Payments</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="hover:bg-slate-700 cursor-pointer">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-red-500/20 text-red-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-2 border-t border-slate-700 pt-4 md:hidden">
            {AUTHENTICATED_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-500/10">
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default AuthenticatedNavbar
