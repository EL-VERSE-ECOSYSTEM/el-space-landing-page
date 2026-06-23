import React from 'react'

interface SectionHeaderProps {
  subheading?: string
  heading: string
  description?: string
  centered?: boolean
}

export function SectionHeader({
  subheading,
  heading,
  description,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
      {subheading && (
        <p className="mb-4 text-sm font-bold text-transparent bg-gradient-to-r from-slate-600 to-slate600 bg-clip-text uppercase tracking-widest">
          {subheading}
        </p>
      )}
      <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 text-balance leading-tight tracking-tight">
        {heading}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
