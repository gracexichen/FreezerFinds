'use client';

import React, { useEffect, useState } from 'react';
import { StoreObject } from './store-object';
import { FrozenFoodObject } from '../shared/frozen-food-object';
import { DisplaySkeleton } from '../shared/skeleton';
import { SearchBar } from './search-bar';
import { Store } from '@/types/store';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { useRouter } from 'next/navigation';

export function HomeContent() {
  const router = useRouter();

  const [searchType, setSearchType] = useState<'store' | 'frozenFood'>('store');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Store | FrozenFoodExtended | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFrozenFoodClick = (id: string) => {
    router.push(`/frozen-food/${id}`);
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true; // track if component is still mounted

    const fetchData = async () => {
      try {
        setResults(null);
        setLoading(true);

        let data;

        if (searchType === 'store') {
          const res = await fetch('/api/stores?query=' + searchQuery, {
            signal: controller.signal
          });
          data = await res.json();
        } else {
          const res = await fetch('/api/frozen-foods?query=' + searchQuery, {
            signal: controller.signal
          });
          data = await res.json();
        }

        if (isMounted) {
          setResults(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchType, searchQuery]);

  return (
    <>
      <div className="w-1/2 m-10">
        <SearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="flex flex-wrap gap-10 justify-center">
        {/* Fix this */}
        {loading && (
          <>
            <DisplaySkeleton />
            <DisplaySkeleton />
            <DisplaySkeleton />
          </>
        )}
        {!loading &&
          searchType === 'store' &&
          results &&
          (Array.isArray(results) ? (
            results.map((store) => <StoreObject store={store} key={store.id} />)
          ) : (
            <StoreObject store={results as Store} />
          ))}
        {!loading &&
          searchType === 'frozenFood' &&
          results &&
          (Array.isArray(results) ? (
            results.map((food) => (
              <div key={food.id} onClick={() => handleFrozenFoodClick(food.id)} style={{ cursor: 'pointer' }}>
                <FrozenFoodObject frozenFood={food} />
              </div>
            ))
          ) : (
            <div
              onClick={() => handleFrozenFoodClick((results as FrozenFoodExtended).id)}
              style={{ cursor: 'pointer' }}>
              <FrozenFoodObject frozenFood={results as FrozenFoodExtended} />
            </div>
          ))}
      </div>
    </>
  );
}
