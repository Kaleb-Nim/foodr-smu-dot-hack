import { SwipeData, EnhancedMatchedFoodItem, GroupMember } from './types';

// Scoring weights for different swipe actions
const SCORING_WEIGHTS = {
  superlike: 3,
  like: 1,
  dislike: -1,
} as const;

export interface SwipeBreakdown {
  superlikes: number;
  likes: number;
  dislikes: number;
}

export interface FoodSwipeStats {
  foodId: string;
  breakdown: SwipeBreakdown;
  weightedScore: number;
  likedBy: GroupMember[];
}

/**
 * Calculate weighted score for a single food item based on swipe data
 */
export function calculateWeightedScore(
  foodId: string,
  swipes: SwipeData[],
  members: GroupMember[]
): FoodSwipeStats {
  const foodSwipes = swipes.filter(swipe => swipe.foodId === foodId);
  
  const breakdown: SwipeBreakdown = {
    superlikes: 0,
    likes: 0,
    dislikes: 0,
  };

  const likedBy: GroupMember[] = [];

  // Count each type of swipe and track who liked the item
  foodSwipes.forEach(swipe => {
    switch (swipe.action) {
      case 'superlike':
        breakdown.superlikes++;
        const superlikeMember = members.find(m => m.id === swipe.userId);
        if (superlikeMember) likedBy.push(superlikeMember);
        break;
      case 'like':
        breakdown.likes++;
        const likeMember = members.find(m => m.id === swipe.userId);
        if (likeMember) likedBy.push(likeMember);
        break;
      case 'dislike':
        breakdown.dislikes++;
        break;
    }
  });

  // Calculate weighted score
  const weightedScore = 
    breakdown.superlikes * SCORING_WEIGHTS.superlike +
    breakdown.likes * SCORING_WEIGHTS.like +
    breakdown.dislikes * SCORING_WEIGHTS.dislike;

  return {
    foodId,
    breakdown,
    weightedScore,
    likedBy,
  };
}

/**
 * Rank all dishes based on weighted scores and return top N
 */
export function rankDishes(
  swipes: SwipeData[],
  members: GroupMember[],
  foodItems: Array<{ id: string; name: string; image: string; restaurant: string; cuisine: string; description?: string }>,
  restaurantCounts: Record<string, number>,
  topN: number = 8
): EnhancedMatchedFoodItem[] {
  // Calculate scores for all food items
  const scoredItems = foodItems.map(food => {
    const stats = calculateWeightedScore(food.id, swipes, members);
    
    return {
      ...food,
      likedBy: stats.likedBy,
      weightedScore: stats.weightedScore,
      restaurantCount: restaurantCounts[food.cuisine] || 0,
      swipeBreakdown: stats.breakdown,
    };
  });

  // Sort by weighted score (descending) and return top N
  return scoredItems
    .sort((a, b) => {
      // Primary sort: by weighted score
      if (b.weightedScore !== a.weightedScore) {
        return b.weightedScore - a.weightedScore;
      }
      // Secondary sort: by number of total interactions (engagement)
      const aInteractions = a.swipeBreakdown.superlikes + a.swipeBreakdown.likes + a.swipeBreakdown.dislikes;
      const bInteractions = b.swipeBreakdown.superlikes + b.swipeBreakdown.likes + b.swipeBreakdown.dislikes;
      return bInteractions - aInteractions;
    })
    .slice(0, topN);
}

/**
 * Generate sample swipe data for testing
 */
export function generateSampleSwipeData(): {
  members: GroupMember[];
  swipes: SwipeData[];
  foodItems: Array<{ id: string; name: string; image: string; restaurant: string; cuisine: string; description?: string }>;
} {
  const members: GroupMember[] = [
    { id: 'user1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 'user2', name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user3', name: 'Mike', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 'user4', name: 'Emma', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  ];

  const foodItems = [
    {
      id: 'dish1',
      name: 'Thai Green Curry',
      image: 'https://source.unsplash.com/400x300/?thai-green-curry',
      restaurant: 'Thai Express',
      cuisine: 'Thai',
      description: 'Aromatic green curry with tender chicken and vegetables',
    },
    {
      id: 'dish2',
      name: 'Hainanese Chicken Rice',
      image: 'https://source.unsplash.com/400x300/?hainanese-chicken-rice',
      restaurant: 'Koufu Food Court',
      cuisine: 'Chinese',
      description: 'Classic Singaporean comfort food with fragrant rice',
    },
    {
      id: 'dish3',
      name: 'Korean Bibimbap',
      image: 'https://source.unsplash.com/400x300/?bibimbap',
      restaurant: 'Yoogane',
      cuisine: 'Korean',
      description: 'Mixed rice bowl with vegetables and Korean chili paste',
    },
    {
      id: 'dish4',
      name: 'Margherita Pizza',
      image: 'https://source.unsplash.com/400x300/?margherita-pizza',
      restaurant: 'Pizza Palace',
      cuisine: 'Western',
      description: 'Classic Italian pizza with fresh mozzarella and basil',
    },
    {
      id: 'dish5',
      name: 'Salmon Teriyaki Bowl',
      image: 'https://source.unsplash.com/400x300/?teriyaki-salmon',
      restaurant: 'Sushi Master',
      cuisine: 'Japanese',
      description: 'Grilled salmon with teriyaki glaze over steamed rice',
    },
    {
      id: 'dish6',
      name: 'Laksa',
      image: 'https://source.unsplash.com/400x300/?laksa',
      restaurant: 'Local Hawker',
      cuisine: 'Malay',
      description: 'Spicy coconut curry noodle soup with prawns',
    },
    {
      id: 'dish7',
      name: 'Pad Thai',
      image: 'https://source.unsplash.com/400x300/?pad-thai',
      restaurant: 'Thai Kitchen',
      cuisine: 'Thai',
      description: 'Stir-fried rice noodles with shrimp and peanuts',
    },
    {
      id: 'dish8',
      name: 'Fish & Chips',
      image: 'https://source.unsplash.com/400x300/?fish-chips',
      restaurant: 'British Bites',
      cuisine: 'Western',
      description: 'Crispy battered fish with golden fries',
    },
    {
      id: 'dish9',
      name: 'Char Kway Teow',
      image: 'https://source.unsplash.com/400x300/?char-kway-teow',
      restaurant: 'Heritage Stall',
      cuisine: 'Chinese',
      description: 'Wok-fried flat noodles with dark soy sauce',
    },
    {
      id: 'dish10',
      name: 'Ramen',
      image: 'https://source.unsplash.com/400x300/?ramen',
      restaurant: 'Ramen House',
      cuisine: 'Japanese',
      description: 'Rich tonkotsu broth with chashu pork',
    },
  ];

  // Generate diverse swipe data
  const swipes: SwipeData[] = [
    // Thai Green Curry - very popular
    { userId: 'user1', foodId: 'dish1', action: 'superlike' },
    { userId: 'user2', foodId: 'dish1', action: 'like' },
    { userId: 'user3', foodId: 'dish1', action: 'like' },
    { userId: 'user4', foodId: 'dish1', action: 'superlike' },
    
    // Hainanese Chicken Rice - moderately popular
    { userId: 'user1', foodId: 'dish2', action: 'like' },
    { userId: 'user2', foodId: 'dish2', action: 'like' },
    { userId: 'user3', foodId: 'dish2', action: 'dislike' },
    { userId: 'user4', foodId: 'dish2', action: 'like' },
    
    // Korean Bibimbap - mixed reactions
    { userId: 'user1', foodId: 'dish3', action: 'dislike' },
    { userId: 'user2', foodId: 'dish3', action: 'superlike' },
    { userId: 'user3', foodId: 'dish3', action: 'like' },
    { userId: 'user4', foodId: 'dish3', action: 'dislike' },
    
    // Margherita Pizza - popular
    { userId: 'user1', foodId: 'dish4', action: 'like' },
    { userId: 'user2', foodId: 'dish4', action: 'like' },
    { userId: 'user3', foodId: 'dish4', action: 'superlike' },
    { userId: 'user4', foodId: 'dish4', action: 'like' },
    
    // Salmon Teriyaki Bowl - good
    { userId: 'user1', foodId: 'dish5', action: 'like' },
    { userId: 'user2', foodId: 'dish5', action: 'dislike' },
    { userId: 'user3', foodId: 'dish5', action: 'like' },
    { userId: 'user4', foodId: 'dish5', action: 'like' },
    
    // Laksa - polarizing
    { userId: 'user1', foodId: 'dish6', action: 'dislike' },
    { userId: 'user2', foodId: 'dish6', action: 'dislike' },
    { userId: 'user3', foodId: 'dish6', action: 'superlike' },
    { userId: 'user4', foodId: 'dish6', action: 'dislike' },
    
    // Pad Thai - decent
    { userId: 'user1', foodId: 'dish7', action: 'like' },
    { userId: 'user2', foodId: 'dish7', action: 'like' },
    { userId: 'user3', foodId: 'dish7', action: 'dislike' },
    { userId: 'user4', foodId: 'dish7', action: 'like' },
    
    // Fish & Chips - okay
    { userId: 'user1', foodId: 'dish8', action: 'dislike' },
    { userId: 'user2', foodId: 'dish8', action: 'like' },
    { userId: 'user3', foodId: 'dish8', action: 'like' },
    { userId: 'user4', foodId: 'dish8', action: 'dislike' },
    
    // Char Kway Teow - not great
    { userId: 'user1', foodId: 'dish9', action: 'dislike' },
    { userId: 'user2', foodId: 'dish9', action: 'dislike' },
    { userId: 'user3', foodId: 'dish9', action: 'like' },
    { userId: 'user4', foodId: 'dish9', action: 'dislike' },
    
    // Ramen - average
    { userId: 'user1', foodId: 'dish10', action: 'like' },
    { userId: 'user2', foodId: 'dish10', action: 'dislike' },
    { userId: 'user3', foodId: 'dish10', action: 'dislike' },
    { userId: 'user4', foodId: 'dish10', action: 'like' },
  ];

  return { members, swipes, foodItems };
}