import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  console.log('Deleting user with:', id);

  try {
    const supabase = await createAPIClient();

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) throw new Error(error.message);
    console.log('Account deleted NOOOOOO');
  } catch (error) {
    console.error(`Error in DELETE /api/users/${id}:`, (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
