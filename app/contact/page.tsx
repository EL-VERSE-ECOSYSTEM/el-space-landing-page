'use client'

import { useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, MessageSquare, Loader } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '', type: 'general' })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.')
      console.error('Contact form error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions or need support? We're here to help. Reach out to us using the form below or contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500/20 border border-cyan-500/50">
                  <Mail className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                <p className="text-slate-400">support@elspace.com</p>
                <p className="text-slate-400 text-sm">We typically respond within 24 hours</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 border border-blue-500/50">
                  <Phone className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                <p className="text-slate-400">+1 (555) 123-4567</p>
                <p className="text-slate-400 text-sm">Available Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-500/20 border border-amber-500/50">
                  <MapPin className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Office</h3>
                <p className="text-slate-400">EL VERSE TECHNOLOGIES</p>
                <p className="text-slate-400 text-sm">Remote-First Company</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4 pt-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/20 border border-green-500/50">
                  <MessageSquare className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="https://twitter.com/elspace" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">Twitter</a>
                  <a href="https://linkedin.com/company/elspace" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">LinkedIn</a>
                  <a href="https://discord.gg/elspace" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">Discord</a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-8">
              <p className="text-sm text-slate-300">
                <strong>Average Response Time:</strong> Within 24 business hours. For urgent matters, please email our support team with "URGENT" in the subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Inquiry Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg hover:border-slate-500 transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="billing">Billing Issue</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                We'll get back to you as soon as possible. Please expect a response within 24 business hours.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-2">How do I get help with my account?</h3>
              <p className="text-slate-400 text-sm">
                You can contact our support team by email or through this contact form. We're available 24/7 to help.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">What's your typical response time?</h3>
              <p className="text-slate-400 text-sm">
                We aim to respond to all inquiries within 24 business hours. Urgent matters may receive faster responses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">How do I report a problem?</h3>
              <p className="text-slate-400 text-sm">
                Please use the form above with "Support Request" as the inquiry type and describe the issue in detail.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Can I schedule a call?</h3>
              <p className="text-slate-400 text-sm">
                For partnership or enterprise inquiries, please mention it in your message and we'll arrange a call.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
