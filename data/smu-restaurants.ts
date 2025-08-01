import { SMURestaurantData } from '@/lib/types';

// SMU campus and nearby restaurant data based on research
export const SMU_RESTAURANT_DATA: Record<string, SMURestaurantData> = {
  Thai: {
    cuisine: 'Thai',
    totalCount: 8,
    locations: [
      {
        name: 'Thai Express',
        area: 'Food Republic (Manulife Centre)',
        distance: '0.1 km',
        priceRange: '$6-12',
      },
      {
        name: 'Thai Kitchen',
        area: 'Koufu (SMU Basement)',
        distance: 'On campus',
        priceRange: '$5-10',
      },
      {
        name: 'Thai Delight',
        area: 'Waterloo Centre',
        distance: '0.2 km',
        priceRange: '$4-8',
      },
      {
        name: 'Bangkok Garden',
        area: 'Bugis Junction',
        distance: '0.3 km',
        priceRange: '$8-15',
      },
      {
        name: 'Basil & Spice',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$6-12',
      },
      {
        name: 'Thai Street Food',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$4-9',
      },
      {
        name: 'Siam Kitchen',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$7-13',
      },
      {
        name: 'Thai Village',
        area: 'Albert Street',
        distance: '0.5 km',
        priceRange: '$8-16',
      },
    ],
  },
  Chinese: {
    cuisine: 'Chinese',
    totalCount: 12,
    locations: [
      {
        name: 'Hainanese Chicken Rice Stall',
        area: 'Koufu (SMU Basement)',
        distance: 'On campus',
        priceRange: '$3-6',
      },
      {
        name: 'Waterloo Cai Fan',
        area: 'Waterloo Street',
        distance: '0.1 km',
        priceRange: '$3-7',
      },
      {
        name: 'Heritage Chinese Kitchen',
        area: 'Food Republic (Manulife)',
        distance: '0.1 km',
        priceRange: '$5-10',
      },
      {
        name: 'Golden Dragon',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$6-12',
      },
      {
        name: 'Char Kway Teow Master',
        area: 'Waterloo Centre',
        distance: '0.2 km',
        priceRange: '$4-8',
      },
      {
        name: 'Beijing Noodles',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$5-9',
      },
      {
        name: 'Canton Kitchen',
        area: 'Bugis Junction',
        distance: '0.3 km',
        priceRange: '$8-15',
      },
      {
        name: 'Dumpling House',
        area: 'Albert Street',
        distance: '0.4 km',
        priceRange: '$6-11',
      },
      {
        name: 'Wok Master',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$5-10',
      },
      {
        name: 'Szechuan Palace',
        area: 'Bencoolen Street',
        distance: '0.3 km',
        priceRange: '$7-14',
      },
      {
        name: 'Rice Bowl Express',
        area: 'SMU Campus',
        distance: 'On campus',
        priceRange: '$4-8',
      },
      {
        name: 'Phoenix Chinese Restaurant',
        area: 'Middle Road',
        distance: '0.5 km',
        priceRange: '$10-20',
      },
    ],
  },
  Korean: {
    cuisine: 'Korean',
    totalCount: 6,
    locations: [
      {
        name: 'Yoogane',
        area: 'Bugis Junction',
        distance: '0.3 km',
        priceRange: '$8-15',
      },
      {
        name: 'Seoul Kitchen',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$6-12',
      },
      {
        name: 'K-Bowl',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$4-9',
      },
      {
        name: 'Kimchi House',
        area: 'Waterloo Centre',
        distance: '0.2 km',
        priceRange: '$5-11',
      },
      {
        name: 'BBQ Korea',
        area: 'Albert Street',
        distance: '0.4 km',
        priceRange: '$12-25',
      },
      {
        name: 'Bibimbap Express',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$6-10',
      },
    ],
  },
  Western: {
    cuisine: 'Western',
    totalCount: 10,
    locations: [
      {
        name: 'The Marmalade Pantry',
        area: 'SMU Campus',
        distance: 'On campus',
        priceRange: '$12-25',
      },
      {
        name: 'Fish & Chips Co.',
        area: 'Koufu (SMU Basement)',
        distance: 'On campus',
        priceRange: '$6-12',
      },
      {
        name: 'Pizza Palace',
        area: 'Food Republic (Manulife)',
        distance: '0.1 km',
        priceRange: '$8-16',
      },
      {
        name: 'British Bites',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$10-18',
      },
      {
        name: 'Burger Joint',
        area: 'Bugis Junction',
        distance: '0.3 km',
        priceRange: '$9-15',
      },
      {
        name: 'Pasta Corner',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$7-14',
      },
      {
        name: 'Grill House',
        area: 'Waterloo Street',
        distance: '0.2 km',
        priceRange: '$12-22',
      },
      {
        name: 'Sandwich Bar',
        area: 'Albert Street',
        distance: '0.4 km',
        priceRange: '$5-10',
      },
      {
        name: 'Cafe Europa',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$8-16',
      },
      {
        name: 'American Diner',
        area: 'Middle Road',
        distance: '0.5 km',
        priceRange: '$11-20',
      },
    ],
  },
  Japanese: {
    cuisine: 'Japanese',
    totalCount: 7,
    locations: [
      {
        name: 'Sushi Master',
        area: 'Food Republic (Manulife)',
        distance: '0.1 km',
        priceRange: '$8-18',
      },
      {
        name: 'Ramen House',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$6-14',
      },
      {
        name: 'Tokyo Kitchen',
        area: 'Bugis Junction',
        distance: '0.3 km',
        priceRange: '$10-20',
      },
      {
        name: 'Bento Box',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$6-12',
      },
      {
        name: 'Teriyaki Express',
        area: 'Waterloo Centre',
        distance: '0.2 km',
        priceRange: '$5-11',
      },
      {
        name: 'Katsu Corner',
        area: 'Albert Street',
        distance: '0.4 km',
        priceRange: '$7-15',
      },
      {
        name: 'Sashimi Bar',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$12-25',
      },
    ],
  },
  Malay: {
    cuisine: 'Malay',
    totalCount: 5,
    locations: [
      {
        name: 'Kampong Kitchen',
        area: 'Waterloo Centre',
        distance: '0.2 km',
        priceRange: '$4-8',
      },
      {
        name: 'Nasi Lemak House',
        area: 'Bras Basah Complex',
        distance: '0.2 km',
        priceRange: '$3-7',
      },
      {
        name: 'Satay Station',
        area: 'Victoria Street',
        distance: '0.3 km',
        priceRange: '$5-10',
      },
      {
        name: 'Rendang Express',
        area: 'Albert Street',
        distance: '0.4 km',
        priceRange: '$4-9',
      },
      {
        name: 'Malay Heritage',
        area: 'Beach Road',
        distance: '0.4 km',
        priceRange: '$6-12',
      },
    ],
  },
};

// Helper function to get restaurant count by cuisine
export function getRestaurantCount(cuisine: string): number {
  return SMU_RESTAURANT_DATA[cuisine]?.totalCount || 0;
}

// Helper function to get all restaurant counts as a record
export function getAllRestaurantCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  Object.entries(SMU_RESTAURANT_DATA).forEach(([cuisine, data]) => {
    counts[cuisine] = data.totalCount;
  });
  return counts;
}