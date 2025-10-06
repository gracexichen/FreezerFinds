'use client';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccessToast, showErrorToast } from '../shared/toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AddFrozenFood({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [foodName, setFoodName] = useState('');
  const [storeId, setStoreId] = useState<string | null>(null);
  const [foodImage, setFoodImage] = useState<File | null>(null);

  const router = useRouter();

  const loadOptions = async (inputValue: string) => {
    const res = await fetch(`/api/stores?query=${inputValue}`);
    const data = await res.json();
    return data.map((store: any) => ({
      value: store.id,
      label: store.store_name,
      address: store.address,
      city: store.city,
      state: store.state
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      showErrorToast('Please login/signup to add store');
      return;
    }

    if (!storeId || !foodImage) {
      alert('Please select a store and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('food-name', foodName);
    formData.append('store-id', storeId);
    formData.append('food-image', foodImage);

    const res = await fetch('/api/frozen-foods', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      showErrorToast('Unable to add frozen food');
    } else {
      showSuccessToast('Successfully added frozen food!');
      router.push('/');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Frozen Food</CardTitle>
          <CardDescription>Add a frozen food item to a store.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Food Name</Label>
                <Input
                  id="store-name"
                  type="text"
                  placeholder="Food Name"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="location">Store</Label>
                </div>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  getOptionLabel={(option: any) =>
                    `${option.label} (${option.address}, ${option.city}, ${option.state})`
                  }
                  defaultOptions
                  onChange={(selectedOption) => setStoreId(selectedOption?.value || null)}
                  placeholder="Search stores"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="store-logo">Add Picture</Label>
                </div>
                <Input
                  id="store-logo"
                  type="file"
                  placeholder="Store Logo URL"
                  onChange={(e) => setFoodImage(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Frozen Food
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
