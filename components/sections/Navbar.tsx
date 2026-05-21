'use client'

import { NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
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
          ? 'border-b border-slate-200 bg-white/80 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with text */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="h-full w-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                EL
              </div>
            </div>
            <span className="hidden text-2xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent sm:inline-block tracking-tight">
              EL SPACE
            </span>
          </Link>

          {/* Nav Links - Hidden on mobile */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons & Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                Login
              </Button>
            </Link>
            <Link href="/auth/register?role=client">
              <Button
                size="sm"
                className="bg-white border-2 border-slate-200 text-slate-900 hover:border-cyan-500 hover:text-cyan-600 font-bold px-6 rounded-xl transition-all"
              >
                Post a Job
              </Button>
            </Link>
            <Link href="/auth/register?role=freelancer">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-cyan-600 text-white font-bold px-6 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/20 transition-all active:scale-95"
              >
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile menu button and Apply Now button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/auth/register?role=freelancer">
              <Button
                size="sm"
                className="bg-slate-900 text-white font-bold px-4 rounded-xl"
              >
                Join
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl md:hidden animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 text-lg font-bold text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-600 font-bold py-6 rounded-2xl">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register?role=client" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full border-2 border-slate-200 text-slate-900 font-bold py-6 rounded-2xl"
                >
                  Post a Job
                </Button>
              </Link>
              <Link href="/auth/register?role=freelancer" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-slate-900 text-white font-bold py-6 rounded-2xl"
                >
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
