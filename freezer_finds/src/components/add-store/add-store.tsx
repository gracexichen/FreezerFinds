"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccessToast, showErrorToast } from "../shared/toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import React, { useState } from "react";

export function AddStore({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    setDisableSubmit(true);
    event.preventDefault();

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      showErrorToast("Please login/signup to add store");
      return;
    }

    const formData = new FormData();
    formData.append("store-name", storeName);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("store-logo", storeLogo!);

    const res = await fetch("/api/stores", {
      method: "POST",
      body: formData, // multipart/form-data automatically
    });

    if (!res.ok) {
      showErrorToast("Failed to add store");
    } else {
      showSuccessToast("Store added successfully");
      router.push("/");
    }
    setDisableSubmit(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Grocery Store</CardTitle>
          <CardDescription>
            Add a grocery store to the global database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Grocery Store"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="city">City</Label>
                </div>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="state">State</Label>
                </div>
                <Input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="store-logo">Add Store Logo</Label>
                </div>
                <Input
                  id="store-logo"
                  type="file"
                  onChange={(e) => setStoreLogo(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={disableSubmit}>
                Add Store
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
