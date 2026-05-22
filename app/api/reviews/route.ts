import { NextRequest, NextResponse } from 'next/server';
import { createReview, getReviewsByUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { projectId, authorId, revieweeId, rating, comment, isPublic } = await request.json();

    if (!projectId || !authorId || !revieweeId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const reviewData = {
      project_id: projectId,
      reviewer_id: authorId,
      reviewee_id: revieweeId,
      rating,
      comment,
      visibility: isPublic !== false ? 'public' : 'private',
      reviewer_role: 'freelancer', // Should be dynamic based on caller
    };

    const { data, error } = await createReview(reviewData);

    if (error) throw error;

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const { data, error } = await getReviewsByUser(userId);

    if (error) throw error;
    if (!data) {
      return NextResponse.json({
        reviews: [],
        stats: { averageRating: 0, totalReviews: 0 }
      });
    }

    // Calculate review stats
    const avgRating = data.length > 0 ? (data.reduce((sum: number, r: any) => sum + r.rating, 0) / data.length).toFixed(1) : "0";

    return NextResponse.json({
      reviews: data.filter((r: any) => r.visibility === 'public'),
      stats: {
        averageRating: parseFloat(avgRating),
        totalReviews: data.filter((r: any) => r.visibility === 'public').length,
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}
