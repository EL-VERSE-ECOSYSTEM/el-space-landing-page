import React from 'react'

interface BenefitCardProps {
  title: string
  description: string
  icon?: string
  colorScheme?: 'cyan' | 'purple' | 'green' | 'blue' | 'yellow' | 'pink'
}

const iconBackgrounds = {
  cyan: 'bg-slate-50 text-slate-600 border-slate-100',
  purple: 'bg-slate50 text-slate600 border-slate100',
  green: 'bg-slate50 text-slate600 border-slate100',
  blue: 'bg-slate-50 text-slate-600 border-slate-100',
  yellow: 'bg-slate50 text-slate600 border-slate100',
  pink: 'bg-slate50 text-slate600 border-slate100'
}

export function BenefitCard({ 
  title, 
  description, 
  icon = '✓',
  colorScheme = 'cyan'
}: BenefitCardProps) {
  return (
    <div className="group flex flex-col gap-4 p-6 rounded-3xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start gap-5">
        <span className={`mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${iconBackgrounds[colorScheme]} border transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 group-hover:text-slate-950 transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
