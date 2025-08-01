// components/IndividualSwipingPhase.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Assume you have a FoodSwipeCard component
// import FoodSwipeCard from "./FoodSwipeCard";

interface FoodItem {
  id: string;
  name: string;
  image: string;
  description: string;
  // Add other relevant food properties
}

interface IndividualSwipingPhaseProps {
  groupId: string;
  userId: string;
  foodItems: FoodItem[];
  onSwipe: (foodId: string, liked: boolean) => void;
  onDoneSwiping: () => void;
  isLoading: boolean;
}

const FoodSwipeCard = ({ food }: { food: FoodItem }) => {
  // This is a placeholder for your actual FoodSwipeCard component.
  // It should handle gestures (swipe left/right) and trigger callbacks.
  return (
    <Card className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg border-2 border-primary-foreground">
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-64 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
        <p className="text-sm text-gray-600">{food.description}</p>
      </CardContent>
    </Card>
  );
};

export function IndividualSwipingPhase({
  groupId,
  userId,
  foodItems,
  onSwipe,
  onDoneSwiping,
  isLoading,
}: IndividualSwipingPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Hide instructions after a few seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 4000); // Display for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleSwipeAction = (foodId: string, liked: boolean) => {
    onSwipe(foodId, liked);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const currentFood = foodItems[currentIndex];
  const totalSwiped = currentIndex;
  const totalDishes = foodItems.length;
  const progressPercentage =
    totalDishes > 0 ? (totalSwiped / totalDishes) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-lg font-medium">
        Loading dishes...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center p-4 rounded-lg shadow-xl z-20 max-w-md"
          >
            <h2 className="text-2xl font-bold mb-2">Welcome to Flavor Sync!</h2>
            <p className="text-lg">
              Swipe right if it looks delicious, swipe left if it's not for you.
              Let's find your group's perfect match!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-6 mt-20 sm:mt-24 w-full max-w-md">
        {currentFood ? (
          <motion.div
            key={currentFood.id} // Key for AnimatePresence
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            {/* 
              This is where you'd integrate your actual swipe logic.
              For simplicity, I'm just showing the card.
              Your FoodSwipeCard component would handle the gestures and call
              handleSwipeAction with the foodId and whether it was liked.
            */}
            <FoodSwipeCard food={currentFood} />
            {/* Example buttons for testing without full swipe logic */}
            <div className="absolute bottom-40 flex gap-4">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => handleSwipeAction(currentFood.id, false)}
              >
                Nah
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => handleSwipeAction(currentFood.id, true)}
              >
                Yum!
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-lg font-medium p-4 bg-white rounded-lg shadow">
            You've swiped through all available dishes for this session!
          </div>
        )}

        <div className="w-full max-w-xs space-y-2">
          <p className="text-center text-sm text-gray-700 font-medium">
            Swiped {totalSwiped} of {totalDishes} dishes
          </p>
          <Progress value={progressPercentage} className="h-2 rounded-full" />
        </div>

        {totalSwiped > 0 && totalSwiped === totalDishes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onDoneSwiping}
              className="mt-6 px-8 py-3 text-lg font-semibold rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
            >
              I'm Done Swiping!
            </Button>
          </motion.div>
        )}
        {totalSwiped < totalDishes && (
          <Button
            onClick={onDoneSwiping}
            className="mt-6 px-8 py-3 text-lg font-semibold rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Finish Early
          </Button>
        )}
      </div>
    </div>
  );
}