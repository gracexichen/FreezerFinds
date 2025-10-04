'use client';

import React, { useState, useEffect } from 'react';
import { ReviewWithUser } from '@/types/reviews';
import { createClient } from '@/lib/supabase/client';

export function ReviewDisplay({ resetReviews, frozenFoodId }: { resetReviews: boolean; frozenFoodId: string }) {
  const [reviews, setReviews] = useState<Array<ReviewWithUser> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/reviews?frozen_food_id=${frozenFoodId}`);
      const dataJson = await response.json();
      console.log('Fetched reviews data:', dataJson);
      setReviews(dataJson);
    };

    fetchData();
  }, [resetReviews]);

  return (
    <>
      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
          <Review
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
    </>
  );
}

type ReviewProps = {
  userName: string;
  reviewText: string;
  createdAt: string;
  rating: number;
};

function Review({
  userName = 'Anonymous',
  reviewText = 'No review provided.',
  createdAt = new Date().toLocaleDateString(),
  rating = 0
}: Partial<ReviewProps>) {
  return (
    <div className="bg-white m-4 rounded-lg shadow p-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{userName}</span>
        <span className="text-yellow-500">
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </span>
      </div>
      <div className="text-gray-700 mb-2">{reviewText}</div>
      <div className="text-xs text-gray-400">{createdAt}</div>
    </div>
  );
}
