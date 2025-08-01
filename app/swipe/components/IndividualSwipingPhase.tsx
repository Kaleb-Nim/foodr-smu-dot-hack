// components/IndividualSwipingPhase.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion"; // Add useAnimation
import { X, Heart, Star, Info } from "lucide-react";

// --- Type Definitions (re-confirmed) ---
export type SwipeAction = "dislike" | "like" | "superLike";

export interface FoodDishContent {
  type: "food";
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface PriceRangeContent {
  type: "price";
  id: string;
  range: string;
  description: string;
}

export type SwipeCardContent = FoodDishContent | PriceRangeContent;

export interface IndividualSwipingPhaseProps {
  groupId: string;
  userId: string;
  swipeCards: SwipeCardContent[];
  onSwipe: (cardId: string, action: SwipeAction) => void;
  onDoneSwiping: () => void;
  initialSuperLikes: number;
  isLoading: boolean;
}

// --- SwipeCard Component (Generic) ---
interface SwipeCardProps {
  card: SwipeCardContent;
  x: any;
  rotate: any;
  opacity: any;
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      point: { x: number; y: number };
      velocity: { x: number; y: number };
      delta: { x: number; y: number };
    }
  ) => void;
  // New prop to trigger programmatic exit animation
  triggerExitAnimation: (action: SwipeAction) => Promise<void>;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  card,
  x,
  rotate,
  opacity,
  onDragEnd,
  triggerExitAnimation, // Receive the new function
}) => {
  const isFood = card.type === "food";
  const content = isFood ? (card as FoodDishContent) : (card as PriceRangeContent);

  const getOverlayColor = useTransform(
    x,
    [-150, 0, 75, 175],
    ["#ef4444", "#ffffff00", "#22c55e", "#8b5cf6"]
  );
  const getOverlayOpacity = useTransform(x, [-100, 0, 100, 200], [0.8, 0, 0.8, 1]);

  return (
    <motion.div
      className="absolute w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-primary-foreground bg-white"
      drag="x"
      dragConstraints={{ left: -1, right: 1, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      style={{ x, rotate, opacity }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      // When this component is about to exit (due to removal from parent's render tree)
      // AnimatePresence will trigger this. The x.get() value will be whatever it was
      // just before unmount (either from drag or programmatically set via triggerExitAnimation)
      exit={(x.get() > 0) ? { x: window.innerWidth * 1.5, opacity: 0, transition: { duration: 0.3 } } : { x: -window.innerWidth * 1.5, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none rounded-xl"
        style={{ backgroundColor: getOverlayColor, opacity: getOverlayOpacity }}
      >
        <AnimatePresence>
          {x.get() < -75 && (
            <motion.div
              key="dislike-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-5xl font-bold"
            >
              <X size={64} />
            </motion.div>
          )}
          {x.get() > 75 && x.get() < 175 && (
            <motion.div
              key="like-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-5xl font-bold"
            >
              <Heart size={64} />
            </motion.div>
          )}
          {x.get() >= 175 && (
            <motion.div
              key="super-like-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-5xl font-bold"
            >
              <Star size={64} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {isFood ? (
        <>
          <img
            src={(content as FoodDishContent).image}
            alt={(content as FoodDishContent).name}
            className="w-full h-64 object-cover object-center"
          />
          <CardContent className="p-4">
            <CardTitle className="text-2xl font-semibold mb-2">
              {(content as FoodDishContent).name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {(content as FoodDishContent).description}
            </CardDescription>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[300px]">
          <Info className="w-16 h-16 text-blue-500 mb-4" />
          <CardTitle className="text-3xl font-bold mb-2">
            {(content as PriceRangeContent).range}
          </CardTitle>
          <CardDescription className="text-md text-gray-700">
            {(content as PriceRangeContent).description}
          </CardDescription>
        </div>
      )}
    </motion.div>
  );
};

// --- Main IndividualSwipingPhase Component ---
export function IndividualSwipingPhase({
  groupId,
  userId,
  swipeCards,
  onSwipe,
  onDoneSwiping,
  initialSuperLikes,
  isLoading,
}: IndividualSwipingPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [superLikesRemaining, setSuperLikesRemaining] = useState(initialSuperLikes);

  // x, rotate, opacity are defined within the parent, passed to the child
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  // We need to reset x whenever the current card changes,
  // to ensure a fresh animation state for the new card.
  useEffect(() => {
    x.set(0);
  }, [currentIndex, x]);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // New function passed down to SwipeCard to trigger its exit animation
  // and get a promise for completion.
  const triggerCardExitAnimation = useCallback(async (action: SwipeAction) => {
    let targetX = 0;
    if (action === "dislike") {
      targetX = -window.innerWidth * 1.5; // Animate off to the left
    } else if (action === "like") {
      targetX = window.innerWidth * 1.5; // Animate off to the right
    } else if (action === "superLike") {
      targetX = window.innerWidth * 2; // Animate further right for super like
    }

    // Directly animate the x MotionValue.
    // The promise returned by x.set() when animation is defined as the second argument
    // IS NOT correct here. MotionValues animate by themselves.
    // To get a completion callback for an animation started by changing a MotionValue,
    // it's more common to observe the MotionValue's changes or use useAnimation hook.

    // A simple way to trigger the exit visually is to set 'x' immediately
    // and then rely on AnimatePresence for the removal animation after a short delay.
    // However, if we want the actual x property of the motion.div to smoothly animate
    // to the targetX, we need to use a more explicit animation control.
    // The most robust way is to use the `animate` prop or `useAnimate` hook
    // and let framer-motion handle the animation end.

    // For a simpler approach that works well with `AnimatePresence`:
    // 1. Immediately move the card off-screen.
    // 2. A short delay to allow visual transition.
    // 3. Then, increment currentIndex to trigger AnimatePresence's exit.

    // Force the x value to the final destination with a quick spring to simulate a flick
    await x.set(targetX, { type: "spring", stiffness: 300, damping: 20 });
    // IMPORTANT: The `x.set()` with animation options (stiffness etc.) does *not*
    // return a promise for completion. It just immediately starts an internal animation.
    // To await its completion, we'd typically need `useAnimation` or similar.
    // For the purpose of immediate unmount via AnimatePresence, we rely on a small timeout.

    // We can rely on a fixed timeout that roughly matches the card's exit transition.
    return new Promise((resolve) => setTimeout(resolve, 300)); // Match the exit transition duration
  }, [x]); // x is a dependency

  const handleSwipeAction = useCallback(async (action: SwipeAction) => {
    const currentCard = swipeCards[currentIndex];
    if (!currentCard) return;

    if (action === "superLike" && superLikesRemaining <= 0) {
      alert("No Super Likes remaining!");
      return;
    }

    // Trigger the card's visual exit animation first
    await triggerCardExitAnimation(action); // Wait for the animation promise to resolve

    // Then, perform the data updates after the animation completes
    onSwipe(currentCard.id, action);

    if (action === "superLike") {
      setSuperLikesRemaining((prev) => prev - 1);
    }

    // Finally, advance to the next card, which triggers AnimatePresence's exit
    // for the old card and entry for the new one (if any).
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, superLikesRemaining, onSwipe, triggerCardExitAnimation, swipeCards]);


  const handleDragEnd = useCallback(
    (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: {
        point: { x: number; y: number };
        velocity: { x: number; y: number };
        delta: { x: number; y: number };
      }
    ) => {
      const likeThreshold = 75;
      const superLikeThreshold = 175;
      const dislikeThreshold = -75;

      // When dragging, Framer Motion already updates `x` dynamically.
      // We just need to decide the action and let `handleSwipeAction` animate and advance.
      let action: SwipeAction | null = null;

      if (info.offset.x > superLikeThreshold && superLikesRemaining > 0) {
        action = "superLike";
      } else if (info.offset.x > likeThreshold) {
        action = "like";
      } else if (info.offset.x < dislikeThreshold) {
        action = "dislike";
      } else {
        // If not past threshold, snap back to center.
        // `x.set(0)` is correct here as it's an immediate value change.
        x.set(0);
        return; // Do not proceed to next card or trigger onSwipe
      }

      if (action) {
        // Call the shared handler. It will also await its internal animation.
        handleSwipeAction(action);
      }
    },
    [superLikesRemaining, x, handleSwipeAction]
  );

  const currentCard = swipeCards[currentIndex];
  const totalSwiped = currentIndex;
  const totalCards = swipeCards.length;
  const progressPercentage = totalCards > 0 ? (totalSwiped / totalCards) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-lg font-medium">
        Loading dishes and preferences...
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
            <p className="text-lg mb-2">
              Swipe <span className="font-semibold text-red-200">left</span> for{" "}
              <span className="font-semibold text-red-200">Dislike</span>. Swipe{" "}
              <span className="font-semibold text-green-200">right</span> for{" "}
              <span className="font-semibold text-green-200">Like</span>, and{" "}
              <span className="font-semibold text-purple-200">far right</span> for{" "}
              <span className="font-semibold text-purple-200">Super-Like!</span>
            </p>
            <p className="text-lg">Let's find your group's perfect match!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-6 mt-20 sm:mt-24 w-full max-w-md">
        <div className="w-full text-right pr-4 mb-2">
          <span className="text-lg font-semibold text-purple-700 flex items-center justify-end">
            <Star className="w-5 h-5 mr-1 text-purple-600" /> Super-Likes:{" "}
            {superLikesRemaining}
          </span>
        </div>

        <div className="relative w-full flex justify-center h-[450px]">
          <AnimatePresence initial={false}>
            {currentCard ? (
              <SwipeCard
                key={currentCard.id}
                card={currentCard}
                x={x}
                rotate={rotate}
                opacity={opacity}
                onDragEnd={handleDragEnd}
                triggerExitAnimation={triggerCardExitAnimation} // Pass the new prop
              />
            ) : (
              <motion.div
                key="no-more-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-lg font-medium p-6 bg-white rounded-lg shadow-lg absolute inset-0 flex items-center justify-center"
              >
                You've swiped through all available options for this session!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swipe Buttons */}
        {currentCard && (
          <div className="flex justify-around w-full max-w-xs mt-4">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16"
              onClick={() => handleSwipeAction("dislike")}
            >
              <X size={32} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-16 w-16 bg-purple-500 text-white hover:bg-purple-600"
              onClick={() => handleSwipeAction("superLike")}
              disabled={superLikesRemaining <= 0}
            >
              <Star size={32} />
            </Button>
            <Button
              variant="success"
              size="lg"
              className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleSwipeAction("like")}
            >
              <Heart size={32} />
            </Button>
          </div>
        )}

        <div className="w-full max-w-xs space-y-2 mt-4">
          <p className="text-center text-sm text-gray-700 font-medium">
            Swiped {totalSwiped} of {totalCards} options
          </p>
          <Progress value={progressPercentage} className="h-2 rounded-full" />
        </div>

        {totalSwiped > 0 && totalSwiped === totalCards ? (
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
        ) : (
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