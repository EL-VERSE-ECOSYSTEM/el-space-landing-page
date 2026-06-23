import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-500 to-slate-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <p className="text-muted-foreground mb-8 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using EL SPACE (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on EL SPACE for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or &quot;mirroring&quot; the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on EL SPACE are provided on an &apos;as is&apos; basis. EL SPACE makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall EL SPACE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use EL SPACE, even if EL SPACE or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. User Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              Users of EL SPACE are responsible for maintaining the confidentiality of their account information and password and for restricting access to their computer. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>You must provide accurate, current, and complete information during registration</li>
              <li>You are responsible for all activities under your account</li>
              <li>You agree not to use the Service for illegal activities</li>
              <li>You agree not to post harmful, abusive, or offensive content</li>
              <li>You will not attempt to gain unauthorized access to the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Escrow and Payments</h2>
            <p className="text-muted-foreground mb-4">
              All project payments are held in escrow until the freelancer completes the work and the client approves it. EL SPACE charges commissions on freelancer earnings as outlined in our pricing structure. Payments are processed securely and in accordance with our payment processor&apos;s terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              In the event of a dispute between clients and freelancers, both parties agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>First attempt to resolve the dispute directly</li>
              <li>If unresolved, contact our support team for mediation</li>
              <li>Follow our dispute resolution process</li>
              <li>Accept the terms of resolution made by EL SPACE</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Termination</h2>
            <p className="text-muted-foreground mb-4">
              EL SPACE may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifications to Service</h2>
            <p className="text-muted-foreground mb-4">
              EL SPACE may modify or discontinue the Service (or any part thereof) provided without notice. EL SPACE shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which EL VERSE TECHNOLOGIES operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
              <p><strong>Email:</strong> support@elspace.com</p>
              <p><strong>Website:</strong> https://elspace.com</p>
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
