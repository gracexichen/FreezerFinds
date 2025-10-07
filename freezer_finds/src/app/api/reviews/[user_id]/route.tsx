import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';
import { idSchema } from '../../shared/types';
import { DatabaseError, InvalidRequestError } from '../../shared/errors';

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  try {
    // Validate input
    const user_id = params.user_id;

    const parsedId = idSchema.safeParse({ id: user_id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['user_id']);
    }

    // Fetch reviews for the given user_id joined with frozen food details
    const supabase = await createAPIClient();
    const { data: reviews, error } = await supabase
      .schema('app')
      .from('reviews')
      .select('id, review_text, rating, created_at, user_id, frozen_foods (id, food_name)')
      .eq('user_id', user_id);

    if (error) {
      console.log('Error fetching reviews:', error);
      throw new DatabaseError(error.message);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews/[user_id]:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
