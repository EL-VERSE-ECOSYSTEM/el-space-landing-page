import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Pricing } from '@/components/sections/Pricing'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Transparent Pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No hidden fees. No surprises. Our pricing is simple, transparent, and designed to work for projects of any size.
          </p>
        </div>

        {/* Pricing Section */}
        <Pricing />

        {/* Pricing Details */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Our Pricing Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* For Clients */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">For Clients</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-slate-300 font-semibold mb-2">Project Size: Micro (Under $500)</p>
                  <p className="text-cyan-400 font-bold">Free</p>
                  <p className="text-slate-400 text-sm">Perfect for small bug fixes and minimal changes</p>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <p className="text-slate-300 font-semibold mb-2">Project Size: Small ($500 - $2,500)</p>
                  <p className="text-cyan-400 font-bold">$25-50</p>
                  <p className="text-slate-400 text-sm">Great for website redesigns and small applications</p>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <p className="text-slate-300 font-semibold mb-2">Project Size: Medium ($2,500 - $10,000)</p>
                  <p className="text-cyan-400 font-bold">$100-500</p>
                  <p className="text-slate-400 text-sm">Ideal for full builds and custom features</p>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <p className="text-slate-300 font-semibold mb-2">Project Size: Large ($10,000+)</p>
                  <p className="text-cyan-400 font-bold">Flat rate (Negotiable)</p>
                  <p className="text-slate-400 text-sm">Perfect for enterprise solutions and scaling</p>
                </div>
              </div>
            </div>

            {/* For Freelancers */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">For Freelancers</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-slate-300 font-semibold mb-2">Starter: 0 - $1,000/month</p>
                  <p className="text-green-400 font-bold">10% Commission</p>
                  <p className="text-slate-400 text-sm">Perfect while building your reputation</p>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <p className="text-slate-300 font-semibold mb-2">Professional: $1,000 - $5,000/month</p>
                  <p className="text-green-400 font-bold">8% Commission</p>
                  <p className="text-slate-400 text-sm">For established professionals</p>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <p className="text-slate-300 font-semibold mb-2">Expert: $5,000+/month</p>
                  <p className="text-green-400 font-bold">5% Commission</p>
                  <p className="text-slate-400 text-sm">Reward for top-rated freelancers</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
                  <p className="text-slate-300 text-sm">
                    <strong>Bonus:</strong> Higher tier commission rates unlock exclusive opportunities and priority support!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">What&apos;s Included?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> For All Users
                </h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• Secure escrow protection</li>
                  <li>• Real-time messaging</li>
                  <li>• Milestone tracking</li>
                  <li>• Dispute resolution support</li>
                  <li>• 24/7 customer support</li>
                  <li>• Ratings and reviews</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">⭐</span> Premium Features
                </h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• Portfolio showcase</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                  <li>• Project management tools</li>
                  <li>• Client verification badge</li>
                  <li>• Payment flexibility</li>
                </ul>
              </div>
            </div>
          </div>

          {/* No Hidden Fees */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">No Hidden Fees</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Our commissions are the ONLY fee - no platform fees, no subscription costs</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Payment processing is included in our service fee</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Milestone-based payments means you control when funds are released</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>All fees are clearly displayed before you commit to a project</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Pricing FAQs</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-2">Can I negotiate pricing for large projects?</h4>
                <p className="text-slate-400">
                  Yes! For projects over $10,000, we offer custom pricing. Contact our sales team for details.
                </p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-2">When do I pay the service fee?</h4>
                <p className="text-slate-400">
                  For clients: The fee is calculated after project completion. For freelancers: The commission is deducted from your earnings.
                </p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-2">Are there penalties for delayed payments?</h4>
                <p className="text-slate-400">
                  No. We only charge our standard service fee. However, escrow funds may have expiration dates.
                </p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-2">Do you offer refunds?</h4>
                <p className="text-slate-400">
                  Service fees are non-refundable. However, if a project is cancelled before work begins, no fees apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Today</h2>
          <p className="text-slate-400 mb-8">
            Join thousands of successful professionals. No credit card required.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Sign Up Now
          </Link>
        </section>

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
