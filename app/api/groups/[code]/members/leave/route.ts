import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Member {
    id: string;
    name: string;
}

export async function POST(req: NextRequest, context: { params: Promise<{ code: string }> }) {
    const params = await context.params;
    const groupCode = params.code;
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const group = await prisma.group.findFirst({
            where: { code: groupCode },
            include: { members: true },
        });

        if (group) {
            if (group.leader_id_fk === userId) {
                return NextResponse.json({ error: "Leader cannot leave the group" }, { status: 403 });
            }

            // Disconnect the user from the group
            await prisma.group.update({
                where: { id: group.id },
                data: {
                    members: {
                        disconnect: { id: userId },
                    },
                },
            });

            // Optionally, delete the user if they are no longer part of any group
            // This depends on your application's logic for user lifecycle
            // For now, we'll just disconnect them from the group.

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