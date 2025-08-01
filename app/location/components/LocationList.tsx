import React from 'react';
import { LocationCard } from './LocationCard';

interface Restaurant {
  name: string;
  area: string;
  distance: string;
  priceRange: string;
}

interface LocationListProps {
  restaurants: Restaurant[];
  className?: string;
}

export function LocationList({ restaurants, className }: LocationListProps) {
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
          />
        ))}
      </div>
    </div>
  );
}