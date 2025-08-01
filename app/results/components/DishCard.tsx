import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DetailedScoreBar } from '@/components/ui/score-bar';
import { RestaurantCountWithTooltip } from './RestaurantCount';
import { EnhancedMatchedFoodItem, GroupMember } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

interface DishCardProps {
  dish: EnhancedMatchedFoodItem;
  rank: number;
  maxScore: number;
  onSeeNearbyLocations: (cuisine: string) => void;
  className?: string;
}

export function DishCard({
  dish,
  rank,
  maxScore,
  onSeeNearbyLocations,
  className,
}: DishCardProps) {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const getRankBadgeColor = (rank: number) => {
    return 'bg-[#F1204A] text-white';
  };

  const handleClick = (cuisine: string) => {
    setIsLoading(true);
    onSeeNearbyLocations(cuisine);
    setIsLoading(false);
  }

  const renderLikedBy = (likedBy: GroupMember[]) => {
    if (likedBy.length === 0) return null;

    const displayMembers = showAllMembers ? likedBy : likedBy.slice(0, 2);
    const remainingCount = likedBy.length - 2;
    let offset = 0;
    let zidx = 1000;
    const to_add = 16;

    return (
      <div className="bg-[#FBEB35]">
        <div className="flex items-center gap-2 border-black relative w-[56px]">
          {remainingCount > 0 && (
              <div 
                className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center`}
                style={{
                  zIndex: zidx,
                }}
              >
                <span className="text-sm font-semibold text-gray-600">
                  +{remainingCount}
                </span>
              </div>
          )}
          {displayMembers.map((member) => {
            offset += to_add;
            zidx--;
            return(
              <Avatar key={member.id} className="absolute w-8 h-8 border-4 border-white shadow-sm"
                style={{
                  zIndex: zidx,
                  left: `${offset}px`
                }}
              >
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      'bg-[#FBEB35] shadow-lg border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative pt-0',
      className
    )}>
      {/* Food Image */}
      <CardHeader className="p-0 relative">
        <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className={cn(
          'absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ',
          getRankBadgeColor(rank)
        )}>
          {rank}
        </div>
        {/* Restaurant Count Badge */}
        <div className="absolute top-3 right-3">
          <RestaurantCountWithTooltip
            count={dish.restaurantCount}
            cuisine={dish.cuisine}
            size="sm"
            showTooltip={true}
          />
        </div>
      </CardHeader>

      <CardContent className="px-4">
        {/* Dish Info */}
        <div className="w-full flex flex-row justify-between items-center relative">
          <CardTitle className="text-xl font-bold line-clamp-1">
            {dish.name}
          </CardTitle>
          {renderLikedBy(dish.likedBy)}
        </div>
        <CardDescription>{dish.likedBy.length === 1 ? '1 person likes this dish' : `${dish.likedBy.length} people like this dish`}</CardDescription>
        
        {/* Score Bar */}
        {/* <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Group Score</span>
            <span className="text-xs text-gray-500">Max: {maxScore}</span>
          </div>
          <DetailedScoreBar
            score={dish.weightedScore}
            maxScore={maxScore}
            breakdown={dish.swipeBreakdown}
            showBreakdown={false}
            size="md"
            animated={true}
          />
        </div> */}

        {/* Liked By */}

        {/* Action Button */}
        <div className="mt-6">
        {isLoading ? 
          <Button
            onClick={() => handleClick(dish.cuisine)}
            className="w-full bg-[#F1204A] text-white"
            disabled
          >
            <Loader2Icon className="animate-spin"/>
          </Button>
        :
          <Button
            onClick={() => handleClick(dish.cuisine)}
            className="w-full bg-[#F1204A] shadow-lg hover:bg-[#2DCCD3] hover:text-black transition-all text-white"
          >
            See nearby locations ({dish.restaurantCount})
          </Button>
        }
        </div>
      </CardContent>
    </Card>
  );
}