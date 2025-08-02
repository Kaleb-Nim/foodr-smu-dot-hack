"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FoodMap from "./FoodMap";

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

export function MapModal({
  isOpen,
  onClose,
  selectedLocation,
  allLocations,
}: MapModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[360px] sm:max-w-[800px] h-[600px] flex flex-col bg-[#BAF6F0] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-[#252525] underline">
            Location Map
          </DialogTitle>
          <DialogDescription>
            View all the locations on the map. Click on a pin to see details.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full">
          <FoodMap
            selectedLocation={selectedLocation}
            allLocations={allLocations}
          />
        </div>
        {selectedLocation && (
          <div className="border-t border-gray-200 flex justify-end">
            <Button asChild className="bg-[#F1204A] font-semibold p-6 text-lg">
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
