'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ReviewWithFrozenFood } from '@/types/reviews';
import { ReviewCard } from './reviewCard';
import { UserDetails } from './userDetails';
import { UserDetailsSkeleton } from './userDetailSkeleton';
import ReviewSkeleton from './reviewsSkeleton';

export default function ProfileMain() {
  const [user, setUser] = useState<any>(null);
  const [userReviews, setUserReviews] = useState<ReviewWithFrozenFood[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push('/auth/sign-up');
        return;
      }

      setUser(data.user);

      const response = await fetch(`/api/reviews/${data.user.id}`);
      if (response.ok) {
        const reviews = await response.json();
        setUserReviews(reviews);
      } else {
        console.error('Failed to fetch reviews');
        setUserReviews([]);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (!mounted) {
    return;
  }
  if (mounted && loading) {
    return (
      <div className="flex flex-col items-center">
        <UserDetailsSkeleton />
        <h2 className="text-2xl mt-10 text-center">Reviews</h2>
        <div className="flex flex-row flex-wrap gap-4 mt-6 justify-center items-center w-full">
          <ReviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <UserDetails user={user} />
      <h2 className="text-2xl mt-10 text-center">Reviews</h2>
      <div className="flex flex-row flex-wrap gap-4 mt-6 justify-center items-center w-full">
        {userReviews && userReviews.length > 0 ? (
          userReviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
}
