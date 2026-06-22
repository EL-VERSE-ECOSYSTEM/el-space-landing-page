'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Award } from 'lucide-react';
import { toast } from 'sonner';

interface SkillEndorsementProps {
  freelancerId: string;
  skills: string[];
  endorsements?: Record<string, number>;
  clientId?: string;
  hasEndorsed?: boolean;
  onEndorse?: (skillId: string) => Promise<void>;
}

export function SkillEndorsement({
  freelancerId,
  skills,
  endorsements = {},
  clientId,
  hasEndorsed = false,
  onEndorse,
}: SkillEndorsementProps) {
  const [endorsedSkills, setEndorsedSkills] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleEndorse = async (skill: string) => {
    try {
      setLoading(true);
      
      if (onEndorse) {
        await onEndorse(skill);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setEndorsedSkills(prev => new Set([...prev, skill]));
      toast.success(`Endorsed "${skill}" skill!`);
    } catch (error) {
      console.error('Error endorsing skill:', error);
      toast.error('Failed to endorse skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-slate-400" />
          <CardTitle className="text-white">Skill Endorsements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-slate-400 text-sm">
          Endorse skills you&apos;ve seen demonstrated in action. This helps build trust in the community.
        </p>
        
        <div className="space-y-2">
          {skills.map(skill => (
            <div 
              key={skill} 
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1">
                <Badge className="bg-slate-600 text-white">{skill}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <ThumbsUp className="h-4 w-4 text-slate400" />
                  <span className="text-slate-300 font-semibold">
                    {(endorsements[skill] || 0).toLocaleString()}
                  </span>
                  <span className="text-slate-500">endorsements</span>
                </div>
              </div>
              
              {!endorsedSkills.has(skill) && clientId && (
                <Button
                  onClick={() => handleEndorse(skill)}
                  disabled={loading || hasEndorsed}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-400 hover:bg-slate-600/10"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              )}
              
              {endorsedSkills.has(skill) && (
                <Badge className="bg-slate600 text-white">
                  ✓ Endorsed
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-600">
          <p className="text-xs text-slate-500">
            💡 Tip: Endorsements from verified clients help freelancers stand out!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
