import { FrozenFoodPage } from '@/components/frozen-food/frozen-food';
import React from 'react';

interface FrozenFoodPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FrozenFood({ params }: FrozenFoodPageProps) {
  const { id } = await params;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <FrozenFoodPage id={id} />
      </div>
    </>
  );
}
