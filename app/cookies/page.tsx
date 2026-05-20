import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          
          <p className="text-slate-400 mb-8 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-300 mb-4">
              Cookies are small pieces of data stored on your browser or device. They help us remember information about you, such as your preferences, login information, and browsing habits. They&apos;re commonly used to enhance user experience on websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Essential Cookies:</h3>
            <p className="text-slate-300 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may not be able to use certain parts of our Service if you disable these.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Performance Cookies:</h3>
            <p className="text-slate-300 mb-4">
              These cookies help us understand how visitors use our website by collecting and reporting information anonymously. This helps us optimize our Service.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Functional Cookies:</h3>
            <p className="text-slate-300 mb-4">
              These cookies enable the website to provide personalized features and remember your choices (e.g., username, language, region).
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Marketing Cookies:</h3>
            <p className="text-slate-300 mb-4">
              These cookies track online activity to help deliver targeted ads and marketing campaigns that are relevant to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-300 mb-4">
              We may allow third-party service providers to place cookies on your device. These include:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Analytics Services:</strong> To track website usage and performance</li>
              <li><strong>Payment Processors:</strong> To process payments securely</li>
              <li><strong>Social Media:</strong> To enable social media integration</li>
              <li><strong>Advertising Partners:</strong> To deliver targeted advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Cookies</h2>
            <p className="text-slate-300 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences and settings</li>
              <li>Track your browsing patterns and improve user experience</li>
              <li>Provide personalized content and recommendations</li>
              <li>Measure the effectiveness of our marketing campaigns</li>
              <li>Detect and prevent fraud</li>
              <li>Analyze website traffic and performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookie Expiration</h2>
            <p className="text-slate-300 mb-4">
              Most cookies used on EL SPACE expire when you close your browser. However, some persistent cookies may remain for extended periods to remember your preferences across multiple visits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Managing Your Cookies</h2>
            <p className="text-slate-300 mb-4">
              You have control over how cookies are used on your device:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Browser Settings:</strong> Most browsers allow you to manage cookie preferences</li>
              <li><strong>Disable Cookies:</strong> You can decline cookies, but this may limit Service functionality</li>
              <li><strong>Clear Cookies:</strong> You can delete existing cookies at any time</li>
              <li><strong>Third-Party Tools:</strong> Use browser extensions to block certain cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Do Not Track</h2>
            <p className="text-slate-300 mb-4">
              Some browsers include a &quot;Do Not Track&quot; feature. EL SPACE currently does not respond to Do Not Track signals as there is no industry standard for interpretation. However, you can control cookie usage through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-slate-300 mb-4">
              Your data collected through cookies may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using EL SPACE, you consent to such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Cookie Policy</h2>
            <p className="text-slate-300 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We will notify you of significant changes by posting the updated policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-slate-300 mb-4">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-slate-300">
              <p><strong>Email:</strong> privacy@elspace.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@elspace.com</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-700">
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
