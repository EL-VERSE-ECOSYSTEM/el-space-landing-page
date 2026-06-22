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

export function FreelancerApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio: '',
    github: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    heardFrom: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Application submitted:', formData)
    // Handle form submission
  }

  return (
    <div className="max-w-2xl mx-auto rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-8">
      <h3 className="mb-2 text-2xl font-bold text-white">Apply as a Freelancer</h3>
      <p className="mb-6 text-slate-400">Join the top 5% of tech talent on EL SPACE.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Personal Information</h4>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Full Name
            </label>
            <Input
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Portfolio & Links */}
        <div className="space-y-4 border-t border-slate-700/50 pt-6">
          <h4 className="font-semibold text-white">Portfolio & Links</h4>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Portfolio URL
            </label>
            <Input
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              GitHub / LinkedIn URL (Optional)
            </label>
            <Input
              type="url"
              placeholder="https://github.com/yourprofile"
              value={formData.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="space-y-4 border-t border-slate-700/50 pt-6">
          <h4 className="font-semibold text-white">Skills & Experience</h4>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Your Skills
            </label>
            <Input
              placeholder="e.g., React, TypeScript, Tailwind, Node.js (comma-separated)"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Years of Experience
            </label>
            <Select value={formData.experience} onValueChange={(val) => handleChange('experience', val)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Hourly Rate (USD)
            </label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={formData.hourlyRate}
              onChange={(e) => handleChange('hourlyRate', e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-4 border-t border-slate-700/50 pt-6">
          <h4 className="font-semibold text-white">About You</h4>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Short Bio
            </label>
            <Textarea
              placeholder="Tell us about yourself and why you'd be great for EL SPACE..."
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              How did you hear about EL SPACE?
            </label>
            <Select value={formData.heardFrom} onValueChange={(val) => handleChange('heardFrom', val)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="friend">Friend Referral</SelectItem>
                <SelectItem value="elaccess">ELACCESS</SelectItem>
                <SelectItem value="search">Search Engine</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-slate-700/50 pt-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate500 to-slate600 text-white hover:from-slate600 hover:to-slate700"
          >
            Apply to Join EL SPACE
          </Button>
          <p className="mt-4 text-center text-sm text-slate-400">
            Our team reviews applications within 48 hours.
          </p>
        </div>
      </form>
    </div>
  )
}
