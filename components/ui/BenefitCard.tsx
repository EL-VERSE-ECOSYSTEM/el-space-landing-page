import React from 'react'

interface BenefitCardProps {
  title: string
  description: string
  icon?: string
  colorScheme?: 'cyan' | 'purple' | 'green' | 'blue' | 'yellow' | 'pink'
}

const iconBackgrounds = {
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  pink: 'bg-pink-50 text-pink-600 border-pink-100'
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
        <span className={`mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold \${iconBackgrounds[colorScheme]} border transition-transform duration-300 group-hover:scale-110`}>
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
