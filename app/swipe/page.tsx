// app/group/[groupId]/page.tsx (Example Page - updated for SuperLike)
"use client";

import React, { useState, useEffect } from "react";
import { IndividualSwipingPhase, SwipeCardContent, SwipeAction } from "./components/IndividualSwipingPhase";
import { FlavorMatchResults } from "./components/FlavorMatchResults";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type Phase = "swiping" | "matching" | "results";

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
  const [swipeCards, setSwipeCards] = useState<SwipeCardContent[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [userSwipeData, setUserSwipeData] = useState<Record<string, SwipeAction>>({});

  const [topMatch, setTopMatch] = useState<MatchedFoodItem | null>(null);
  const [alternativeMatches, setAlternativeMatches] = useState<MatchedFoodItem[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const MAX_SUPER_LIKES = 3; // Define total super likes available per user (can come from backend)

  // Simulate fetching initial data
  useEffect(() => {
    async function fetchData() {
      setIsLoadingCards(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const fetchedCards: SwipeCardContent[] = [
        {
          type: "food",
          id: "dish1",
          name: "Spicy Ramen",
          image: "https://source.unsplash.com/random/400x300/?ramen-bowl",
          description: "A rich pork broth ramen with extra chili oil.",
        },
        {
          type: "price",
          id: "price1",
          range: "$10-20",
          description: "Casual dining, perfect for a quick bite.",
        },
        {
          type: "food",
          id: "dish2",
          name: "Sushi Platter",
          image: "https://source.unsplash.com/random/400x300/?sushi-set",
          description: "Assorted fresh sashimi and nigiri.",
        },
        {
          type: "food",
          id: "dish3",
          name: "Vegan Burger",
          image: "https://source.unsplash.com/random/400x300/?vegan-burger-patty",
          description: "Beyond meat patty with fresh veggies on a brioche bun.",
        },
        {
          type: "price",
          id: "price2",
          range: "$$$",
          description: "Fine dining experience, for special occasions.",
        },
        {
          type: "food",
          id: "dish4",
          name: "Margherita Pizza",
          image: "https://source.unsplash.com/random/400x300/?pizza-margherita",
          description: "Classic Neapolitan pizza with fresh mozzarella and basil.",
        },
        {
          type: "food",
          id: "dish5",
          name: "Mexican Tacos",
          image: "https://source.unsplash.com/random/400x300/?tacos",
          description: "Authentic street style tacos with various fillings.",
        },
        {
          type: "food",
          id: "dish6",
          name: "Mala Hotpot",
          image: "https://source.unsplash.com/random/400x300/?hotpot",
          description: "Spicy Szechuan hotpot with a numbing kick.",
        },
      ];
      setSwipeCards(fetchedCards);

      const fetchedMembers: GroupMember[] = [
        { id: "user123", name: "You", avatarUrl: "https://i.pravatar.cc/150?img=1" },
        { id: "memberA", name: "Alice", avatarUrl: "https://i.pravatar.cc/150?img=2" },
        { id: "memberB", name: "Bob", avatarUrl: "https://i.pravatar.cc/150?img=3" },
      ];
      setGroupMembers(fetchedMembers);
      setIsLoadingCards(false);
    }
    fetchData();
  }, [groupId]);

  const handleSwipe = (cardId: string, action: SwipeAction) => {
    console.log(`User ${userId} ${action}d ${cardId} in group ${groupId}`);
    setUserSwipeData((prev) => ({ ...prev, [cardId]: action }));
  };

  const handleDoneSwiping = async () => {
    setCurrentPhase("matching");
    console.log("Notifying backend that user is done swiping and requesting match...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

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
        id: "dish4",
        name: "Margherita Pizza",
        image: "https://source.unsplash.com/random/400x300/?pizza-margherita-slice",
        restaurant: "Pizza Palace",
        likedBy: [{ id: "memberA", name: "Alice" }, { id: "user123", name: "You" }],
      },
    ];

    setTopMatch(simulatedTopMatch);
    setAlternativeMatches(simulatedAlternatives);
    setCurrentPhase("results");
  };

  const handleViewMenu = (foodId: string) => {
    alert(`Viewing menu for dish: ${foodId}`);
  };

  const handleGetDirections = (restaurantName: string) => {
    alert(`Getting directions to: ${restaurantName}`);
  };

  const handleOrderNow = (foodId: string) => {
    alert(`Ordering now for dish: ${foodId}`);
  };

  const handleStartNewSession = () => {
    setCurrentPhase("swiping");
    setUserSwipeData({});
    setTopMatch(null);
    setAlternativeMatches([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoadingCards ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Skeleton className="w-96 h-96 rounded-xl mb-6" />
          <Skeleton className="w-64 h-8 rounded-md" />
          <Skeleton className="w-48 h-4 rounded-md mt-2" />
        </div>
      ) : currentPhase === "swiping" && swipeCards.length > 0 ? (
        <IndividualSwipingPhase
          groupId={groupId}
          userId={userId}
          swipeCards={swipeCards}
          onSwipe={handleSwipe}
          onDoneSwiping={handleDoneSwiping}
          initialSuperLikes={MAX_SUPER_LIKES} // Re-added this prop
          isLoading={isLoadingCards}
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
          <h2 className="text-2xl font-bold mb-4">No Swipe Options Available</h2>
          <p className="text-lg text-gray-600">
            Please check back later or start a new session.
          </p>
          {swipeCards.length === 0 && (
             <Button onClick={handleStartNewSession} className="mt-8 px-6 py-3">
               Retry Session
             </Button>
          )}
        </div>
      )}
    </div>
  );
}