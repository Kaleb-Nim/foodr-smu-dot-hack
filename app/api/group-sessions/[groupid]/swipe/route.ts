// In: app/api/group-sessions/[groupId]/swipe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { groups, groupSwipes } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// UPDATED: Simplified request body type
interface SwipeRequestBody {
    userId: string;
    dishId: string;
    preference: 'like' | 'dislike';
}

interface Member {
    id: string;
    name: string;
}

export async function POST(req: NextRequest, { params }: { params: { groupId: string } }) {
    const sessionId = params.groupId;
    
    try {
        const { userId, dishId, preference } = await req.json() as SwipeRequestBody;

        // 1. Validation
        if (!userId || !dishId || !preference) {
            return NextResponse.json({ error: "userId, dishId, and preference are required" }, { status: 400 });
        }
        if (preference !== 'like' && preference !== 'dislike') {
            return NextResponse.json({ error: "Preference must be 'like' or 'dislike'" }, { status: 400 });
        }

        // 2. Authorization
        const group = await db.query.groups.findFirst({
            where: eq(groups.id, sessionId),
        });

        if (!group) {
            return NextResponse.json({ error: "Group session not found" }, { status: 404 });
        }

        const isMember = (group.members as Member[]).some(member => member.id === userId);
        if (!isMember) {
            return NextResponse.json({ error: "User is not a member of this group" }, { status: 403 });
        }

        // 3. Database Upsert Operation
        await db.insert(groupSwipes).values({
            sessionId: sessionId,
            userId: userId,
            dishId: dishId,
            preference: preference,
        }).onConflictDoUpdate({
            target: [groupSwipes.userId, groupSwipes.dishId, groupSwipes.sessionId],
            set: {
                preference: preference // Update preference on re-swipe
            }
        });

        // 4. Success
        return NextResponse.json({ message: "Swipe recorded successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error recording swipe:", error);
        return NextResponse.json({ error: "Failed to record swipe" }, { status: 500 });
    }
}