"use client";

import React, { useState, useEffect } from 'react';
import { LocationList } from '../../components/LocationList';
import { calculateDistance, formatDistance } from '@/lib/utils';

interface Place {
  id: number;
  name: string;
  amenity: string;
  lat: number;
  lon: number;
  area?: string;
  distance?: number;
  priceRange?: string;
  imageUrl?: string;
}

interface CuisineLocationClientPageProps {
  cuisine: string;
}

const SEARCH_RADIUS = 5000; // meters, increased radius for broader search
const RESULT_LIMIT = 50;
const DEFAULT_SMU_LAT = 1.2963;
const DEFAULT_SMU_LON = 103.8502;

export default function CuisineLocationClientPage({ cuisine }: CuisineLocationClientPageProps) {
  const decodedCuisine = decodeURIComponent(cuisine);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async (latitude: number, longitude: number, cuisineTag: string) => {
      setLoading(true);
      setError(null);

      const cacheKey = `cuisine_locations:${cuisineTag}:${latitude}:${longitude}`;
      try {
        const cachedResponse = await fetch(`/api/redis-cache?key=${cacheKey}`);
        const cachedData = await cachedResponse.json();
        if (cachedData.value) {
          console.log('Serving from cache:', cacheKey);
          console.log(cachedData.value);
          setPlaces(cachedData.value as Place[]);
          setLoading(false);
          return;
        }

        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="restaurant"]["cuisine"="${cuisineTag}"](around:${SEARCH_RADIUS},${latitude},${longitude});
            way["amenity"="restaurant"]["cuisine"="${cuisineTag}"](around:${SEARCH_RADIUS},${latitude},${longitude});
            relation["amenity"="restaurant"]["cuisine"="${cuisineTag}"](around:${SEARCH_RADIUS},${latitude},${longitude});
          );
          out body;
          out tags;
          >;
          out skel qt;
        `;

        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query.trim(),
        });
        const data = await res.json();
        const rawEls: Place[] = (data.elements as any[])
          .filter(el => el.tags?.name && (el.lat || el.center?.lat) && (el.lon || el.center?.lon))
          .slice(0, RESULT_LIMIT) // Limit to 10 results
          .map(el => ({
            id: el.id,
            name: el.tags.name,
            amenity: el.tags.amenity || 'restaurant',
            lat: el.lat || el.center.lat,
            lon: el.lon || el.center.lon,
            area: el.tags['addr:street'], // Remove 'Unknown' fallback
            distance: calculateDistance(DEFAULT_SMU_LAT, DEFAULT_SMU_LON, el.lat || el.center.lat, el.lon || el.center.lon),
            priceRange: 'N/A',
          }));

        // Fetch image URLs for each place
        for (const place of rawEls) {
          try {
            const imageRes = await fetch(`/api/images?name=${encodeURIComponent(place.name)}`);
            const imageData = await imageRes.json();
            if (imageData.imageUrl) {
              place.imageUrl = imageData.imageUrl;
            }
          } catch (imageErr) {
            console.error(`Failed to fetch image for ${place.name}:`, imageErr);
          }
        }

        // Filter out places without an image URL
        const filteredPlaces = rawEls.filter(place => place.imageUrl); // Filter out places with null imageUrl
        filteredPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

        await fetch('/api/redis-cache', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: cacheKey, value: JSON.stringify(filteredPlaces), ex: 3600 }),
        });
        setPlaces(filteredPlaces);
      } catch (err) {
        console.error('Overpass fetch error:', err);
        setError('Failed to fetch locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces(DEFAULT_SMU_LAT, DEFAULT_SMU_LON, decodedCuisine.toLowerCase());
  }, [decodedCuisine]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p>Loading recommended places...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No locations found for {decodedCuisine} cuisine near SMU. Try a different cuisine!</p>
      </div>
    );
  }

  return (
    <LocationList
      restaurants={places.map(p => ({
        name: p.name,
        address: `${p.lat}, ${p.lon}`,
        area: p.area || '',
        distance: p.distance ? formatDistance(p.distance) : 'N/A',
        priceRange: p.priceRange || 'N/A',
        imageUrl: p.imageUrl,
        lat: p.lat,
        lon: p.lon,
      }))}
      allLocations={places.map(p => ({
        name: p.name,
        lat: p.lat,
        lon: p.lon,
      }))}
    />
  );
}