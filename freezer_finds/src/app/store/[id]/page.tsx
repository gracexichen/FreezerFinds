import { Navbar } from '@/components/navbar/navbar';
import { StorePage } from '@/components/store/store';
import React from 'react';

interface StorePageProps {
  params: {
    id: string;
  };
}

export default function Store({ params }: StorePageProps) {
  const { id } = params;
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-8">
        <StorePage id={id} />
      </div>
    </>
  );
}
