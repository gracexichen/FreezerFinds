'use client';
import React, { useEffect, useState } from 'react';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import AddReviewModal from './add_review_modal';
import { ReviewDisplay } from './review-display';
import { FrozenFoodInfo, FrozenFoodInfoSkeleton } from './frozen-food-display';

export function FrozenFoodPage({ id }: { id: string }) {
  const [frozenFood, setFrozenFood] = useState<FrozenFoodExtended | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetReviews, setResetReviews] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrozenFood = async () => {
      setLoading(true);
      const response = await fetch(`/api/frozen-foods/${id}`);

      const data = await response.json();
      console.log('Fetched frozen food data:', data);
      setFrozenFood(data);
      setLoading(false);
    };

    fetchFrozenFood();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row w-full items-stretch">
      {loading ? <FrozenFoodInfoSkeleton /> : frozenFood && <FrozenFoodInfo frozenFood={frozenFood} />}

      {/* Split line for separation */}
      <div className="hidden md:block border-l border-gray-300 mx-4" />

      <ReviewDisplay resetReviews={resetReviews} frozenFoodId={id} setIsModalOpen={setIsModalOpen} />

      {isModalOpen && (
        <AddReviewModal
          frozenFoodId={id}
          visible={isModalOpen}
          onSubmit={() => {
            setResetReviews(!resetReviews);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
