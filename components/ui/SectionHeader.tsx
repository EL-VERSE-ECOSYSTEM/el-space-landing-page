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
        <p className="mb-4 text-sm font-bold text-transparent bg-gradient-to-r from-slate-600 to-slate-600 bg-clip-text uppercase tracking-widest">
          {subheading}
        </p>
      )}
      <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter text-balance leading-tight tracking-tight">
        {heading}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
