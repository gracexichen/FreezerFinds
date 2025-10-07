'use client';

import React from 'react';
import { Skeleton } from '../ui/skeleton';

type ReviewProps = {
  userName: string;
  reviewText: string;
  createdAt: string;
  rating: number;
};

export function ReviewSkeleton() {
  return (
    <div className="bg-white m-2 rounded-lg shadow p-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="w-[130px] h-4" />
        <Skeleton className="w-[40px] h-4" />
      </div>
      <div className="text-gray-700 mb-2">
        <Skeleton className="w-full h-4" />
      </div>
      <div className="text-xs text-gray-400">
        <Skeleton className="w-[100px] h-4" />
      </div>
    </div>
  );
}

export function ReviewComponent({
  userName = 'Anonymous',
  reviewText = 'No review provided.',
  createdAt = new Date().toLocaleDateString(),
  rating = 0
}: Partial<ReviewProps>) {
  return (
    <div className="bg-white m-2 rounded-lg shadow p-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{userName}</span>
        <span className="text-yellow-500">
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </span>
      </div>
      <div className="text-gray-700 mb-2">{reviewText}</div>
      <div className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</div>
    </div>
  );
}
