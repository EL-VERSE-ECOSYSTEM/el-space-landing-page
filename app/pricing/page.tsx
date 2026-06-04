import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Pricing } from '@/components/sections/Pricing'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative text-foreground">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center mb-24 relative z-10">
          <h1 className="text-6xl font-black mb-6 tracking-tight text-foreground uppercase">
            Predictable <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Economics</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminating the complexity of global hiring with zero hidden costs and total transparency.
          </p>
        </div>

        {/* Pricing Section */}
        <Pricing />

        {/* Pricing Details */}
        <section className="mt-24 relative z-10">
          <h2 className="text-4xl font-black text-foreground mb-16 text-center tracking-tight uppercase">Structured For Success</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* For Clients */}
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-12 shadow-2xl shadow-primary/5 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                 <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-8 tracking-tight uppercase">Enterprise Scale</h3>
              
              <div className="space-y-8">
                {[
                  { label: 'Micro Projects', budget: 'Under $500', fee: 'Free', desc: 'Maintenance and small fixes' },
                  { label: 'Standard Builds', budget: '$500 - $5k', fee: '$25 - $100', desc: 'Web apps and UI/UX design' },
                  { label: 'Strategic Ops', budget: '$5k - $20k', fee: '2% Flat', desc: 'Full-stack infrastructure' }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</p>
                       <p className="text-primary font-black text-xl">{item.fee}</p>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                       <p className="text-foreground font-bold">{item.budget}</p>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
                    {i < 2 && <div className="mt-8 border-t border-border" />}
                  </div>
                ))}
              </div>
            </div>

            {/* For Freelancers */}
            <div className="bg-foreground rounded-[3rem] p-12 shadow-2xl shadow-primary/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <span className="text-9xl">🚀</span>
              </div>
              <div className="w-16 h-16 bg-background/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                 <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-3xl font-black text-background mb-8 tracking-tight uppercase">Creator Earnings</h3>
              
              <div className="space-y-8 relative z-10">
                {[
                  { label: 'Network Entry', volume: '$0 - $2k/mo', commission: '10%', desc: 'Building your elite reputation' },
                  { label: 'Established Elite', volume: '$2k - $10k/mo', commission: '7%', desc: 'Preferential marketplace placement' },
                  { label: 'The 1% Club', volume: '$10k+/mo', commission: '5%', desc: 'Lowest fees in the industry' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-background/50 font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</p>
                       <p className="text-primary font-black text-xl">{item.commission}</p>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                       <p className="text-background font-bold">{item.volume}</p>
                    </div>
                    <p className="text-background/60 text-sm font-medium">{item.desc}</p>
                    {i < 2 && <div className="mt-8 border-t border-background/10" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-lg">
            <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">What&apos;s Included?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 uppercase text-sm tracking-widest">
                  <span className="text-primary font-black">✓</span> For All Users
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm font-medium">
                  <li>• Secure escrow protection</li>
                  <li>• Real-time messaging</li>
                  <li>• Milestone tracking</li>
                  <li>• Dispute resolution support</li>
                  <li>• 24/7 customer support</li>
                  <li>• Ratings and reviews</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 uppercase text-sm tracking-widest">
                  <span className="text-emerald-500 font-black">★</span> Premium Features
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm font-medium">
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
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 mb-12 shadow-inner">
            <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">No Hidden Fees</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-muted-foreground font-medium">
                <span className="text-emerald-500 font-black">✓</span>
                <span>Our commissions are the ONLY fee - no platform fees, no subscription costs</span>
              </li>
              <li className="flex items-center gap-4 text-muted-foreground font-medium">
                <span className="text-emerald-500 font-black">✓</span>
                <span>Payment processing is included in our service fee</span>
              </li>
              <li className="flex items-center gap-4 text-muted-foreground font-medium">
                <span className="text-emerald-500 font-black">✓</span>
                <span>Milestone-based payments means you control when funds are released</span>
              </li>
              <li className="flex items-center gap-4 text-muted-foreground font-medium">
                <span className="text-emerald-500 font-black">✓</span>
                <span>All fees are clearly displayed before you commit to a project</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">Pricing FAQs</h3>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="font-black text-foreground mb-2 uppercase text-sm tracking-widest">Can I negotiate pricing for large projects?</h4>
                <p className="text-muted-foreground font-medium text-sm">
                  Yes! For projects over $10,000, we offer custom pricing. Contact our sales team for details.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="font-black text-foreground mb-2 uppercase text-sm tracking-widest">When do I pay the service fee?</h4>
                <p className="text-muted-foreground font-medium text-sm">
                  For clients: The fee is calculated after project completion. For freelancers: The commission is deducted from your earnings.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="font-black text-foreground mb-2 uppercase text-sm tracking-widest">Are there penalties for delayed payments?</h4>
                <p className="text-muted-foreground font-medium text-sm">
                  No. We only charge our standard service fee. However, escrow funds may have expiration dates.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="font-black text-foreground mb-2 uppercase text-sm tracking-widest">Do you offer refunds?</h4>
                <p className="text-muted-foreground font-medium text-sm">
                  Service fees are non-refundable. However, if a project is cancelled before work begins, no fees apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-[2.5rem] p-16 text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-600 opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
          <h2 className="text-5xl font-black text-primary-foreground mb-6 relative z-10 tracking-tight uppercase">Global. Digital. Absolute.</h2>
          <p className="text-primary-foreground/80 mb-10 text-xl font-medium relative z-10 max-w-xl mx-auto">
            Ready to experience the future of professional commerce?
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-12 py-5 bg-background text-foreground font-black rounded-2xl transition-all hover:bg-foreground hover:text-background hover:shadow-2xl uppercase tracking-[0.2em] text-sm relative z-10 border border-border"
          >
            Initiate Account
          </Link>
        </section>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border">
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
