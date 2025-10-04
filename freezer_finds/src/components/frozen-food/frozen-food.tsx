'use client';
import React, { useEffect, useState } from 'react';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { Button } from '../ui/button';
import AddReviewModal from './add_review_modal';
import { ReviewDisplay } from './reviews';

export function FrozenFoodPage({ id }: { id: string }) {
  const [frozenFood, setFrozenFood] = useState<FrozenFoodExtended | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetReviews, setResetReviews] = useState(false);

  useEffect(() => {
    const fetchFrozenFood = async () => {
      const response = await fetch(`/api/frozen-foods/${id}`);
      const data = await response.json();
      console.log('Fetched frozen food data:', data);
      setFrozenFood(data);
    };

    fetchFrozenFood();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        {frozenFood && (
          <div className="flex flex-col items-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-center">{frozenFood.food_name}</h1>
            <img
              src={frozenFood.picture_url}
              alt={frozenFood.food_name}
              className="w-64 h-64 object-cover rounded-xl mb-6 border"
            />
            {/* Rounded to nearest half star */}
            <div>
              <span style={{ color: '#fadb14', marginRight: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const rating = frozenFood.average_rating ?? 0;
                  if (rating >= i + 1) return '★';
                  if (rating >= i + 0.5) return '⯨';
                  return '☆';
                })}
              </span>
              {frozenFood.average_rating?.toFixed(2)}
            </div>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Store:</span> {frozenFood.stores?.store_name}
            </p>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50">
        <ReviewDisplay resetReviews={resetReviews} frozenFoodId={id} />
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Add Review
        </Button>
      </div>
      {isModalOpen && (
        <AddReviewModal
          frozenFoodId={id}
          visible={isModalOpen}
          onSubmit={() => {
            // closes modal
            setResetReviews(!resetReviews);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
