'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, TrendingUp, CheckCircle, X, Download } from 'lucide-react';

interface FreelancerData {
  id: string;
  full_name: string;
  hourly_rate: number;
  years_experience: number;
  avg_rating: number;
  total_projects: number;
  skills: string[];
  bio: string;
  cv_url?: string;
  profile_picture?: string;
  availability?: 'available' | 'busy' | 'unavailable';
  response_time?: string;
  completion_rate?: number;
}

interface FreelancerComparisonProps {
  freelancers: FreelancerData[];
  onSelectFreelancer?: (freelancerId: string) => void;
}

export function FreelancerComparison({ 
  freelancers, 
  onSelectFreelancer 
}: FreelancerComparisonProps) {
  const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>(
    freelancers.slice(0, 2).map(f => f.id)
  );
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectFreelancer = (id: string) => {
    if (selectedFreelancers.includes(id)) {
      setSelectedFreelancers(selectedFreelancers.filter(fid => fid !== id));
    } else if (selectedFreelancers.length < 3) {
      setSelectedFreelancers([...selectedFreelancers, id]);
    }
  };

  const displayFreelancers = freelancers.filter(f => selectedFreelancers.includes(f.id));

  const skillsUnion = Array.from(new Set(displayFreelancers.flatMap(f => f.skills)));

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Compare Freelancers</h3>
          <Button
            onClick={() => setShowComparison(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white"
            disabled={selectedFreelancers.length < 2}
          >
            Compare ({selectedFreelancers.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freelancers.map((freelancer) => (
            <Card 
              key={freelancer.id} 
              className={`cursor-pointer transition-all ${
                selectedFreelancers.includes(freelancer.id)
                  ? 'bg-slate-900/30 border-slate-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
              onClick={() => handleSelectFreelancer(freelancer.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-500 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {freelancer.full_name?.charAt(0) || 'F'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-base truncate">
                      {freelancer.full_name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(freelancer.avg_rating || 0)
                                ? 'fill-slate-400 text-slate-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {freelancer.avg_rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {selectedFreelancers.includes(freelancer.id) && (
                    <CheckCircle className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-slate-400">Rate</p>
                    <p className="font-semibold text-slate-400">${freelancer.hourly_rate}/hr</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-slate-400">Exp.</p>
                    <p className="font-semibold text-slate-400">{freelancer.years_experience}y</p>
                  </div>
                </div>
                
                {freelancer.completion_rate !== undefined && (
                  <div className="bg-slate-600/20 border border-slate-600/50 rounded p-2">
                    <p className="text-xs text-slate-400 mb-1">Completion Rate</p>
                    <div className="w-full bg-slate-700 rounded h-2">
                      <div 
                        className="bg-slate-500 h-2 rounded"
                        style={{ width: `${freelancer.completion_rate}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 line-clamp-2">{freelancer.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Freelancer Comparison</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-slate-700 border-slate-600 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills Match</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Feature</th>
                      {displayFreelancers.map(f => (
                        <th key={f.id} className="text-center py-3 px-4 text-white font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {f.full_name?.charAt(0)}
                            </div>
                            <div className="text-sm truncate max-w-[120px]">{f.full_name}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-400">Hourly Rate</td>
                      {displayFreelancers.map(f => (
                        <td key={f.id} className="text-center py-3 px-4 text-white font-semibold">
                          ${f.hourly_rate}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-400">Experience</td>
                      {displayFreelancers.map(f => (
                        <td key={f.id} className="text-center py-3 px-4 text-white font-semibold">
                          {f.years_experience}y
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-400">Rating</td>
                      {displayFreelancers.map(f => (
                        <td key={f.id} className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-slate-400 text-slate-400" />
                            <span className="text-white font-semibold">{f.avg_rating?.toFixed(1)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-400">Projects Completed</td>
                      {displayFreelancers.map(f => (
                        <td key={f.id} className="text-center py-3 px-4 text-white font-semibold">
                          {f.total_projects}
                        </td>
                      ))}
                    </tr>
                    {displayFreelancers.some(f => f.availability) && (
                      <tr className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">Availability</td>
                        {displayFreelancers.map(f => (
                          <td key={f.id} className="text-center py-3 px-4">
                            <Badge className={
                              f.availability === 'available' 
                                ? 'bg-slate-600 text-white'
                                : f.availability === 'busy'
                                ? 'bg-slate-600 text-white'
                                : 'bg-red-600 text-white'
                            }>
                              {f.availability || 'N/A'}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                    )}
                    {displayFreelancers.some(f => f.response_time) && (
                      <tr className="hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">Avg Response Time</td>
                        {displayFreelancers.map(f => (
                          <td key={f.id} className="text-center py-3 px-4 text-white font-semibold">
                            {f.response_time || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="space-y-3">
                {skillsUnion.map(skill => (
                  <div key={skill} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-slate-400 font-medium min-w-[150px]">{skill}</div>
                    <div className="flex gap-2 flex-1">
                      {displayFreelancers.map(f => (
                        <div key={f.id} className="flex-1">
                          {f.skills.includes(skill) ? (
                            <Badge className="bg-slate-600 text-white w-full justify-center">
                              ✓ Has
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-600 text-slate-400 w-full justify-center">
                              —
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {displayFreelancers.map(f => (
                <Card key={f.id} className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{f.full_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Bio</p>
                      <p className="text-slate-300 text-sm">{f.bio}</p>
                    </div>
                    {f.cv_url && (
                      <Button 
                        onClick={() => window.open(f.cv_url, '_blank')}
                        variant="outline"
                        className="w-full border-slate-600 text-slate-400 hover:bg-slate-600/10"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </Button>
                    )}
                    {onSelectFreelancer && (
                      <Button 
                        onClick={() => {
                          onSelectFreelancer(f.id);
                          setShowComparison(false);
                        }}
                        className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                      >
                        Select This Freelancer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
