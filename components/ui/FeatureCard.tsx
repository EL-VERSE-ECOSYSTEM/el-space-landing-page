import React from 'react'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  colorScheme?: 'cyan' | 'purple' | 'green' | 'blue' | 'yellow' | 'pink'
}

const iconBackgrounds = {
  cyan: 'bg-cyan-50 text-cyan-600',
  purple: 'bg-purple-50 text-purple-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  pink: 'bg-pink-50 text-pink-600'
}

const borderColors = {
  cyan: 'hover:shadow-cyan-500/10',
  purple: 'hover:shadow-purple-500/10',
  green: 'hover:shadow-emerald-500/10',
  blue: 'hover:shadow-blue-500/10',
  yellow: 'hover:shadow-yellow-500/10',
  pink: 'hover:shadow-pink-500/10'
}

export function FeatureCard({ 
  icon, 
  title, 
  description,
  colorScheme = 'cyan'
}: FeatureCardProps) {
  return (
    <div className={`group relative h-full rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl \${borderColors[colorScheme]}`}>
      <div className={`mb-6 inline-flex items-center justify-center p-4 rounded-2xl \${iconBackgrounds[colorScheme]} text-4xl group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{description}</p>
    </div>
  )
}
