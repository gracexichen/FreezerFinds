import React, { useState, useEffect } from 'react';
import { ReviewWithUser } from '@/types/reviews';
import { ReviewComponent, ReviewSkeleton } from './reviews';
import { Button } from '../ui/button';

export function ReviewDisplay({
  resetReviews,
  frozenFoodId,
  setIsModalOpen
}: {
  resetReviews: boolean;
  frozenFoodId: string;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const [reviews, setReviews] = useState<Array<ReviewWithUser> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`/api/reviews?frozen_food_id=${frozenFoodId}`);
      const dataJson = await response.json();
      console.log('Fetched reviews data:', dataJson);
      setReviews(dataJson);
      setLoading(false);
    };

    fetchData();
  }, [resetReviews]);

  if (loading) {
    return (
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
        <ReviewSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewComponent
            key={review.id}
            userName={review.user.email}
            reviewText={review.review_text}
            createdAt={String(review.created_at)}
            rating={review.rating}
          />
        ))
      ) : (
        <p>No reviews available.</p>
      )}
      <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
        Add Review
      </Button>
    </div>
  );
}
