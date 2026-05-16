'use client'

import { useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, MessageSquare, Loader, ChevronLeft, Send, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-widest mb-6">
            <MessageSquare className="w-3 h-3" /> Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight">
            How can we help?
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
            Have questions about the platform or need technical support? Our team of specialists is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 relative z-10">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <div>
               <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Contact Information</h2>
               <p className="text-slate-500 font-medium leading-relaxed">Prefer direct communication? Use the details below to reach our departments directly.</p>
            </div>

            <div className="space-y-8">
              {/* Email */}
              <div className="group flex gap-6 p-6 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Support</h3>
                  <p className="text-xl font-black text-slate-900 mb-1">support@elspace.com</p>
                  <p className="text-slate-500 text-sm font-medium">Response within 24 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex gap-6 p-6 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Line</h3>
                  <p className="text-xl font-black text-slate-900 mb-1">+1 (555) 123-4567</p>
                  <p className="text-slate-500 text-sm font-medium">Mon-Fri, 9AM - 6PM EST</p>
                </div>
              </div>

              {/* Address */}
              <div className="group flex gap-6 p-6 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Headquarters</h3>
                  <p className="text-xl font-black text-slate-900 mb-1">EL VERSE TECHNOLOGIES</p>
                  <p className="text-slate-500 text-sm font-medium">Remote-First Global Ecosystem</p>
                </div>
              </div>
            </div>

            {/* Response Time Callout */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-50" />
               <div className="relative z-10 flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                  <p className="text-sm font-bold leading-relaxed text-slate-300">
                    <strong className="text-white">Premium Support:</strong> Verified professionals and enterprise clients receive priority response times under 4 hours.
                  </p>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="h-14 bg-slate-50 border-slate-50 text-slate-900 placeholder:text-slate-400 rounded-2xl font-bold focus:border-cyan-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="h-14 bg-slate-50 border-slate-50 text-slate-900 placeholder:text-slate-400 rounded-2xl font-bold focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Inquiry Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-4 bg-slate-50 border-slate-50 text-slate-900 rounded-2xl font-bold focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Platform Feedback</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="h-14 bg-slate-50 border-slate-50 text-slate-900 placeholder:text-slate-400 rounded-2xl font-bold focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Your Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Provide as much detail as possible..."
                    rows={6}
                    className="bg-slate-50 border-slate-50 text-slate-900 placeholder:text-slate-400 rounded-[2rem] p-6 font-medium focus:border-cyan-500 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Dispatching Message...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Inquiry <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em]">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-black text-xs uppercase tracking-widest transition-all group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Ecosystem
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
