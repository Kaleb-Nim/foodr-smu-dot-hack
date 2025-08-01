"use client";

import Swiper, { SwiperCard } from "./components/Swiper";

const fakeSwiperCardData = [
  {
    id: "uuid-1",
    title: "Luna",
    description: "Aspiring astrologer with a love for indie folk music and chai lattes.",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-2",
    title: "Max",
    description: "Software engineer by day, amateur chef by night. Obsessed with tacos and sci-fi novels.",
    imageUrl: "https://images.unsplash.com/photo-1543610892-0b19f79b8ce8?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-3",
    title: "Chloe",
    description: "Travel blogger exploring hidden gems and capturing moments. Fluent in sarcasm.",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-edcd4a9697ad?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-4",
    title: "Leo",
    description: "Outdoor enthusiast who loves hiking, bouldering, and anything with a mountain view.",
    imageUrl: "https://images.unsplash.com/photo-1552058544-baa4360b06c1?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-5",
    title: "Sophie",
    description: "Bookworm and cat mom. Can often be found in a cozy nook with a good fantasy novel.",
    imageUrl: "https://images.unsplash.com/photo-1529626465618-a89aab5dfcee?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-6",
    title: "Ethan",
    description: "Musician (guitarist) and coffee connoisseur. Always looking for new jam sessions.",
    imageUrl: "https://images.unsplash.com/photo-1534008757871-6c1dc48b5efd?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-7",
    title: "Mia",
    description: "Passionate about sustainable living and loves thrifting for vintage finds.",
    imageUrl: "https://images.unsplash.com/photo-1542155823-3889151240ff?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uuid-8",
    title: "Noah",
    description: "Fitness enthusiast and gamer. Always up for a challenge, in the gym or online.",
    imageUrl: "https://images.unsplash.com/photo-1522529599131-01cd7a07c570?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Page() {

    const handleAllCardsSwiped = () => {
    console.log("No more cards to show! Time to load more or display an end screen.");
    // You might fetch more data, navigate to another page,
    // or display a "You've seen everyone!" message.
    };

    const handleSwipeLeft = (card: SwiperCard) => {
        console.log(`Swiped LEFT on ${card.title}`);
        // Logic for "no" or "dislike"
    };

    const handleSwipeRight = (card: SwiperCard) => {
        console.log(`Swiped RIGHT on ${card.title}`);
        // Logic for "yes" or "like"
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <Swiper
                data={fakeSwiperCardData}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onFinish={handleAllCardsSwiped}
            />
        </div>
    )
}