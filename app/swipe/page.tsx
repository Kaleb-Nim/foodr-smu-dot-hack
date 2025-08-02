"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Swiper, { SwiperCard } from "./components/Swiper";
import { CardTitle } from "@/components/ui/card";

const fakeSwiperCardData = [
    {
        "id": "3c2579f7-f62c-42f0-a07b-4c4aafcc3f81",
        "name": "Burger",
        "image_path": "/images/dishes/burger.png"
    },
    {
        "id": "cea4b94f-aca2-4933-8653-6b5cb6907ea3",
        "name": "Chicken Rice",
        "image_path": "/images/dishes/chicken_rice.png"
    },
    {
        "id": "3cec8f5b-8260-496c-8ed6-683ca6c1fc67",
        "name": "Dim Sum",
        "image_path": "/images/dishes/dim_sum.png"
    },
    {
        "id": "b0ce1b13-1b77-4b75-ab9e-2d014f59c08d",
        "name": "Hotpot",
        "image_path": "/images/dishes/hotpot.png"
    },
    {
        "id": "556fcf80-9122-4003-9607-9cbc62c2509e",
        "name": "Pasta",
        "image_path": "/images/dishes/pasta.png"
    },
    {
        "id": "8a192a85-1c4c-48f0-8faa-1e1eca4a6557",
        "name": "Prata",
        "image_path": "/images/dishes/prata.png"
    },
    {
        "id": "7d5e6b50-a366-496e-b497-d28449e8eb04",
        "name": "Ramen",
        "image_path": "/images/dishes/ramen.png"
    },
    {
        "id": "319de175-c664-458e-a407-98610141c1d5",
        "name": "Sushi",
        "image_path": "/images/dishes/sushi.png"
    },
    {
        "id": "a69063a1-86eb-45c2-814d-0a15c5600f1b",
        "name": "Taco",
        "image_path": "/images/dishes/taco.png"
    },
    {
        "id": "d3866abb-a408-4c09-b5a2-942aea37a580",
        "name": "Thai Green Curry",
        "image_path": "/images/dishes/thai_green_curry.png"
    }
];

function SwipeContent() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const userId = searchParams.get("userId");
    const groupId = searchParams.get("groupId");

    const handleRequest = async (id: string, preference: string) => {
        void fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/group-sessions/${groupId}/swipe`, {
            method: "POST",
            body: JSON.stringify({
                "userId": userId,
                "dishId": id,
                "preference": preference
            })
        });
    }

    const handleAllCardsSwiped = () => {
        // You might fetch more data, navigate to another page,
        // or display a "You've seen everyone!" message.
        console.log("No more cards to show! Time to load more or display an end screen.");
        router.push(`/results?code=${groupId}`)
    };

    const handleSwipeLeft = (card: SwiperCard) => {
        console.log(`Swiped LEFT on ${card.name}`);
        // Logic for "no" or "dislike"
        void handleRequest(card.id, "like");
    };

    const handleSwipeRight = (card: SwiperCard) => {
        console.log(`Swiped RIGHT on ${card.name}`);
        // Logic for "yes" or "like"
        void handleRequest(card.id, "dislike");
    };

    const handleSuperLike = (card: SwiperCard) => {
        console.log(`Superlike on ${card.name}`);
        // Logic for "yes" or "like"
        void handleRequest(card.id, "superlike");
    };

    return (
        <div className="bg-[#252525] w-full h-screen flex flex-col gap-24 justify-center items-center">
            <div>
                <CardTitle>Swipe left for no, swipe right for yes, heart for superlike</CardTitle>
            </div>
            <Swiper
                data={fakeSwiperCardData}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSuperLike={handleSuperLike}
                onFinish={handleAllCardsSwiped}
            />
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SwipeContent />
        </Suspense>
    );
}