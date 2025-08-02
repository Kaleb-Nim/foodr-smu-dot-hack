"use client";

import React, { useState, useEffect } from "react";
import { Map, Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface Place {
  id: number;
  name: string;
  amenity: string;
  lat: number;
  lon: number;
}

const SEARCH_RADIUS = 1000; // meters
const RESULT_LIMIT = 50;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function FoodMap({
  selectedLocation,
  allLocations,
}: {
  selectedLocation?: { name: string; lat: number; lon: number };
  allLocations?: { name: string; lat: number; lon: number }[];
}) {
  const DEFAULT_SMU_LAT = 1.2963;
  const DEFAULT_SMU_LON = 103.8502;

  const [viewState, setViewState] = useState({
    longitude: DEFAULT_SMU_LON,
    latitude: DEFAULT_SMU_LAT,
    zoom: 15,
  });
  const [position, setPosition] = useState<[number, number]>([
    DEFAULT_SMU_LON,
    DEFAULT_SMU_LAT,
  ]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [useLiveLocation, setUseLiveLocation] = useState(false);

  const fetchPlaces = async (latitude: number, longitude: number) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|fast_food|bar"](around:${SEARCH_RADIUS},${latitude},${longitude});
      );
      out body;
    `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query.trim(),
      });
      const data = await res.json();
      const els: Place[] = (data.elements as any[])
        .filter((el) => el.tags?.name)
        .slice(0, RESULT_LIMIT)
        .map((el) => ({
          id: el.id,
          name: el.tags.name,
          amenity: el.tags.amenity || "unknown",
          lat: el.lat,
          lon: el.lon,
        }));
      setPlaces(els);
    } catch (err) {
      console.error("Overpass fetch error:", err);
    }
  };

  const fetchPrices = async () => {
    if (!selected) return;
    try {
      const response = await fetch(
        `/api/prices/?placeName=${selected.name}&placeAmenity=${selected.amenity}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Price data:", data);
      if (data.priceRange) {
        setSelectedPrice(data.priceRange);
      } else {
        setSelectedPrice("Loading...");
      }
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }
  };

  useEffect(() => {
    if (selected) {
      fetchPrices();
    }
  }, [selected]);

  useEffect(() => {
    if (useLiveLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setPosition([longitude, latitude]);
          setViewState((prev) => ({ ...prev, longitude, latitude }));
          fetchPlaces(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to default if live location fails
          setUseLiveLocation(false); // Turn off live location if it fails
          setPosition([DEFAULT_SMU_LON, DEFAULT_SMU_LAT]);
          setViewState((prev) => ({
            ...prev,
            longitude: DEFAULT_SMU_LON,
            latitude: DEFAULT_SMU_LAT,
          }));
          fetchPlaces(DEFAULT_SMU_LAT, DEFAULT_SMU_LON);
        }
      );
    }
  }, [useLiveLocation]);

  // Initial fetch for places when component mounts
  useEffect(() => {
    if (!useLiveLocation) {
      fetchPlaces(DEFAULT_SMU_LAT, DEFAULT_SMU_LON);
    }
  }, []);

  const handleToggleLiveLocation = () => {
    const newUseLiveLocation = !useLiveLocation;
    setUseLiveLocation(newUseLiveLocation);
    if (!newUseLiveLocation) {
      setPosition([DEFAULT_SMU_LON, DEFAULT_SMU_LAT]);
      setViewState({
        longitude: DEFAULT_SMU_LON,
        latitude: DEFAULT_SMU_LAT,
        zoom: 15, // Keep the current zoom or reset to a default
      });
      fetchPlaces(DEFAULT_SMU_LAT, DEFAULT_SMU_LON);
    }
  };

  if (!viewState) return <p>Loading map...</p>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <button
        onClick={handleToggleLiveLocation}
        className="absolute top-4 left-3 z-10 px-3 py-2 text-[#252525] rounded-lg bg-white font-semibold shadow-lg shadow-gray-700 border-2 border-[#F1204A] active:bg-[#F1204A] active:text-white transition duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {useLiveLocation ? "Use Default Location (SMU)" : "Use Live Location"}
      </button>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Current Location Marker */}
        <Marker longitude={position[0]} latitude={position[1]} color="blue" />

        {/* All Locations Markers */}
        {places?.map((loc, index) => (
          <Marker
            key={`all-${index}`}
            longitude={loc.lon}
            latitude={loc.lat}
            color={
              selectedLocation && loc.name === selectedLocation.name
                ? "red"
                : "green"
            }
            onClick={() =>
              setSelected({
                id: index,
                name: loc.name,
                amenity: "Restaurant",
                lat: loc.lat,
                lon: loc.lon,
              })
            }
          />
        ))}

        {/* Selected Location Marker (if different from current location) */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lon}
            latitude={selectedLocation.lat}
            color="red" // Highlight selected location in red
          />
        )}

        {/* Popup for selected place */}
        {selected && (
          <Popup
            longitude={selected.lon}
            latitude={selected.lat}
            anchor="top"
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-[#252525]">
              <p className="text-base font-semibold">{selected.name}</p>
              <p className="text-sm opacity-60">Type: {selected.amenity}</p>
              <p className="text-sm opacity-60">
                Price: {selectedPrice !== null ? selectedPrice : "Loading..."}
              </p>
            </div>
          </Popup>
        )}

        {/* Selected Location Marker (if different from current location) */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lon}
            latitude={selectedLocation.lat}
            color="red" // Highlight selected location in red
          >
            <div className="relative -top-14 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-sm font-semibold whitespace-nowrap text-[#252525]">
              <div>{selectedLocation.name}</div>
              <div>
                {selectedLocationPrice !== null
                  ? selectedLocationPrice
                  : "Loading..."}
              </div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
