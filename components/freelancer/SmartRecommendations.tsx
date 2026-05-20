'use client';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Star } from 'lucide-react';

interface RecommendedFreelancer {
  id: string;
  name: string;
  rating: number;
  rate: number;
  match_score: number;
  match_reason: string;
  skills: string[];
  completed_projects: number;
  availability: 'available' | 'busy';
}

interface SmartRecommendationsProps {
  projectSkills: string[];
  recommendations: RecommendedFreelancer[];
  onSelectFreelancer?: (freelancerId: string) => void;
}

export function SmartRecommendations({
  projectSkills,
  recommendations,
  onSelectFreelancer,
}: SmartRecommendationsProps) {
  const topPick = recommendations[0];

  return (
    <div className="space-y-4">
      {/* Top Recommendation */}
      {topPick && (
        <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-600/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-white">Top Recommended</CardTitle>
              </div>
              <Badge className="bg-yellow-600 text-white">Best Match</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {topPick.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{topPick.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(topPick.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">{topPick.rating}/5</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-slate-400 mb-1">Rate</p>
                <p className="text-cyan-400 font-semibold">${topPick.rate}/hr</p>
              </div>
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-slate-400 mb-1">Projects</p>
                <p className="text-cyan-400 font-semibold">{topPick.completed_projects}</p>
              </div>
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-slate-400 mb-1">Match</p>
                <p className="text-green-400 font-semibold">{topPick.match_score}%</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-sm text-slate-300">
                <span className="text-cyan-400 font-semibold">Why matched:</span> {topPick.match_reason}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400">Required Skills Match:</p>
              <div className="flex flex-wrap gap-2">
                {projectSkills.map(skill => (
                  <Badge
                    key={skill}
                    className={topPick.skills.includes(skill) ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}
                  >
                    {topPick.skills.includes(skill) ? '✓ ' : '○ '}{skill}
                  </Badge>
                ))}
              </div>
            </div>

            {onSelectFreelancer && (
              <Button
                onClick={() => onSelectFreelancer(topPick.id)}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                View Profile
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other Recommendations */}
      {recommendations.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <h3 className="text-white font-semibold">Other Great Matches</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.slice(1, 5).map(freelancer => (
              <Card key={freelancer.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {freelancer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{freelancer.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-slate-400">{freelancer.rating}/5</span>
                      </div>
                    </div>
                    <Badge className="bg-green-600/20 text-green-300 text-xs">
                      {freelancer.match_score}%
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>${freelancer.rate}/hr</span>
                      <span>{freelancer.completed_projects} projects</span>
                    </div>
                  </div>

                  {onSelectFreelancer && (
                    <Button
                      onClick={() => onSelectFreelancer(freelancer.id)}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    >
                      View Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
