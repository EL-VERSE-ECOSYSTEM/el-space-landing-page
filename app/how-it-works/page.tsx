import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { HowItWorksClients, HowItWorksFreelancers } from '@/components/sections/HowItWorks'
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            How EL SPACE Works
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Whether you&apos;re a client looking to hire top talent or a freelancer ready to earn, our platform makes it simple and secure.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center gap-4">
          <button className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg font-semibold">
            For Clients
          </button>
          <button className="px-6 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
            For Freelancers
          </button>
        </div>

        {/* How It Works for Clients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Clients Process</h2>
          <HowItWorksClients />
        </section>

        {/* Divider */}
        <div className="border-t border-slate-700 my-16"></div>

        {/* How It Works for Freelancers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Freelancers Process</h2>
          <HowItWorksFreelancers />
        </section>

        {/* Key Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose EL SPACE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Escrow</h3>
              <p className="text-slate-400">
                All payments are held securely in escrow until both parties are satisfied with the work.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Payouts</h3>
              <p className="text-slate-400">
                Get paid instantly after project completion. Multiple payment methods available.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Professionals</h3>
              <p className="text-slate-400">
                All users are verified to ensure quality and reliability across the platform.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Messaging</h3>
              <p className="text-slate-400">
                Communicate seamlessly with your team. Keep all conversations in one place.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Milestone Tracking</h3>
              <p className="text-slate-400">
                Break projects into manageable milestones for better progress tracking and accountability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-2">Ratings & Reviews</h3>
              <p className="text-slate-400">
                Transparent feedback system builds trust and helps you make informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of successful clients and freelancers who have found the perfect match on EL SPACE.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Post a Project
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg transition-colors"
            >
              Find Work
            </Link>
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-slate-700">
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
