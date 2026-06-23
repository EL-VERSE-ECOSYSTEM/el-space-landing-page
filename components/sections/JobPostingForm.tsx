'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function JobPostingForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: '',
    budget: '',
    timeline: '',
    email: '',
    company: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <div className="max-w-2xl mx-auto rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-8">
      <h3 className="mb-2 text-2xl font-bold text-white">Post a Job</h3>
      <p className="mb-6 text-slate-400">Find the perfect freelancer in 5 minutes.</p>

      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-gradient-to-r from-slate-500 to-slate-600' : 'bg-slate-700/50'
            }`}
          ></div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Project Title
            </label>
            <Input
              placeholder="e.g., Build a React dashboard"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Category
            </label>
            <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="dev">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Project Description
            </label>
            <Textarea
              placeholder="Tell us about your project..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Required Skills
            </label>
            <Input
              placeholder="e.g., React, TypeScript, Tailwind (comma-separated)"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Budget Range
            </label>
            <Input
              placeholder="e.g., $1,000 - $5,000"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Timeline
            </label>
            <Select value={formData.timeline} onValueChange={(val) => handleChange('timeline', val)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="1week">1 week</SelectItem>
                <SelectItem value="2weeks">2 weeks</SelectItem>
                <SelectItem value="1month">1 month</SelectItem>
                <SelectItem value="3months">3+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Company Name (Optional)
            </label>
            <Input
              placeholder="Your company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-600 text-white hover:bg-slate-800/50">
            Back
          </Button>
        )}
        {step < 4 && (
          <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700">
            Continue
          </Button>
        )}
        {step === 4 && (
          <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-slate500 to-teal-600 text-white hover:from-slate600 hover:to-teal-700">
            Post Job (Free)
          </Button>
        )}
      </div>
    </div>
  )
}
