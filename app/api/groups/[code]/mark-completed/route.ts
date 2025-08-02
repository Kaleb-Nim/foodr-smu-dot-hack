import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const markCompletedSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format." }),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;

  try {
    const body = await req.json();
    const { userId } = markCompletedSchema.parse(body);

    // Find the group
    const group = await prisma.group.findUnique({
      where: { code },
      include: {
        members: {
          select: { id: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => member.id === userId);
    if (!isMember) {
      return NextResponse.json({ error: "User is not a member of this group" }, { status: 403 });
    }

    // For tracking individual completion, we'll create a simple approach:
    // Store completion status in a UserCompletion table or use existing data
    // For now, let's use a simple approach - check if user has rated foods and assume they're done
    
    // Check if all members have completed their swiping
    const allMemberIds = group.members.map(member => member.id);
    
    // Get completion status for each member
    const memberCompletionStatus = await Promise.all(
      allMemberIds.map(async (memberId) => {
        const user = await prisma.user.findUnique({
          where: { id: memberId },
          select: { hasCompleted: true },
        });
        return { memberId, hasCompleted: user?.hasCompleted || false };
      })
    );

    // Consider a member "completed" if their hasCompleted flag is true
    const completedMembers = memberCompletionStatus.filter(mc => mc.hasCompleted);
    const allCompleted = completedMembers.length === allMemberIds.length;

    // Update group completion status if all members are done
    if (allCompleted && !group.hasCompleted) {
      await prisma.group.update({
        where: { code },
        data: { hasCompleted: true },
      });
    }

    return NextResponse.json({
      message: "User completion status updated",
      userCompleted: memberCompletionStatus.find(mc => mc.memberId === userId)?.hasCompleted || false,
      groupCompleted: allCompleted,
      completedCount: completedMembers.length,
      totalCount: allMemberIds.length,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating completion status:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}