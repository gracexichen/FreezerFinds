import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { storeSchema } from '@/types/store';
import { uploadImageToSupabase } from '@/app/api/shared/sharedFunctions';
import { getPublicUrl } from '@/app/api/shared/sharedFunctions';

export async function GET(req: Request) {
  try {
    const supabase = await createAPIClient();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const asOptions = searchParams.get('asOptions') === 'true';

    const { data: stores, error } = await supabase
      .from('stores')
      .select('id, store_name, address, city, state, picture_url')
      .ilike('store_name', `%${query}%`);

    if (stores && Array.isArray(stores)) {
      for (const store of stores) {
        if (store.picture_url) {
          const updatedUrl = await getPublicUrl(store.picture_url, 'store_logos');
          store.picture_url = updatedUrl;
        }
      }
    }

    if (error) throw new Error(error.message);

    if (asOptions) {
      const options = stores.map((store) => ({
        value: store.id,
        label: store.store_name,
        ...store
      }));
      return NextResponse.json(options);
    }

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error in GET /api/stores:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAPIClient();
    const formData = await request.formData();

    console.log('Form Data Entries:');
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    const file = formData.get('store-logo') as File;
    const filePath = await uploadImageToSupabase(file, 'store_logos');
    console.log('Uploaded file path:', filePath);

    const storeObject = {
      store_name: formData.get('store-name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      picture_url: filePath
    };

    const parsedBody = storeSchema
      .pick({ store_name: true, address: true, city: true, state: true, picture_url: true })
      .safeParse(storeObject);
    if (!parsedBody.success) {
      throw new Error('Invalid store data');
    }

    const { error: databaseError } = await supabase.schema('app').from('stores').insert(parsedBody.data).select();
    if (databaseError) {
      throw new Error(`Database error: ${databaseError.message}`);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error in POST /api/stores:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
