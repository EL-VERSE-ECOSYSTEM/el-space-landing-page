'use client'

import { useState, useEffect } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

export function FeaturedTalent() {
  interface Freelancer {
    id: string;
    name: string;
    title: string;
    hourlyRate: string;
    rating: number;
    reviews: number;
    skills: string[];
    availability: string;
  }
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch('/api/freelancers?limit=4')
        const data = await response.json()
        if (data.success) {
          setFreelancers(data.freelancers)
        }
      } catch (error) {
        console.error('Error fetching featured talent:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFreelancers()
  }, [])

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subheading="Meet Our Vetted Freelancers"
          heading="Top 5% of Tech Talent. Ready This Week."
          description="Handpicked professionals ready to bring your vision to life."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-[420px] bg-slate-100 rounded-[2rem] animate-pulse"></div>
            ))
          ) : freelancers.length > 0 ? (
            freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="group relative flex flex-col h-full rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50"
              >
                {/* Avatar Placeholder */}
                <div className="mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                  {freelancer.name.charAt(0)}
                </div>

                {/* Name & Title */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{freelancer.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{freelancer.title}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                   <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                   <span className="text-sm font-bold text-slate-900">{freelancer.rating || '4.9'}</span>
                   <span className="text-sm text-slate-400">({freelancer.reviews || '20'}+ reviews)</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                  {freelancer.skills.slice(0, 3).map((skill: string, idx: number) => (
                    <span
                      key={`${freelancer.id}-${skill}-${idx}`}
                      className="rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 transition-colors group-hover:bg-cyan-50 group-hover:text-cyan-700 group-hover:border-cyan-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Rate & Availability */}
                <div className="mb-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Starting at</p>
                    <p className="text-lg font-black text-slate-900">
                      {freelancer.hourlyRate}/hr
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tighter">
                      Online
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link href={`/freelancer/${freelancer.id}`} className="w-full">
                  <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-900 font-bold py-6 rounded-2xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                    View Profile
                  </Button>
                </Link>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-3xl">
               No featured talent available at the moment.
             </div>
          )}
        </div>
      </div>
    </section>
  )
}
