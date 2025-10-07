'use client';
import React, { useEffect, useState } from 'react';
import { Store } from '@/types/store';
import { Map } from './map';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { FrozenFoodObject } from '../shared/frozen-food-object';
import { StoreInfo, StoreInfoSkeleton } from './storeInfo';
import { DisplaySkeleton } from '../shared/skeleton';
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link';

export function StorePage({ id }: { id: string }) {
  const [store, setStore] = useState<null | Store>(null);
  const [loading, setLoading] = useState(true);
  const [frozenfoods, setFrozenFoods] = useState<FrozenFoodExtended[] | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`/api/frozen-foods/by-store/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch foods: ${response.status}`);
        }
        const data = await response.json();
        setFrozenFoods(data);
      } catch (err) {
        console.error('Error fetching foods:', err);
      }
    };
    fetchFoods();
  }, [id]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/stores/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch store: ${response.status}`);
        }

        const data = await response.json();

        setStore(data);
      } catch (err) {
        console.error('Error fetching store:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-col w-full">
      <div className="flex flex-row">
        {/* Store Information */}
        {loading ? <StoreInfoSkeleton /> : store && <StoreInfo store={store} />}

        {/* Map display */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 border-2 rounded-xl m-2">
          {store && <Map address={store.address} city={store.city} state={store.state} />}
        </div>
      </div>

      {/* Frozen foods section */}
      <div className="flex flex-col w-full ml-4">
        <div className="flex items-center m-4">
          <h1 className="text-3xl font-bold mr-4">Frozen Foods</h1>
          <span className="text-gray-500 hover:text-gray-700 cursor-pointer text-3xl">
            <Link href={`/add-frozen-food`}>
              <PlusSquareOutlined />
            </Link>
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          {loading ? (
            <DisplaySkeleton />
          ) : frozenfoods && frozenfoods.length > 0 ? (
            frozenfoods.map((food) => (
              <Link key={food.id} href={`/frozen-food/${food.id}`}>
                <FrozenFoodObject frozenFood={food} />
              </Link>
            ))
          ) : (
            <div>No frozen foods found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
