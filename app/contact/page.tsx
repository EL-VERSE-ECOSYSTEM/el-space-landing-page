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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary to-slate-500 bg-clip-text text-transparent uppercase tracking-tight">
            Initiate Contact
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Strategic support for the global technical workforce. Reach out to our core team below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-foreground mb-8 uppercase tracking-tight">System Access Points</h2>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-tighter">Direct Transmission</h3>
                <p className="text-muted-foreground font-medium">support@elspace.com</p>
                <p className="text-muted-foreground text-xs uppercase font-black tracking-widest mt-1 opacity-60">Response Window: 24 Cycles</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-500/10 border border-slate-500/20 shadow-sm">
                  <Phone className="h-6 w-6 text-slate-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-tighter">Voice Link</h3>
                <p className="text-muted-foreground font-medium">+1 (555) 123-4567</p>
                <p className="text-muted-foreground text-xs uppercase font-black tracking-widest mt-1 opacity-60">Mon - Fri, 0900 - 1800 EST</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate500/10 border border-slate500/20 shadow-sm">
                  <MapPin className="h-6 w-6 text-slate500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-tighter">HQ Node</h3>
                <p className="text-muted-foreground font-medium">EL VERSE TECHNOLOGIES</p>
                <p className="text-muted-foreground text-xs uppercase font-black tracking-widest mt-1 opacity-60">Remote-First Infrastructure</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4 pt-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate500/10 border border-slate500/20 shadow-sm">
                  <MessageSquare className="h-6 w-6 text-slate500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-tighter">Social Nexus</h3>
                <div className="flex gap-6 mt-2">
                  <a href="https://twitter.com/elspace" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-black uppercase text-xs tracking-widest">Twitter</a>
                  <a href="https://linkedin.com/company/elspace" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-black uppercase text-xs tracking-widest">LinkedIn</a>
                  <a href="https://discord.gg/elspace" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-black uppercase text-xs tracking-widest">Discord</a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-muted/50 border border-border rounded-2xl p-6 mt-8 shadow-inner">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wide">
                <strong className="text-foreground">Average Sync Time:</strong> Within 24 business hours. For urgent mission friction, please subject your transmission with <span className="text-red-500 font-black">"URGENT"</span>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Entity Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 h-12 rounded-xl focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Communication Endpoint *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 h-12 rounded-xl focus:ring-primary/20"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Inquiry Protocol *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 h-12 bg-muted/50 border border-border text-foreground rounded-xl hover:border-primary/50 transition-colors outline-none font-bold text-sm"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="billing">Billing Issue</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Transmission Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Query objective"
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 h-12 rounded-xl focus:ring-primary/20"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Data Packet *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your inquiry in detail..."
                  rows={5}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 rounded-xl focus:ring-primary/20 resize-none p-4 font-medium"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all uppercase text-sm tracking-widest"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  'Authorize Send'
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-tighter">
                Secure link active. Please expect a response within 24 operational hours.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-xl">
          <h2 className="text-2xl font-black text-foreground mb-8 uppercase tracking-tight">Frequent Queries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <h3 className="font-black text-foreground uppercase text-sm tracking-widest">Account Support</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                You can contact our support team by email or through this contact form. We&apos;re available 24/7 to maintain your operational status.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-foreground uppercase text-sm tracking-widest">Response Velocity</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                We aim to respond to all inquiries within 24 business cycles. Urgent mission parameters may receive priority synchronization.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-foreground uppercase text-sm tracking-widest">System Anomalies</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Please use the form above with &quot;Support Request&quot; as the protocol type and describe the anomaly in granular detail.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-foreground uppercase text-sm tracking-widest">Strategic Partnership</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                For enterprise or high-volume integration queries, please mention it in your message and we&apos;ll arrange a secure call.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
