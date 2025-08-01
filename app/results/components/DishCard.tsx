import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DetailedScoreBar } from '@/components/ui/score-bar';
import { RestaurantCountWithTooltip } from './RestaurantCount';
import { EnhancedMatchedFoodItem, GroupMember } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-blue-500 text-white';
  };

  const renderLikedBy = (likedBy: GroupMember[]) => {
    if (likedBy.length === 0) return null;

    const displayMembers = showAllMembers ? likedBy : likedBy.slice(0, 2);
    const remainingCount = likedBy.length - 2;

    return (
      <div className="mt-3">
        <div className="flex items-center flex-wrap gap-2">
          {displayMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 truncate max-w-[80px]">
                {member.name}
              </span>
            </div>
          ))}
          
          {!showAllMembers && remainingCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllMembers(true)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 h-auto border-0 text-xs"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">
                  +{remainingCount}
                </span>
              </div>
              <span className="text-gray-600">
                others
              </span>
            </Button>
          )}
          
          {showAllMembers && likedBy.length > 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllMembers(false)}
              className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 h-auto border-0 text-xs text-gray-600"
            >
              Show less
            </Button>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          {likedBy.length === 1 ? '1 person likes this dish' : `${likedBy.length} people like this dish`}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      'bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative',
      className
    )}>
      {/* Rank Badge */}
      <div className={cn(
        'absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg',
        getRankBadgeColor(rank)
      )}>
        {rank}
      </div>

      {/* Food Image */}
      <CardHeader className="p-0 relative">
        <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
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

      <CardContent className="p-6">
        {/* Dish Info */}
        <CardTitle className="text-xl font-bold mb-1 line-clamp-1">
          {dish.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3">
          {dish.cuisine} cuisine
        </CardDescription>
        
        {dish.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {dish.description}
          </p>
        )}

        {/* Score Bar */}
        <div className="mb-4">
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
        </div>

        {/* Liked By */}
        {renderLikedBy(dish.likedBy)}

        {/* Action Button */}
        <div className="mt-6">
          <Button
            onClick={() => onSeeNearbyLocations(dish.cuisine)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            See nearby locations ({dish.restaurantCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}