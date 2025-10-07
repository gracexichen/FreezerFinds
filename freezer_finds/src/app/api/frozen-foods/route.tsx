import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { frozenFoodSchema } from '@/types/frozen_foods';
import { uploadImageToSupabase, addAverageRatingsToFoods } from '@/app/api/shared/sharedFunctions';
import { querySchema } from '../shared/types';
import { InvalidRequestError } from '../shared/errors';

export async function GET(req: Request) {
  try {
    const supabase = await createAPIClient();

    // Validate input
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    const parsedId = querySchema.safeParse({ query });
    if (!parsedId.success) {
      throw new InvalidRequestError(['query']);
    }

    // Fetch frozen food records based on query
    const { data: frozenFoods, error } = await supabase
      .from('frozen_foods')
      .select('id, created_at, food_name, picture_url, store_id, stores(id, store_name)')
      .ilike('food_name', `%${query}%`);

    if (error) throw new Error(error.message);

    // Add extended info
    const extendedFrozenFoods = await addAverageRatingsToFoods(frozenFoods);

    return NextResponse.json(extendedFrozenFoods);
  } catch (error) {
    console.error('Error in GET /api/frozen-foods:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAPIClient();

    // Prepare object data to insert to database
    const formData = await request.formData();
    const file = formData.get('food-image') as File;
    const filePath = await uploadImageToSupabase(file, 'frozen_food_images');

    const frozenFoodObject = {
      store_id: formData.get('store-id') as string,
      food_name: formData.get('food-name') as string,
      picture_url: filePath
    };

    // Validate object data
    const parsedBody = frozenFoodSchema
      .pick({ store_id: true, food_name: true, picture_url: true })
      .safeParse(frozenFoodObject);
    if (!parsedBody.success) {
      console.error('Validation errors:', parsedBody.error.issues);
      throw new Error(`Invalid frozen food data: ${parsedBody.error.issues.map((e) => e.message).join(', ')}`);
    }

    // Insert into database
    const { error: databaseError } = await supabase.schema('app').from('frozen_foods').insert(parsedBody.data).select();
    if (databaseError) {
      throw new Error(`Database error: ${databaseError.message}`);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error in POST /api/frozen-foods:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
