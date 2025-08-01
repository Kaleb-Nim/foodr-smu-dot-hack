import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { groups } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

interface Member {
    id: string;
    name: string;
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
    const groupCode = (await params).code;
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const group = await db.query.groups.findFirst({
            where: eq(groups.code, groupCode),
        });

        if (group) {
            const currentMembers = group.members as Member[];
            const updatedMembers = currentMembers.filter(
                (member: Member) => member.id !== userId
            );

            await db.update(groups)
                .set({ members: updatedMembers })
                .where(eq(groups.code, groupCode));

            console.log(`Removed user ${userId} from group ${groupCode} in DB.`);

            return NextResponse.json({ message: "Member removed successfully" });
        } else {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error removing member from DB:", error);
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}