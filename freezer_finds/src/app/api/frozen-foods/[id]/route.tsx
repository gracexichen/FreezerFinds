import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { getPublicUrl } from '@/app/api/shared/sharedFunctions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const supabase = await createClient();

    const { data: frozenFood, error } = await supabase
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .eq('id', id)
      .single();

    if (frozenFood && frozenFood.picture_url) {
      const updatedUrl = await getPublicUrl(frozenFood.picture_url, 'frozen_food_images');
      frozenFood.picture_url = updatedUrl;
    }

    if (error) throw new Error(error.message);

    return NextResponse.json(frozenFood);
  } catch (error) {
    console.error('Error in GET /api/frozen-foods/[id]:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
