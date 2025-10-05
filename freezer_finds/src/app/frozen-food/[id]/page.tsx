import { Navbar } from '@/components/navbar/navbar';
import { FrozenFoodPage } from '@/components/frozen-food/frozen-food';
import React from 'react';

interface FrozenFoodPageProps {
  params: {
    id: string;
  };
}

export default function FrozenFood({ params }: FrozenFoodPageProps) {
  const { id } = params;
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-8">
        <FrozenFoodPage id={id} />
      </div>
    </>
  );
}
