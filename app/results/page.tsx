"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnhancedResultsDisplay } from './components/EnhancedResultsDisplay';
import { generateSampleSwipeData, rankDishes } from '@/lib/scoring';
import { getAllRestaurantCounts } from '@/data/smu-restaurants';
import { EnhancedMatchedFoodItem, GroupMember } from '@/lib/types';

interface ResultsData {
  topDishes: EnhancedMatchedFoodItem[];
  groupMembers: GroupMember[];
  totalVotes?: number;
  uniqueVoters?: number;
  message?: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupCode = searchParams.get('code');
  
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!groupCode) {
        // Fall back to sample data if no groupId provided
        const { members, swipes, foodItems } = generateSampleSwipeData();
        const restaurantCounts = getAllRestaurantCounts();
        const topDishes = rankDishes(swipes, members, foodItems, restaurantCounts, 8);
        
        setResultsData({
          topDishes,
          groupMembers: members,
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/groups/${groupCode}/results`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Group not found');
          } else {
            setError('Failed to load results');
          }
          setIsLoading(false);
          return;
        }

        const data: ResultsData = await response.json();
        setResultsData(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [groupCode]);

  const handleSeeNearbyLocations = (cuisine: string) => {
    router.push(`/location/${encodeURIComponent(cuisine)}`);
  };

  const handleStartNewSession = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {resultsData.message && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{resultsData.message}</p>
        </div>
      )}
      <EnhancedResultsDisplay
        topDishes={resultsData.topDishes}
        groupMembers={resultsData.groupMembers}
        onSeeNearbyLocations={handleSeeNearbyLocations}
        onStartNewSession={handleStartNewSession}
      />
    </div>
  );
}