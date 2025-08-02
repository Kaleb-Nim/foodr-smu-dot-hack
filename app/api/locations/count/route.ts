import { NextRequest, NextResponse } from 'next/server';
import { getAllRestaurantCounts } from '@/data/smu-restaurants';
import { redis } from '@/lib/redis';

const CACHE_KEY = 'restaurant_counts';
const CACHE_EXPIRATION_SECONDS = 60 * 60 * 24; // 24 hours

export async function GET(req: NextRequest) {
  try {
    // Try to fetch from cache first
    const cachedCounts = await redis.get(CACHE_KEY);
    if (cachedCounts) {
      console.log("Serving restaurant counts from cache.");
      return NextResponse.json(cachedCounts);
    }

    // If not in cache, fetch from source
    const restaurantCounts = getAllRestaurantCounts();

    // Store in cache with an expiration
    await redis.setex(CACHE_KEY, CACHE_EXPIRATION_SECONDS, restaurantCounts);
    console.log("Restaurant counts cached successfully.");

    return NextResponse.json(restaurantCounts);
  } catch (error) {
    console.error("Error fetching or caching restaurant counts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching restaurant counts." },
      { status: 500 }
    );
  }
}