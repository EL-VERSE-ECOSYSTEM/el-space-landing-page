import React from 'react';
import { FOOTER_SECTIONS } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLoginDialog } from '@/components/admin-login-dialog'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Sections */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 mb-12">
          {/* About */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="h-full w-full bg-gradient-to-br from-primary via-slate-500 to-accent rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-primary/20">
                  EL
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-500 to-slate-300 bg-clip-text text-transparent">
                EL SPACE
              </span>
            </div>
            <p className="mb-4 text-sm font-bold text-foreground">
              {FOOTER_SECTIONS.about.subtitle}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {FOOTER_SECTIONS.about.description}
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="mb-6 font-bold text-foreground uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.forClients.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.forClients.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-slate-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="mb-6 font-bold text-foreground uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.forFreelancers.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.forFreelancers.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-6 font-bold text-foreground uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.ecosystem.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.ecosystem.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-slate-500 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-6 font-bold text-foreground uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.legal.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.legal.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8">
          <p className="text-center md:text-left text-sm text-muted-foreground font-medium">
            © 2026 EL SPACE. Built by EL VERSE TECHNOLOGIES. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <AdminLoginDialog />
          </div>
        </div>
      </div>
    </footer>
  )
}
