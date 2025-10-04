'use client';

import React, { useEffect, useState } from 'react';
import { StoreObject } from './store-object';
import { FrozenFoodObject } from './frozen-food-object';
import { SearchBar } from './search-bar';
import { Store } from '@/types/store';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { useRouter } from 'next/navigation';

export function HomeContent() {
  const router = useRouter();

  const [searchType, setSearchType] = useState<'store' | 'frozenFood'>('store');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Store | FrozenFoodExtended | null>(null);

  const handleFrozenFoodClick = (id: string) => {
    router.push(`/frozen-food/${id}`);
  };

  useEffect(() => {
    // Fetch data based on searchType and searchQuery
    const fetchData = async () => {
      let data;
      if (searchType === 'store') {
        const res = await fetch('/api/stores?query=' + searchQuery, {
          method: 'GET'
        });
        data = await res.json();
      } else {
        const res = await fetch('/api/frozen-foods?query=' + searchQuery, {
          method: 'GET'
        });
        data = await res.json();
      }
      console.log(data);
      setResults(data);
    };
    fetchData();
  }, [searchType, searchQuery]);

  return (
    <div className="flex flex-row gap-10 flex-wrap justify-center">
      <div className="w-2/6">
        <SearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="flex flex-wrap gap-10 justify-center">
        {searchType === 'store' &&
          results &&
          (Array.isArray(results) ? (
            results.map((store) => <StoreObject store={store} />)
          ) : (
            <StoreObject store={results as Store} />
          ))}
        {searchType === 'frozenFood' &&
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
    </div>
  );
}
