"use client";

import { Input, Radio, Skeleton } from "antd";
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  searchType: "store" | "frozenFood";
  setSearchType: React.Dispatch<React.SetStateAction<"store" | "frozenFood">>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBar({
  searchType,
  setSearchType,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => setLoading(false), []);
  if (loading) return;
  return (
    <div className="flex flex-col justify-center items-center">
      <Input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-10"
      />
      <Radio.Group
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="mt-2 flex flex-row"
      >
        <Radio.Button
          value="store"
          className="flex justify-center items-center h-8"
        >
          Store
        </Radio.Button>
        <Radio.Button
          value="frozenFood"
          className="flex justify-center items-center h-8"
        >
          Frozen Food
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}
