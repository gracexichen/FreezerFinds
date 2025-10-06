import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { reviewSchema } from '@/types/reviews';
import { idSchema } from '../shared/types';
import { AdditionalContextError, DatabaseError, InvalidRequestError } from '../shared/errors';

export async function GET(req: Request) {
  try {
    const supabase = await createAPIClient();

    // Validate input
    const { searchParams } = new URL(req.url);
    const frozen_food_id = searchParams.get('frozen_food_id');

    const parsedId = idSchema.safeParse({ id: frozen_food_id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['frozen_food_id']);
    }

    // Retrieve reviews for the given frozen_food_id
    const { data: reviews, error: fetchError } = await supabase
      .schema('app')
      .from('reviews')
      .select('id, review_text, rating, created_at, frozen_food_id, user_id')
      .eq('frozen_food_id', frozen_food_id);

    if (fetchError) {
      throw new DatabaseError(fetchError.message);
    }

    // Extend reviews with user info
    const extendedReviews = await Promise.all(
      reviews.map(async (review) => {
        const { data, error: userError } = await supabase.auth.admin.getUserById(review.user_id);

        if (userError) {
          throw new AdditionalContextError('users');
        }
        return {
          ...review,
          user: {
            id: data.user.id,
            email: data.user.email
          }
        };
      })
    );

    return NextResponse.json(extendedReviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAPIClient();

    // Prepare object data to insert to database
    const body = await request.json();
    const reviewObject = {
      review_text: body.review_text as string,
      rating: Number(body.rating), // Convert to number
      frozen_food_id: body.frozen_food_id as string,
      user_id: body.user_id as string
    };

    // Validate object data
    const parsedBody = reviewSchema
      .pick({ review_text: true, rating: true, frozen_food_id: true, user_id: true })
      .safeParse(reviewObject);
    if (!parsedBody.success) {
      console.error('Validation errors:', parsedBody.error.issues);
      throw new InvalidRequestError(['review_text', 'rating', 'frozen_food_id', 'user_id']);
    }

    // Insert into database
    const { error: databaseError } = await supabase.schema('app').from('reviews').insert(parsedBody.data).select();
    if (databaseError) {
      throw new DatabaseError(`${databaseError.message}`);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error in POST /api/reviews:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
