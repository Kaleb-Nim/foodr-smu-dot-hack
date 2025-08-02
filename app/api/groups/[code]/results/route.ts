import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, FoodRating } from '@prisma/client';
import { calculateWeightedScore, rankDishes } from '@/lib/scoring';
import { getAllRestaurantCounts } from '@/data/smu-restaurants';
import { SwipeData, GroupMember, EnhancedMatchedFoodItem } from '@/lib/types';

const prisma = new PrismaClient();

// Map Prisma enum to frontend action type
const mapEnumToAction = (rating: FoodRating): 'like' | 'dislike' | 'superlike' => {
  switch (rating) {
    case FoodRating.SUPER_LIKE:
      return 'superlike';
    case FoodRating.DISLIKE:
      return 'dislike';
    default:
      return 'like';
  }
};

export async function GET(req: NextRequest, context: { params: Promise<{ code: string }> }) {
  const params = await context.params;
  const groupCode = params.code;

  try {
    // 1. Find group by code and get members
    const group = await prisma.group.findUnique({
      where: { code: groupCode },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            blobIcon: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // 2. Fetch all ratings for group members
    const ratings = await prisma.ratings.findMany({
      where: {
        person_id_fk: {
          in: group.members.map(member => member.id),
        },
      },
      include: {
        food: true,
        person: true,
      },
    });

    // 3. If no ratings found, return empty results
    if (ratings.length === 0) {
      return NextResponse.json({
        topDishes: [],
        groupMembers: group.members.map(member => ({
          id: member.id,
          name: member.name,
          avatarUrl: member.blobIcon || undefined,
        })),
        message: "No votes found for this group yet.",
      });
    }

    // 4. Transform data to match scoring function requirements
    const members: GroupMember[] = group.members.map(member => ({
      id: member.id,
      name: member.name,
      avatarUrl: member.blobIcon || undefined,
    }));

    const swipes: SwipeData[] = ratings.map(rating => ({
      userId: rating.person_id_fk,
      foodId: rating.food_id_fk,
      action: mapEnumToAction(rating.rating),
    }));

    // 5. Get unique food items from ratings and fetch cuisine
    const uniqueFoodItemsPromises = ratings.reduce((acc, rating) => {
      if (!acc.some(item => item.id === rating.food.id)) {
        acc.push(rating.food);
      }
      return acc;
    }, [] as typeof ratings[number]['food'][]).map(async (food) => {
      const imagePath = food.image_path && food.image_path.trim() !== ''
        ? food.image_path
        : '/images/placeholder-food.jpg';

      let cuisine = 'Mixed'; // Default to Mixed
      try {
        const cuisineResponse = await fetch(`${req.nextUrl.origin}/api/cuisine`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ foodName: food.name }),
        });
        if (cuisineResponse.ok) {
          const data = await cuisineResponse.json();
          cuisine = data.cuisine;
        } else {
          console.warn(`Failed to fetch cuisine for ${food.name}:`, cuisineResponse.statusText);
        }
      } catch (cuisineError) {
        console.error(`Error fetching cuisine for ${food.name}:`, cuisineError);
      }
      
      return {
        id: food.id,
        name: food.name,
        image: imagePath,
        restaurant: 'SMU Campus', // Default restaurant
        cuisine: cuisine,
        description: `Delicious ${food.name}`,
      };
    });

    const uniqueFoodItems = await Promise.all(uniqueFoodItemsPromises);

    // 6. Get restaurant counts
    const restaurantCounts = getAllRestaurantCounts();

    // 7. Calculate top dishes using existing scoring logic
    const topDishes = rankDishes(swipes, members, uniqueFoodItems, restaurantCounts, 8);

    // 8. Return results
    return NextResponse.json({
      topDishes,
      groupMembers: members,
      totalVotes: ratings.length,
      uniqueVoters: new Set(ratings.map(r => r.person_id_fk)).size,
    });

  } catch (error) {
    console.error("Error fetching group results:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching results." },
      { status: 500 }
    );
  }
}