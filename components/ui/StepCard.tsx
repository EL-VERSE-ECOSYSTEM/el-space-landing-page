import React from 'react'

interface StepCardProps {
  icon: string
  title: string
  description: string
  step?: number
}

const stepColors = [
  'bg-cyan-50 text-cyan-600 border-cyan-100',
  'bg-blue-50 text-blue-600 border-blue-100',
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-purple-50 text-purple-600 border-purple-100'
]

export function StepCard({ icon, title, description, step }: StepCardProps) {
  const colorClass = step ? stepColors[(step - 1) % stepColors.length] : 'bg-slate-50 text-slate-600 border-slate-100'

  return (
    <div className="group relative flex flex-col items-start gap-5 rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50">
      <div className={`text-4xl rounded-2xl p-4 transition-transform duration-500 group-hover:scale-110 \${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        {step && (
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
            Step {step}
          </p>
        )}
        <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
      </div>
      {/* Decorative arrow for step flow - could be added if desired */}
    </div>
  )
}
