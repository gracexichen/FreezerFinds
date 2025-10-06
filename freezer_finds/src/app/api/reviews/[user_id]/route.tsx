import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const user_id = params.user_id;

  try {
    console.log('called reviews get api:', user_id);
    const supabase = await createAPIClient();

    // Join between reviews and users table (done this way since it's in different schemas)
    const { data: reviews, error: fetchError } = await supabase
      .schema('app')
      .from('reviews')
      .select('id, review_text, rating, created_at, user_id, frozen_foods (id, food_name)')
      .eq('user_id', user_id);
    console.log('Fetched reviews:', reviews);

    console.log(reviews);
    if (fetchError) {
      console.log('Error fetching reviews:', fetchError);
      throw new Error(fetchError.message);
    }

    if (!reviews) {
      console.log('No reviews found for user_id:', user_id);
      return NextResponse.json([]);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
