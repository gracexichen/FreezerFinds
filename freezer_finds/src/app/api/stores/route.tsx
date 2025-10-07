import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { storeSchema } from '@/types/store';
import { uploadImageToSupabase } from '@/app/api/shared/sharedFunctions';
import { querySchemaWithOptions } from '../shared/types';
import { InvalidRequestError } from '../shared/errors';

export async function GET(req: Request) {
  try {
    // Validate input
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const asOptions = searchParams.get('asOptions') === 'true';

    const parsedQuery = querySchemaWithOptions.safeParse({ query, asOptions });
    if (!parsedQuery.success) {
      throw new InvalidRequestError(['query', 'asOptions']);
    }

    // Fetch store records based on query
    const supabase = await createAPIClient();
    const { data: stores, error } = await supabase
      .from('stores')
      .select('id, store_name, address, city, state, picture_url')
      .ilike('store_name', `%${query}%`);

    if (error) throw new Error(error.message);

    // If asOptions is true, format response w/ value and label
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
