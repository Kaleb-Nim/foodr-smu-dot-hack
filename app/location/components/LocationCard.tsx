import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationCardProps {
  name: string;
  area: string;
  distance: string;
  priceRange: string;
  image?: string;
  className?: string;
}

export function LocationCard({
  name,
  area,
  distance,
  priceRange,
  image,
  className,
}: LocationCardProps) {
  const [imageError, setImageError] = useState(false);

  // If there's an image error or no image provided, do not render the card
  if (imageError || !image) {
    return null;
  }

  return (
    <Card className={cn(
      'bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group cursor-pointer',
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Restaurant Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)} // Set imageError to true on error
            />
          </div>

          {/* Restaurant Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 truncate">
              {area}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-700">
                {distance}
              </span>
              <span className="text-sm font-medium text-gray-900 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                {priceRange}
              </span>
            </div>
          </div>

          {/* Arrow Button */}
          <Button
            variant="outline"
            size="sm"
            className="ml-2 sm:ml-4 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0 border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          >
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}