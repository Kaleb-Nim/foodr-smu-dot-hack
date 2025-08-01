// components/FlavorMatchResults.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MatchedFoodItem {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  likedBy: Member[];
  matchScore?: number; // Optional, for sorting or display
}

interface FlavorMatchResultsProps {
  topMatch: MatchedFoodItem | null;
  alternativeMatches: MatchedFoodItem[];
  groupMembers: Member[]; // All group members, useful for avatar lookup
  isHost: boolean; // To enable/disable action buttons for ordering
  onViewMenu: (foodId: string) => void;
  onGetDirections: (restaurantName: string) => void;
  onOrderNow: (foodId: string) => void;
  onStartNewSession?: () => void; // Optional: if you want a restart button
}

export function FlavorMatchResults({
  topMatch,
  alternativeMatches,
  groupMembers,
  isHost,
  onViewMenu,
  onGetDirections,
  onOrderNow,
  onStartNewSession,
}: FlavorMatchResultsProps) {
  const [expandedMembers, setExpandedMembers] = useState<{[key: string]: boolean}>({});
  if (!topMatch && alternativeMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-to-br from-red-50 to-orange-100">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">No Flavor Match Found!</h2>
        <p className="text-lg text-gray-600 mb-8">
          It looks like the group couldn't find a common dish this time. Try again?
        </p>
        {onStartNewSession && (
          <Button onClick={onStartNewSession} className="px-6 py-3 text-lg font-semibold rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
            Start New Session
          </Button>
        )}
      </div>
    );
  }

  const renderLikedBy = (likedBy: Member[], foodId: string, isTopMatch: boolean = false) => {
    if (likedBy.length === 0) return null;

    const isExpanded = expandedMembers[foodId] || false;
    const displayMembers = isExpanded ? likedBy : likedBy.slice(0, 2);
    const remainingCount = likedBy.length - 2;
    const toggleExpanded = () => setExpandedMembers(prev => ({ ...prev, [foodId]: !prev[foodId] }));

    const bgColor = isTopMatch ? 'bg-emerald-50' : 'bg-gray-50';
    const borderColor = isTopMatch ? 'border-emerald-200' : 'border-gray-200';
    const avatarBg = isTopMatch ? 'bg-emerald-100' : 'bg-blue-100';
    const avatarText = isTopMatch ? 'text-emerald-700' : 'text-blue-700';
    const nameColor = isTopMatch ? 'text-emerald-800' : 'text-gray-700';
    const summaryColor = isTopMatch ? 'text-emerald-700' : 'text-gray-500';

    return (
      <div className="mt-3">
        <div className={`flex items-center ${isTopMatch ? 'justify-center' : ''} flex-wrap gap-2`}>
          {displayMembers.map((member) => (
            <div key={member.id} className={`flex items-center gap-2 ${bgColor} rounded-full px-2 py-1 ${isTopMatch ? `border ${borderColor}` : ''}`}>
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback className={`${avatarBg} text-sm font-semibold ${avatarText}`}>
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className={`text-sm font-medium ${nameColor} truncate max-w-[80px]`}>
                {member.name}
              </span>
            </div>
          ))}
          
          {!isExpanded && remainingCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
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
          
          {isExpanded && likedBy.length > 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 h-auto border-0 text-xs text-gray-600"
            >
              Show less
            </Button>
          )}
        </div>
        
        <div className={`text-sm ${summaryColor} mt-2 ${isTopMatch ? 'text-center font-medium' : ''}`}>
          {likedBy.length === 1 ? (isTopMatch ? 'Loved by 1 person' : '1 person likes this') : (isTopMatch ? `Loved by ${likedBy.length} people` : `${likedBy.length} people like this`)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
        ✨ Flavor Match Found! ✨
      </h1>

      {topMatch && (
        <Card className="w-full max-w-2xl bg-white shadow-2xl border-4 border-emerald-500 rounded-xl overflow-hidden mb-12 animate-fade-in-up">
          <CardHeader className="p-0">
            <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden">
              <img
                src={topMatch.image}
                alt={topMatch.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-2 text-center text-emerald-700">
              {topMatch.name}
            </CardTitle>
            <CardDescription className="text-xl text-gray-700 text-center mb-4">
              from <span className="font-semibold">{topMatch.restaurant}</span>
            </CardDescription>
            <div className="flex justify-center mb-6">
              {renderLikedBy(topMatch.likedBy, topMatch.id, true)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => onViewMenu(topMatch.id)}
                className="w-full py-3 text-md sm:text-lg font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              >
                View Menu
              </Button>
              <Button
                onClick={() => onGetDirections(topMatch.restaurant)}
                className="w-full py-3 text-md sm:text-lg font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-md"
              >
                Get Directions
              </Button>
              <Button
                onClick={() => onOrderNow(topMatch.id)}
                disabled={!isHost}
                className="w-full py-3 text-md sm:text-lg font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Order Now {isHost ? "" : " (Host Only)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {alternativeMatches.length > 0 && (
        <>
          <Separator className="w-full max-w-2xl my-8 bg-gray-300" />
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Other Delicious Options:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {alternativeMatches.map((food) => (
              <Card
                key={food.id}
                className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden animate-fade-in"
              >
                <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-1">
                    {food.name}
                  </CardTitle>
                  <CardDescription className="text-md text-gray-600 mb-2">
                    from {food.restaurant}
                  </CardDescription>
                  {renderLikedBy(food.likedBy, food.id)}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewMenu(food.id)}
                      className="flex-1"
                    >
                      View Menu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGetDirections(food.restaurant)}
                      className="flex-1"
                    >
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {onStartNewSession && (
        <Button onClick={onStartNewSession} className="mt-12 px-8 py-4 text-lg font-semibold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg">
          Start New Flavor Session
        </Button>
      )}
    </div>
  );
}