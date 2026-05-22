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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">Freelancer not found</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Info */}
          <Card className="md:col-span-2 bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {profile.full_name?.charAt(0) || 'F'}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                  <p className="text-slate-400">{profile.profile_type}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mt-4 text-sm">
                    <div>
                      <div className="text-yellow-400 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(4.5) ? 'fill-yellow-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-500">4.5 ({reviews.length} reviews)</p>
                    </div>
                  </div>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600">Hire Now</Button>
              </div>
            </CardContent>
          </Card>

          {/* Verified Badges */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-300">Verified Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/50">
                  <span className="text-lg">{badge.icon}</span>
                  <div className="text-xs">
                    <p className="text-white font-medium">{badge.name}</p>
                    <p className="text-slate-400">{badge.level}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  {profile.bio || 'No bio provided yet'}
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-slate-500 text-sm">Experience</p>
                    <p className="text-lg font-semibold text-white">{profile.years_experience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Hourly Rate</p>
                    <p className="text-lg font-semibold text-white">${profile.hourly_rate || 0}/hr</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Jobs Completed</p>
                    <p className="text-lg font-semibold text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-6">
              {portfolio.length > 0 ? (
                portfolio.map((item) => (
                  <Card key={item.id} className="bg-slate-800 border-slate-700 overflow-hidden group">
                    <div className="aspect-video bg-slate-700 relative">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex items-center justify-center h-full text-slate-600">
                            <Briefcase className="w-12 h-12" />
                         </div>
                       )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.skills?.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No portfolio items available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-white">{review.author_id}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-slate-300">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Star className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No reviews yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-6">
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <Badge key={skill} className="bg-cyan-500/20 text-cyan-300">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-400">No skills listed yet</p>
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
