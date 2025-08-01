
// components/swiper.tsx
"use client";

import React, { useState, useRef } from "react";
import { useSprings, animated, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface SwiperCard {
  id: string;
  name: string;
  description?: string; image_path: string;
}

interface SwiperProps {
  data: SwiperCard[];
  onSwipeLeft?: (card: SwiperCard) => void;
  onSwipeRight?: (card: SwiperCard) => void;
  onSuperLike: (card: SwiperCard) => void;
  onFinish?: () => void;
}

const SWIPE_THRESHOLD = 150; // Pixels to define a swipe

const Swiper = ({ data, onSwipeLeft, onSwipeRight, onSuperLike, onFinish }: SwiperProps) => {
  const [gone] = useState(() => new Set()); // The set of all cards that are flicked out
  const [props, api] = useSprings(data.length, (i) => ({
    x: 0,
    rot: 0,
    scale: 1,
    display: "block",
  })); // Create a spring for each card

  const handleSuperLike = (index: number) => {
    gone.add(index);
    void onSuperLike(data[index]);
  }

  // Create a gesture handler
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2 || Math.abs(mx) > SWIPE_THRESHOLD; // If velocity exceeds a threshold or an x-direction movement threshold is met, the card goes off screen
      const dir = xDir < 0 ? -1 : 1; // Direction should either be -1 (left) or 1 (right)

      if (!down && trigger) {
        gone.add(index); // Mark card as gone
        if (dir === -1 && onSwipeLeft) {
          onSwipeLeft(data[index]);
        } else if (dir === 1 && onSwipeRight) {
          onSwipeRight(data[index]);
        }
      }

      api.start((i) => {
        if (index !== i) return; // We're only changing the spring-data of the selected card
        const isGone = gone.has(index);

        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it goes off screen
        const rot = mx / 100 + (isGone ? dir * 10 * vx : 0); // Rotate the card while it is being dragged
        const scale = down ? 1.1 : 1; // Card scales up when being dragged

        return {
          x,
          rot,
          scale,
          display: isGone ? "none" : "block", // Hide the card completely when it's gone
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });

      if (!down && gone.size === data.length) {
        setTimeout(() => {
          gone.clear();
          api.start((i) => ({
            x: 0,
            rot: 0,
            scale: 1,
            display: "block",
            config: { friction: 50, tension: 500 },
          }));
          if (onFinish) {
            onFinish();
          }
        }, 500); // Give a brief moment before resetting
      }
    }
  );

  return (
    <div className="relative flex h-[500px] w-full max-w-sm items-center justify-center">
      {props.map(({ x, rot, scale, display }, i) => (
        <animated.div
          key={i}
          className="absolute h-full w-full will-change-transform bg-background"
          style={{ display, x }}
        >
          {/* The backdrop card effect */}
          <animated.div
            {...bind(i)}
            style={{
              transform: to([rot, scale], (r, s) => `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`),
            }}
            className="h-full w-full cursor-grab active:cursor-grabbing bg-background"
          >
            <Card className="h-full w-full flex flex-col justify-between overflow-hidden bg-amber-300 border-black">
              {data[i].image_path && (
                <div
                  className="h-2/3 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${data[i].image_path})` }}
                ></div>
              )}
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-bold text-center">
                  {data[i].name}
                </CardTitle>
                <CardDescription className="text-500">
                  {data[i].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <motion.button
                  className="relative flex items-center justify-center p-2 rounded-full bg-white shadow-md focus:outline-none"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSuperLike(i)}
                >
                  {/* Circle Background */}
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-20"></div>

                  {/* Heart Icon */}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-colors duration-200 ${
                      'text-red-600'
                    }`}
                    fill="#F1204A"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    variants={{
                      liked: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
                      unliked: { scale: [1, 0.8, 1], transition: { duration: 0.3 } },
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </motion.svg>
                </motion.button>
              </CardContent>
              {/* You can add CardContent and CardFooter if needed */}
            </Card>
          </animated.div>
        </animated.div>
      ))}
      {data.length === 0 && (
        <p className="text-lg text-gray-500">No more cards!</p>
      )}
    </div>
  );
};

export default Swiper;