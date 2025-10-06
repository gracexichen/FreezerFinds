'use client';

import React, { useEffect, useState } from 'react';
import { StoreObject } from './store-object';
import { FrozenFoodObject } from '../shared/frozen-food-object';
import { SearchBar } from './search-bar';
import { Store } from '@/types/store';
import { FrozenFoodExtended } from '@/types/frozen_foods';

export function HomeContent() {
  const [searchType, setSearchType] = useState<'store' | 'frozenFood'>('store');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Store | FrozenFoodExtended | null>(null);

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
    <div className="flex flex-col gap-10 flex-wrap justify-center">
      <SearchBar
        searchType={searchType}
        setSearchType={setSearchType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex flex-wrap gap-10 justify-center">
        {searchType === 'store' &&
          results &&
          (Array.isArray(results) ? (
            results.map((store) => (
              <div key={store.id} style={{ cursor: 'pointer' }}>
                <StoreObject store={store} />
              </div>
            ))
          ) : (
            <div style={{ cursor: 'pointer' }}>
              <StoreObject store={results as Store} />
            </div>
          ))}
        {searchType === 'frozenFood' &&
          results &&
          (Array.isArray(results) ? (
            results.map((food) => (
              <div key={food.id} style={{ cursor: 'pointer' }}>
                <FrozenFoodObject frozenFood={food} />
              </div>
            ))
          ) : (
            <div style={{ cursor: 'pointer' }}>
              <FrozenFoodObject frozenFood={results as FrozenFoodExtended} />
            </div>
          ))}
      </div>
    </div>
  );
}
