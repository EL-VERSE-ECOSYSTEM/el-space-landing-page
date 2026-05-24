'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Rocket, Sparkles, ChevronLeft, Target, DollarSign, Clock, X } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    budget: { min: 500, max: 5000 },
    skills: '',
    timeline: 'Not specified',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleAddSkill = () => {
    if (formData.skills.trim() && !selectedSkills.includes(formData.skills.trim())) {
      setSelectedSkills([...selectedSkills, formData.skills.trim()]);
      setFormData({ ...formData, skills: '' });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('You must be logged in to post a job');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: formData.budget,
          skills: selectedSkills,
          timeline: formData.timeline,
        }),
      });

      if (!response.ok) throw new Error('Failed to post job');

      const data = await response.json();
      toast.success('Project launched successfully!');
      router.push(`/jobs/${data.project.id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         {/* Breadcrumb */}
         <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-widest mb-4">
              <Rocket className="w-3 h-3" /> Launch a Project
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Hire Top Tech Talent</h1>
           <p className="text-slate-500 font-medium text-lg">Describe your vision and get matched with the best in the industry.</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="p-8 md:p-12 pb-4">
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <Sparkles className="w-6 h-6 text-cyan-500" /> Project Definition
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 md:p-12 pt-6">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Next.js Developer for Fintech Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold focus:border-cyan-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about the project goals, requirements, and scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-3xl p-6 h-48 focus:border-cyan-500 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category */}
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="Development" className="font-bold">Development</SelectItem>
                      <SelectItem value="Design" className="font-bold">Design</SelectItem>
                      <SelectItem value="Marketing" className="font-bold">Marketing</SelectItem>
                      <SelectItem value="Writing" className="font-bold">Writing</SelectItem>
                      <SelectItem value="Other" className="font-bold">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <Label htmlFor="timeline" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Project Duration</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 pl-12 rounded-2xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="Less than 1 week" className="font-bold">Less than 1 week</SelectItem>
                        <SelectItem value="1-2 weeks" className="font-bold">1-2 weeks</SelectItem>
                        <SelectItem value="1 month" className="font-bold">1 month</SelectItem>
                        <SelectItem value="1-3 months" className="font-bold">1-3 months</SelectItem>
                        <SelectItem value="3+ months" className="font-bold">3+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <DollarSign className="w-3 h-3" /> Budget Range (USD) *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="Min"
                      value={formData.budget.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        budget: { ...formData.budget, min: parseInt(e.target.value) || 0 }
                      })}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 pl-8 rounded-2xl font-black text-lg"
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="Max"
                      value={formData.budget.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        budget: { ...formData.budget, max: parseInt(e.target.value) || 0 }
                      })}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 pl-8 rounded-2xl font-black text-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <Label htmlFor="skills" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                   <Target className="w-3 h-3" /> Target Expertise
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="skills"
                    placeholder="Enter skills (React, Figma, etc.)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    className="h-14 px-8 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all"
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-white border-2 border-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:border-red-200 transition-all group/badge"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill}
                        <X className="w-3 h-3 text-slate-400 group-hover/badge:text-red-500 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.description}
                  className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-xl rounded-[1.5rem] shadow-2xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Launching Project...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                       Launch Project <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>
                <p className="text-center text-slate-400 font-bold text-xs mt-6 uppercase tracking-widest">
                  Secure Escrow protection active for all projects
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
