"use client";

import React from 'react';
import { LocationHeader } from '../components/LocationHeader';
import { LocationList } from '../components/LocationList';
import { SMU_RESTAURANT_DATA } from '@/data/smu-restaurants';
import { notFound } from 'next/navigation';

interface LocationPageProps {
  params: {
    cuisine: string;
  };
}

export default function CuisineLocationPage({ params }: LocationPageProps) {
  const { cuisine } = params;
  
  // Decode the cuisine parameter (in case it's URL encoded)
  const decodedCuisine = decodeURIComponent(cuisine);
  
  // Find the restaurant data for this cuisine
  const restaurantData = SMU_RESTAURANT_DATA[decodedCuisine];
  
  if (!restaurantData) {
    notFound();
  }

  const title = `Top Locations for ${decodedCuisine} cuisine`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <LocationHeader title={title} showBackButton={true} />
      <LocationList restaurants={restaurantData.locations} />
    </div>
  );
}