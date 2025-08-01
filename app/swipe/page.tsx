// app/group/[groupId]/page.tsx (Example Page)
"use client";

import React, { useState, useEffect } from "react";
import { IndividualSwipingPhase } from "./components/IndividualSwipingPhase";
import { FlavorMatchResults } from "./components/FlavorMatchResults";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Phase = "swiping" | "matching" | "results";

interface FoodItem {
  id: string;
  name: string;
  image: string;
  description: string;
  restaurant: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MatchedFoodItem {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  likedBy: GroupMember[];
}

export default function GroupSessionPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const userId = "user123"; // Replace with actual user ID from auth
  const isHost = true; // Replace with actual host status

  const [currentPhase, setCurrentPhase] = useState<Phase>("swiping");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoadingFood, setIsLoadingFood] = useState(true);
  const [likedFoodIds, setLikedFoodIds] = useState<Set<string>>(new Set());
  const [dislikedFoodIds, setDislikedFoodIds] = useState<Set<string>>(new Set());

  const [topMatch, setTopMatch] = useState<MatchedFoodItem | null>(null);
  const [alternativeMatches, setAlternativeMatches] = useState<MatchedFoodItem[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Simulate fetching initial data
  useEffect(() => {
    async function fetchData() {
      setIsLoadingFood(true);
      // Simulate API call to fetch food items for the group
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      const fetchedFood: FoodItem[] = [
        {
          id: "dish1",
          name: "Spicy Ramen",
          image: "https://source.unsplash.com/random/400x300/?ramen",
          description: "A rich pork broth ramen with extra chili oil.",
          restaurant: "Ramen House",
        },
        {
          id: "dish2",
          name: "Sushi Platter",
          image: "https://source.unsplash.com/random/400x300/?sushi",
          description: "Assorted fresh sashimi and nigiri.",
          restaurant: "Sushi Master",
        },
        {
          id: "dish3",
          name: "Vegan Burger",
          image: "https://source.unsplash.com/random/400x300/?vegan-burger",
          description: "Beyond meat patty with fresh veggies on a brioche bun.",
          restaurant: "Green Bites",
        },
        {
          id: "dish4",
          name: "Margherita Pizza",
          image: "https://source.unsplash.com/random/400x300/?pizza",
          description: "Classic Neapolitan pizza with fresh mozzarella and basil.",
          restaurant: "Pizza Palace",
        },
        // ... more food items
      ];
      setFoodItems(fetchedFood);

      // Simulate fetching group members
      const fetchedMembers: GroupMember[] = [
        { id: "user123", name: "You", avatarUrl: "https://i.pravatar.cc/150?img=1" },
        { id: "memberA", name: "Alice", avatarUrl: "https://i.pravatar.cc/150?img=2" },
        { id: "memberB", name: "Bob", avatarUrl: "https://i.pravatar.cc/150?img=3" },
      ];
      setGroupMembers(fetchedMembers);
      setIsLoadingFood(false);
    }
    fetchData();
  }, [groupId]);

  const handleSwipe = (foodId: string, liked: boolean) => {
    // In a real app, send this to your backend
    console.log(`User ${userId} ${liked ? "liked" : "disliked"} ${foodId} in group ${groupId}`);
    if (liked) {
      setLikedFoodIds((prev) => new Set(prev).add(foodId));
    } else {
      setDislikedFoodIds((prev) => new Set(prev).add(foodId));
    }
    // Backend would typically update group session likes in real-time
    // and potentially trigger match calculation when all members are done or a threshold is met.
  };

  const handleDoneSwiping = async () => {
    setCurrentPhase("matching");
    setIsMatching(true);
    // Simulate API call to backend to calculate match
    console.log("Notifying backend that user is done swiping...");
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate match calculation time

    // Simulate backend sending match results
    const simulatedTopMatch: MatchedFoodItem = {
      id: "dish1",
      name: "Spicy Ramen",
      image: "https://source.unsplash.com/random/800x600/?ramen-bowl",
      restaurant: "Ramen House",
      likedBy: [
        { id: "user123", name: "You" },
        { id: "memberA", name: "Alice" },
        { id: "memberB", name: "Bob" },
      ],
    };

    const simulatedAlternatives: MatchedFoodItem[] = [
      {
        id: "dish2",
        name: "Sushi Platter",
        image: "https://source.unsplash.com/random/400x300/?sushi-set",
        restaurant: "Sushi Master",
        likedBy: [{ id: "user123", name: "You" }, { id: "memberA", name: "Alice" }],
      },
      {
        id: "dish3",
        name: "Vegan Burger",
        image: "https://source.unsplash.com/random/400x300/?burger-vegan",
        restaurant: "Green Bites",
        likedBy: [{ id: "memberA", name: "Alice" }, { id: "memberB", name: "Bob" }],
      },
    ];

    setTopMatch(simulatedTopMatch);
    setAlternativeMatches(simulatedAlternatives);
    setGroupMembers([
      { id: "user123", name: "You", avatarUrl: "https://i.pravatar.cc/150?img=1" },
      { id: "memberA", name: "Alice", avatarUrl: "https://i.pravatar.cc/150?img=2" },
      { id: "memberB", name: "Bob", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    ]);

    setIsMatching(false);
    setCurrentPhase("results");
  };

  const handleViewMenu = (foodId: string) => {
    alert(`Viewing menu for dish: ${foodId}`);
    // In a real app, navigate to menu page or open a modal
  };

  const handleGetDirections = (restaurantName: string) => {
    alert(`Getting directions to: ${restaurantName}`);
    // In a real app, open map app or provide directions
  };

  const handleOrderNow = (foodId: string) => {
    alert(`Ordering now for dish: ${foodId}`);
    // In a real app, redirect to ordering platform
  };

  const handleStartNewSession = () => {
    // Reset state to start a new session
    setCurrentPhase("swiping");
    setLikedFoodIds(new Set());
    setDislikedFoodIds(new Set());
    setTopMatch(null);
    setAlternativeMatches([]);
    // Optionally refetch food items if they change per session
    // fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoadingFood ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Skeleton className="w-96 h-96 rounded-xl mb-6" />
          <Skeleton className="w-64 h-8 rounded-md" />
          <Skeleton className="w-48 h-4 rounded-md mt-2" />
        </div>
      ) : currentPhase === "swiping" && foodItems.length > 0 ? (
        <IndividualSwipingPhase
          groupId={groupId}
          userId={userId}
          foodItems={foodItems}
          onSwipe={handleSwipe}
          onDoneSwiping={handleDoneSwiping}
          isLoading={isLoadingFood}
        />
      ) : currentPhase === "matching" ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
          <p className="text-4xl animate-bounce mb-4">🚀</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Calculating Flavor Match...
          </h2>
          <p className="text-lg text-gray-600">
            Hold tight! We're finding the perfect dish for your group.
          </p>
          {/* You could add a loading spinner here */}
        </div>
      ) : currentPhase === "results" ? (
        <FlavorMatchResults
          topMatch={topMatch}
          alternativeMatches={alternativeMatches}
          groupMembers={groupMembers}
          isHost={isHost}
          onViewMenu={handleViewMenu}
          onGetDirections={handleGetDirections}
          onOrderNow={handleOrderNow}
          onStartNewSession={handleStartNewSession}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">No Food Items Available</h2>
          <p className="text-lg text-gray-600">
            Please check back later or start a new session.
          </p>
          {onStartNewSession && (
            <Button onClick={onStartNewSession} className="mt-8 px-6 py-3">
              Retry
            </Button>
          )}
        </div>
      )}
    </div>
  );
}