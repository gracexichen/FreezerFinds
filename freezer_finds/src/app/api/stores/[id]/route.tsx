import { createAPIClient } from '@/lib/supabase/api';
import { getPublicUrl } from '../../shared/sharedFunctions';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  console.log('Getting store with:', id);

  try {
    const supabase = await createAPIClient();

    const { data: stores, error: dberror } = await supabase
      .schema('app')
      .from('stores')
      .select('id, store_name, address, city, state, picture_url')
      .eq('id', id)
      .single(); // Get single record instead of array

    if (dberror) throw new Error(dberror.message);

    if (stores && stores.picture_url) {
      const updatedUrl = await getPublicUrl(stores.picture_url, 'store_logos');
      stores.picture_url = updatedUrl;
    }

    return NextResponse.json(stores);
  } catch (error) {
    console.error(`Error in GET /api/stores/${id}:`, (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
