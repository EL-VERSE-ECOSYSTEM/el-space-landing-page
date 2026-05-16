'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, MessageSquare, ThumbsUp, Flag } from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'

interface Review {
  id: string
  author: string
  authorRole: 'client' | 'freelancer'
  rating: number
  title: string
  comment: string
  project: string
  date: string
  verified: boolean
  helpful: number
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingBreakdown: Record<number, number>
}

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [myRating, setMyRating] = useState(0)
  const [myTitle, setMyTitle] = useState('')
  const [myComment, setMyComment] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      fetchReviews()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      showLoader(2)

      const response = await fetch(`/api/reviews?userId=${user?.id}`)
      const data = await response.json()

      if (data.success && data.reviews) {
        setReviews(data.reviews)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setReviews([])
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        })
      }
      hideLoader()
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
      hideLoader()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!myRating || !myTitle || !myComment) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      showLoader(2)
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: myRating,
          title: myTitle,
          comment: myComment,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Review submitted successfully')
        setMyRating(0)
        setMyTitle('')
        setMyComment('')
        fetchReviews()
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
      hideLoader()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit review')
      hideLoader()
    }
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText) {
      toast.error('Please enter your reply')
      return
    }

    try {
      showLoader(2)
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          reviewId,
          reply: replyText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Reply posted')
        setReplyTo(null)
        setReplyText('')
        fetchReviews()
      } else {
        toast.error(data.error || 'Failed to post reply')
      }
      hideLoader()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to post reply')
      hideLoader()
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Star className="w-12 h-12 mx-auto mb-4 animate-bounce" />
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Authentication Required</CardTitle>
            <CardDescription className="text-purple-200">Please log in to view and manage reviews.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => window.location.href='/login'}>
               Go to Login
             </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Star className="w-10 h-10 text-yellow-400" />
            Reviews & Ratings
          </h1>
          <p className="text-purple-200">Your professional reputation and client feedback</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-purple-200">Overall Rating</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(stats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-200">Total Reviews</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalReviews}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-200">5 Star Reviews</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {stats.ratingBreakdown[5]}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Leave Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Leave a Review</DialogTitle>
                    <DialogDescription className="text-purple-200">
                      Share your experience with clients
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2 block">Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMyRating(rating)}
                            className="group"
                          >
                            <Star
                              className={`w-8 h-8 transition ${
                                rating <= myRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-600 group-hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="review-title" className="text-white">
                        Title
                      </Label>
                      <input
                        id="review-title"
                        type="text"
                        value={myTitle}
                        onChange={(e) => setMyTitle(e.target.value)}
                        placeholder="Sum up your experience"
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-purple-500/20 rounded text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="review-comment" className="text-white">
                        Comment
                      </Label>
                      <Textarea
                        id="review-comment"
                        value={myComment}
                        onChange={(e) => setMyComment(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        className="mt-1 bg-slate-700 border-purple-500/20 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Submit Review
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="bg-slate-800/50 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-white">{review.author}</p>
                        {review.verified && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                            Verified
                          </Badge>
                        )}
                        <Badge className={`${
                          review.authorRole === 'client'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        }`}>
                          {review.authorRole === 'client' ? 'Client' : 'Freelancer'}
                        </Badge>
                      </div>

                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-1">{review.title}</h3>
                      <p className="text-slate-300 mb-3">{review.comment}</p>

                      <p className="text-xs text-slate-500">
                        Project: {review.project} • {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2 items-center pt-4 border-t border-slate-700/50">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-blue-400"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-purple-400"
                      onClick={() => setReplyTo(replyTo === review.id ? null : review.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {replyTo === review.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to this review..."
                        className="bg-slate-700 border-purple-500/20 text-white"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReply(review.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Post Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyTo(null)
                            setReplyText('')
                          }}
                          className="border-slate-600 text-slate-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="pt-12 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-300">No reviews yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
