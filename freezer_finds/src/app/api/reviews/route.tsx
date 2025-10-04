import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reviewSchema } from '@/types/reviews';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    console.log('Received user_id:', user_id);
    if (!user_id) {
      console.log('user_id is missing in the request');
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    // Join between reviews and users table (done this way since it's in different schemas)
    const { data: reviews } = await supabase
      .schema('app')
      .from('reviews')
      .select('id, review_text, rating, created_at, user_id')
      .eq('user_id', user_id);

    if (!reviews) {
      console.log('No reviews found for user_id:', user_id);
      return NextResponse.json([]);
    }

    const userIds = reviews.map((r) => r.user_id);
    console.log('Fetching user data for user IDs:', userIds);
    const { data: users, error } = await supabase.schema('auth').from('users').select('id, email').in('id', userIds);
    if (error) {
      console.log('Error fetching users:', error.message);
    }
    if (!users) {
      console.log('No users found for the given user IDs');
      return NextResponse.json([]);
    }

    const reviewsWithUser = reviews.map((r) => ({
      ...r,
      user: users.find((u) => u.id === r.user_id) || null
    }));
    console.log('Fetched reviews with user data:', reviewsWithUser);
    return NextResponse.json(reviewsWithUser);
  } catch (error) {
    console.error('Error in GET /api/reviews:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const reviewObject = {
      review_text: body.review_text as string,
      rating: Number(body.rating), // Convert to number
      user_id: body.user_id as string
    };

    const parsedBody = reviewSchema.pick({ review_text: true, rating: true, user_id: true }).safeParse(reviewObject);
    if (!parsedBody.success) {
      console.error('Validation errors:', parsedBody.error.issues);
      throw new Error(`Invalid review data: ${parsedBody.error.issues.map((e) => e.message).join(', ')}`);
    }

    const { error: databaseError } = await supabase.schema('app').from('reviews').insert(parsedBody.data).select();
    if (databaseError) {
      throw new Error(`Database error: ${databaseError.message}`);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error in POST /api/reviews:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
