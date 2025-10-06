'use client';

import { Input, Radio } from 'antd';
import React, { useState } from 'react';

interface SearchBarProps {
  searchType: 'store' | 'frozenFood';
  setSearchType: React.Dispatch<React.SetStateAction<'store' | 'frozenFood'>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBar({ searchType, setSearchType, searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <Radio.Group value={searchType} onChange={(e) => setSearchType(e.target.value)} className="mt-2">
        <Radio.Button value="store">Store</Radio.Button>
        <Radio.Button value="frozenFood">Frozen Food</Radio.Button>
      </Radio.Group>
    </div>
  );
}
