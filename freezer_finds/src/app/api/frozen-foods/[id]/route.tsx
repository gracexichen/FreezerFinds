import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { idSchema } from '../../shared/types';
import { InvalidRequestError, DatabaseError, MissingResourceError, AdditionalContextError } from '../../shared/errors';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createAPIClient();
    const { id } = await params;

    // Validate input
    const parsedId = idSchema.safeParse({ id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['id']);
    }

    // Fetch frozen food record
    const { data: frozenFood, error } = await supabase
      .schema('app')
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .eq('id', id)
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!frozenFood) {
      throw new MissingResourceError('frozen food');
    }

    // Fetch average rating
    const { data: ratings, error: ratingsError } = await supabase
      .schema('app')
      .from('reviews')
      .select('rating')
      .eq('frozen_food_id', frozenFood.id);

    if (ratingsError) {
      throw new AdditionalContextError('ratings');
    }

    // Get list of rating values, then compute average
    const ratingValues = ratings.map((r) => r.rating);
    const averageRating = ratingValues.length > 0 ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : 0;

    // Return combined result
    return NextResponse.json({
      ...frozenFood,
      average_rating: averageRating
    });
  } catch (error) {
    console.error('Error in GET /api/frozen-foods/[id]:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
