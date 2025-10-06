'use client';
import React, { useEffect, useState } from 'react';
import { Store } from '@/types/store';
import Map from './map';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { FrozenFoodObject } from '../shared/frozen-food-object';

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
        console.log('Fetched foods data:', data);
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
        console.log('Fetched store data:', data);

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
      <div className="flex flex=row">
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
          {loading && <div>Loading store...</div>}
          {store && (
            <div className="flex flex-col items-center max-w-md">
              <h1 className="text-3xl font-bold mb-4 text-center">{store.store_name}</h1>
              <img
                src={store.picture_url}
                alt={store.store_name}
                className="w-64 h-30 object-fit rounded-xl mb-6 border"
              />
              <p className="text-sm text-gray-500 mt-2">
                {store.address}, {store.city}, {store.state}
              </p>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50">
          {store && <Map address={store.address} city={store.city} state={store.state} />}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">Frozen Foods</h1>

        {frozenfoods && frozenfoods.length > 0 ? (
          frozenfoods.map((food) => <FrozenFoodObject key={food.id} frozenFood={food} />)
        ) : (
          <div>No frozen foods found.</div>
        )}
      </div>
    </div>
  );
}
