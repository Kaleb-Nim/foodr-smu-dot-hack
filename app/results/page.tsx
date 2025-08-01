"use client";

import React from 'react';
import { EnhancedResultsDisplay } from './components/EnhancedResultsDisplay';
import { generateSampleSwipeData, rankDishes } from '@/lib/scoring';
import { getAllRestaurantCounts } from '@/data/smu-restaurants';

export default function ResultsPage() {
  // Generate sample data for demonstration
  const { members, swipes, foodItems } = generateSampleSwipeData();
  const restaurantCounts = getAllRestaurantCounts();
  
  // Calculate top 8 dishes using the scoring algorithm
  const topDishes = rankDishes(swipes, members, foodItems, restaurantCounts, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <EnhancedResultsDisplay
        topDishes={topDishes}
        groupMembers={members}
        onSeeNearbyLocations={(cuisine) => alert(`Showing nearby ${cuisine} restaurants around SMU campus`)}
        onStartNewSession={() => alert('Starting new session...')}
      />
    </div>
  );
}