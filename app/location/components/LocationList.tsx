import React from 'react';
import { LocationCard } from './LocationCard';

interface Restaurant {
  name: string;
  area: string;
  distance: string;
  priceRange: string;
  imageUrl?: string;
  lat?: number;
  lon?: number;
}

interface LocationListProps {
  restaurants: Restaurant[];
  className?: string;
  allLocations?: { name: string; lat: number; lon: number; }[];
}

export function LocationList({ restaurants, className, allLocations = [] }: LocationListProps) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No restaurants found for this cuisine.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 ${className || ''}`}>
      <div className="space-y-4">
        {restaurants.map((restaurant, index) => (
          <LocationCard
            key={`${restaurant.name}-${index}`}
            name={restaurant.name}
            area={restaurant.area}
            distance={restaurant.distance}
            priceRange={restaurant.priceRange}
            image={restaurant.imageUrl}
            lat={restaurant.lat || 1.2966}
            lon={restaurant.lon || 103.8498}
            allLocations={allLocations}
          />
        ))}
      </div>
    </div>
  );
}