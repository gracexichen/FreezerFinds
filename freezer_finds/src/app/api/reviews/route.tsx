import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reviewSchema } from '@/types/reviews';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const frozen_food_id = searchParams.get('frozen_food_id');

    console.log('Received frozen_food_id:', frozen_food_id);
    if (!frozen_food_id) {
      console.log('frozen_food_id is missing in the request');
      throw new Error('Missing frozen_food_id');
    }

    // Join between reviews and users table (done this way since it's in different schemas)
    const { data: reviews } = await supabase
      .schema('app')
      .from('reviews')
      .select('id, review_text, rating, created_at, frozen_food_id, user_id')
      .eq('frozen_food_id', frozen_food_id);

    if (!reviews) {
      console.log('No reviews found for frozen_food_id:', frozen_food_id);
      return NextResponse.json([]);
    }

    const userIds = reviews.map((r) => r.user_id);
    console.log('Fetching user data for user IDs:', userIds);

    let users = [];
    for (const id of userIds) {
      const { data, error: userError } = await supabase.auth.admin.getUserById(id);
      if (userError) {
        throw new Error(userError.message);
      }
      if (data) {
        users.push({ id: data.user.id, email: data.user.email });
      }
    }

    if (!users.length) {
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
      frozen_food_id: body.frozen_food_id as string,
      user_id: body.user_id as string
    };

    const parsedBody = reviewSchema
      .pick({ review_text: true, rating: true, frozen_food_id: true, user_id: true })
      .safeParse(reviewObject);
    if (!parsedBody.success) {
      console.error('Validation errors:', parsedBody.error.issues);
      throw new Error(`Invalid review data: ${parsedBody.error.issues.map((e) => e.message).join(', ')}`);
    }

    console.log('Inserting review:', parsedBody.data);

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
