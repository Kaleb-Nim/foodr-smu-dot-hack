import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DishCard } from './DishCard';
import { EnhancedMatchedFoodItem, GroupMember } from '@/lib/types';
import { Trophy, Users, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface EnhancedResultsDisplayProps {
  topDishes: EnhancedMatchedFoodItem[];
  groupMembers: GroupMember[];
  onSeeNearbyLocations: (cuisine: string) => void;
  onStartNewSession?: () => void;
}

export function EnhancedResultsDisplay({
  topDishes,
  groupMembers,
  onSeeNearbyLocations,
  onStartNewSession,
}: EnhancedResultsDisplayProps) {
  const [showAllDishes, setShowAllDishes] = useState(false);
  
  if (topDishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">No Matches Found!</h2>
          <p className="text-lg text-gray-600 mb-8">
            It looks like the group couldn't agree on anything this time. Maybe try again?
          </p>
          {onStartNewSession && (
            <Button 
              onClick={onStartNewSession} 
              className="px-6 py-3 text-lg font-semibold rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Start New Session
            </Button>
          )}
        </div>
      </div>
    );
  }

  const topMatch = topDishes[0];
  const remainingDishes = topDishes.slice(1);
  const maxScore = Math.max(...topDishes.map(dish => dish.weightedScore));
  
  // Calculate total participants and engagement stats
  const totalMembers = groupMembers.length;
  const totalSwipes = topDishes.reduce((acc, dish) => 
    acc + dish.swipeBreakdown.superlikes + dish.swipeBreakdown.likes + dish.swipeBreakdown.dislikes, 0
  );

  return (
    <div className="min-h-screen p-4 bg-[#252525]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Top Flavor Picks
            </h1>
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your group's preferences, here are the top-ranked dishes around SMU campus
          </p>
          
          {/* Group Stats */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{totalMembers} group members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              <span>{totalSwipes} total swipes</span>
            </div>
          </div>
        </div>

        {/* Winner Card - Highlighted */}
        {topMatch && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🏆 Group Favorite</h2>
              <p className="text-lg text-gray-600">The clear winner with the highest score!</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <DishCard
                dish={topMatch}
                rank={1}
                maxScore={maxScore}
                onSeeNearbyLocations={onSeeNearbyLocations}
                className="border-4 border-yellow-400 shadow-2xl transform scale-105"
              />
            </div>
          </div>
        )}

        {/* Separator */}
        {remainingDishes.length > 0 && (
          <div className="mb-8">
            <Separator className="my-8" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Other Great Options</h2>
              <p className="text-gray-600">More dishes your group might enjoy</p>
            </div>
          </div>
        )}

        {/* Other Dishes Grid */}
        {remainingDishes.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(showAllDishes ? remainingDishes : remainingDishes.slice(0, 3)).map((dish, index) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  rank={index + 2}
                  maxScore={maxScore}
                  onSeeNearbyLocations={onSeeNearbyLocations}
                />
              ))}
            </div>

            {/* Show More/Less Button */}
            {remainingDishes.length > 3 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAllDishes(!showAllDishes)}
                  className="px-6 py-2"
                >
                  {showAllDishes ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show All {remainingDishes.length} Options
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="text-center pt-8 border-t border-gray-200">
          {onStartNewSession && (
            <Button 
              onClick={onStartNewSession} 
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Start New Flavor Session
            </Button>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Scores based on group preferences: Superlikes (+3), Likes (+1), Dislikes (-1)</p>
            <p className="mt-1">Restaurant counts show available options within walking distance of SMU campus</p>
          </div>
        </div>
      </div>
    </div>
  );
}