import { StorePage } from '@/components/store/store';
import React from 'react';

interface StorePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Store({ params }: StorePageProps) {
  const { id } = await params;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <StorePage id={id} />
      </div>
    </>
  );
}
