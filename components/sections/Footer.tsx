import React from 'react';
import { FOOTER_SECTIONS } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLoginDialog } from '@/components/admin-login-dialog'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Sections */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 mb-12">
          {/* About */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="h-full w-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-cyan-500/20">
                  EL
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                EL SPACE
              </span>
            </div>
            <p className="mb-4 text-sm font-bold text-slate-900">
              {FOOTER_SECTIONS.about.subtitle}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              {FOOTER_SECTIONS.about.description}
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.forClients.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.forClients.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.forFreelancers.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.forFreelancers.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-purple-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.ecosystem.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.ecosystem.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">
              {FOOTER_SECTIONS.legal.title}
            </h4>
            <ul className="space-y-4">
              {FOOTER_SECTIONS.legal.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8">
          <p className="text-center md:text-left text-sm text-slate-500 font-medium">
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
