import { NextRequest, NextResponse } from 'next/server';
import { FoodRating } from '@prisma/client';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const swipeRequestSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format." }),
  dishId: z.string().uuid({ message: "Invalid dish ID format." }),
  preference: z.enum(['like', 'dislike', 'super-like']),
});

const mapPreferenceToEnum = (preference: string): FoodRating => {
  switch (preference) {
    case 'super-like':
      return FoodRating.SUPER_LIKE;
    case 'dislike':
      return FoodRating.DISLIKE;
    default:
      return FoodRating.LIKE;
  }
};

export async function POST(req: NextRequest, context: { params: Promise<{ groupid: string }> }) {
  const params = await context.params;
  const sessionId = params.groupid;

  try {
    const body = await req.json();
    const { userId, dishId, preference } = swipeRequestSchema.parse(body);

    const group = await prisma.group.findUnique({
      where: { code: sessionId },
      include: {
        members: {
          select: { id: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group session not found" }, { status: 404 });
    }

    const isMember = group.members.some((member: { id: string }) => member.id === userId);
    if (!isMember) {
      return NextResponse.json({ error: "User is not a member of this group" }, { status: 403 });
    }

    const ratingEnum = mapPreferenceToEnum(preference);

    const savedRating = await prisma.ratings.upsert({
      where: {
        person_id_fk_food_id_fk: {
          person_id_fk: userId,
          food_id_fk: dishId,
        },
      },
      update: {
        rating: ratingEnum,
      },
      create: {
        person_id_fk: userId,
        food_id_fk: dishId,
        rating: ratingEnum,
      },
    });

    return NextResponse.json(
      { message: "Swipe recorded successfully", data: savedRating },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error },
        { status: 400 }
      );
    }
    
    console.error("Error recording swipe:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}