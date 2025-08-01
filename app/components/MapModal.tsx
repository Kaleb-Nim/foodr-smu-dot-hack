'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
      </DialogContent>
    </Dialog>
  );
}