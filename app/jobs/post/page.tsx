'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
    setLoading(true);

    try {
      const userId = user?.id || ''
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: userId, // Updated from hardcoded user-123
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
      toast.success('Job posted successfully!');
      router.push(`/jobs/${data.project.id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Post a New Job</CardTitle>
            <CardDescription className="text-slate-400">Describe your project and find the right freelancer</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-slate-300">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Build a React Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-slate-300">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 h-32"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-slate-300">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetMin" className="text-slate-300">Min Budget ($) *</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    min="0"
                    value={formData.budget.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: { ...formData.budget, min: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="budgetMax" className="text-slate-300">Max Budget ($) *</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    min="0"
                    value={formData.budget.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: { ...formData.budget, max: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label htmlFor="skills" className="text-slate-300">Required Skills</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="skills"
                    placeholder="Type and press Enter..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill();
                      }
                    }}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-slate-600 hover:bg-slate-500"
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} className="bg-cyan-500/20 text-cyan-300 cursor-pointer hover:bg-cyan-500/30">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <Label htmlFor="timeline" className="text-slate-300">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Less than 1 week">Less than 1 week</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3+ months">3+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.description}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
