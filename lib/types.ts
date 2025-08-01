// Shared type definitions for the enhanced results page
export interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface SwipeData {
  userId: string;
  foodId: string;
  action: 'like' | 'dislike' | 'superlike';
  timestamp?: Date;
}

export interface EnhancedMatchedFoodItem {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  description?: string;
  cuisine: string;
  likedBy: GroupMember[];
  weightedScore: number;
  restaurantCount: number;
  swipeBreakdown: {
    superlikes: number;
    likes: number;
    dislikes: number;
  };
}

export interface SMURestaurantData {
  cuisine: string;
  locations: {
    name: string;
    area: string;
    distance: string;
    priceRange: string;
  }[];
  totalCount: number;
}

export interface GroupSwipeSession {
  groupId: string;
  members: GroupMember[];
  swipes: SwipeData[];
  foodItems: {
    id: string;
    name: string;
    cuisine: string;
  }[];
}