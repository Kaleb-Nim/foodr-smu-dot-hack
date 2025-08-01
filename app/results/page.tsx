"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedResultsDisplay } from './components/EnhancedResultsDisplay';
import { generateSampleSwipeData, rankDishes } from '@/lib/scoring';
import { getAllRestaurantCounts } from '@/data/smu-restaurants';

export default function ResultsPage() {
  const router = useRouter();
  
  // Generate sample data for demonstration
  const { members, swipes, foodItems } = generateSampleSwipeData();
  const restaurantCounts = getAllRestaurantCounts();
  
  // Calculate top 8 dishes using the scoring algorithm
  const topDishes = rankDishes(swipes, members, foodItems, restaurantCounts, 8);

  const handleSeeNearbyLocations = (cuisine: string) => {
    router.push(`/location/${encodeURIComponent(cuisine)}`);
  };

  const handleStartNewSession = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <EnhancedResultsDisplay
        topDishes={topDishes}
        groupMembers={members}
        onSeeNearbyLocations={handleSeeNearbyLocations}
        onStartNewSession={handleStartNewSession}
      />
    </div>
  );
}