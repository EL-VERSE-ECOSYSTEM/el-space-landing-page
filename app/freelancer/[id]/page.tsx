'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Award, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default function FreelancerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchReviews();
    fetchPortfolio();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile?userId=${params.id}`);
      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?userId=${params.id}`);
      const data = await response.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio?userId=${params.id}`);
      const data = await response.json();
      if (data.items) setPortfolio(data.items);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground font-bold">Specialist not found in the Nexus</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const badges = [
    { id: 1, name: 'Portfolio Verified', level: 'Portfolio', icon: '✓' },
    { id: 2, name: 'Test Project Passed', level: 'Test Project', icon: '★' },
    { id: 3, name: 'ELACCESS Member', level: 'ELACCESS', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Info */}
          <Card className="md:col-span-2 bg-card border-border shadow-xl">
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                  {profile.full_name?.charAt(0) || 'F'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-foreground tracking-tight">{profile.full_name}</h1>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{profile.profile_type}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mt-4 text-sm">
                    <div>
                      <div className="text-amber-500 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(4.5) ? 'fill-amber-500' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest mt-1">4.5 Rating / {reviews.length} missions</p>
                    </div>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 rounded-xl">Initialize Contract</Button>
              </div>
            </CardContent>
          </Card>

          {/* Verified Badges */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Network Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 border border-border">
                  <span className="text-lg text-primary">{badge.icon}</span>
                  <div className="text-[10px]">
                    <p className="text-foreground font-black uppercase tracking-tight">{badge.name}</p>
                    <p className="text-muted-foreground font-bold">{badge.level}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-card border border-border p-1 rounded-2xl w-full justify-start overflow-x-auto">
            <TabsTrigger value="about" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Dossier</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Deployments</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Nexus Feedback</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Intelligence Stack</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="bg-card border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">Mission Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  {profile.bio || 'No intelligence data provided yet.'}
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Duration</p>
                    <p className="text-2xl font-black text-foreground">{profile.years_experience || 0} Cycles</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement Rate</p>
                    <p className="text-2xl font-black text-foreground">${profile.hourly_rate || 0}/HR</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations Neutralized</p>
                    <p className="text-2xl font-black text-foreground">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-6">
              {portfolio.length > 0 ? (
                portfolio.map((item) => (
                  <Card key={item.id} className="bg-card border-border overflow-hidden group shadow-lg hover:border-primary/30 transition-all">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                       ) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground/20">
                            <Briefcase className="w-12 h-12" />
                         </div>
                       )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-black text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-medium">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.skills?.map((skill: string) => (
                          <Badge key={skill} className="bg-muted text-muted-foreground border-none text-[10px] font-black uppercase px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full bg-card border-border border-2 border-dashed rounded-[2rem]">
                  <CardContent className="py-20 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-black uppercase text-sm">Deployment Log Empty</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-card border-border shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-foreground uppercase text-sm tracking-tight">{review.author_id}</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-muted-foreground font-medium italic">"{review.comment}"</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-card border-border border-2 border-dashed rounded-[2rem]">
                  <CardContent className="py-20 text-center">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-black uppercase text-sm">Nexus Reputation Syncing...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="bg-card border-border shadow-xl">
              <CardContent className="py-8">
                <div className="flex flex-wrap gap-3">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <Badge key={skill} className="bg-primary/10 text-primary border-none font-black uppercase px-4 py-2 rounded-xl text-xs tracking-widest">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground font-medium">Intelligence stack not yet documented.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
