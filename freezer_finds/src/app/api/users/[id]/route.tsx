import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';
import { idSchema } from '../../shared/types';
import { InvalidRequestError, DatabaseError } from '../../shared/errors';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Validate input
    const { id } = await params;
    const parsedId = idSchema.safeParse({ id: id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['frozen_food_id']);
    }

    // Delete user by id
    const supabase = await createAPIClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw new DatabaseError(`${error.message}`);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(`Error in DELETE /api/users/[id]:`, (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
