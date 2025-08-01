"use client";

import React from 'react';
import { LocationHeader } from './components/LocationHeader';
import { LocationList } from './components/LocationList';
import { SMU_RESTAURANT_DATA } from '@/data/smu-restaurants';

export default function LocationPage() {
  // Combine all restaurants from different cuisines
  const allRestaurants = Object.values(SMU_RESTAURANT_DATA)
    .flatMap(cuisineData => 
      cuisineData.locations.map(location => ({
        ...location,
        cuisine: cuisineData.cuisine
      }))
    )
    .sort((a, b) => {
      // Sort by distance (on campus first, then by distance)
      if (a.distance === 'On campus' && b.distance !== 'On campus') return -1;
      if (b.distance === 'On campus' && a.distance !== 'On campus') return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <LocationHeader title="All Restaurant Locations Around SMU" showBackButton={true} />
      <LocationList restaurants={allRestaurants} />
    </div>
  );
}