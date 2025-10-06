'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ReviewWithFrozenFood } from '@/types/reviews';
import { ProfileReviewCard } from '@/components/profile/reviewCard';
import { Button, Card, Popconfirm } from 'antd';
import { showErrorToast } from '@/components/shared/toast';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [userReviews, setUserReviews] = useState<ReviewWithFrozenFood[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth/sign-up');
        return;
      }
      setUser(data.user);

      console.log(data.user.id);
      const response = await fetch(`/api/reviews/${data.user.id}`);
      const reviews = await response.json();
      console.log('Reivews fetched yay', reviews);
      setUserReviews(reviews);
    };

    fetchUser();
  }, []);

  async function deleteAccount() {
    try {
      console.log('Deleting account');
      const supabase = await createClient();

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return;
      }

      console.log('Calling API to delete this: ', data.user.id);
      const response = await fetch(`/api/users/${data.user.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      router.push('/auth/sign-up');
    } catch (error) {
      showErrorToast('Unable to delete account');
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold m-4 text-center">Welcome to your profile!</h1>
      <Card
        title={
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">User Details</div>
            <Popconfirm
              title={'Are you sure you want to delete your account?'}
              onConfirm={() => deleteAccount()}
              okText="Yes"
              cancelText="No">
              <Button size="large" danger>
                Delete Account
              </Button>
            </Popconfirm>
          </div>
        }
        className="w-1/2">
        <div className="mb-4 flex flex-col">
          <p className="text-base font-medium">
            Email: <span className="font-normal">{user.email}</span>
          </p>
          <p className="text-base font-medium">
            Joined: <span className="font-normal">{new Date(user.created_at).toLocaleDateString()}</span>
          </p>
        </div>
      </Card>
      <h1 className="text-2xl mt-10 text-center">Reviews</h1>
      <div className="flex flex-row flex-wrap gap-4 mt-6 justify-center items-center w-full">
        {userReviews && userReviews.length > 0 ? (
          userReviews.map((review) => <ProfileReviewCard key={review.id} review={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
}
