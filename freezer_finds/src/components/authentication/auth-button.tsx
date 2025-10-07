'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { LogoutButton } from './logout-button';
import type { User } from '@supabase/supabase-js';

export function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return;
  }

  return user ? (
    <div className="flex items-center gap-4 text-sm border rounded px-2 py-1">
      <Link href="/profile">
        <Button size="sm" variant="ghost">
          <span className="italic">{user.email}</span>
        </Button>
      </Link>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
