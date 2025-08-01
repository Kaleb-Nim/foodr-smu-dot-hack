'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FoodMap from './FoodMap';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: {
    name: string;
    lat: number;
    lon: number;
  };
  allLocations?: {
    name: string;
    lat: number;
    lon: number;
  }[];
}

export function MapModal({ isOpen, onClose, selectedLocation, allLocations }: MapModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
          <DialogDescription>
            View the selected location and other places on the map.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full h-full">
          <FoodMap
            selectedLocation={selectedLocation}
            allLocations={allLocations}
          />
        </div>
        {selectedLocation && (
          <div className="p-4 border-t border-gray-200">
            <Button asChild className="w-full">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lon}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}