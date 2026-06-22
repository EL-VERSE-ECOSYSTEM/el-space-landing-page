import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-500 to-slate-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-muted-foreground mb-8 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              EL SPACE (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the EL SPACE website and mobile application (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information Collection and Use</h2>
            <p className="text-muted-foreground mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Types of Data Collected:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Personal Data:</strong> Email address, name, phone number, address, profile information</li>
              <li><strong>Payment Information:</strong> Bank details, payment method information (processed securely)</li>
              <li><strong>Project Data:</strong> Job descriptions, project details, deliverables, milestones</li>
              <li><strong>Communication Data:</strong> Messages, support tickets, feedback</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent, referring URL</li>
              <li><strong>Device Data:</strong> Device type, operating system, unique device identifiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Data</h2>
            <p className="text-muted-foreground mb-4">
              EL SPACE uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process payments and send related information</li>
              <li>To provide news, special offers, and general information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Security of Data</h2>
            <p className="text-muted-foreground mb-4">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. &quot;Do Not Track&quot; Signals</h2>
            <p className="text-muted-foreground mb-4">
              Some browsers include a &quot;Do Not Track&quot; feature. Our Service does not recognize Do Not Track signals. However, you may disable certain tracking features through your browser settings or third-party tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our Service does not address anyone under the age of 18 (&quot;Children&quot;). We do not knowingly collect personally identifiable information from children under 18. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove such information and terminate the child&apos;s account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
              <p><strong>Email:</strong> privacy@elspace.com</p>
              <p><strong>Address:</strong> EL VERSE TECHNOLOGIES, Contact us for details</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-300 transition-colors"
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
