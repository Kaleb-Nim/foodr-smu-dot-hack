// components/FlavorMatchResults.tsx
import React from "react";
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

  const renderLikedBy = (likedBy: Member[]) => (
    <div className="flex items-center flex-wrap gap-1 mt-2">
      {likedBy.map((member) => (
        <Avatar key={member.id} className="w-6 h-6 border-2 border-white shadow">
          <AvatarImage src={member.avatarUrl} alt={member.name} />
          <AvatarFallback className="bg-gray-200 text-xs font-semibold">
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ))}
      {likedBy.length > 0 && (
        <span className="text-sm text-gray-600 ml-1">
          Liked by: {likedBy.map((m) => m.name).join(", ")}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
        ✨ Flavor Match Found! ✨
      </h1>

      {topMatch && (
        <Card className="w-full max-w-2xl bg-white shadow-2xl border-4 border-emerald-500 rounded-xl overflow-hidden mb-12 animate-fade-in-up">
          <CardHeader className="p-0">
            <img
              src={topMatch.image}
              alt={topMatch.name}
              className="w-full h-72 sm:h-96 object-cover object-center"
            />
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-2 text-center text-emerald-700">
              {topMatch.name}
            </CardTitle>
            <CardDescription className="text-xl text-gray-700 text-center mb-4">
              from <span className="font-semibold">{topMatch.restaurant}</span>
            </CardDescription>
            <div className="flex justify-center mb-6">
              {renderLikedBy(topMatch.likedBy)}
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
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-40 object-cover object-center"
                />
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-1">
                    {food.name}
                  </CardTitle>
                  <CardDescription className="text-md text-gray-600 mb-2">
                    from {food.restaurant}
                  </CardDescription>
                  {renderLikedBy(food.likedBy)}
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