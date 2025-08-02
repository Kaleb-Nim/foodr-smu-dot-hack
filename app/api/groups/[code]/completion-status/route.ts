import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;

  try {
    // Find the group with its members
    const group = await prisma.group.findUnique({
      where: { code },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            blobIcon: true,
            hasCompleted: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Get ratings count for each member to determine completion status
    const memberCompletionStatus = await Promise.all(
      group.members.map(async (member) => {
        const ratingsCount = await prisma.ratings.count({
          where: { person_id_fk: member.id },
        });

        return {
          id: member.id,
          name: member.name,
          hasCompleted: member.hasCompleted,
          avatarUrl: member.blobIcon || undefined,
        };
      })
    );

    const completedCount = memberCompletionStatus.filter(m => m.hasCompleted).length;
    const totalCount = group.members.length;
    const allCompleted = completedCount === totalCount;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return NextResponse.json({
      members: memberCompletionStatus,
      completedCount,
      totalCount,
      allCompleted,
      progressPercentage,
      groupHasCompleted: group.hasCompleted,
    });

  } catch (error) {
    console.error("Error fetching group completion status:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching completion status." },
      { status: 500 }
    );
  }
}