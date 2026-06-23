'use client';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Shield, Zap, Users, TrendingUp, Lock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const trustFeatures = [
  {
    icon: Shield,
    title: 'Verified Badge System',
    description: 'Three-tier verification: Portfolio Reviewed → Test Project Passed → ELACCESS Graduate',
    highlight: 'Clients filter for 🥇 only',
    color: 'cyan'
  },
  {
    icon: Lock,
    title: 'Escrow Protection',
    description: 'Stripe Connect holds funds. Milestone-based release protects both parties.',
    highlight: 'Safe for projects up to $100k+',
    color: 'blue'
  },
  {
    icon: CheckCircle2,
    title: 'Identity Verification',
    description: 'Government ID + video selfie check (optional but recommended).',
    highlight: 'Eliminates fake profiles',
    color: 'indigo'
  },
];

const matchingFeatures = [
  {
    icon: Zap,
    title: 'Smart Matching Algorithm',
    description: 'Skills + Budget + Timeline + Availability = Top 5 matches',
    highlight: 'No browsing 1,000 profiles',
    color: 'purple'
  },
  {
    icon: TrendingUp,
    title: 'Instant Availability Badge',
    description: '🟢 "Available This Week" filter keeps you matched with active freelancers.',
    highlight: 'Active freelancers get priority',
    color: 'pink'
  },
  {
    icon: Users,
    title: 'Skill-Based Search',
    description: 'Filter by exact tech stack: React, Python, Figma, Webflow, etc.',
    highlight: 'Precision hiring, every time',
    color: 'blue'
  },
];

const paymentFeatures = [
  {
    icon: TrendingUp,
    title: 'Instant Pay',
    description: 'Withdraw earnings to bank/crypto/PayPal in minutes. 5% fee.',
    highlight: 'Major differentiator',
    color: 'emerald'
  },
  {
    icon: Zap,
    title: 'Real-Time Earnings Dashboard',
    description: 'See total earned, pending, available, and withdrawn instantly.',
    highlight: 'Financial clarity',
    color: 'cyan'
  },
  {
    icon: Lock,
    title: 'Multi-Currency Support',
    description: 'USD, EUR, GBP, NGN, KES, ZAR and more.',
    highlight: 'Global payment network',
    color: 'blue'
  },
];

export function TrustSafetyFeatures() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trust & Safety */}
        <div className="mb-24">
          <SectionHeader
            subheading="Trust & Safety"
            heading="Built for Safety & Trust"
            description="We prioritize security and fairness for both clients and freelancers with our advanced protection systems."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {trustFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="group border-slate-200 bg-white rounded-[2rem] hover:border-transparent hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-slate-500 mb-6 leading-relaxed">{feature.description}</p>
                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{feature.highlight}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Smart Matching */}
        <div className="mb-24">
          <SectionHeader
            subheading="Matching & Discovery"
            heading="Smarter Matching"
            description="Our advanced algorithm connects you with perfect-fit projects and talent based on over 20 unique data points."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {matchingFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="group border-slate-200 bg-white rounded-[2rem] hover:border-transparent hover:shadow-2xl hover:shadow-slate500/10 transition-all duration-500 overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate50 text-slate600 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-slate-500 mb-6 leading-relaxed">{feature.description}</p>
                    <Badge className="bg-slate100 text-slate700 hover:bg-slate100 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{feature.highlight}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Payments & Earnings */}
        <div>
          <SectionHeader
            subheading="Payments & Earnings"
            heading="Get Paid Faster"
            description="Flexible payment options with industry-leading withdrawal speeds and multi-currency support."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {paymentFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="group border-slate-200 bg-white rounded-[2rem] hover:border-transparent hover:shadow-2xl hover:shadow-slate500/10 transition-all duration-500 overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate50 text-slate600 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-slate-500 mb-6 leading-relaxed">{feature.description}</p>
                    <Badge className="bg-slate100 text-slate700 hover:bg-slate100 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{feature.highlight}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
