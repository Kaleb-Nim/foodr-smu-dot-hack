import React, { useState, useEffect } from 'react';
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

type RestaurantCounts = Record<string, number>;

export function EnhancedResultsDisplay({
  topDishes,
  groupMembers,
  onSeeNearbyLocations,
  onStartNewSession,
}: EnhancedResultsDisplayProps) {
  const [showAllDishes, setShowAllDishes] = useState(false);
  const [restaurantCounts, setRestaurantCounts] = useState<RestaurantCounts>({});
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchRestaurantCounts = async () => {
      try {
        const response = await fetch('/api/locations/count');
        if (response.ok) {
          const data = await response.json();
          setRestaurantCounts(data);
        } else {
          console.error('Failed to fetch restaurant counts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching restaurant counts:', error);
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchRestaurantCounts();
  }, []);

  if (topDishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#252525]">
        <div className="bg-[#FBEB35] rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">No Matches Found!</h2>
          <p className="text-lg text-gray-600 mb-8">
            It looks like the group couldn't agree on anything this time. Maybe try again?
          </p>
          {onStartNewSession && (
            <Button 
              onClick={onStartNewSession} 
              className="w-full py-4 text-lg font-semibold rounded-md bg-[#F1204A] shadow-lg hover:bg-[#2DCCD3] hover:text-black transition-all duration-500 group"
            >
              <RefreshCw className="w-5 h-5 mr-2 transition-transform duration-500 group-hover:rotate-180" />
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

        <div className="w-full h-screen flex flex-col justify-center items-center">

          {/* Winner Card - Highlighted */}
          {topMatch && (
            <div className="mb-12">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#e9e9e9]-800 mb-2">Your Choice</h2>
              </div>
              
              <div className="w-full flex justify-center">
                <DishCard
                  dish={topMatch}
                  rank={1}
                  maxScore={maxScore}
                  onSeeNearbyLocations={onSeeNearbyLocations}
                  className="border-4 border-yellow-400 shadow-2xl transform scale-105"
                  restaurantCounts={restaurantCounts} // Pass the new prop
                />
              </div>
            </div>
          )}

          <div className="text-center">
            {/* Group Stats */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#e9e9e9]" />
                <span className="text-[#e9e9e9]">{totalMembers} group members</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#2DCCD3] rounded-full"></span>
                <span className="text-[#e9e9e9]">{totalSwipes} total swipes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 opacity-25" />
        <div>
        <div className="min-h-screen flex justify-center items-center">
          <div>
            {remainingDishes.length > 0 && (
              <div className="mb-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#e9e9e9] mb-2">Other Great Options</h2>
                </div>
              </div>
            )}

            {/* Other Dishes Grid */}
            {remainingDishes.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(showAllDishes ? remainingDishes : remainingDishes.slice(0, 3)).map((dish, index) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      rank={index + 2}
                      maxScore={maxScore}
                      onSeeNearbyLocations={onSeeNearbyLocations}
                      restaurantCounts={restaurantCounts} // Pass the new prop
                    />
                  ))}
                </div>

                {/* Show More/Less Button */}
                {remainingDishes.length > 3 && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => setShowAllDishes(!showAllDishes)}
                      className="px-6 py-2 bg-[#F1204A] shadow-lg hover:bg-[#2DCCD3] hover:text-black transition-all duration-300"
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
            </div>
        </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center pt-8">
          {onStartNewSession && (
            <Button 
              onClick={onStartNewSession} 
              size="lg"
              className="w-full py-4 text-lg font-semibold rounded-md bg-[#F1204A] shadow-lg hover:bg-[#2DCCD3] hover:text-black transition-all duration-500 group"
            >
              <RefreshCw className="w-5 h-5 mr-2 transition-transform duration-500 group-hover:rotate-180" />
              Start New Session
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