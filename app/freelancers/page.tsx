'use client'

'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/sections/Navbar'
import { FeaturedTalent } from '@/components/sections/FeaturedTalent'
import { Footer } from '@/components/sections/Footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Star, MapPin, Briefcase, DollarSign, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function FreelancersPage() {
  interface Freelancer {
    id: string;
    name: string;
    title: string;
    hourlyRate: string;
    rating: number;
    reviews: number;
    skills: string[];
    badges: string[];
    completedProjects: number;
    responseTime: string;
    avatar_url?: string;
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch('/api/freelancers?limit=20')
        const data = await response.json()
        if (data.success) {
          setFreelancers(data.freelancers)
        }
      } catch (error) {
        console.error('Error fetching freelancers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFreelancers()
  }, [])

  const allSkills = ['React', 'Node.js', 'Python', 'UI Design', 'AWS', 'Solidity']

  const filteredFreelancers = freelancers
    .filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(f => !selectedSkill || f.skills.includes(selectedSkill))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price') return parseInt(a.hourlyRate) - parseInt(b.hourlyRate)
      if (sortBy === 'reviews') return b.reviews - a.reviews
      return 0
    })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="mb-16 relative z-10">
          <h1 className="text-6xl font-black mb-6 tracking-tight text-slate-900">
            The <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Global Elite</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">
            Access the top 1% of specialized talent. Every professional in our network is rigorously vetted for technical excellence.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 mb-12 shadow-2xl shadow-slate-200/50 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, title, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-4 h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-2xl hover:border-slate-300 transition-all appearance-none cursor-pointer focus:ring-cyan-500"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-2xl hover:border-slate-300 transition-all appearance-none cursor-pointer focus:ring-cyan-500"
            >
              <option value="rating">Top Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between relative z-10 px-2">
          <p className="text-slate-500 font-medium">
            Found <strong className="text-slate-900 font-black">{filteredFreelancers.length}</strong> available professionals
          </p>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4" />
              Refine Search
            </button>
          </div>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative z-10">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <Link key={freelancer.id} href={`/freelancer/${freelancer.id}`} className="group">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowUpRight className="w-6 h-6 text-cyan-600" />
                  </div>

                  {/* Avatar & Header */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden shrink-0">
                      {freelancer.avatar_url ? (
                        <img src={freelancer.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-slate-300">{(freelancer.name || 'U').charAt(0)}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">{freelancer.name}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest truncate">{freelancer.title}</p>
                    </div>
                  </div>

                  {/* Pricing & Rating */}
                  <div className="flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate</p>
                      <p className="text-slate-900 font-black text-lg">{freelancer.hourlyRate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputation</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-black text-slate-900">{freelancer.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-8 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Core Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm">
                          {skill}
                        </span>
                      ))}
                      {freelancer.skills.length > 4 && (
                        <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-black rounded-xl">
                          +{freelancer.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {freelancer.badges.map(badge => (
                      <span key={badge} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-2xl transition-all duration-300">
                    Engage Talent
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">No freelancers found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSkill('')
                }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Featured Talent Section */}
        <section className="mb-24 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Featured <span className="text-cyan-600">Talent</span></h2>
          <FeaturedTalent />
        </section>

        {/* Categories */}
        <section className="mb-24 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Industry <span className="text-purple-600">Specializations</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Web Development', 'Mobile Development', 'UI/UX Design', 'Cloud Architecture', 'Data Science', 'Blockchain', 'DevOps', 'AI/ML'].map(category => (
              <button
                key={category}
                className="p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-transparent hover:shadow-xl transition-all text-slate-900 font-black text-lg text-left group"
              >
                <div className="mb-4 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                  <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-cyan-600" />
                </div>
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 rounded-[3rem] p-16 text-center mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-white mb-6">Can&apos;t find the right match?</h2>
            <p className="text-slate-400 text-xl mb-10 font-medium">
              Launch a custom project request and let our elite network of verified professionals bid for your vision.
            </p>
            <Link
              href="/jobs/post"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-xl rounded-2xl transition-all shadow-xl shadow-cyan-500/20"
            >
              Post a Project Request <ArrowUpRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-12 border-t border-slate-100 flex justify-center">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition-colors"
          >
            ← Return to Hub
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
