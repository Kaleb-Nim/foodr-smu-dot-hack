
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
import { cn } from "@/lib/utils"; // Assuming you have this utility from Shadcn setup

export interface SwiperCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface SwiperProps {
  data: SwiperCard[];
  onSwipeLeft?: (card: SwiperCard) => void;
  onSwipeRight?: (card: SwiperCard) => void;
  onFinish?: () => void;
}

const SWIPE_THRESHOLD = 150; // Pixels to define a swipe

const Swiper = ({ data, onSwipeLeft, onSwipeRight, onFinish }: SwiperProps) => {
  const [gone] = useState(() => new Set()); // The set of all cards that are flicked out
  const [props, api] = useSprings(data.length, (i) => ({
    x: 0,
    rot: 0,
    scale: 1,
    display: "block",
  })); // Create a spring for each card

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
          className="absolute h-full w-full will-change-transform"
          style={{ display, x }}
        >
          {/* The backdrop card effect */}
          <animated.div
            {...bind(i)}
            style={{
              transform: to([rot, scale], (r, s) => `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`),
            }}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          >
            <Card className="h-full w-full flex flex-col justify-between overflow-hidden">
              {data[i].imageUrl && (
                <div
                  className="h-2/3 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${data[i].imageUrl})` }}
                ></div>
              )}
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-bold">
                  {data[i].title}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {data[i].description}
                </CardDescription>
              </CardHeader>
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