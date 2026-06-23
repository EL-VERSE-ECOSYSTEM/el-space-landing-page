import React from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-none">
          <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-primary to-slate-500 bg-clip-text text-transparent uppercase tracking-tight">
            Cookie Protocol
          </h1>
          
          <p className="text-muted-foreground mb-12 text-xs font-black uppercase tracking-[0.2em]">
            Sync Date: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">1. Operational Overview</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
              Cookies are granular data packets stored on your browser or hardware node. They facilitate the retention of identity parameters, operational preferences, and navigational patterns to optimize the system interface.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">2. Packet Classification</h2>
            
            <h3 className="text-lg font-black text-foreground mb-3 mt-8 uppercase tracking-widest text-slate-700">Core Essential:</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
              Mandatory for base system stability. These enable identity verification, secure socket management, and resource allocation. Disabling these packets will result in mission failure.
            </p>
            
            <h3 className="text-lg font-black text-foreground mb-3 mt-8 uppercase tracking-widest text-slate-700">Performance Intel:</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
              These monitor node behavior to generate anonymous usage telemetry. This data is utilized for platform optimization and bandwidth management.
            </p>
            
            <h3 className="text-lg font-black text-foreground mb-3 mt-8 uppercase tracking-widest text-slate-700">Operational Choice:</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
              Used to remember specialized configurations such as regional localization, language preference, and workspace personalization.
            </p>
            
            <h3 className="text-lg font-black text-foreground mb-3 mt-8 uppercase tracking-widest text-slate-700">External Influence:</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
              Used by synchronized partners to deliver targeted intelligence and strategic communication relevant to your operational history.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">3. External Nodes</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
              We may permit authorized third-party nodes to inject data packets:
            </p>
            <ul className="list-none space-y-4">
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground font-medium"><strong className="text-foreground uppercase text-xs tracking-widest">Telemetry Services:</strong> Real-time platform performance monitoring.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground font-medium"><strong className="text-foreground uppercase text-xs tracking-widest">Fiscal Gateways:</strong> Secure transaction and escrow processing.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground font-medium"><strong className="text-foreground uppercase text-xs tracking-widest">Nexus Bridges:</strong> Cross-platform social integration.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">4. System Utilization</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
              Operational objectives for data retention:
            </p>
            <ul className="list-none space-y-4">
              <li className="flex items-center gap-4">
                <span className="text-slate-500 font-black">✓</span>
                <span className="text-muted-foreground font-medium">Identity persistence and secure session locking.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-slate-500 font-black">✓</span>
                <span className="text-muted-foreground font-medium">Node preference synchronization.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-slate-500 font-black">✓</span>
                <span className="text-muted-foreground font-medium">Behavioral pattern mapping for UX improvement.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-slate-500 font-black">✓</span>
                <span className="text-muted-foreground font-medium">Anomaly detection and fraud prevention.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">5. Temporal Status</h2>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Session packets are purged upon browser termination. Persistent packets remain active on your node for extended cycles to maintain consistent workspace configuration across multiple sessions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">6. Control Protocols</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
              You retain full command over node data:
            </p>
            <ul className="list-none space-y-4">
              <li className="flex items-start gap-4 text-muted-foreground font-medium">
                 <span className="text-slate-700 font-black">»</span>
                 Node Interface: Configure packet acceptance via browser firmware.
              </li>
              <li className="flex items-start gap-4 text-muted-foreground font-medium">
                 <span className="text-slate-700 font-black">»</span>
                 Manual Purge: Execute cache clearance to remove existing data.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">7. External Communications</h2>
            <p className="text-muted-foreground leading-relaxed font-medium">
              If you have inquiries regarding the data matrix, contact the Command Center:
            </p>
            <div className="bg-card border border-border rounded-2xl p-8 mt-6 shadow-inner">
              <p className="text-sm font-medium text-muted-foreground mb-2"><strong className="text-foreground uppercase tracking-widest text-[10px]">Secure Link:</strong> privacy@elspace.com</p>
              <p className="text-sm font-medium text-muted-foreground"><strong className="text-foreground uppercase tracking-widest text-[10px]">Data Node Officer:</strong> dpo@elspace.com</p>
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
