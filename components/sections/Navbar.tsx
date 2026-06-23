'use client'

import { NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut, LayoutDashboard, User, Settings } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/components/auth-provider'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with text */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <Image src="/logo.png" alt="EL SPACE" width={120} height={40} className="h-8 w-auto object-contain" />
          </Link>

          {/* Nav Links - Hidden on mobile */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-400 to-slate-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons & Links */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register?role=client">
                  <Button
                    size="sm"
                    className="bg-background border-2 border-border text-foreground hover:border-primary hover:text-primary font-bold px-6 rounded-xl transition-all"
                  >
                    Post a Job
                  </Button>
                </Link>
                <Link href="/auth/register?role=freelancer">
                  <Button
                    size="sm"
                    className="bg-foreground hover:bg-primary text-background font-bold px-6 rounded-xl shadow-lg shadow-foreground/10 hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Apply Now
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={user?.user_type === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard'}>
                  <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl gap-2">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="font-bold text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button and Apply Now button */}
          <div className="flex items-center gap-2 md:hidden">
            {!isAuthenticated && (
              <Link href="/auth/register?role=freelancer">
                <Button
                  size="sm"
                  className="bg-foreground text-background font-bold px-4 rounded-xl"
                >
                  Join
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-6 bg-card border border-border rounded-3xl shadow-2xl md:hidden animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 text-lg font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-muted-foreground font-bold py-6 rounded-2xl">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register?role=client" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full border-2 border-border text-foreground font-bold py-6 rounded-2xl"
                    >
                      Post a Job
                    </Button>
                  </Link>
                  <Link href="/auth/register?role=freelancer" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full bg-foreground text-background font-bold py-6 rounded-2xl"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={user?.user_type === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-muted-foreground font-bold py-6 rounded-2xl justify-start gap-4">
                      <LayoutDashboard size={24} />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-muted-foreground font-bold py-6 rounded-2xl justify-start gap-4">
                      <Settings size={24} />
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive font-bold py-6 rounded-2xl justify-start gap-4"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={24} />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
